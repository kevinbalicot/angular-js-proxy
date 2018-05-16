# Angular Javascript Proxy

An Angular ES6 proxy. If you don't want to use TypeScript. Work with Angular 5.

⚠️ Every example, in this documentation, works with Babel

---

## Installation

``` bash
$ npm install --save angular-js-proxy
```

## What is contained in this module

``` javascript
import {
    Component,       // Component decorator proxy
    NgModule,        // NgModule decorator proxy
    Injectable       // Injectable decorator proxy
    compiler,        // Angular compiler namespace
    common,          // Angular common namespace
    core,            // Angular core namespace
    platformBrowserDynamic, // Angular platformBrowserDynamic namespace
    platformBrowser         // Angular platformBrowser namespace
} from 'angular-js-proxy';

```

## Usage with decorators

You can use Angular decorators (Component, NgModule ...), with `transform-decorators-legacy` babel plugin, as Javascript decorator.

``` javascript
// index.js

import { Component, NgModule, platformBrowserDynamic, platformBrowser } from 'angular-js-proxy';

@Component({
    selector: 'home-component',
    template: `
        <h1>Hello</h1>
    `
})
class HomeComponent {
    constructor() {}
}

@NgModule({
    imports: [platformBrowser.BrowserModule],
    declarations: [HomeComponent],
    bootstrap: [HomeComponent]
})
class Module {
    constructor() {}
}

platformBrowserDynamic.platformBrowserDynamic().bootstrapModule(Module);
```

With this `package.json`

``` json
{
  "name": "angular-es6-demo",
  "scripts": {
    "build": "browserify index.js -o dist/app.js -t [ babelify ]"
  },
  "babel": {
    "presets": [
      "env"
    ],
    "plugins": [
      "transform-decorators-legacy"
    ]
  },
  "dependencies": {
    "angular-js-proxy": "^0.1"
  },
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-plugin-transform-decorators-legacy": "^1.3.4",
    "babel-preset-env": "^1.6.1",
    "babelify": "^8.0.0",
    "browserify": "^16.2.0"
  }
}
```

Run `npm run build` to transpilate your code.

## Usage with functions

You can also use Angular decorators (Component, NgModule ...) as function

``` javascript
// index.js

import { Component, NgModule, platformBrowserDynamic, platformBrowser } from 'angular-js-proxy';

class HomeComponent {
    constructor() {}
}

Component({
    selector: 'home-component',
    template: `
        <h1>Hello</h1>
    `
})(HomeComponent);

class Module {
    constructor() {}
}

NgModule({
    imports: [platformBrowser.BrowserModule],
    declarations: [HomeComponent],
    bootstrap: [HomeComponent]
})(Module);


platformBrowserDynamic.platformBrowserDynamic().bootstrapModule(Module);
```

With this `package.json`

``` json
{
  "name": "angular-es6-demo",
  "scripts": {
    "build": "browserify index.js -o dist/app.js -t [ babelify ]"
  },
  "babel": {
    "presets": [
      "env"
    ]
  },
  "dependencies": {
    "angular-js-proxy": "^0.1"
  },
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-preset-env": "^1.6.1",
    "babelify": "^8.0.0",
    "browserify": "^16.2.0"
  }
}
```

Run `npm run build` to transpilate your code.

## Examples

### Create an injectable service.

``` javascript
import { Injectable } from 'angular-js-proxy';

// as decorator

@Injectable()
class Utils {
    toUpperCase(string) {
        return String(string).toUpperCase();
    }
}

// as function

class Utils {
    toUpperCase(string) {
        return String(string).toUpperCase();
    }
}

Injectable()(Utils);
```

Usage

``` javascript
import { Component, NgModule, Injectable, platformBrowserDynamic, platformBrowser } from 'angular-js-proxy';

@Injectable()
class Utils {
    toUpperCase(string) {
        return String(string).toUpperCase();
    }
}

@Component({
    selector: 'home-component',
    template: `
        <h1>{{ message }}</h1>
    `,
    providers: [Utils]
})
class HomeComponent {
    constructor(utils) {
        this.message = utils.toUpperCase('hello');
    }
}

@NgModule({
    imports: [platformBrowser.BrowserModule],
    providers: [Utils],
    declarations: [HomeComponent],
    bootstrap: [HomeComponent]
})
class Module {
    constructor() {}
}

platformBrowserDynamic.platformBrowserDynamic().bootstrapModule(Module);
```

A injectable service can be inject to another injectable service.

``` javascript
@Injectable()
class Configurator {
    getAPIConfig() {
        ...
    }
}

@Injectable({
    providers: [Configurator]
})
class API {
    constructor(configurator) {
        this.config = configurator.getAPIConfig();
    }

    callAPI() {
        ...
    }
}
```

### Create an exportable module

``` javascript
// index.js

import { Component, NgModule, common } from 'angular-js-proxy';

@Component({
    selector: 'another-component',
    template: '<h2>Another hello</h2>'
})
class AnotherComponent {}

@NgModule({
    imports: [common.CommonModule],
    declarations: [AnotherComponent],
    exports: [AnotherComponent]
})
export class AnotherModule {}
```

With this `package.json`

``` json
{
  "name": "another-angular-es6-module",
  "main": "index.js",
  "dependencies": {
    "angular-js-proxy": "^0.1"
  },
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-preset-env": "^1.6.1",
    "babelify": "^8.0.0",
    "browserify": "^16.1.1"
  },
  "browserify": {
    "transform": [
      [
        "babelify",
        {
          "presets": [
            "env"
          ],
          "plugins": [
            "transform-decorators-legacy"
          ]
        }
      ]
    ]
  }
}
```

Usage

``` javascript
import { Component, NgModule, platformBrowserDynamic, platformBrowser } from 'angular-js-proxy';
import { AnotherModule } from 'another-angular-es6-module';

@Component({
    selector: 'home-component',
    template: `
        <h1>Hello</h1>
        <another-component></another-component>
    `
})
class HomeComponent {}

@NgModule({
    imports: [platformBrowser.BrowserModule, AnotherModule],
    declarations: [HomeComponent],
    bootstrap: [HomeComponent]
})
class Module {
    constructor() {}
}

platformBrowserDynamic.platformBrowserDynamic().bootstrapModule(Module);
```

## Use Angular service

Example with Angular Router service

``` javascript
import { Component, NgModule, Injectable, router, platformBrowserDynamic, platformBrowser } from 'angular-js-proxy';

@Injectable()
class MyService {}

@Component({
    selector: 'home-component',
    template: `
        <h1>Hello</h1>
        <router-outlet></router-outlet>
    `,
    providers: [MyService]
})
class HomeComponent {
    constructor(myService, ActivatedRoute) {
        this.service = myService;
        this.route = ActivatedRoute;
    }
}

@NgModule({
    imports: [
        platformBrowser.BrowserModule,
        router.RouterModule.forRoot([...])
    ],
    declarations: [HomeComponent],
    bootstrap: [HomeComponent],
    providers: [MyService]
})
class Module {
    constructor() {}
}

platformBrowserDynamic.platformBrowserDynamic().bootstrapModule(Module);
```

The 2nd argument of `HomeComponent` will automatically inject Angular `ActivatedRoute` service (Respect argument name as the Angular service name).
