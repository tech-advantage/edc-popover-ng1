import { EdcHelpService, EDC_HELP_SERVICE_NAME } from '../edc-help.service';
import { SYS_LANG } from './language-codes';
import { PopoverLabel } from 'edc-client-js';
import { DEFAULT_LABELS } from './default-translations';

export const EDC_LANG_SERVICE_NAME = 'EdcLangService';

export class EdcLangService {
    // Dependencies Injection
    static get $inject() {
        return [EDC_HELP_SERVICE_NAME];
    }

    private defaultLanguage: string;
    private lang: string;

    constructor(private readonly helpService: EdcHelpService) {
    }

    getLang() {
        return this.lang;
    }

    setLang(lang: string) {
        this.lang = lang;
    }

    getTranslation(lang = this.lang) {
        const langToUse = this.helpService.isLanguagePresent(lang) ? lang : SYS_LANG;
        return this.helpService.getPopoverTranslation(langToUse)
            .catch(() => this.loadDefaultLabels(lang));
    }

    /**
     * Load default popover labels on error
     *
     * @param lang the lang code
     * @param defaultLanguage default lang code
     */
    loadDefaultLabels(lang: string, defaultLanguage: string = this.defaultLanguage): Promise<PopoverLabel> {
        const labelTranslation = DEFAULT_LABELS.get(lang) || DEFAULT_LABELS.get(this.defaultLanguage)
            || DEFAULT_LABELS.get(SYS_LANG);

        return Promise.resolve(labelTranslation);
    }
}
