import { Placement } from 'tippy.js';

/**
 * Options for the popover that can be set globally
 *
 * these options are the one provided by the configuration
 * They all can be overwritten by the options injected to a single popover, with component inputs
 */
export class GlobalPopoverOptions {
    placement?: Placement;
    customClass?: string;
    appendTo?: string | HTMLElement;
}
