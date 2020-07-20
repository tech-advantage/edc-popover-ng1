import { module } from 'angular';

import { EDC_HELP_COMPONENT_NAME, HelpComponent } from './help.component';
import { EdcHelpService, EDC_HELP_SERVICE_NAME } from './edc-help.service';
import { EdcHelpConfigService, EDC_HELP_CONFIGURATION_NAME } from './config/edc-help-config.service';
import { EdcLangService, EDC_LANG_SERVICE_NAME } from './translate/edc-lang.service';
import { EDC_CONFIGURATION_NAME, EdcConfigurationProvider } from './config/edc-configuration.provider';

export const EDC_HELP_MODULE_NAME = 'edcHelpModule';

/**
 * Main module
 *
 * The configuration provider allows host applications to inject their own settings
 *
 */
export const EDC_HELP_MODULE = module(EDC_HELP_MODULE_NAME, [])
    .provider(EDC_CONFIGURATION_NAME, EdcConfigurationProvider)
    .service(EDC_HELP_CONFIGURATION_NAME, EdcHelpConfigService)
    .service(EDC_LANG_SERVICE_NAME, EdcLangService)
    .service(EDC_HELP_SERVICE_NAME, EdcHelpService)
    .component(EDC_HELP_COMPONENT_NAME, HelpComponent);
