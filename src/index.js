require('zone.js');

import * as compiler from '@angular/compiler';
import * as common from '@angular/common';
import * as core from '@angular/core';
import * as router from '@angular/router';
import * as platformBrowserDynamic from '@angular/platform-browser-dynamic';
import * as platformBrowser from '@angular/platform-browser';

export { compiler, common, core, router, platformBrowserDynamic, platformBrowser };

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

function getParameters(target, metadata) {
    const args = target.toString().match(/(?:function [\w]+|constructor)\((.*)\)/i);
    const parameters = [];

    if (null === args) {
        return parameters;
    }

    target.parameters = [];
    if (!metadata.providers || !Array.isArray(metadata.providers)) {
        metadata.providers = [];
    }

    let i = 0;
    let provider;
    let angularServer;
    args[1].split(',').forEach(arg => {
        if (arg.trim() === '') {
            return;
        }

        angularService = isAngularService(arg);
        if (!!angularService) {
            // https://stackoverflow.com/questions/38859198/angular-2-dependency-injection-in-es5-and-es6
            parameters.push([new core.Inject(angularService)]);
        } else if (!!metadata.providers[i]) {
            provider = metadata.providers[i];
            if (!provider.useValue && !provider.useClass) {
                parameters.push([new core.Inject(provider)]);
            } else {
                parameters.push([new core.Inject(provider.provide), provider.useValue || provider.useClass]);
            }

            i++;
        } else {
            parameters.push(eval(arg));
        }
    });

    return parameters;
}

export function Injectable(metadata = {}) {
    return function decorator(target) {
        target.annotations = [new core.Injectable(metadata)];
        target.parameters = getParameters(target, metadata);

        return target;
    }
}

export function Component(metadata = {}) {
    return function decorator(target) {
        target.annotations = [new core.Component(metadata)];
        target.parameters = getParameters(target, metadata);

        return target;
    }
}

export function NgModule(metadata = {}) {
    return function decorator(target) {
        target.annotations = [new core.NgModule(metadata)];
        target.parameters = getParameters(target, metadata);

        return target;
    }
}

window.Injectable = Injectable;
window.Component = Component;
window.NgModule = NgModule;
window.ng = { compiler, common, core, router, platformBrowserDynamic, platformBrowser };
