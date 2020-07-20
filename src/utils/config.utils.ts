import { PopoverOptions as PopoverJSOptions } from 'edc-popover-js';
import { PopoverOptions } from '../config/popover-options';

export const mapToPopoverJSOptions = (parentRef: HTMLElement, inputOptions: PopoverOptions, optionsToExtend?: PopoverJSOptions): PopoverJSOptions => {
    const options = optionsToExtend || new PopoverJSOptions();
    if (!inputOptions) {
        return options;
    }
    // Add custom class option - same name
    if (inputOptions.customClass) {
        options.customClass = inputOptions.customClass;
    }
    // Append to option
    if (inputOptions.appendTo) {
        // For now we only support parent as alternative to body, use the given reference
        switch (inputOptions.appendTo) {
            case 'parent':
                options.appendTo = 'parent';
                break;
            default:
                options.appendTo = () => document.body;
        }
    }
    // Placement
    if (inputOptions.placement) {
        options.placement = inputOptions.placement;
    }
    return options;
};
