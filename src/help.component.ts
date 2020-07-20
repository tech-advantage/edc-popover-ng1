import { IAugmentedJQuery, IComponentOptions, IScope } from 'angular';

import { Popover, PopoverConfig } from 'edc-popover-js';
import { EDC_HELP_CONFIGURATION_NAME, EdcHelpConfigService } from './config/edc-help-config.service';
import { PopoverOptions } from './config/popover-options';
import { Placement } from 'tippy.js';

export const EDC_HELP_COMPONENT_NAME = 'edcHelp';

class HelpComponentCtrl {
    // Dependencies Injection
    static get $inject() {
        return ['$scope', '$element', EDC_HELP_CONFIGURATION_NAME];
    }

    // The popover configuration, provided by the edc config provider
    popoverConfig: PopoverConfig;
    // The reference for the icon that will trigger the popover
    elementRef: HTMLElement;
    // The instance of the popover
    popoverInstance;

    // Inputs
    mainKey: string;
    subKey: string;
    pluginId: string;
    lang: string;
    dark: boolean;
    placement: Placement;
    customClass: string;
    appendTo: string;

    constructor(private $scope: IScope,
                private $element: IAugmentedJQuery,
                private helpConfigService: EdcHelpConfigService) {
    }

    $onChanges(): void {
        this.buildPopoverConfig();
    }

    buildPopoverConfig(): void {
        // Set the button element reference if not defined yet
        if (!this.elementRef) {
            this.elementRef = this.$element && this.$element[0];
        }
        const { placement, customClass, appendTo } = this;
        const options: PopoverOptions = { placement, customClass, appendTo };
        this.helpConfigService.buildPopoverConfig(this.elementRef, this.mainKey, this.subKey, this.pluginId, this.lang, options)
            .then(this.loadPopover.bind(this));
    }

    loadPopover(config: PopoverConfig): void {
        if (config) {
            this.popoverConfig = config;
            // Third party edc-client-js will perform async calls, need to force new angularJS digest cycle
            this.$scope.$apply();
            this.popoverInstance = new Popover(this.popoverConfig);
        }
    }

    getIconClass(): string[] {
        const classes = [];
        // Set icon class
        if (this.popoverConfig && this.popoverConfig.icon) {
            classes.push(this.popoverConfig.icon);
        }
        // Set dark class
        if (this.dark) {
            classes.push('on-dark');
        }
        return classes;
    }
}

export const HelpComponent: IComponentOptions = {
    template: `<span class="fa help-icon" ng-class="$ctrl.getIconClass()"></span>`,
    bindings: {
        mainKey: '<',
        subKey: '<',
        pluginId: '<',
        lang: '<',
        dark: '<',
        placement: '<',
        customClass: '<',
        appendTo: '<',
    },
    controller: HelpComponentCtrl
};
