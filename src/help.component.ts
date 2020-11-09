import { IAugmentedJQuery, IComponentOptions, IScope } from 'angular';

import { Popover } from 'edc-popover-utils';
import { EDC_HELP_CONFIG_SERVICE_NAME, EdcHelpConfigService } from './services/edc-help-config.service';
import { IEdcPopoverOptions } from './config/edc-popover-options.interface';
import { IconPopoverConfig } from './config/icon-popover-config';
import { isFalse } from './utils/global.utils';

export const EDC_HELP_COMPONENT_NAME = 'edcHelp';

class HelpComponentCtrl {
    // Dependencies Injection
    static get $inject() {
        return ['$scope', '$element', EDC_HELP_CONFIG_SERVICE_NAME];
    }

    // The popover configuration, built from global configuration and component inputs
    private config: IconPopoverConfig;
    // The reference for the icon that will trigger the popover
    private targetRef: HTMLElement;
    private popover: Popover;

    // Inputs
    private mainKey: string;
    private subKey: string;
    private pluginId: string;
    private lang: string;
    private options: IEdcPopoverOptions;

    constructor(private $scope: IScope,
                private $element: IAugmentedJQuery,
                private helpConfigService: EdcHelpConfigService) {
    }

    $onChanges(): void {
        this.buildPopoverConfig();
    }

    $onDestroy(): void {
        this.removePopover();
    }

    getIconClasses(): string | string[] {
        return this.helpConfigService.getIconClasses(this.config);
    }

    /**
     * Returns the style if icon was set via url
     */
    getIconStyle(): Partial<CSSStyleDeclaration> {
        return this.config && this.config.iconConfig && this.config.iconConfig.imageStyle;
    }

    /**
     * Prepares the popover configuration
     *
     * @private
     */
    private buildPopoverConfig(): void {
        // Set the button element reference if not defined yet
        if (!this.targetRef) {
            // If not already set, defined the icon as the target element
            this.targetRef = this.getTargetRef();
        }
        this.helpConfigService.buildPopoverConfig(this.mainKey, this.subKey, this.pluginId, this.lang, this.options)
            .then((config: IconPopoverConfig) => this.updateConfig(config));
    }

    /**
     * Returns the reference of the target (DOM element that will trigger the popover)
     *
     * @private
     */
    private getTargetRef(): HTMLElement {
        let targetIcon: HTMLElement;
        if (this.$element) {
            // Target is the span, child of current element
            const children = this.$element.children();
            targetIcon = (children && children.length) ? children[0] : null;
        }
        return targetIcon;
    }

    /**
     * Updates the popover configuration and loads the popover
     *
     * Configuration contains the help content, the labels, the target,
     * and the options to pass to the popover library
     *
     * @param newConfig the freshly built popover configuration
     * @private
     */
    private updateConfig(newConfig: IconPopoverConfig): void {
        if (!newConfig) {
            return;
        }
        this.config = { ...newConfig };

        this.$scope.$apply();
        this.loadPopover();
    }

    /**
     * Loads the popover once the configuration is ready
     * @private
     */
    private loadPopover(): void {
        if (this.config && isFalse(this.config.disablePopover) && this.targetRef) {
            this.config.target = this.targetRef;
            if (!this.popover) {
                this.popover = new Popover();
            }
            this.popover.buildPopover(this.config);
        } else {
            this.removePopover();
        }
    }

    /**
     * Removes the popover and resets the component attributes
     *
     * @private
     */
    private removePopover(): void {
        // Clean any previous instance
        if (this.popover && this.popover.instance &&
            typeof this.popover.instance.destroy === 'function') {
            this.popover.instance.unmount();
            this.popover.instance.destroy();
            this.popover = null;
        }
    }

}

export const HelpComponent: IComponentOptions = {
    template: `<span
        id="popover-trigger"
        class="edc-help-icon"
        ng-class="$ctrl.getIconClasses()"
        ng-style="$ctrl.getIconStyle()"></span>`,
    bindings: {
        mainKey: '<',
        subKey: '<',
        pluginId: '<',
        lang: '<',
        options: '<'
    },
    controller: HelpComponentCtrl
};
