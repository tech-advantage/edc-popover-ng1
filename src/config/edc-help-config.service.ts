import { PopoverConfig, PopoverContent, PopoverOptions as PopoverJSOptions } from 'edc-popover-js';
import { EDC_HELP_SERVICE_NAME, EdcHelpService } from '../edc-help.service';
import { EDC_LANG_SERVICE_NAME, EdcLangService } from '../translate/edc-lang.service';
import { Article, Helper, Link } from 'edc-client-js';
import { PopoverOptions } from './popover-options';
import { mapToPopoverJSOptions } from '../utils/config.utils';

export const EDC_HELP_CONFIGURATION_NAME = 'EdcHelpConfigService';

export class EdcHelpConfigService {
    // Dependencies Injection
    static get $inject() {
        return [EDC_HELP_SERVICE_NAME, EDC_LANG_SERVICE_NAME];
    }

    constructor(private readonly helpService: EdcHelpService, private readonly langService: EdcLangService) {
    }

    /**
     * Build the edc-popover-js configuration from the inputs
     *
     * @param elementRef: the reference or id of the help button - the popover will be associated with it
     * @param mainKey the brick primary key
     * @param subKey the brick sub key
     * @param pluginId the plugin Identifier
     * @param lang the lang to use
     * @param options the options for this popover
     */
    buildPopoverConfig(elementRef: HTMLElement,
                       mainKey: string,
                       subKey: string,
                       pluginId: string,
                       lang: string,
                       options: PopoverOptions): Promise<void | PopoverConfig> {
        // Get the helper with the popover content, and add the labels and options
        return this.helpService.getHelp(mainKey, subKey, pluginId, lang)
            .then((helper: Helper) => this.addContent(helper, mainKey, subKey, lang))
            .then((config: any) => this.addLabels(config))
            .then((config: any) => this.addOptions(elementRef, config, options))
            .catch((err: any) => console.error(err));
    }

    /**
     * Build the popover content
     * includes
     *  - the title (in the header)
     *  - the brick description
     *  - the articles list section
     *  - the links list section
     *
     * @param helper the edc-client-js content helper with the content
     * @param primaryKey the brick primary key
     * @param subKey the brick sub key
     * @param lang the lang to use
     */
    addContent(helper: Helper, primaryKey: string, subKey: string, lang: string): PopoverConfig {
        let config = new PopoverConfig();
        if (helper) {
            const { language: resolvedLanguage } = helper;

            // Set translation language for the labels -
            // could be the current or default language if the requested one was not found
            this.langService.setLang(resolvedLanguage);
            // Extract the content from the edc-client-js helper
            const {
                label: title, description, articles, links,
            } = helper;

            config.content = { ...new PopoverContent(), title, description, articles, links };
            // Parse article and links urls
            config = this.parseUrls(config, primaryKey, subKey, resolvedLanguage);
        } else {
            console.error(`Could not load Helper for the key ${primaryKey} and subKey ${subKey}`);
        }
        return config;
    }

    /**
     * Modify the urls for the articles and links
     *
     * @param config the popover configuration
     * @param primaryKey the brick primary key
     * @param subKey the brick sub key
     * @param lang the lang to use
     */
    parseUrls(config: any, primaryKey: string, subKey: string, lang: string): PopoverConfig {
        if (!config || !config.content) {
            return null;
        }
        const sourceArticles = config.content.articles || [];
        const sourceLinks = config.content.links || [];
        const articles = sourceArticles.reduce((memo: Article[], article: Article, index: number) => {
            const updatedArticle = { ...article };
            updatedArticle.url = this.helpService.getContextUrl(primaryKey, subKey, lang, index);
            memo.push(updatedArticle);
            return memo;
        }, []);
        const links = sourceLinks.reduce((memo: Link[], link: Link) => {
            const updatedLink = { ...link };
            updatedLink.url = this.helpService.getDocumentationUrl(link.id);
            memo.push(updatedLink);
            return memo;
        }, []);
        return {
            ...config,
            content: {
                ...config.content,
                articles,
                links,
            },
        };
    }

    /**
     * Add the translated labels for the popover
     *
     * @param config the popover configuration
     */
    addLabels(config: PopoverConfig): Promise<PopoverConfig> {
        const updatedConfig = { ...config };
        return this.langService.getTranslation()
            .then((translations: any) => {
                updatedConfig.labels = translations;
                return updatedConfig;
            })
            .catch(() => updatedConfig);
    }

    /**
     * Add popover options
     *
     * currently supported :
     *  - placement (popover positioning relatively to the button)
     *  - customClass: allows to add the class to the main popover element, for changing the style
     *  - body: defines whether the popover should be attached to the body or its parent
     *
     * @param elementRef: the reference or id of the help button - the popover will be associated with it
     * @param config the popover configuration
     * @param inputOptions the options passed as input to this popover-ng1
     */
    addOptions(elementRef: HTMLElement, config: PopoverConfig, inputOptions: PopoverOptions): PopoverConfig {
        const updatedConfig = { ...new PopoverConfig(), ...config };
        // Set the element reference
        updatedConfig.target = elementRef;
        // Options - we get the global options,
        // and then override with any option that was defined for this specific popover component
        const globalOptions: PopoverJSOptions = mapToPopoverJSOptions(elementRef, this.helpService.getPopoverOptions());
        // Merge options with component's
        updatedConfig.options = mapToPopoverJSOptions(elementRef, inputOptions, globalOptions);

        // Finally, set the icon
        updatedConfig.icon = this.helpService.getIcon();
        return updatedConfig;
    }
}
