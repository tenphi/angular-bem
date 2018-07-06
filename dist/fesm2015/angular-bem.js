import { NgModule, Directive, Attribute, Renderer2, Input, ElementRef } from '@angular/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class BemConfig {
}
const /** @type {?} */ separators = {
    el: '__',
    mod: '--',
    val: '-'
};
let /** @type {?} */ ignoreValues = false;
let /** @type {?} */ modCase = 'kebab';
/**
 * @param {?} str
 * @return {?}
 */
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
/**
 * @param {?} blockName
 * @param {?=} elemName
 * @param {?=} modName
 * @param {?=} modValue
 * @return {?}
 */
function generateClass(blockName, elemName, modName, modValue) {
    if (ignoreValues) {
        modValue = !!modValue;
    }
    if (typeof modValue !== 'string' && typeof modValue !== 'boolean') {
        modValue = !!modValue;
    }
    let /** @type {?} */ cls = blockName;
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
/**
 * @param {?} mods
 * @return {?}
 */
function parseMods(mods) {
    if (typeof mods === 'string') {
        mods = mods.split(/\s+/);
    }
    if (Array.isArray(mods)) {
        let /** @type {?} */ arr = mods;
        mods = {};
        arr.forEach(key => {
            mods[key] = true;
        });
    }
    else if (typeof mods !== 'object') {
        return {};
    }
    return mods;
}
/**
 * @param {?} blockName
 * @param {?} elemName
 * @param {?} mods
 * @param {?} oldMods
 * @param {?} element
 * @param {?} renderer
 * @return {?}
 */
function setMods(blockName, elemName, mods, oldMods, element, renderer) {
    Object.keys(mods).forEach(key => {
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
    Object.keys(oldMods).forEach(key => {
        if (!(key in mods) && oldMods[key]) {
            renderer.removeClass(element.nativeElement, generateClass(blockName, elemName, key, oldMods[key]));
        }
    });
}
class BlockDirective {
    /**
     * @param {?} element
     * @param {?} renderer
     * @param {?} name
     */
    constructor(element, renderer, name) {
        this.name = name;
        this.element = element;
        this.renderer = renderer;
        renderer.addClass(element.nativeElement, generateClass(name));
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        if (JSON.stringify(this.mod) !== this._modSerialized) {
            this._modSerialized = JSON.stringify(this.mod);
            let /** @type {?} */ mods = this.mod;
            let { renderer, element, name } = this;
            mods = parseMods(mods);
            setMods(name, '', mods, this._mods || {}, element, renderer);
            this._mods = this._mods === mods ? Object.assign({}, mods) : mods;
        }
    }
}
BlockDirective.decorators = [
    { type: Directive, args: [{
                selector: '[block]',
            },] },
];
/** @nocollapse */
BlockDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: String, decorators: [{ type: Attribute, args: ['block',] }] }
];
BlockDirective.propDecorators = {
    mod: [{ type: Input }]
};
class ElemDirective {
    /**
     * @param {?} element
     * @param {?} renderer
     * @param {?} name
     * @param {?} block
     */
    constructor(element, renderer, name, block) {
        this.blockName = block.name;
        this.name = name;
        this.element = element;
        this.renderer = renderer;
        renderer.addClass(element.nativeElement, generateClass(block.name, name));
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        if (JSON.stringify(this.mod) !== this._modSerialized) {
            this._modSerialized = JSON.stringify(this.mod);
            let /** @type {?} */ mods = this.mod;
            let { renderer, element, blockName, name } = this;
            mods = parseMods(mods);
            setMods(blockName, name, mods, this._mods || {}, element, renderer);
            this._mods = this._mods === mods ? Object.assign({}, mods) : mods;
        }
    }
}
ElemDirective.decorators = [
    { type: Directive, args: [{
                selector: '[elem]',
            },] },
];
/** @nocollapse */
ElemDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: String, decorators: [{ type: Attribute, args: ['elem',] }] },
    { type: BlockDirective }
];
ElemDirective.propDecorators = {
    mod: [{ type: Input }]
};
class ModDirective {
}
ModDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mod]',
            },] },
];
class BemModule {
    /**
     * @param {?} data
     * @return {?}
     */
    static config(data) {
        if (!data) {
            return BemModule;
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
        return BemModule;
    }
}
BemModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    BlockDirective,
                    ElemDirective,
                    ModDirective,
                ],
                exports: [
                    BlockDirective,
                    ElemDirective,
                    ModDirective,
                ]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { BemConfig, BlockDirective, ElemDirective, ModDirective, BemModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1iZW0uanMubWFwIiwic291cmNlcyI6WyJuZzovL2FuZ3VsYXItYmVtL2JlbS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgRGlyZWN0aXZlLCBBdHRyaWJ1dGUsIFJlbmRlcmVyMiwgSW5wdXQsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGNsYXNzIEJlbUNvbmZpZyB7XG4gIHNlcGFyYXRvcnM/OiBBcnJheTxzdHJpbmc+O1xuICBpZ25vcmVWYWx1ZXM/OiBib29sZWFuO1xuICBtb2RDYXNlPzogc3RyaW5nO1xufVxuXG5jb25zdCBzZXBhcmF0b3JzID0ge1xuICBlbDogJ19fJyxcbiAgbW9kOiAnLS0nLFxuICB2YWw6ICctJ1xufTtcbmxldCBpZ25vcmVWYWx1ZXMgPSBmYWxzZTtcbmxldCBtb2RDYXNlID0gJ2tlYmFiJztcblxuZnVuY3Rpb24gbW9kTmFtZUhhbmRsZXIoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICBzd2l0Y2ggKG1vZENhc2UpIHtcbiAgICBjYXNlICdrZWJhYic6XG4gICAgICByZXR1cm4gc3RyID8gc3RyLnJlcGxhY2UoL1tBLVpdL2csIGZ1bmN0aW9uKHMpIHtyZXR1cm4gJy0nICsgcy50b0xvd2VyQ2FzZSgpOyB9KS5yZXBsYWNlKC8kXFwtLywgJycpIDogJyc7XG4gICAgY2FzZSAnc25ha2UnOlxuICAgICAgcmV0dXJuIHN0ciA/IHN0ci5yZXBsYWNlKC9bQS1aXS9nLCBmdW5jdGlvbihzKSB7cmV0dXJuICdfJyArIHMudG9Mb3dlckNhc2UoKTsgfSkucmVwbGFjZSgvJFxcLS8sICcnKSA6ICcnO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQ2xhc3MoYmxvY2tOYW1lOiBzdHJpbmcsIGVsZW1OYW1lPzogc3RyaW5nLCBtb2ROYW1lPzogc3RyaW5nLCBtb2RWYWx1ZT86IGJvb2xlYW4gfCBzdHJpbmcpIHtcbiAgaWYgKGlnbm9yZVZhbHVlcykge1xuICAgIG1vZFZhbHVlID0gISFtb2RWYWx1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgbW9kVmFsdWUgIT09ICdzdHJpbmcnICYmIHR5cGVvZiBtb2RWYWx1ZSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgbW9kVmFsdWUgPSAhIW1vZFZhbHVlO1xuICB9XG5cbiAgbGV0IGNscyA9IGJsb2NrTmFtZTtcblxuICBpZiAoZWxlbU5hbWUpIHtcbiAgICBjbHMgKz0gc2VwYXJhdG9ycy5lbCArIGVsZW1OYW1lO1xuICB9XG5cbiAgaWYgKG1vZE5hbWUpIHtcbiAgICBtb2ROYW1lID0gbW9kTmFtZUhhbmRsZXIobW9kTmFtZSk7XG4gICAgY2xzICs9IHNlcGFyYXRvcnMubW9kICsgbW9kTmFtZTtcbiAgICBpZiAodHlwZW9mKG1vZFZhbHVlKSAhPT0gJ2Jvb2xlYW4nICYmIG1vZFZhbHVlICE9IG51bGwpIHtcbiAgICAgIGNscyArPSBzZXBhcmF0b3JzLnZhbCArIG1vZFZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjbHM7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTW9kcyhtb2RzOiBzdHJpbmcgfCBzdHJpbmdbXSB8IG9iamVjdCkge1xuICBpZiAodHlwZW9mIG1vZHMgPT09ICdzdHJpbmcnKSB7XG4gICAgbW9kcyA9IG1vZHMuc3BsaXQoL1xccysvKTtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KG1vZHMpKSB7XG4gICAgbGV0IGFyciA9IG1vZHM7XG5cbiAgICBtb2RzID0ge307XG5cbiAgICBhcnIuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgbW9kc1trZXldID0gdHJ1ZTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgbW9kcyAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICByZXR1cm4gbW9kcztcbn1cblxuZnVuY3Rpb24gc2V0TW9kcyhibG9ja05hbWU6IHN0cmluZywgZWxlbU5hbWU6IHN0cmluZywgbW9kczogb2JqZWN0LCBvbGRNb2RzOiBvYmplY3QsIGVsZW1lbnQ6IEVsZW1lbnRSZWYsIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgT2JqZWN0LmtleXMobW9kcykuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmIChvbGRNb2RzW2tleV0pIHtcbiAgICAgIGlmIChtb2RzW2tleV0gPT09IG9sZE1vZHNba2V5XSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcmVyLnJlbW92ZUNsYXNzKGVsZW1lbnQubmF0aXZlRWxlbWVudCwgZ2VuZXJhdGVDbGFzcyhibG9ja05hbWUsIGVsZW1OYW1lLCBrZXksIG9sZE1vZHNba2V5XSkpO1xuICAgIH1cblxuICAgIGlmIChtb2RzW2tleV0pIHtcbiAgICAgIHJlbmRlcmVyLmFkZENsYXNzKGVsZW1lbnQubmF0aXZlRWxlbWVudCwgZ2VuZXJhdGVDbGFzcyhibG9ja05hbWUsIGVsZW1OYW1lLCBrZXksIG1vZHNba2V5XSkpO1xuICAgIH1cbiAgfSk7XG5cbiAgT2JqZWN0LmtleXMob2xkTW9kcykuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmICghKGtleSBpbiBtb2RzKSAmJiBvbGRNb2RzW2tleV0pIHtcbiAgICAgIHJlbmRlcmVyLnJlbW92ZUNsYXNzKGVsZW1lbnQubmF0aXZlRWxlbWVudCwgZ2VuZXJhdGVDbGFzcyhibG9ja05hbWUsIGVsZW1OYW1lLCBrZXksIG9sZE1vZHNba2V5XSkpO1xuICAgIH1cbiAgfSk7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tibG9ja10nLFxufSlcbmV4cG9ydCBjbGFzcyBCbG9ja0RpcmVjdGl2ZSB7XG4gIHB1YmxpYyBlbGVtZW50OiBFbGVtZW50UmVmO1xuICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMjtcbiAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgQElucHV0KCkgcHVibGljIG1vZDogc3RyaW5nIHwgc3RyaW5nW10gfCBvYmplY3Q7XG4gIHByaXZhdGUgX21vZHM6IE9iamVjdDtcbiAgcHJpdmF0ZSBfbW9kU2VyaWFsaXplZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgICAgICAgIEBBdHRyaWJ1dGUoJ2Jsb2NrJykgbmFtZTogc3RyaW5nKSB7XG5cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuXG4gICAgcmVuZGVyZXIuYWRkQ2xhc3MoZWxlbWVudC5uYXRpdmVFbGVtZW50LCBnZW5lcmF0ZUNsYXNzKG5hbWUpKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIGlmIChKU09OLnN0cmluZ2lmeSh0aGlzLm1vZCkgIT09IHRoaXMuX21vZFNlcmlhbGl6ZWQpIHtcbiAgICAgIHRoaXMuX21vZFNlcmlhbGl6ZWQgPSBKU09OLnN0cmluZ2lmeSh0aGlzLm1vZCk7XG5cbiAgICAgIGxldCBtb2RzID0gdGhpcy5tb2Q7XG5cbiAgICAgIGxldCB7cmVuZGVyZXIsIGVsZW1lbnQsIG5hbWV9ID0gdGhpcztcblxuICAgICAgbW9kcyA9IHBhcnNlTW9kcyhtb2RzKTtcblxuICAgICAgc2V0TW9kcyhuYW1lLCAnJywgbW9kcywgdGhpcy5fbW9kcyB8fCB7fSwgZWxlbWVudCwgcmVuZGVyZXIpO1xuXG4gICAgICB0aGlzLl9tb2RzID0gdGhpcy5fbW9kcyA9PT0gbW9kcyA/IE9iamVjdC5hc3NpZ24oe30sIG1vZHMpIDogbW9kcztcbiAgICB9XG4gIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2VsZW1dJyxcbn0pXG5leHBvcnQgY2xhc3MgRWxlbURpcmVjdGl2ZSB7XG4gIHB1YmxpYyBlbGVtZW50OiBFbGVtZW50UmVmO1xuICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMjtcbiAgcHVibGljIGJsb2NrTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICBASW5wdXQoKSBwdWJsaWMgbW9kOiBzdHJpbmcgfCBzdHJpbmdbXSB8IG9iamVjdDtcbiAgcHJpdmF0ZSBfbW9kczogT2JqZWN0O1xuICBwcml2YXRlIF9tb2RTZXJpYWxpemVkOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgICAgICAgQEF0dHJpYnV0ZSgnZWxlbScpIG5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgYmxvY2s6IEJsb2NrRGlyZWN0aXZlKSB7XG5cbiAgICB0aGlzLmJsb2NrTmFtZSA9IGJsb2NrLm5hbWU7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMucmVuZGVyZXIgPSByZW5kZXJlcjtcblxuICAgIHJlbmRlcmVyLmFkZENsYXNzKGVsZW1lbnQubmF0aXZlRWxlbWVudCwgZ2VuZXJhdGVDbGFzcyhibG9jay5uYW1lLCBuYW1lKSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICBpZiAoSlNPTi5zdHJpbmdpZnkodGhpcy5tb2QpICE9PSB0aGlzLl9tb2RTZXJpYWxpemVkKSB7XG4gICAgICB0aGlzLl9tb2RTZXJpYWxpemVkID0gSlNPTi5zdHJpbmdpZnkodGhpcy5tb2QpO1xuXG4gICAgICBsZXQgbW9kcyA9IHRoaXMubW9kO1xuXG4gICAgICBsZXQge3JlbmRlcmVyLCBlbGVtZW50LCBibG9ja05hbWUsIG5hbWV9ID0gdGhpcztcblxuICAgICAgbW9kcyA9IHBhcnNlTW9kcyhtb2RzKTtcblxuICAgICAgc2V0TW9kcyhibG9ja05hbWUsIG5hbWUsIG1vZHMsIHRoaXMuX21vZHMgfHwge30sIGVsZW1lbnQsIHJlbmRlcmVyKTtcblxuICAgICAgdGhpcy5fbW9kcyA9IHRoaXMuX21vZHMgPT09IG1vZHMgPyBPYmplY3QuYXNzaWduKHt9LCBtb2RzKSA6IG1vZHM7XG4gICAgfVxuICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttb2RdJyxcbn0pXG5leHBvcnQgY2xhc3MgTW9kRGlyZWN0aXZlIHt9XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEJsb2NrRGlyZWN0aXZlLFxuICAgIEVsZW1EaXJlY3RpdmUsXG4gICAgTW9kRGlyZWN0aXZlLFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgQmxvY2tEaXJlY3RpdmUsXG4gICAgRWxlbURpcmVjdGl2ZSxcbiAgICBNb2REaXJlY3RpdmUsXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgQmVtTW9kdWxlIHtcbiAgc3RhdGljIGNvbmZpZyhkYXRhOiBCZW1Db25maWcpIHtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybiBCZW1Nb2R1bGU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuc2VwYXJhdG9ycykge1xuICAgICAgc2VwYXJhdG9ycy5lbCA9IGRhdGEuc2VwYXJhdG9yc1swXSB8fCAnX18nO1xuICAgICAgc2VwYXJhdG9ycy5tb2QgPSBkYXRhLnNlcGFyYXRvcnNbMV0gfHwgJy0tJztcbiAgICAgIHNlcGFyYXRvcnMudmFsID0gZGF0YS5zZXBhcmF0b3JzWzJdIHx8ICctJztcbiAgICB9XG5cbiAgICBpZiAoJ2lnbm9yZVZhbHVlcycgaW4gZGF0YSkge1xuICAgICAgaWdub3JlVmFsdWVzID0gISFkYXRhLmlnbm9yZVZhbHVlcztcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5tb2RDYXNlKSB7XG4gICAgICBpZiAoIX5bJ2tlYmFiJywgJ2NhbWVsJywgJ3NuYWtlJ10uaW5kZXhPZihkYXRhLm1vZENhc2UpKSB7XG4gICAgICAgIHRocm93ICdXcm9uZyBtb2QgY2FzZS4gWW91IGNhbiB1c2Ugb25seSB0aGVzZSBjYXNlczoga2ViYWIsIHNuYWtlLCBjYW1lbCc7XG4gICAgICB9XG5cbiAgICAgIG1vZENhc2UgPSBkYXRhLm1vZENhc2U7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