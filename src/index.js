require('zone.js');

import * as compiler from '@angular/compiler';
import * as common from '@angular/common';
import * as core from '@angular/core';
import * as router from '@angular/router';
import * as forms from '@angular/forms';
import * as platformBrowserDynamic from '@angular/platform-browser-dynamic';
import * as platformBrowser from '@angular/platform-browser';

export { compiler, common, core, router, platformBrowserDynamic, platformBrowser, forms };

function isAngularService(providerName) {
    for (let props in common) {
        if (
            String(props).trim() === String(providerName).trim() ||
            String(props).trim().toUpperCase() === String(providerName).trim().toUpperCase()
        ) {
            return common[props];
        }
    }

    for (let props in core) {
        if (
            String(props).trim() === String(providerName).trim() ||
            String(props).trim().toUpperCase() === String(providerName).trim().toUpperCase()
        ) {
            return core[props];
        }
    }

    for (let props in router) {
        if (
            String(props).trim() === String(providerName).trim() ||
            String(props).trim().toUpperCase() === String(providerName).trim().toUpperCase()
        ) {
            return router[props];
        }
    }

    return null;
}

function getParameters(metadata) {
    const parameters = [];
    const providers = [];

    // DI : https://stackoverflow.com/questions/38859198/angular-2-dependency-injection-in-es5-and-es6

    if (!metadata.providers || !Array.isArray(metadata.providers)) {
        metadata.providers = [];
    }

    if (!metadata.inject || !Array.isArray(metadata.inject)) {
        metadata.inject = [];
    }

    let angularService;
    metadata.providers.forEach(provider => {
        angularService = isAngularService(provider.name);
        if (!!angularService) {
            parameters.push([new core.Inject(angularService)]);
        } else {
            if (!provider.useValue && !provider.useClass && !provider.useFactory) {
                parameters.push([new core.Inject(provider)]);
            } else {
                parameters.push([new core.Inject(provider.provide), provider.useValue || provider.useClass || provider.useFactory]);
            }

            providers.push(provider);
        }
    });

    metadata.inject.forEach(provider => {
        angularService = isAngularService(provider.name);
        if (!!angularService) {
            parameters.push([new core.Inject(angularService)]);
        } else {
            parameters.push([new core.Inject(provider)]);
        }
    });

    delete metadata.inject;
    metadata.providers = providers;

    return parameters;
}

export function Injectable(metadata = {}) {
    return function decorator(target) {
        target.parameters = getParameters(metadata);
        target.annotations = [new core.Injectable(metadata)];

        return target;
    }
}

export function Component(metadata = {}) {
    return function decorator(target) {
        target.parameters = getParameters(metadata);
        target.annotations = [new core.Component(metadata)];

        return target;
    }
}

export function NgModule(metadata = {}) {
    return function decorator(target) {
        target.parameters = getParameters(metadata);
        target.annotations = [new core.NgModule(metadata)];

        return target;
    }
}

export function Directive(metadata = {}) {
    return function decorator(target) {
        target.parameters = getParameters(metadata);
        target.annotations = [new core.Directive(metadata)];

        return target;
    }
}

window.Injectable = Injectable;
window.Component = Component;
window.NgModule = NgModule;
window.Directive = Directive;
window.ng = { compiler, common, core, router, platformBrowserDynamic, platformBrowser, forms };
