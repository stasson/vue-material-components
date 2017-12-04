
> This Guide assumes you are familiar with [Vue.js](https://vuejs.org/v2/guide/index.html)
components and plugin system.

## Quick Start

#### Playground

Fork the [reference codepen template](https://codepen.io/stasson/pen/XzmMKp)
or one of the [vue-mdc-adapter codepen collection](https://codepen.io/collection/XBpwxq/) 
or the [CodeSandbox](https://codesandbox.io/s/r5o35xnn3q?module=%2Fsrc%2Fcomponents%2FHello.vue)

#### Vue CLI

```console
npm install -g vue-cli
vue init stasson/vue-mdc-adapter-simple my-project
```

## Getting Serious

> Vue.js version `^2.5.3` is required as a peer dependency.  
> Material Components are bundled and do not need to be installed.  
> Material Icons and Fonts are not bundled and need to be fetched.

### UMD Distribution

The UMD distribution is available at
[unpkg.com/vue-mdc-adapter/dist](https://unpkg.com/vue-mdc-adapter/dist/) or via npm:

```console
npm install --save vue-mdc-adapter
```

The distribution comes in two flavors:

#### standalone plugin

| distribution                 | env         | description                |
| ---------------------------- | ----------- | -------------------------- |
| dist/vue-mdc-adapter.js      | development | plugin (ES5)               |
| dist/vue-mdc-adapter.css     | development | stylesheet (CSS)           |
| dist/vue-mdc-adapter.min.js  | production  | minified plugin (ES5)      |
| dist/vue-mdc-adapter.min.css | production  | minified stylesheet (CSS)  |

#### _a la carte_  plugins

| distribution                   | env         | description                |
| ------------------------------ | ----------- | -------------------------- |
| dist/[plugin]/[plugin].js      | development | plugin (ES5)               |
| dist/[plugin]/[plugin].css     | development | stylesheet (CCS)           |
| dist/[plugin]/[plugin].min.js  | production  | minified plugin (ES5)      |
| dist/[plugin]/[plugin].min.css | production  | minified stylesheet (CCS)  |

#### Using the CDN

```html
<head>
  <!-- import reset and material stylesheets -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" type="text/css">

  <!-- import vue and then vue-mdc-adapter -->
  <script src="https://unpkg.com/vue"></script>
  <script src="https://unpkg.com/vue-mdc-adapter"></script>
</head>
<body>
  <!-- vue mdc markup -->
<body>
```

> You may want to use the split distribution and freeze the version used:

```html
<head>
  <!-- import reset and material stylesheets -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" type="text/css">

  <!-- import vue-mdc-adapter stylesheet -->
  <link rel="stylesheet" href="https://unpkg.com/vue-mdc-adapter@^0.6.0/dist/vue-mdc-adapter.min.css" type="text/css">

  <!-- import vue and then vue-mdc-adapter -->
  <script src="https://unpkg.com/vue@^2.5.9/dist/vue.min.js"></script>
  <script src="https://unpkg.com/vue-mdc-adapter@^0.6.0/dist/vue-mdc-adapter.min.js"></script>
</head>
```

### ES Module Distribution (Webpack/Rollup)

> The following guide assumes you have a valid Vue.js/Webpack congig.
> refer to [vuejs-templates/webpack](https://github.com/vuejs-templates/webpack) for more.

| module                          | type  |
| ------------------------------- | ----- |
| vue-mdc-adapter                 | ESM   |
| vue-mdc-adapter/styles          | SASS  |
| vue-mdc-adapter[plugin]         | ESM   |
| vue-mdc-adapter/[plugin]/styles | SASS  |

#### install vue, vue-mdc-adapter and eventually vue-router

```bash
npm install vue
npm install vue-router # optional
npm install vue-mdc-adapter
```

#### Add Reset and Material Dependencies to HTML template

```html
<!-- index.html template -->
<head>
  <!-- import reset material icons, fonts and vue-mdc-adapter stylesheets -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono:300,400,500">
  </head>
  <body>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
```

#### import _standalone_ plugin

```javascript
import Vue from 'vue'
import VueMDCAdapter from 'vue-mdc-adapter'
Vue.use(VueMdcAdapter)
```

#### import _a la carte_  plugins

```javascript
import Vue from 'vue'
import VueMDCButton from 'vue-mdc-adapter/button'
Vue.use(VueMDCButton)
```

#### import _a la carte_ SFC mixins

```html
<!-- my-component.vue -->
<template>
    <div class="my-own-component">
        <mdc-headline>Headline</mdc-headline>
        <mdc-title>Title <mdc-caption>Caption</mdc-caption></mdc-title>
        <mdc-subheading >Subheading</mdc-subheading>
        <mdc-body >Body</mdc-body>
    </div>
</template>

<script>
    import VueMDCTypography from 'vue-mdc-adapter/typography'

    export default {
        mixins: [VueMDCTypography]
    }
</script>
```

#### Create your own SASS Theme

> Material Components styles come as a highly themable SASS framework.
> refer to the [MDC Theming Guide](https://material.io/components/web/docs/theming/) 
> for more.

Configure Webpack with sass-loader and make sure sass modules can be resolved:

```javascript
// sass loader config
  {
    loader: 'sass-loader',
    options: {
      sourceMap: false,
      includePaths: [path.resolve(__dirname,'node_modules')],
    },
  },
```

import styles

```scss
/* theme.scss */
$mdc-theme-primary: #212121;
$mdc-theme-accent: #41B883;
$mdc-theme-background: #fff;

@import "vue-mdc-adapter/dist/styles";
```

or _a la carte_

```scss
/* theme.scss */
$mdc-theme-primary: #212121;
$mdc-theme-accent: #41B883;
$mdc-theme-background: #fff;

@import "vue-mdc-adapter/dist/button/styles";
@import "vue-mdc-adapter/dist/fab/styles";
```
