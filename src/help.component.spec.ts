import * as angular from 'angular';

import { HelpComponent } from './help.component';
import { EdcHelpConfigService, EDC_HELP_CONFIG_SERVICE_NAME } from './services/edc-help-config.service';
import { mockServices, mockService } from './utils/test.utils';


describe('Help component test', () => {

    let injector: any;
    let $element: JQLite;
    let $componentController;

    let helpConfigService: EdcHelpConfigService;

    beforeEach(() => {
        // Need to provide element since it's injected locally by angular into component controllers and not natively provided
        $element = angular.element('<div></div>');
        angular.module('edcHelp', [])
            .constant('$element', $element)
            .component('edcHelp', HelpComponent as angular.IComponentOptions);
        angular.mock.module('edcHelp');
        mockServices([mockService(EDC_HELP_CONFIG_SERVICE_NAME, ['buildPopoverConfig'])]);
    });

    beforeEach(inject(($injector: angular.auto.IInjectorService, _$componentController_: any) => {
        injector = $injector;
        helpConfigService = $injector.get<EdcHelpConfigService>(EDC_HELP_CONFIG_SERVICE_NAME);
        $componentController = _$componentController_;
    }));

    beforeEach(() => {
        spyOn(helpConfigService, 'buildPopoverConfig').and.returnValue(Promise.resolve(null));
    });

    const buildComponent = (_$componentController_, bindings: any) => {
        $componentController = _$componentController_;
        return $componentController('edcHelp', bindings, {});
    };

    describe('init', () => {
        it('should init the component', angular.mock.inject((_$componentController_: any) => {

            const component = buildComponent(_$componentController_, {});

            expect(component).toBeDefined();
            component.$onChanges();
            expect(helpConfigService.buildPopoverConfig).toHaveBeenCalledTimes(1);
        }));
    });

    it('should exist', angular.mock.inject((_$componentController_: any) => {
        $componentController = _$componentController_;

        const element = angular.element('<div></div>');
        const component = _$componentController_('edcHelp', {$element: element}, {});

        expect(component).toBeDefined();
    }));

    it('should init with right inputs', angular.mock.inject(($componentController: any) => {
        const bindings = {
            mainKey: 'main',
            subKey: 'sub',
            pluginId: 'myPlugin',
            lang: 'fr'
        };
        const component = $componentController('edcHelp', {}, bindings);

        expect(component.mainKey).toEqual('main');
        expect(component.subKey).toEqual('sub');
        expect(component.pluginId).toEqual('myPlugin');
        expect(component.lang).toEqual('fr');
    }));
});
