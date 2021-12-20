## edc-popover-ng1

[![Build Status](https://travis-ci.org/tech-advantage/edc-popover-ng1.svg?branch=master)](https://travis-ci.org/tech-advantage/edc-popover-ng1)
[![npm version](https://badge.fury.io/js/edc-popover-ng1.svg)](https://badge.fury.io/js/edc-popover-ng1)

AngularJS popover component to display a contextual help.

_This project is part of **easy doc contents** [(edc)](https://www.easydoccontents.com)._

edc is a simple yet powerful tool for agile-like documentation management.

Learn more at [https://www.easydoccontents.com](https://www.easydoccontents.com).

## Dependencies

The required dependencies are:

- [AngularJS](https://https://angularjs.org/) >= 1.5.8
- [FontAwesome](https://www.npmjs.com/package/font-awesome) 4.7.0

## How to use

### Import

You can import this module with `npm` by running:
```bash
npm install edc-popover-ng1 --save
```

Or with `yarn`:
```bash
yarn add edc-popover-ng1
```

import the css file in your main style file (e.g. _style.less_) :

```less
@import '~edc-popover-ng1/dist/edc-popover-ng1.css';
```

You need to [download font-awesome](https://fontawesome.com/v4.7.0/get-started/) or install it as a dependency

```bash
npm install font-awesome --save
```
Then import the style.
```html
<link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css">
```
Note that if you use scss, you'll need to specify the font localisation too, defining the `$fa-font-path` variable

```scss
$fa-font-path: '~font-awesome/fonts/';
@import '~font-awesome/scss/font-awesome';
```

More info [here](https://fontawesome.com/v4.7.0/get-started/).

### Setup

To import the edc help module, add it to your module dependencies (`edcHelpModule`).
The help module needs a basic configuration, injected with the edcConfigurationProvider.

```javascript

angular.module('myApp', [
  'edcHelpModule'
]).config(EdcConfiguration);

// Where EdcConfiguration is a function to retrieve the edc configuration provider
function EdcConfiguration(edcConfigurationProvider) {
    // A setter is available to save your configuration, for example:
    edcConfigurationProvider.set({
        helpPath: '/help',
        docPath: '/doc',
        pluginId: 'edchelp',
        icon: 'fa-question-circle-o',
        // You can specify the options to be set globally 
        options: {
            placement: 'top'
        }
    });
}

```

### Usage

The edc-help component will then be available in your application


```html

<edc-help main-key="'my.key'" sub-key="'my.sub.key'"></edc-help>

```

## Inputs and options

#### Mandatory inputs
Mandatory inputs or the `EdcHelp` (see [HelpComponent](./src/help.component.ts)):

| Prop | Type | Description |
|---|---|---|
| mainKey | `string` | The main key of the contextual help |
| subKey | `string` | The sub key of the contextual help |


#### Optional inputs
Optional inputs for the component:

| Input Name | Return type | Description | Default value |
|---|---|---|---|
| pluginId | `string` | A different pluginId from the one defined in the main service | `undefined` |
| lang | `string` | The language to use, for labels and contents, identified by the 2 letters from the [ISO639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) standard. Will use documentation's default if no value is provided  | `undefined` |
| options | [EdcPopoverOptions](./src/config/edc-popover-options.ts) | Options for this popover - will overwrite global options | `undefined` |

Available options [(EdcPopoverOptions)](./src/config/edc-popover-options.ts):

| Property | Type | Description | Default |
|---|---|---|---|
| icon | `PopoverIcon` | Icon settings, see [Icon](#Icon) | [PopoverIcon](./src/config/popover-icon.ts) |
| failBehavior | `FailBehavior` | Icon and popover behavior on error, see [Fail Behavior](#fail-behavior)  | [FailBehavior](./src/config/fail-behavior.ts) |
| placement | popper.js `Placement` | Popover positioning relatively to the icon | `bottom` |
| hideOnClick | `boolean` | If true, any click outside of the popover will close it (inside too if interactive is false) | `true` |
| interactive | `boolean` | Determine if we can interact with the popover content | `true` |
| trigger | `string` | Event that will trigger the popover: `click` `mouseenter` `focus` | `click` |
| customClass | `string` | class name that will be added to the main popover container | undefined |
| dark | `boolean` | Dark mode | `false` |
| theme | `string` | Popover's theme name | `undefined` |
| displayPopover | `boolean` | Show the popover / Go directly to the web help viewer on click | `true` |
| displaySeparator | `boolean` | Show / Hide the separator between header and body | `true` |
| displayTitle | `boolean` | Show / Hide the header containing the title | `true` |
| displayArticles | `boolean` | Show / Hide the articles section | `true` |
| displayRelatedTopics | `boolean` | Show / Hide the related Topics (aka Links) section | `true` |
| displayTooltip | `boolean` | Show / Hide the icon tooltip | `true` |
| delay | `number | [number, number]` | Delay in milliseconds before showing the popover - if array, delay for opening and closing respectively | `undefined` |
| animation | `Animation` | Animation when opening / closing the popover | `undefined` |
| appendTo | `'parent' | Element | (() => Element)` | The element to which append the popover to | `(() => documentation.body)` |

#### Icon
[PopoverIcon](./src/config/popover-icon.ts) contains the options for the icon.

| Property | Type | Description | Default |
|---|---|---|---|
| class | `string` | Class name for the icon. [Font awesome icon classes](https://fontawesome.com/v4.7.0/cheatsheet/) are handled natively | `'fa fa-question-circle-o'` |
| url | `string` | Image url, size is determined by height, and width properties | `undefined` |
| height | `number` | Image height in pixels (for url images only) | `18` |
| width | `number` | Image width in pixels (for url images only). Will take height value if none is provided | `18` |

If `class` property is provided, it will overwrite the default class `'fa fa-question-circle-o'`.
If `url` is defined, it will override the class property, even if `class` is defined.

#### Fail behavior
If the help content failed to be loaded - or any other error occured, the icon and the popover will look for the [FailBehavior](./src/config/fail-behavior.ts) options to define their style and content.

There are separate behaviors for the help icon, and the popover itself.

For the help icon when an error occurs, it adds the following css selector.
 
| Behavior | Description | CSS selector |
|---|---|---|
| `SHOWN` | The help icon is shown as usual (default) | `.edc-help-icon` |
| `DISABLED` | The help icon is greyed out | `.edc-icon-disabled` |
| `HIDDEN` | The help icon is completely hidden (but stays in DOM to avoid breaking the UI) | `.edc-icon-hidden` |
| `ERROR` | The help icon is replaced by an exclamation point | `.edc-icon-error` |

Default values are in file [help.less](./src/help.less)

For the popover when an error occurs:
 - `ERROR_SHOWN` An error message is shown in the popover
 - `FRIENDLY_MSG` A friendly and translated message is shown in the popover
 - `NO_POPOVER` No popover appears when the help icon is triggered

By default, the icon is `SHOWN` and the popover is set to `FRIENDLY_MSG`.

## Customization

### CSS

#### Global

When dark-mode is enabled, the CSS class `edc-on-dark` is applied to the help icon.

#### Popover

You can customize the popover with CSS classes as described below :

![CSS Classes](./CSSClasses.png)

For more control, the `customClass` option will add the given class name to the popover container `.edc-popover-container`.
You can then override the main classes.

For example, if you'd like to change the background color of the popover
```css
.my-custom-class {
    background-color: lightgreen;
}
/* or the title font-size */
.my-custom-class .edc-popover-title {
    font-size: 18px;
}
```

## Providing your own translations for the popover labels

You can set additional translations (or replace the existing ones) by adding i18n json files to the documentation folder.

Please note that one file is required per language (see file example below), and should be named following the ISO639-1 two letters standards 
(ie en.json, it.json...).

By default, edc-popover-ng will be looking for the files in [yourDocPath]/popover/i18n/ (*.json), but you can change this path by modifying 
getI18nPath() in your PopoverConfigurationHandler.

edc-popover-ng comes with English and French translations, and supports up to 36 languages.
For the full list, please refer to [LANGUAGE_CODES](./src/translate/language-codes.ts).

##### JSON file structure

Here is the en.json file used by default:

```json
{
  "labels": {
  "articles": "Need more...",
  "links": "Related topics",
  "iconAlt": "Help",
  "comingSoon": "Contextual help is coming soon.",
  "errorTitle":  "Error",
  "errors": {
    "failedData": "An error occurred when fetching data !\nCheck the brick keys provided to the EdcHelp component."
  },
  "content": null,
  "url": "",
  "exportId": ""
  }
}
```

## Tests

### Unit

You can test the project by running:
```bash
npm run test
```
or
```bash
yarn test
```
