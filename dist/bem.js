"use strict";
var core_1 = require("@angular/core");
var BemConfig = (function () {
    function BemConfig() {
    }
    return BemConfig;
}());
exports.BemConfig = BemConfig;
var separators = {
    el: '__',
    mod: '--',
    val: '-'
};
var ignoreValues = false;
var modCase = 'kebab';
function modNameHandler(str) {
    switch (modCase) {
        case 'kebab':
            return str ? str.replace(/[A-Z]/g, function (s) { return '-' + s.toLowerCase(); }).replace(/$\-/, '') : '';
        case 'snake':
            return str ? str.replace(/[A-Z]/g, function (s) { return '_' + s.toLowerCase(); }).replace(/$\-/, '') : '';
        default:
            return str;
    }
}
function generateClass(blockName, elemName, modName, modValue) {
    if (ignoreValues) {
        modValue = !!modValue;
    }
    blockName = blockName;
    elemName = elemName;
    modName = modNameHandler(modName);
    if (typeof modValue !== 'string' && typeof modValue !== 'boolean') {
        modValue = !!modValue;
    }
    var cls = blockName;
    if (elemName) {
        cls += separators.el + elemName;
    }
    if (modName) {
        cls += separators.mod + modName;
        if (typeof (modValue) !== 'boolean' && modValue != null) {
            cls += separators.val + modValue;
        }
    }
    return cls;
}
function parseMods(mods) {
    if (typeof mods === 'string') {
        mods = mods.split(/\s+/);
    }
    if (Array.isArray(mods)) {
        var arr = mods;
        mods = {};
        arr.forEach(function (key) {
            mods[key] = true;
        });
    }
    else if (typeof mods !== 'object') {
        return {};
    }
    return mods;
}
function setMods(blockName, elemName, mods, oldMods, element, renderer) {
    Object.keys(mods).forEach(function (key) {
        if (oldMods[key]) {
            if (mods[key] === oldMods[key])
                return;
            renderer.setElementClass(element.nativeElement, generateClass(blockName, elemName, key, oldMods[key]), false);
        }
        if (mods[key]) {
            renderer.setElementClass(element.nativeElement, generateClass(blockName, elemName, key, mods[key]), true);
        }
    });
    Object.keys(oldMods).forEach(function (key) {
        if (!(key in mods) && oldMods[key]) {
            renderer.setElementClass(element.nativeElement, generateClass(blockName, elemName, key, oldMods[key]), false);
        }
    });
}
var Block = (function () {
    function Block(element, renderer, name) {
        this.name = name;
        this.element = element;
        this.renderer = renderer;
        renderer.setElementClass(element.nativeElement, generateClass(name), true);
    }
    ;
    Block.prototype.ngOnChanges = function () {
        if (JSON.stringify(this.mod) !== this._modSerialized) {
            this._modSerialized = JSON.stringify(this.mod);
            var mods = this.mod;
            var _a = this, renderer = _a.renderer, element = _a.element, name_1 = _a.name;
            mods = parseMods(mods);
            setMods(name_1, null, mods, this._mods || {}, element, renderer);
            this._mods = this._mods === mods ? Object.assign({}, mods) : mods;
        }
    };
    return Block;
}());
Block = __decorate([
    core_1.Directive({
        selector: '[block]',
        inputs: ['mod']
    }),
    __param(2, core_1.Attribute('block')),
    __metadata("design:paramtypes", [core_1.ElementRef,
        core_1.Renderer, String])
], Block);
var Elem = (function () {
    function Elem(element, renderer, name, block) {
        this.blockName = block.name;
        this.name = name;
        this.element = element;
        this.renderer = renderer;
        renderer.setElementClass(element.nativeElement, generateClass(block.name, name), true);
    }
    ;
    Elem.prototype.ngOnChanges = function () {
        if (JSON.stringify(this.mod) !== this._modSerialized) {
            this._modSerialized = JSON.stringify(this.mod);
            var mods = this.mod;
            var _a = this, renderer = _a.renderer, element = _a.element, blockName = _a.blockName, name_2 = _a.name;
            mods = parseMods(mods);
            setMods(blockName, name_2, mods, this._mods || {}, element, renderer);
            this._mods = this._mods === mods ? Object.assign({}, mods) : mods;
        }
    };
    return Elem;
}());
Elem = __decorate([
    core_1.Directive({
        selector: '[elem]',
        inputs: ['mod']
    }),
    __param(2, core_1.Attribute('elem')),
    __metadata("design:paramtypes", [core_1.ElementRef,
        core_1.Renderer, String, Block])
], Elem);
var BemModule = BemModule_1 = (function () {
    function BemModule() {
    }
    BemModule.config = function (data) {
        if (!data)
            return BemModule_1;
        if (data.separators) {
            separators.el = data.separators[0] || '__';
            separators.mod = data.separators[1] || '--';
            separators.val = data.separators[2] || '-';
        }
        if ('ignoreValues' in data) {
            ignoreValues = !!data.ignoreValues;
        }
        if (data.modCase) {
            if (!~['kebab', 'camel', 'snake'].indexOf(data.modCase)) {
                throw 'Wrong mod case. You can use only these cases: kebab, snake, camel';
            }
            modCase = data.modCase;
        }
        return BemModule_1;
    };
    return BemModule;
}());
BemModule = BemModule_1 = __decorate([
    core_1.NgModule({
        declarations: [
            Block,
            Elem
        ],
        exports: [
            Block,
            Elem
        ]
    }),
    __metadata("design:paramtypes", [])
], BemModule);
exports.BemModule = BemModule;
;
var BemModule_1;
//# sourceMappingURL=bem.js.map