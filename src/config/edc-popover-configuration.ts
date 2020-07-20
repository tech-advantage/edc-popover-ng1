import { GlobalPopoverOptions } from './global-popover-options';

export class EdcPopoverConfiguration {
    helpPath: string; // The URL to the help web app.
    docPath: string;  // The URL to the HTTP served export.
    pluginId: string; // Export plugin name for the edc documentation.
    icon?: string;    // CSS font-awesome class (ex: "fa-question-circle-o").
    i18nPath?: string;
    options?: GlobalPopoverOptions; // Popover options that can be defined globally
}
