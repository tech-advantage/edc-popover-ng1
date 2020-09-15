import { IEdcPopoverOptions } from './edc-popover-options.interface';

/**
 * Popover global configuration, to provide when importing the edc help module
 *
 *    pluginId: URL to the help web app.
 *    helpPath: URL to the HTTP served export.
 *    docPath: Export plugin name for the edc documentation.
 *    i18nDirName: Path to the i18n files, containing the labels
 *    popoverOptions: Popover global options, to apply to all popovers
 *
 */
export class EdcPopoverConfiguration {
    helpPath: string;
    docPath: string;
    pluginId: string;
    i18nPath?: string;
    options?: IEdcPopoverOptions;
}
