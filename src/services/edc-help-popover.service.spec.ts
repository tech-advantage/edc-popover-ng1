import * as angular from 'angular';
import { EDC_CONFIGURATION_NAME, EdcConfigurationProvider } from '../config/edc-configuration.provider';
import { EDC_HELP_POPOVER_SERVICE_NAME, EdcHelpPopoverService } from './edc-help-popover.service';
import { Article, Helper, Link, PopoverLabel } from 'edc-client-js';
import { mock, mockHelper, mockService, mockServices } from '../utils/test.utils';
import { EDC_HELP_SERVICE_NAME, EdcHelpService } from './edc-help.service';
import { EDC_LANG_SERVICE_NAME, EdcLangService } from './edc-lang.service';
import { IconPopoverConfig } from '../config/icon-popover-config';
import { DEFAULT_LABELS } from '../translate/default-translations';
import { SYS_LANG } from '../translate/language-codes';

describe('EdcHelpPopoverService test', () => {

    let injector;

    let helpPopoverService: EdcHelpPopoverService;

    let helpService: EdcHelpService;
    let langService: EdcLangService;

    // Mock objects
    let helper: Helper;

    beforeEach(() => {
        angular.module('edcHelp', [])
            .provider(EDC_CONFIGURATION_NAME, EdcConfigurationProvider)
            .service(EDC_HELP_POPOVER_SERVICE_NAME, EdcHelpPopoverService);
        angular.mock.module('edcHelp');
        mockServices([
            mockService(EDC_HELP_SERVICE_NAME, ['getContextUrl', 'getDocumentationUrl']),
            mockService(EDC_LANG_SERVICE_NAME, ['getPopoverLabels', 'setLang']),
        ]);
    });

    beforeEach(inject(($injector: angular.auto.IInjectorService, _$componentController_: any) => {
        injector = $injector;
        helpPopoverService = $injector.get<EdcHelpPopoverService>(EDC_HELP_POPOVER_SERVICE_NAME);
        helpService = $injector.get<EdcHelpService>(EDC_HELP_SERVICE_NAME);
        langService = $injector.get<EdcLangService>(EDC_LANG_SERVICE_NAME);
    }));


    beforeEach(() => {
        helper = mockHelper()
    });

    const initSpies = (labels: PopoverLabel = DEFAULT_LABELS.get(SYS_LANG)) => {
        spyOn(helpService, 'getContextUrl')
            .and.callFake((mainKey: string, subKey: string, languageCode: string, articleIndex: number) =>
            `articleUrl1/${mainKey}/${subKey}/${languageCode}/${articleIndex}/`);
        spyOn(helpService, 'getDocumentationUrl').and.callFake((docId: number) => `linkUrl1/${docId}/`);
        spyOn(langService, 'getPopoverLabels').and.returnValue(Promise.resolve(labels));
        spyOn(langService, 'setLang').and.stub();
    };

    describe('addContent', () => {

        it('should add content', () => {
            // Given the helper is set with base properties
            initSpies();

            // When calling addContent
            const config: IconPopoverConfig = helpPopoverService.addContent(helper, 'myMainKey', 'mySubKey', 'en');

            // Then configuration and its main attributes should be defined
            expect(config).toBeDefined();
            expect(config.content).toBeDefined();
            const { title, description, articles, links } = config.content;
            expect(helpService.getContextUrl).toHaveBeenCalledWith('myMainKey', 'mySubKey', 'en', 0, 'resolvedPluginId');
            expect(helpService.getContextUrl).toHaveBeenCalledTimes(1);
            expect(title).toEqual('MyTitle');
            expect(description).toEqual('MyDescription');
            expect(articles.length).toEqual(1);
            expect(articles).toContain(mock(Article, {
                label: 'articleLabel1',
                url: `articleUrl1/myMainKey/mySubKey/en/0/`
            }));
            expect(links.length).toEqual(1);
            expect(helpService.getDocumentationUrl).toHaveBeenCalledWith(7);
            expect(helpService.getDocumentationUrl).toHaveBeenCalledTimes(1);
            expect(links).toContain(mock(Link, { id: 7, label: 'linkLabel1', url: `linkUrl1/7/` }));

        });
        // Description
        it('should return configuration if description is not defined', () => {
            // Given the helper is set with no description
            helper.description = undefined;
            initSpies();

            // When calling addContent
            const config: IconPopoverConfig = helpPopoverService.addContent(helper, 'mainKey', 'subKey', 'en');

            // Then configuration and its main attributes should be defined, except for description
            const { title, description, articles, links } = config.content;
            expect(title).toEqual('MyTitle');
            expect(description).toBeFalsy();
            expect(articles.length).toEqual(1);
            expect(links.length).toEqual(1);
        });
        // Articles and links
        it('should return configuration if articles and links are not defined', () => {
            // Given the helper is set with no articles and no links
            helper.articles = undefined;
            helper.links = undefined;
            initSpies();

            // When calling addContent
            const config: IconPopoverConfig = helpPopoverService.addContent(helper, 'mainKey', 'subKey', 'en');

            // Then configuration and its main attributes should be defined, expect for articles and links
            const { title, description, articles, links } = config.content;
            expect(title).toEqual('MyTitle');
            expect(description).toEqual('MyDescription');
            expect(articles).toEqual([]);
            expect(links).toEqual([]);
        });

        // Language
        it('should add content', () => {
            // Given we call the helper for content in fr language but the helper came back with 'ru' as the resolved language
            helper.language = 'ru';
            initSpies();

            // When calling addContent
            helpPopoverService.addContent(helper, 'myMainKey', 'mySubKey', 'en');

            // Then translation service should be updated with the resolved language
            expect(langService.setLang).toHaveBeenCalledWith('ru');
            expect(helpService.getContextUrl).toHaveBeenCalledWith('myMainKey', 'mySubKey', 'ru', 0, 'resolvedPluginId');
        });
    });

    describe('addLabels', () => {

        it('should return the translated labels', () => {
            // Given a custom label is return from the translation service
            const customLabels: PopoverLabel = {
                articles: 'Plus d\'info...',
                links: 'Sujets associés',
                iconAlt: 'Aide',
                comingSoon: 'Aide contextuelle à venir.',
                errors: {
                    failedData: 'Une erreur est survenue lors de la récupération des données !' +
                        '\\nVérifiez les clés de la brique fournies au composant EdcHelp.'
                },
                content: null,
                url: '',
                exportId: ''
            };
            initSpies(customLabels);
            const config: IconPopoverConfig = new IconPopoverConfig();
            // When calling addLabels
            helpPopoverService.addLabels(config)
                .then((config: IconPopoverConfig) => {
                    // Then popover labels should match
                    expect(config.labels).toEqual(customLabels);
                });
        });

    });
});
