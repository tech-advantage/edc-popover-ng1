import { EdcPopoverConfiguration } from './edc-popover-configuration';

export const EDC_CONFIGURATION_NAME = 'edcConfiguration';

/**
 * Sets the configuration for all the popovers in the host application
 *
 * Needs to be provided by the host application when importing the edc help module
 */
export class EdcConfigurationProvider {

    config: EdcPopoverConfiguration;

    /**
     * Returns the current configuration, when required by angular for dependency injection
     */
    $get(): EdcPopoverConfiguration {
        // This will be injected when requiring the 'edcPopoverConfig' dependency
        return this.config;
    }

    set(config: EdcPopoverConfiguration): void {
        // This will be set at module loading, from the host application
        this.config = config;
    }
}
