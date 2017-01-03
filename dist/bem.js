"use strict";
var core_1 = require("@angular/core");
function toKebabCase(str) {
    return str ? str.replace(/[A-Z]/g, function (s) { return '-' + s.toLowerCase(); }).replace(/$\-/, '') : '';
}
function generateClass(blockName, elemName, modName, modValue) {
    blockName = blockName;
    elemName = elemName;
    modName = toKebabCase(modName);
    if (typeof modValue !== 'string' && typeof modValue !== 'boolean') {
        modValue = !!modValue;
    }
    var cls = blockName;
    if (elemName) {
        cls += '__' + elemName;
    }
    if (modName) {
        cls += '--' + modName;
        if (typeof (modValue) !== 'boolean' && modValue != null) {
            cls += '-' + modValue;
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
exports.Block = Block;
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
exports.Elem = Elem;
var BemModule = (function () {
    function BemModule() {
    }
    return BemModule;
}());
BemModule = __decorate([
    core_1.NgModule({
        declarations: [
            // helpers
            Block,
            Elem
        ],
        imports: [],
        providers: []
    }),
    __metadata("design:paramtypes", [])
], BemModule);
exports.BemModule = BemModule;
//# sourceMappingURL=bem.js.map