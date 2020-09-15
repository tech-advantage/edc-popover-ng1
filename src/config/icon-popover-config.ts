import { PopoverConfig } from 'edc-popover-js';
import { IconConfig } from './icon-config';
import { PopoverLabel } from 'edc-client-js';

/**
 * Configuration for both icon and the popover itself
 * Extends the edc-popover-js configuration.
 * Holds the configuration for the edc-popover-js, along with other properties necessary for the edc-client-ng1
 *
 *    - iconConfig: Configuration for the icon: classes, style, url...
 *    - disablePopover: Defines popover current disabled state
 *    - labels: Translated labels from the i18n files returned by the edc help client
 */
export class IconPopoverConfig extends PopoverConfig {
  iconConfig: IconConfig = new IconConfig();
  disablePopover = false;
  labels: PopoverLabel;
}
