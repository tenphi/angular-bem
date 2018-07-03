"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@angular/core");
var BemConfig = /** @class */ (function () {
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
    if (typeof modValue !== 'string' && typeof modValue !== 'boolean') {
        modValue = !!modValue;
    }
    var cls = blockName;
    if (elemName) {
        cls += separators.el + elemName;
    }
    if (modName) {
        modName = modNameHandler(modName);
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
            if (mods[key] === oldMods[key]) {
                return;
            }
            renderer.removeClass(element.nativeElement, generateClass(blockName, elemName, key, oldMods[key]));
        }
        if (mods[key]) {
            renderer.addClass(element.nativeElement, generateClass(blockName, elemName, key, mods[key]));
        }
    });
    Object.keys(oldMods).forEach(function (key) {
        if (!(key in mods) && oldMods[key]) {
            renderer.removeClass(element.nativeElement, generateClass(blockName, elemName, key, oldMods[key]));
        }
    });
}
var BlockDirective = /** @class */ (function () {
    function BlockDirective(element, renderer, name) {
        this.name = name;
        this.element = element;
        this.renderer = renderer;
        renderer.addClass(element.nativeElement, generateClass(name));
    }
    BlockDirective.prototype.ngOnChanges = function () {
        if (JSON.stringify(this.mod) !== this._modSerialized) {
            this._modSerialized = JSON.stringify(this.mod);
            var mods = this.mod;
            var _a = this, renderer = _a.renderer, element = _a.element, name_1 = _a.name;
            mods = parseMods(mods);
            setMods(name_1, '', mods, this._mods || {}, element, renderer);
            this._mods = this._mods === mods ? Object.assign({}, mods) : mods;
        }
    };
    tslib_1.__decorate([
        core_1.Input(),
        tslib_1.__metadata("design:type", Object)
    ], BlockDirective.prototype, "mod", void 0);
    BlockDirective = tslib_1.__decorate([
        core_1.Directive({
            selector: '[block]',
        }),
        tslib_1.__param(2, core_1.Attribute('block')),
        tslib_1.__metadata("design:paramtypes", [core_1.ElementRef,
            core_1.Renderer2, String])
    ], BlockDirective);
    return BlockDirective;
}());
exports.BlockDirective = BlockDirective;
var ElemDirective = /** @class */ (function () {
    function ElemDirective(element, renderer, name, block) {
        this.blockName = block.name;
        this.name = name;
        this.element = element;
        this.renderer = renderer;
        renderer.addClass(element.nativeElement, generateClass(block.name, name));
    }
    ElemDirective.prototype.ngOnChanges = function () {
        if (JSON.stringify(this.mod) !== this._modSerialized) {
            this._modSerialized = JSON.stringify(this.mod);
            var mods = this.mod;
            var _a = this, renderer = _a.renderer, element = _a.element, blockName = _a.blockName, name_2 = _a.name;
            mods = parseMods(mods);
            setMods(blockName, name_2, mods, this._mods || {}, element, renderer);
            this._mods = this._mods === mods ? Object.assign({}, mods) : mods;
        }
    };
    tslib_1.__decorate([
        core_1.Input(),
        tslib_1.__metadata("design:type", Object)
    ], ElemDirective.prototype, "mod", void 0);
    ElemDirective = tslib_1.__decorate([
        core_1.Directive({
            selector: '[elem]',
        }),
        tslib_1.__param(2, core_1.Attribute('elem')),
        tslib_1.__metadata("design:paramtypes", [core_1.ElementRef,
            core_1.Renderer2, String, BlockDirective])
    ], ElemDirective);
    return ElemDirective;
}());
exports.ElemDirective = ElemDirective;
var BemModule = /** @class */ (function () {
    function BemModule() {
    }
    BemModule_1 = BemModule;
    BemModule.config = function (data) {
        if (!data) {
            return BemModule_1;
        }
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
    var BemModule_1;
    BemModule = BemModule_1 = tslib_1.__decorate([
        core_1.NgModule({
            declarations: [
                BlockDirective,
                ElemDirective,
            ],
            exports: [
                BlockDirective,
                ElemDirective,
            ]
        })
    ], BemModule);
    return BemModule;
}());
exports.BemModule = BemModule;
//# sourceMappingURL=bem.js.map