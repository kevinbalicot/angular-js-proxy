//require('rxjs');
require('zone.js');

import * as compiler from '@angular/compiler';
import * as common from '@angular/common';
import * as core from '@angular/core';
import * as platformBrowserDynamic from '@angular/platform-browser-dynamic';
import * as platformBrowser from '@angular/platform-browser';

export { compiler, common, core, platformBrowserDynamic, platformBrowser };

export function Injectable(metadata = {}) {
    return function decorator(target) {
        target.annotations = [new core.Injectable(metadata)];
        target.parameters = [];

        if (!!metadata.providers && Array.isArray(metadata.providers)) {
            metadata.providers.forEach(provider => target.parameters.push([new core.Inject(provider)]))
        }

        return target;
    }
}

export function Component(metadata = {}) {
    return function decorator(target) {
        target.annotations = [new core.Component(metadata)];
        target.parameters = [];

        if (!!metadata.providers && Array.isArray(metadata.providers)) {
            metadata.providers.forEach(provider => target.parameters.push([new core.Inject(provider)]))
        }

        return target;
    }
}

export function NgModule(metadata = {}) {
    return function decorator(target) {
        target.annotations = [new core.NgModule(metadata)];
        target.parameters = [];

        if (!!metadata.providers && Array.isArray(metadata.providers)) {
            metadata.providers.forEach(provider => target.parameters.push([new core.Inject(provider)]))
        }

        return target;
    }
}