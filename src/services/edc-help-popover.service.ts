import { Helper, PopoverLabel } from 'edc-client-js';
import { IconPopoverConfig } from '../config/icon-popover-config';
import { ContentNotFoundError } from '../errors/content-not-found.error';
import { PopoverContent, PopoverItem } from 'edc-popover-utils';
import { EDC_HELP_SERVICE_NAME, EdcHelpService } from './edc-help.service';
import { EDC_LANG_SERVICE_NAME, EdcLangService } from './edc-lang.service';
import { SYS_LANG } from '../translate/language-codes';
import { isNil } from '../utils/global.utils';

export const EDC_HELP_POPOVER_SERVICE_NAME = 'EdcHelpPopoverService';

export class EdcHelpPopoverService {
    // Dependencies Injection
    static get $inject() {
        return [EDC_HELP_SERVICE_NAME, EDC_LANG_SERVICE_NAME];
    }

    constructor(private readonly helpService: EdcHelpService,
                private readonly langService: EdcLangService) {
    }

    /**
     * Adds the popover content
     *
     * throws a ContentNotFoundError if helper is not defined
     *
     * @param helper the edc helper that will request the content using the edc-client-js instance
     * @param mainKey the brick primary key
     * @param subKey the brick sub key
     * @param lang the lang to use
     * @private
     */
    addContent(helper: Helper | null, mainKey: string, subKey: string, lang: string | undefined): IconPopoverConfig {
        const config = new IconPopoverConfig();
        if (!helper) {
            // The help client could not resolve any helper for the content, throw an error
            throw new ContentNotFoundError(mainKey, subKey, lang ?? SYS_LANG);
        }
        // Retrieve the language that the helper resolved, from the requested and the current export state
        const { language: resolvedLanguage } = helper;
        // Resolved language might be different from the requested, if content was not available in that language
        // Keep the language service up to date with the finally used language
        this.langService.setLang(resolvedLanguage || undefined);
        // Extract and create the popover content
        const { label: title, description, articles, links } = helper;
        config.content = new PopoverContent(title, description, articles ?? [], links ?? []);
        // Parse articles and links urls
        this.parseUrls(config, mainKey, subKey, this.langService.getLang(), helper.exportId || undefined);
        return config;
    }

    /**
     * Adds labels into the popover configuration
     *
     * @param config the popover configuration being created
     * @param lang the lang to use
     */
    addLabels(config: IconPopoverConfig, lang?: string): Promise<IconPopoverConfig> {
        return this.langService.getPopoverLabels(lang)
            .then((translations: PopoverLabel | null) => {
                config.labels = translations;
                return config;
            });
    }

    /**
     * Sets the url attributes for links and articles to open in the web help explorer,
     * inserting the help path defined in the global configuration
     *
     * @param config the popover configuration
     * @param mainKey the brick primary key
     * @param subKey the brick sub key
     * @param lang the lang to use
     * @param pluginId the identifier of the published export the keys belong to
     * @private
     */
    private parseUrls(config: IconPopoverConfig, mainKey: string, subKey: string, lang: string, pluginId?: string): void {
        if (!config || !config.content) {
            return;
        }
        const articles = config.content.articles || [];
        const links = config.content.links || [];
        articles.forEach((article: PopoverItem, index: number) => {
            article.url = this.helpService.getContextUrl(mainKey, subKey, lang, index, pluginId);
        });
        links.forEach((link: PopoverItem) => {
            link.url = isNil(link.id) ? null : this.helpService.getDocumentationUrl(link.id);
        });
    }
}
