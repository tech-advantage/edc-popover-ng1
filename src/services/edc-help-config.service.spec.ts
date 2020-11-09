import { PopoverOptions } from 'edc-popover-utils';
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

describe('Test Help Config service', () => {
    let injector;
    let helpConfigService: EdcHelpConfigService;

    let helpService: EdcHelpService;
    let helpIconService: EdcHelpIconService;
    let helpPopoverService: EdcHelpPopoverService;
    let helpErrorService: EdcHelpErrorService;

    // Mock objects
    let helper: Helper;

    beforeEach(() => {
        angular.module('edcHelp', [])
            .provider(EDC_CONFIGURATION_NAME, EdcConfigurationProvider)
            .service(EDC_HELP_CONFIG_SERVICE_NAME, EdcHelpConfigService);
        angular.mock.module('edcHelp');
        mockServices([
            mockService(EDC_HELP_SERVICE_NAME, ['getHelp', 'getPopoverOptions']),
            mockService(EDC_HELP_ICON_SERVICE_NAME, ['getIconClasses', 'getTooltip', 'buildIconClasses', 'getIconImageStyle']),
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

    beforeEach(() => { helper = mockHelper(); });

    beforeEach(() => {
       spyOn(helpService, 'getHelp').and.returnValue(Promise.resolve(helper));
    });

    describe('buildPopoverConfig', () => {
        const initSpies =

            it('should build the popover configuration', () => {
                // Given we have the helper with common properties

                // When calling buildPopoverConfig
                helpConfigService.buildPopoverConfig('myMainKey', 'mySubKey', 'myPluginId', 'en')
                    .then((config: IconPopoverConfig) => {
                    });
            });

        // Options
        it('should set the append to option to body and placement to bottom', () => {
            // Given set the append to option to null
            const options = new PopoverOptions();
            options.appendTo = null;
            spyOn(helpService, 'getPopoverOptions').and.returnValue(options);

            // When calling buildPopoverConfig requesting the content in french
            helpConfigService.buildPopoverConfig('myMainKey', 'mySubKey', 'myPluginId', 'en')
                .then((config: IconPopoverConfig) => {
                    // Then append to option should be set as parent, via the function returning the body element
                    expect(typeof config.options.appendTo).toEqual('function');
                    // Bottom should be set from default value
                    expect(config.options.placement).toEqual('bottom');
                    expect(config.options.customClass).toBeUndefined();
                });
        });
        it('should set the append to option to parent and placement to top', () => {
            // Given set the append to option to 'parent'
            const options = new PopoverOptions();
            options.appendTo = 'parent';
            spyOn(helpService, 'getPopoverOptions').and.returnValue(options);

            // When calling buildPopoverConfig requesting the content in french
            helpConfigService.buildPopoverConfig('myMainKey',
                'mySubKey',
                'myPluginId',
                'en',
                new PopoverOptions())
                .then((config: IconPopoverConfig) => {
                    // Then append to option should be set as parent
                    expect(config.options.appendTo).toEqual('parent');
                    // Bottom should be set from default value
                    expect(config.options.placement).toEqual('top');
                    // Custom class should have been set to "my-custom-class"
                    expect(config.options.customClass).toEqual('my-custom-class');
                });
        });

    });
});
