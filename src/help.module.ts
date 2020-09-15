import { module } from 'angular';

import { EDC_HELP_COMPONENT_NAME, HelpComponent } from './help.component';
import { EdcHelpService, EDC_HELP_SERVICE_NAME } from './services/edc-help.service';
import { EdcHelpConfigService, EDC_HELP_CONFIG_SERVICE_NAME } from './services/edc-help-config.service';
import { EdcLangService, EDC_LANG_SERVICE_NAME } from './services/edc-lang.service';
import { EDC_CONFIGURATION_NAME, EdcConfigurationProvider } from './config/edc-configuration.provider';
import { EDC_HELP_ICON_SERVICE_NAME, EdcHelpIconService } from './services/edc-help-icon.service';
import { EDC_HELP_POPOVER_SERVICE_NAME, EdcHelpPopoverService } from './services/edc-help-popover.service';
import { EDC_HELP_ERROR_SERVICE_NAME, EdcHelpErrorService } from './services/edc-help-error.service';

export const EDC_HELP_MODULE_NAME = 'edcHelpModule';

/**
 * Main module
 *
 * The configuration provider allows host applications to inject their own settings
 *
 */
export const EDC_HELP_MODULE = module(EDC_HELP_MODULE_NAME, [])
    .provider(EDC_CONFIGURATION_NAME, EdcConfigurationProvider)
    .service(EDC_HELP_ICON_SERVICE_NAME, EdcHelpIconService)
    .service(EDC_HELP_POPOVER_SERVICE_NAME, EdcHelpPopoverService)
    .service(EDC_HELP_ERROR_SERVICE_NAME, EdcHelpErrorService)
    .service(EDC_HELP_CONFIG_SERVICE_NAME, EdcHelpConfigService)
    .service(EDC_LANG_SERVICE_NAME, EdcLangService)
    .service(EDC_HELP_SERVICE_NAME, EdcHelpService)
    .component(EDC_HELP_COMPONENT_NAME, HelpComponent);
