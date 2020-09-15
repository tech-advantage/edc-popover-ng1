import { EdcClient } from 'edc-client-js';
import * as angular from 'angular';
import { EDC_HELP_SERVICE_NAME, EdcHelpService } from './edc-help.service';
import { EdcPopoverConfiguration, EdcPopoverOptions } from '../config';
import { EDC_CONFIGURATION_NAME, EdcConfigurationProvider } from '../config/edc-configuration.provider';

describe('Help Service Test', () => {
    let injector;

    let popoverConfigurationHandler: EdcPopoverConfiguration;
    let helpService: EdcHelpService;

    beforeEach(() => {
        const app = angular.module('edcHelp', [])
            .service(EDC_HELP_SERVICE_NAME, EdcHelpService)
            .provider(EDC_CONFIGURATION_NAME, EdcConfigurationProvider);
        angular.mock.module('edcHelp');
        app.config(EdcConfiguration);

        // Where EdcConfiguration is a function to retrieve the edc configuration provider
        function EdcConfiguration(edcConfigurationProvider) {
            // A setter is available to save your configuration, for example:
            edcConfigurationProvider.set({
                helpPath: '/help',
                docPath: '/doc',
                pluginId: 'myPluginId',
                icon: 'fa-question-circle-o',
                // You can specify the options to set globally
                options: { appendTo: 'parent' }
            });
        }
    });

    beforeEach(inject(($injector: angular.auto.IInjectorService, _$componentController_: any) => {
        injector = $injector;
        helpService = $injector.get<EdcHelpService>(EDC_HELP_SERVICE_NAME);
        popoverConfigurationHandler = $injector.get<EdcPopoverConfiguration>(EDC_CONFIGURATION_NAME);
    }));

    // mock EdcClient
    beforeEach(() => {
        spyOn(EdcClient.prototype, 'getHelper').and.returnValue(Promise.resolve());
    });

    describe('create Service', () => {
        it('should have provided configuration', () => {
            expect(helpService.getPluginId()).toEqual('myPluginId');
        });
    });

    describe('Runtime', () => {

        beforeEach(() => {
            popoverConfigurationHandler.helpPath = '/help';
            popoverConfigurationHandler.docPath = '/doc';
            popoverConfigurationHandler.pluginId = 'myPluginId';
            popoverConfigurationHandler.options = { appendTo: 'parent' };
        });

        describe('getHelp', () => {

            it('should use "edchelp" as plugin identifier if getHelper is called with no defined pluginId parameter', () => {
                helpService.getHelp('mainKey', 'subKey').then(() => {});

                expect(EdcClient.prototype.getHelper).toHaveBeenCalledWith('mainKey', 'subKey', 'myPluginId', undefined);
            });

            it('should use "edchelp2" as plugin identifier', () => {

                helpService.getHelp('mainKey', 'subKey', 'edchelp2').then(() => {});

                expect(EdcClient.prototype.getHelper).toHaveBeenCalledWith('mainKey', 'subKey', 'edchelp2', undefined);
            });
        });

        describe('getContextUrl', () => {

            it('should call edc client for the context url', () => {
                spyOn(EdcClient.prototype, 'getContextWebHelpUrl').and.returnValue('contextUrl');

                const url = helpService.getContextUrl('main', 'sub', 'en', 0, 'myPlugin');

                expect(url).toEqual('contextUrl');
                expect(EdcClient.prototype.getContextWebHelpUrl).toHaveBeenCalledWith('main', 'sub', 'en', 0, 'myPlugin');
            });
        });

        describe('getDocumentationUrl', () => {

            it('should call edc client for the context url', () => {
                spyOn(EdcClient.prototype, 'getDocumentationWebHelpUrl').and.returnValue('docUrl');

                const url = helpService.getDocumentationUrl(0);

                expect(url).toEqual('docUrl');
                expect(EdcClient.prototype.getDocumentationWebHelpUrl).toHaveBeenCalledWith(0);
            });
        });

        describe('getI18nUrl', () => {
            it('should call edc client for the context url', () => {
                spyOn(EdcClient.prototype, 'getPopoverI18nUrl').and.returnValue('i18nUrl');

                const url = helpService.getI18nUrl();

                expect(url).toEqual('i18nUrl');
                expect(EdcClient.prototype.getPopoverI18nUrl).toHaveBeenCalledWith();
            });
        });

        describe('getPluginId', () => {
            it('should call edc client for the context url', () => {
                expect(popoverConfigurationHandler.pluginId).toEqual('myPluginId');

                const pluginId = helpService.getPluginId();

                expect(pluginId).toEqual('myPluginId');
            });
        });

        describe('getPopoverOptions', () => {
            it('should call edc client for the context url', () => {
                expect(popoverConfigurationHandler.options).toEqual({ appendTo: 'parent' });

                const options = helpService.getPopoverOptions();

                expect(options).toEqual({ appendTo: 'parent' });
            });
            it('should return default options if none was defined', () => {
                popoverConfigurationHandler.options = null;

                const options = helpService.getPopoverOptions();

                expect(JSON.stringify(options)).toEqual(JSON.stringify(new EdcPopoverOptions()));
            });
        });
    });
});
