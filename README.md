## edc-popover-ng1

[![Build Status](https://travis-ci.org/tech-advantage/edc-popover-ng1.svg?branch=master)](https://travis-ci.org/tech-advantage/edc-popover-ng1)
[![npm version](https://badge.fury.io/js/edc-popover-ng1.svg)](https://badge.fury.io/js/edc-popover-ng1)

AngularJS implementation of edc popover displaying the contextual help.

_This project is meant to be used with **easy doc contents** (aka edc)._

edc is a simple yet powerful tool for agile-like documentation management.

Learn more at [https://www.easydoccontents.com](https://www.easydoccontents.com).

## Dependencies

The required dependencies are:

- [AngularJS](https://https://angularjs.org/) tested with 1.5.8 and higher
- [FontAwesome](https://github.com/FortAwesome/Font-Awesome) 4.7.0 or higher

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

font-awesome is a dependency; if you use scss, you'll need to specify the font localisation too

```scss
$fa-font-path: '~font-awesome/fonts/';
```

```less
@import "~font-awesome/less/font-awesome.less";
```


### Setup

To work properly, this module needs a basic configuration, using the edcConfigurationProvider.

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
        // You can specify the options to set globally 
        options: {
            appendTo: 'parent'
        }
    });
}

```
The edc-help component will then be available anywhere in your application

```html

<edc-help mainKey='myKey' subKey='mySubKey'></edc-help>

```

Configuration properties :
| Property | Type | Description |
|---|---|---|
| pluginId | `string` | The identifier of the target plugin documentation export |
| helpPath | `string` | The path to [edc-help-viewer](https://github.com/tech-advantage/edc-help-viewer) for opening the documentation. It needs to be the same as the **base href** parameter used by the viewer. See [here](https://github.com/tech-advantage/edc-help-viewer) for more information.|
| docPath  | `string` | The path to exported documentation |
| i18nPath | `string` | The path to translation json files |
| icon  | `string` | The icon to use |
| options | `Object` | Global options for the popovers (see below) |

Global options (more to come):

| Property | Type | Description | Default |
|---|---|---|---|
| placement | popper.js `Placement` | The popover placement | `bottom` |
| customClass | `string` | class name that will be added to the main popover container | undefined |
| appendTo | `parent` or `Element` | the element that will contain the popover | `body` |

### Usage

You just need to insert the edc-help component in your templates

```html

<edc-help mainKey='myKey' subKey='mySubKey'></edc-help>

```

Mandatory inputs:

The `mainKey` and `subKey` inputs are necessary to identify the help content

| Prop | Type | Description |
|---|---|---|
| mainKey | `string` | The main key of the contextual help |
| subKey | `string` | The sub key of the contextual help |

Optional inputs:

| Method | Return type | Description | Default value |
|---|---|---|---|
| pluginId | `string` | A custom pluginId | `undefined` (will use the global one) |
| dark | `boolean` | true if dark mode enabled | `false` |
| placement | `string` | Positions can be `auto` `top` `bottom` `right` `left`... (see full list below) | `bottom` |
| lang | `string` | A language | `undefined` (keeps the language from the provider) |
| customClass | `string` | A css class name for style customization | `undefined` |
| appendTo | `parent` or `body` | Element that will receive the popover | `body` |

## Customization

### CSS

#### Global

When dark-mode is enabled, the CSS class `on-dark` is applied to the help icon.

#### Popover

For more control, the `customClass` option will add the given class name to the popover container `.edc-popover-container`.
You can then override the main classes.

For example, to change the background color
```css
.my-custom-class {
    background-color: lightgreen;
}
/* or the title font-size */
.my-custom-class .edc-popover-title {
    font-size: 18px;
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
