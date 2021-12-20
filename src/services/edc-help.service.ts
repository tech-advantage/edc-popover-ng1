import { EdcClient, Helper, PopoverLabel } from 'edc-client-js';
import { SYS_LANG } from '../translate/language-codes';
import { IEdcPopoverOptions } from '../config/edc-popover-options.interface';
import { EdcPopoverOptions } from '../config/edc-popover-options';
import { EdcPopoverConfiguration } from '../config/edc-popover-configuration';
import { EDC_CONFIGURATION_NAME } from '../config/edc-configuration.provider';

export const EDC_HELP_SERVICE_NAME = 'EdcHelpService';

export class EdcHelpService {
    // For angular's Dependency Injection
    static get $inject() {
        return [EDC_CONFIGURATION_NAME];
    }

    private readonly edcClient: EdcClient;

    constructor(private readonly edcPopoverConfig: EdcPopoverConfiguration) {
        this.edcClient = new EdcClient(this.edcPopoverConfig.docPath,
            this.edcPopoverConfig.helpPath,
            this.edcPopoverConfig.pluginId,
            true);
    }

    getHelp(primaryKey: string, subKey: string, pluginId?: string, lang?: string): Promise<Helper | null> {
        const pluginIdentifier = pluginId || this.edcPopoverConfig.pluginId;
        return this.edcClient.getHelper(primaryKey, subKey, pluginIdentifier, lang);
    }

    getContextUrl(mainKey: string, subKey: string, languageCode: string, articleIndex: number, pluginId?: string): string | null {
        return this.edcClient.getContextWebHelpUrl(mainKey, subKey, languageCode, articleIndex, pluginId);
    }

    getDocumentationUrl(docId: number): string {
        return this.edcClient.getDocumentationWebHelpUrl(docId);
    }

    getI18nUrl(): string {
        return this.edcClient.getPopoverI18nUrl();
    }

    getPluginId(): string {
        return this.edcPopoverConfig.pluginId;
    }

    getPopoverOptions(): IEdcPopoverOptions {
        return this.edcPopoverConfig.options || new EdcPopoverOptions();
    }

    getDefaultLanguage(): string {
        return (this.edcClient && this.edcClient.getDefaultLanguage && this.edcClient.getDefaultLanguage()) || SYS_LANG;
    }

    isLanguagePresent(langCode: string): boolean {
        return this.edcClient.isLanguagePresent(langCode);
    }

    getPopoverLabels(langCode: string): Promise<PopoverLabel | null> {
        return this.edcClient.getPopoverLabels(langCode);
    }
}
