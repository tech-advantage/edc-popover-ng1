import * as angular from 'angular';
import { EDC_CONFIGURATION_NAME, EdcConfigurationProvider } from '../config/edc-configuration.provider';
import { mockService, mockServices } from '../utils/test.utils';
import { EDC_HELP_ICON_SERVICE_NAME, EdcHelpIconService } from './edc-help-icon.service';
import { EDC_HELP_POPOVER_SERVICE_NAME, EdcHelpPopoverService } from './edc-help-popover.service';
import { EDC_HELP_ERROR_SERVICE_NAME, EdcHelpErrorService } from './edc-help-error.service';
import { DEFAULT_LABELS } from '../translate/default-translations';
import { IconPopoverConfig } from '../config/icon-popover-config';
import { IconConfig, IEdcPopoverOptions, EdcPopoverOptions } from '../config';
import { ContentNotFoundError } from '../errors/content-not-found.error';
import { IconBehavior, PopoverBehavior } from '../config/fail-behavior';
import { DEFAULT_ICON } from '../constants/style.constant';

describe('EdcHelpErrorService test', () => {

    let injector;

    let service: EdcHelpErrorService;
    let edcHelpIconService: EdcHelpIconService;
    let edcHelpPopoverService: EdcHelpPopoverService;

    beforeEach(() => {
        angular.module('edcHelp', [])
            .provider(EDC_CONFIGURATION_NAME, EdcConfigurationProvider)
            .service(EDC_HELP_ERROR_SERVICE_NAME, EdcHelpErrorService);
        angular.mock.module('edcHelp');
        mockServices([
            mockService(EDC_HELP_ICON_SERVICE_NAME, ['buildErrorIconConfig']),
            mockService(EDC_HELP_POPOVER_SERVICE_NAME, ['addLabels']),
        ]);
    });

    beforeEach(inject(($injector: angular.auto.IInjectorService, _$componentController_: any) => {
        injector = $injector;
        service = $injector.get<EdcHelpErrorService>(EDC_HELP_ERROR_SERVICE_NAME);
        edcHelpIconService = $injector.get<EdcHelpIconService>(EDC_HELP_ICON_SERVICE_NAME);
        edcHelpPopoverService = $injector.get<EdcHelpPopoverService>(EDC_HELP_POPOVER_SERVICE_NAME);
    }));

    describe('handleHelpError', () => {
        let config: IconPopoverConfig;
        let options: IEdcPopoverOptions;

        beforeEach(() => {
            config = new IconPopoverConfig();
            options = new EdcPopoverOptions();
            config.options = new EdcPopoverOptions();
            // Prevent appendTo functions erratic comparisons
            options.appendTo = null;
            config.options.appendTo = null;
            // Mock addLabels with system language - should set the given config labels
            spyOn(edcHelpPopoverService, 'addLabels').and.callFake((conf) => {
                conf.labels = DEFAULT_LABELS.get('en');
                return Promise.resolve(conf);
            });
        });

        // ContentNotFoundError - default content
        it('should return a valid configuration', async () => {
            // Given we have a ContentNotFoundError and a icon configuration
            const iconConfig = new IconConfig();
            iconConfig.icon.class = 'my other class';
            spyOn(edcHelpIconService, 'buildErrorIconConfig').and.returnValue(iconConfig);
            const error: ContentNotFoundError = new ContentNotFoundError('myKey', 'mySubKey', 'en');

            // When calling handleHelpError
            await service.handleHelpError(error, options, 'en').then((errorConfig: IconPopoverConfig) => {
                expect(errorConfig).toBeDefined();
                // Labels should be defined
                expect(errorConfig.labels).toEqual(DEFAULT_LABELS.get('en'));
                // Icon config should have been set by helpIconService
                expect(edcHelpIconService.buildErrorIconConfig).toHaveBeenCalledWith(options, errorConfig.labels);
                expect(errorConfig.iconConfig.icon.class).toEqual('my other class');
                // Default content should have been set - description coming soon message and no title
                expect(errorConfig.content.description).toEqual(DEFAULT_LABELS.get('en').comingSoon);
                expect(errorConfig.content.title).toBeFalsy();
            });
        });
        // Failbehavior : icon SHOWN, popover ERROR_SHOWN
        it('should return a configuration with icon SHOWN and popover ERROR_SHOWN', async () => {
            // Given we have a ContentNotFoundError and fail behavior with IconBehavior.SHOWN && PopoverBehavior.ERROR_SHOWN
            expect(options.failBehavior.icon).toEqual(IconBehavior.SHOWN);
            options.failBehavior.popover = PopoverBehavior.ERROR_SHOWN;
            spyOn(edcHelpIconService, 'buildErrorIconConfig').and.returnValue(new IconConfig());
            const error: ContentNotFoundError = new ContentNotFoundError('myKey', 'mySubKey', 'en');

            // When calling handleHelpError
            await service.handleHelpError(error, options, 'en').then((errorConfig: IconPopoverConfig) => {
                // Labels should be defined
                expect(errorConfig.labels).toEqual(DEFAULT_LABELS.get('en'));
                // Icon config should have been set by helpIconService
                expect(edcHelpIconService.buildErrorIconConfig).toHaveBeenCalledWith(options, errorConfig.labels);
                // Default content should have been set: icon class, description with failed data message and title with errorTitle
                expect(errorConfig.iconConfig.icon.class).toEqual(DEFAULT_ICON);
                expect(errorConfig.content.description).toEqual(DEFAULT_LABELS.get('en').errors.failedData);
                expect(errorConfig.content.title).toEqual(DEFAULT_LABELS.get('en').errorTitle);
            });
        });
        // Failbehavior : icon DISABLED, popover ERROR_SHOWN
        it('should return a configuration with icon DISABLED and popover ERROR_SHOWN', async () => {
            // Given we have a ContentNotFoundError and fail behavior with IconBehavior.DISABLED && PopoverBehavior.ERROR_SHOWN
            options.failBehavior.icon = IconBehavior.DISABLED;
            options.failBehavior.popover = PopoverBehavior.ERROR_SHOWN;
            spyOn(edcHelpIconService, 'buildErrorIconConfig').and.returnValue(new IconConfig());
            const error: ContentNotFoundError = new ContentNotFoundError('myKey', 'mySubKey', 'en');

            // When calling handleHelpError
            await service.handleHelpError(error, options, 'en').then((errorConfig: IconPopoverConfig) => {
                // Labels should be defined
                expect(errorConfig.labels).toEqual(DEFAULT_LABELS.get('en'));
                // Icon config should have been set by helpIconService
                expect(edcHelpIconService.buildErrorIconConfig).toHaveBeenCalledWith(options, errorConfig.labels);
                // With icon disabled, content should be null
                expect(errorConfig.content).toBeNull();
                expect(errorConfig.disablePopover).toBeTrue();
            });
        });
        // Failbehavior : icon ERROR, popover NO_POPOVER
        it('should return a configuration with icon ERROR and popover NO_POPOVER', async () => {
            // Given we have a ContentNotFoundError and fail behavior with IconBehavior.ERROR && PopoverBehavior.NO_POPOVER
            options.failBehavior.icon = IconBehavior.ERROR;
            options.failBehavior.popover = PopoverBehavior.NO_POPOVER;
            spyOn(edcHelpIconService, 'buildErrorIconConfig').and.returnValue(new IconConfig());
            const error: ContentNotFoundError = new ContentNotFoundError('myKey', 'mySubKey', 'en');

            // When calling handleHelpError
            await service.handleHelpError(error, options, 'en').then((errorConfig: IconPopoverConfig) => {
                // Labels should be defined
                expect(errorConfig.labels).toEqual(DEFAULT_LABELS.get('en'));
                // Icon config should have been set by helpIconService
                expect(edcHelpIconService.buildErrorIconConfig).toHaveBeenCalledWith(options, errorConfig.labels);
                // Default content should be null and disabledPopover should be true
                expect(errorConfig.content).toBeNull();
                expect(errorConfig.disablePopover).toBeTruthy();
            });
        });
        // Failbehavior : icon HIDDEN, popover FRIENDLY_MSG
        it('should return a configuration with icon HIDDEN and popover FRIENDLY_MSG', async () => {
            // Given we have a ContentNotFoundError and fail behavior with IconBehavior.HIDDEN && PopoverBehavior.FRIENDLY_MSG
            options.failBehavior.icon = IconBehavior.HIDDEN;
            options.failBehavior.popover = PopoverBehavior.FRIENDLY_MSG;
            spyOn(edcHelpIconService, 'buildErrorIconConfig').and.returnValue(new IconConfig());
            const error: ContentNotFoundError = new ContentNotFoundError('myKey', 'mySubKey', 'en');

            // When calling handleHelpError
            await service.handleHelpError(error, options, 'en').then((errorConfig: IconPopoverConfig) => {
                // Labels should be defined
                expect(errorConfig.labels).toEqual(DEFAULT_LABELS.get('en'));
                // Icon config should have been set by helpIconService
                expect(edcHelpIconService.buildErrorIconConfig).toHaveBeenCalledWith(options, errorConfig.labels);
                // Default content should be null and disabledPopover should be true
                expect(errorConfig.content).toBeNull();
                expect(errorConfig.disablePopover).toBeTruthy();
            });
        });

        // Other errors
        it('should return a configuration for the other errors', async () => {
            // Given we have a simple Error and fail behavior with IconBehavior.SHOWN && PopoverBehavior.FRIENDLY_MSG
            options.failBehavior.icon = IconBehavior.SHOWN;
            options.failBehavior.popover = PopoverBehavior.FRIENDLY_MSG;
            spyOn(edcHelpIconService, 'buildErrorIconConfig').and.returnValue(new IconConfig());
            const error: Error = new Error('An unlisted error appeared');

            // When calling handleHelpError
            await service.handleHelpError(error, options, 'en').then((errorConfig: IconPopoverConfig) => {
                // Labels should be defined
                expect(errorConfig.labels).toEqual(DEFAULT_LABELS.get('en'));
                // Icon config should have been set by helpIconService
                expect(edcHelpIconService.buildErrorIconConfig).toHaveBeenCalledWith(options, errorConfig.labels);
                // Default content description should be coming soon and no title should be set
                expect(errorConfig.content.description).toEqual(DEFAULT_LABELS.get('en').comingSoon);
                expect(errorConfig.content.title).toBeFalsy();
            });
        });
    });

});
