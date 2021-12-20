import { PopoverOptions, PopoverPlacement } from 'edc-popover-utils';
import { Helper } from 'edc-client-js';
import { IconPopoverConfig } from '../config/icon-popover-config';
import { EDC_HELP_CONFIG_SERVICE_NAME, EdcHelpConfigService } from './edc-help-config.service';
import { EDC_HELP_SERVICE_NAME, EdcHelpService } from './edc-help.service';
import { EDC_HELP_ICON_SERVICE_NAME, EdcHelpIconService } from './edc-help-icon.service';
import { EDC_HELP_POPOVER_SERVICE_NAME, EdcHelpPopoverService } from './edc-help-popover.service';
import { mockHelper, mockService, mockServices } from '../utils/test.utils';
import * as angular from 'angular';
import { EDC_CONFIGURATION_NAME, EdcConfigurationProvider } from '../config/edc-configuration.provider';
import { EDC_HELP_ERROR_SERVICE_NAME, EdcHelpErrorService } from './edc-help-error.service';
import { hasOwnProperty } from '../utils/global.utils';

describe('Test Help Config service', () => {
    let injector;
    let helpConfigService: EdcHelpConfigService;

    let helpService: EdcHelpService;
    let helpIconService: EdcHelpIconService;
    let helpPopoverService: EdcHelpPopoverService;
    let helpErrorService: EdcHelpErrorService;

    // Mock objects
    let helper: Helper;
    let iconPopoverConfig: IconPopoverConfig;

    beforeEach(() => {
        angular.module('edcHelp', [])
            .provider(EDC_CONFIGURATION_NAME, EdcConfigurationProvider)
            .service(EDC_HELP_CONFIG_SERVICE_NAME, EdcHelpConfigService);
        angular.mock.module('edcHelp');
        mockServices([
            mockService(EDC_HELP_SERVICE_NAME, ['getHelp', 'getPopoverOptions']),
            mockService(EDC_HELP_ICON_SERVICE_NAME, ['getIconClasses', 'getTooltip', 'buildIconClasses', 'getIconImageStyle', 'buildIconConfig']),
            mockService(EDC_HELP_POPOVER_SERVICE_NAME, ['addContent', 'addLabels']),
            mockService(EDC_HELP_ERROR_SERVICE_NAME, ['handleHelpError']),
        ]);
    });

    beforeEach(inject(($injector: angular.auto.IInjectorService, _$componentController_: any) => {
        injector = $injector;
        helpConfigService = $injector.get<EdcHelpConfigService>(EDC_HELP_CONFIG_SERVICE_NAME);
        helpService = $injector.get<EdcHelpService>(EDC_HELP_SERVICE_NAME);
        helpIconService = $injector.get<EdcHelpIconService>(EDC_HELP_ICON_SERVICE_NAME);
        helpPopoverService = $injector.get<EdcHelpPopoverService>(EDC_HELP_POPOVER_SERVICE_NAME);
        helpErrorService = $injector.get<EdcHelpErrorService>(EDC_HELP_ERROR_SERVICE_NAME);
    }));

    beforeEach(() => {
        helper = mockHelper();
        iconPopoverConfig = new IconPopoverConfig();
    });

    beforeEach(() => {
        spyOn(helpPopoverService, 'addContent').and.returnValue(iconPopoverConfig);
        spyOn(helpService, 'getHelp').and.returnValue(Promise.resolve(helper));
        spyOn(helpPopoverService, 'addLabels').and.returnValue(Promise.resolve(iconPopoverConfig));
    });

    describe('buildPopoverConfig', () => {

        const customMatcher = {
            toHaveOptions: function (matcherUtil) {
                return {
                    compare: function (actual, expected) {
                        const options = actual?.options;
                        const sameType = (options && expected) || (!options && !expected);
                        return {
                            pass: sameType && matcherUtil.contains(options, expected)
                        };
                    }
                };
            }
        };

        beforeEach(() => {
            jasmine.addMatchers(customMatcher);
        });

        it('should build the popover configuration', (done) => {
            // Given we have the helper with common properties

            // When calling buildPopoverConfig
            helpConfigService.buildPopoverConfig('myMainKey', 'mySubKey', 'myPluginId', 'en')
                .then((config: IconPopoverConfig) => {
                    expect(config).toBeDefined();
                    done();
                });
        });


        // Options
        it('should set the append to option to body and placement to bottom', (done) => {
            // Given set the append to option to null
            const options = new PopoverOptions();
            // @ts-ignore
            options.appendTo = undefined;
            spyOn(helpService, 'getPopoverOptions').and.returnValue(options);

            // When calling buildPopoverConfig requesting the content in french
            helpConfigService.buildPopoverConfig('myMainKey', 'mySubKey', 'myPluginId', 'en')
                .then((config: IconPopoverConfig) => {
                    // Then append to option should be set as parent, via the function returning the body element
                    expect(typeof config?.options?.appendTo).toEqual('function');
                    // Bottom should be set from default value
                    expect(config?.options?.placement).toEqual(PopoverPlacement.BOTTOM);
                    expect(config?.options?.customClass).toBeUndefined();
                    done();
                });
        });
        it('should set the append to option to parent and placement to top', (done) => {
            // Given custom options have been set
            const options = new PopoverOptions();
            options.appendTo = 'parent';
            options.placement = PopoverPlacement.TOP;
            options.customClass = 'my-custom-class';
            spyOn(helpService, 'getPopoverOptions').and.returnValue(options);

            // When calling buildPopoverConfig requesting the content in french
            helpConfigService.buildPopoverConfig('myMainKey',
                'mySubKey',
                'myPluginId',
                'en')
                .then(() => {
                    expect(helpPopoverService.addLabels).toHaveBeenCalledWith(
                        configContainingOptions({
                            placement: PopoverPlacement.TOP,
                            appendTo: 'parent',
                            customClass: 'my-custom-class'
                        })
                    );
                    done();
                });
        });

        // Custom jasmine asymmetricMatcher for checking if config contains the expected options
        function configContainingOptions(expectedOptions) {
            const mismatch = {
                key: '',
                found: undefined,
                expected: undefined
            };
            return {
                asymmetricMatch(config): boolean {
                    const options = config?.options;
                    const checkUndefined = (!!options && !expectedOptions) || (!options && !!expectedOptions);
                    if (checkUndefined || (!options && !expectedOptions)) {
                        return false;
                    }
                    return Object.entries(expectedOptions).every(([key, value]) => {
                        if (hasOwnProperty(options, key) && options[key] === value) {
                            return true;
                        } else {
                            mismatch.key = key;
                            mismatch.expected = value as any;
                            mismatch.found = options[key] as any;
                            return false;
                        }
                    });
                },
                jasmineToString: function () {
                    let message;
                    if (!mismatch.key) {
                        message = (expectedOptions ? 'Configuration' : 'Expected options') + ' not defined';
                    } else {
                        message = `Configuration was expected to have option property : '${ mismatch.key }' with value '${ mismatch.expected }'
                        but instead value '${ mismatch.found }' was found`;
                    }
                    return message;
                }
            };
        }

    });
});
