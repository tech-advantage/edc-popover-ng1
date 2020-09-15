import { EdcHelpService, EDC_HELP_SERVICE_NAME } from './edc-help.service';
import { SYS_LANG } from '../translate/language-codes';
import { PopoverLabel } from 'edc-client-js';
import { DEFAULT_LABELS } from '../translate/default-translations';

export const EDC_LANG_SERVICE_NAME = 'EdcLangService';

export class EdcLangService {
    // Dependencies Injection
    static get $inject() {
        return [EDC_HELP_SERVICE_NAME];
    }

    private lang: string;

    constructor(private readonly helpService: EdcHelpService) {
    }

    getLang() {
        return this.lang;
    }

    setLang(lang: string) {
        this.lang = lang;
    }

    /**
     * Returns the popover labels from the i18n files in the publication export
     *
     * If an error occurred or no translations were returned, returns default labels
     *
     * @param lang the language to use
     */
    getPopoverLabels(lang = this.lang) {
        const langToUse = this.helpService.isLanguagePresent(lang) ? lang : SYS_LANG;
        return this.helpService.getPopoverLabels(langToUse)
            .then((translations: PopoverLabel) => translations || this.loadDefaultLabels(lang))
            .catch(() => this.loadDefaultLabels(lang));
    }

    /**
     * Load default popover labels on error
     *
     * @param lang the lang code
     * @param defaultLanguage default lang code
     */
    loadDefaultLabels(lang: string): Promise<PopoverLabel> {
        const labelTranslation = DEFAULT_LABELS.get(lang) || DEFAULT_LABELS.get(SYS_LANG);

        return Promise.resolve(labelTranslation);
    }
}
