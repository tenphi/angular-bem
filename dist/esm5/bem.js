/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { NgModule, Directive, Attribute, Renderer2, Input, ElementRef } from '@angular/core';
var BemConfig = /** @class */ (function () {
    function BemConfig() {
    }
    return BemConfig;
}());
export { BemConfig };
function BemConfig_tsickle_Closure_declarations() {
    /** @type {?} */
    BemConfig.prototype.separators;
    /** @type {?} */
    BemConfig.prototype.ignoreValues;
    /** @type {?} */
    BemConfig.prototype.modCase;
}
var /** @type {?} */ separators = {
    el: '__',
    mod: '--',
    val: '-'
};
var /** @type {?} */ ignoreValues = false;
var /** @type {?} */ modCase = 'kebab';
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
    var /** @type {?} */ cls = blockName;
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
        var /** @type {?} */ arr = mods;
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
    /**
     * @return {?}
     */
    BlockDirective.prototype.ngOnChanges = /**
     * @return {?}
     */
    function () {
        if (JSON.stringify(this.mod) !== this._modSerialized) {
            this._modSerialized = JSON.stringify(this.mod);
            var /** @type {?} */ mods = this.mod;
            var _a = this, renderer = _a.renderer, element = _a.element, name_1 = _a.name;
            mods = parseMods(mods);
            setMods(name_1, '', mods, this._mods || {}, element, renderer);
            this._mods = this._mods === mods ? Object.assign({}, mods) : mods;
        }
    };
    BlockDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[block]',
                },] },
    ];
    /** @nocollapse */
    BlockDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: String, decorators: [{ type: Attribute, args: ['block',] }] }
    ]; };
    BlockDirective.propDecorators = {
        mod: [{ type: Input }]
    };
    return BlockDirective;
}());
export { BlockDirective };
function BlockDirective_tsickle_Closure_declarations() {
    /** @type {?} */
    BlockDirective.prototype.element;
    /** @type {?} */
    BlockDirective.prototype.renderer;
    /** @type {?} */
    BlockDirective.prototype.name;
    /** @type {?} */
    BlockDirective.prototype.mod;
    /** @type {?} */
    BlockDirective.prototype._mods;
    /** @type {?} */
    BlockDirective.prototype._modSerialized;
}
var ElemDirective = /** @class */ (function () {
    function ElemDirective(element, renderer, name, block) {
        this.blockName = block.name;
        this.name = name;
        this.element = element;
        this.renderer = renderer;
        renderer.addClass(element.nativeElement, generateClass(block.name, name));
    }
    /**
     * @return {?}
     */
    ElemDirective.prototype.ngOnChanges = /**
     * @return {?}
     */
    function () {
        if (JSON.stringify(this.mod) !== this._modSerialized) {
            this._modSerialized = JSON.stringify(this.mod);
            var /** @type {?} */ mods = this.mod;
            var _a = this, renderer = _a.renderer, element = _a.element, blockName = _a.blockName, name_2 = _a.name;
            mods = parseMods(mods);
            setMods(blockName, name_2, mods, this._mods || {}, element, renderer);
            this._mods = this._mods === mods ? Object.assign({}, mods) : mods;
        }
    };
    ElemDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[elem]',
                },] },
    ];
    /** @nocollapse */
    ElemDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: String, decorators: [{ type: Attribute, args: ['elem',] }] },
        { type: BlockDirective }
    ]; };
    ElemDirective.propDecorators = {
        mod: [{ type: Input }]
    };
    return ElemDirective;
}());
export { ElemDirective };
function ElemDirective_tsickle_Closure_declarations() {
    /** @type {?} */
    ElemDirective.prototype.element;
    /** @type {?} */
    ElemDirective.prototype.renderer;
    /** @type {?} */
    ElemDirective.prototype.blockName;
    /** @type {?} */
    ElemDirective.prototype.name;
    /** @type {?} */
    ElemDirective.prototype.mod;
    /** @type {?} */
    ElemDirective.prototype._mods;
    /** @type {?} */
    ElemDirective.prototype._modSerialized;
}
var ModDirective = /** @class */ (function () {
    function ModDirective() {
    }
    ModDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[mod]',
                },] },
    ];
    return ModDirective;
}());
export { ModDirective };
var BemModule = /** @class */ (function () {
    function BemModule() {
    }
    /**
     * @param {?} data
     * @return {?}
     */
    BemModule.config = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
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
    };
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
    return BemModule;
}());
export { BemModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVtLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1iZW0vIiwic291cmNlcyI6WyJiZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RixJQUFBOzs7b0JBRkE7SUFNQyxDQUFBO0FBSkQscUJBSUM7Ozs7Ozs7OztBQUVELHFCQUFNLFVBQVUsR0FBRztJQUNqQixFQUFFLEVBQUUsSUFBSTtJQUNSLEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLEdBQUc7Q0FDVCxDQUFDO0FBQ0YscUJBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztBQUN6QixxQkFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDOzs7OztBQUV0Qix3QkFBd0IsR0FBVztJQUNqQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLEtBQUssT0FBTztZQUNWLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFVBQVMsQ0FBQyxJQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMzRyxLQUFLLE9BQU87WUFDVixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFTLENBQUMsSUFBRyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDM0c7WUFDRSxN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QUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO1NBQzVDO1FBRUQsRUFBRSxDQUFDLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDM0IsWUFBWSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1NBQ3BDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsTUFBTSxtRUFBbUUsQ0FBQzthQUMzRTtZQUVELE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ3hCO1FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztLQUNsQjs7Z0JBckNGLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUU7d0JBQ1osY0FBYzt3QkFDZCxhQUFhO3dCQUNiLFlBQVk7cUJBQ2I7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLGNBQWM7d0JBQ2QsYUFBYTt3QkFDYixZQUFZO3FCQUNiO2lCQUNGOztvQkFoTUQ7O1NBaU1hLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgRGlyZWN0aXZlLCBBdHRyaWJ1dGUsIFJlbmRlcmVyMiwgSW5wdXQsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGNsYXNzIEJlbUNvbmZpZyB7XG4gIHNlcGFyYXRvcnM/OiBBcnJheTxzdHJpbmc+O1xuICBpZ25vcmVWYWx1ZXM/OiBib29sZWFuO1xuICBtb2RDYXNlPzogc3RyaW5nO1xufVxuXG5jb25zdCBzZXBhcmF0b3JzID0ge1xuICBlbDogJ19fJyxcbiAgbW9kOiAnLS0nLFxuICB2YWw6ICctJ1xufTtcbmxldCBpZ25vcmVWYWx1ZXMgPSBmYWxzZTtcbmxldCBtb2RDYXNlID0gJ2tlYmFiJztcblxuZnVuY3Rpb24gbW9kTmFtZUhhbmRsZXIoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICBzd2l0Y2ggKG1vZENhc2UpIHtcbiAgICBjYXNlICdrZWJhYic6XG4gICAgICByZXR1cm4gc3RyID8gc3RyLnJlcGxhY2UoL1tBLVpdL2csIGZ1bmN0aW9uKHMpIHtyZXR1cm4gJy0nICsgcy50b0xvd2VyQ2FzZSgpOyB9KS5yZXBsYWNlKC8kXFwtLywgJycpIDogJyc7XG4gICAgY2FzZSAnc25ha2UnOlxuICAgICAgcmV0dXJuIHN0ciA/IHN0ci5yZXBsYWNlKC9bQS1aXS9nLCBmdW5jdGlvbihzKSB7cmV0dXJuICdfJyArIHMudG9Mb3dlckNhc2UoKTsgfSkucmVwbGFjZSgvJFxcLS8sICcnKSA6ICcnO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQ2xhc3MoYmxvY2tOYW1lOiBzdHJpbmcsIGVsZW1OYW1lPzogc3RyaW5nLCBtb2ROYW1lPzogc3RyaW5nLCBtb2RWYWx1ZT86IGJvb2xlYW4gfCBzdHJpbmcpIHtcbiAgaWYgKGlnbm9yZVZhbHVlcykge1xuICAgIG1vZFZhbHVlID0gISFtb2RWYWx1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgbW9kVmFsdWUgIT09ICdzdHJpbmcnICYmIHR5cGVvZiBtb2RWYWx1ZSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgbW9kVmFsdWUgPSAhIW1vZFZhbHVlO1xuICB9XG5cbiAgbGV0IGNscyA9IGJsb2NrTmFtZTtcblxuICBpZiAoZWxlbU5hbWUpIHtcbiAgICBjbHMgKz0gc2VwYXJhdG9ycy5lbCArIGVsZW1OYW1lO1xuICB9XG5cbiAgaWYgKG1vZE5hbWUpIHtcbiAgICBtb2ROYW1lID0gbW9kTmFtZUhhbmRsZXIobW9kTmFtZSk7XG4gICAgY2xzICs9IHNlcGFyYXRvcnMubW9kICsgbW9kTmFtZTtcbiAgICBpZiAodHlwZW9mKG1vZFZhbHVlKSAhPT0gJ2Jvb2xlYW4nICYmIG1vZFZhbHVlICE9IG51bGwpIHtcbiAgICAgIGNscyArPSBzZXBhcmF0b3JzLnZhbCArIG1vZFZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjbHM7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTW9kcyhtb2RzOiBzdHJpbmcgfCBzdHJpbmdbXSB8IG9iamVjdCkge1xuICBpZiAodHlwZW9mIG1vZHMgPT09ICdzdHJpbmcnKSB7XG4gICAgbW9kcyA9IG1vZHMuc3BsaXQoL1xccysvKTtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KG1vZHMpKSB7XG4gICAgbGV0IGFyciA9IG1vZHM7XG5cbiAgICBtb2RzID0ge307XG5cbiAgICBhcnIuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgbW9kc1trZXldID0gdHJ1ZTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgbW9kcyAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICByZXR1cm4gbW9kcztcbn1cblxuZnVuY3Rpb24gc2V0TW9kcyhibG9ja05hbWU6IHN0cmluZywgZWxlbU5hbWU6IHN0cmluZywgbW9kczogb2JqZWN0LCBvbGRNb2RzOiBvYmplY3QsIGVsZW1lbnQ6IEVsZW1lbnRSZWYsIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgT2JqZWN0LmtleXMobW9kcykuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmIChvbGRNb2RzW2tleV0pIHtcbiAgICAgIGlmIChtb2RzW2tleV0gPT09IG9sZE1vZHNba2V5XSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcmVyLnJlbW92ZUNsYXNzKGVsZW1lbnQubmF0aXZlRWxlbWVudCwgZ2VuZXJhdGVDbGFzcyhibG9ja05hbWUsIGVsZW1OYW1lLCBrZXksIG9sZE1vZHNba2V5XSkpO1xuICAgIH1cblxuICAgIGlmIChtb2RzW2tleV0pIHtcbiAgICAgIHJlbmRlcmVyLmFkZENsYXNzKGVsZW1lbnQubmF0aXZlRWxlbWVudCwgZ2VuZXJhdGVDbGFzcyhibG9ja05hbWUsIGVsZW1OYW1lLCBrZXksIG1vZHNba2V5XSkpO1xuICAgIH1cbiAgfSk7XG5cbiAgT2JqZWN0LmtleXMob2xkTW9kcykuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmICghKGtleSBpbiBtb2RzKSAmJiBvbGRNb2RzW2tleV0pIHtcbiAgICAgIHJlbmRlcmVyLnJlbW92ZUNsYXNzKGVsZW1lbnQubmF0aXZlRWxlbWVudCwgZ2VuZXJhdGVDbGFzcyhibG9ja05hbWUsIGVsZW1OYW1lLCBrZXksIG9sZE1vZHNba2V5XSkpO1xuICAgIH1cbiAgfSk7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tibG9ja10nLFxufSlcbmV4cG9ydCBjbGFzcyBCbG9ja0RpcmVjdGl2ZSB7XG4gIHB1YmxpYyBlbGVtZW50OiBFbGVtZW50UmVmO1xuICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMjtcbiAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgQElucHV0KCkgcHVibGljIG1vZDogc3RyaW5nIHwgc3RyaW5nW10gfCBvYmplY3Q7XG4gIHByaXZhdGUgX21vZHM6IE9iamVjdDtcbiAgcHJpdmF0ZSBfbW9kU2VyaWFsaXplZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgICAgICAgIEBBdHRyaWJ1dGUoJ2Jsb2NrJykgbmFtZTogc3RyaW5nKSB7XG5cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuXG4gICAgcmVuZGVyZXIuYWRkQ2xhc3MoZWxlbWVudC5uYXRpdmVFbGVtZW50LCBnZW5lcmF0ZUNsYXNzKG5hbWUpKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIGlmIChKU09OLnN0cmluZ2lmeSh0aGlzLm1vZCkgIT09IHRoaXMuX21vZFNlcmlhbGl6ZWQpIHtcbiAgICAgIHRoaXMuX21vZFNlcmlhbGl6ZWQgPSBKU09OLnN0cmluZ2lmeSh0aGlzLm1vZCk7XG5cbiAgICAgIGxldCBtb2RzID0gdGhpcy5tb2Q7XG5cbiAgICAgIGxldCB7cmVuZGVyZXIsIGVsZW1lbnQsIG5hbWV9ID0gdGhpcztcblxuICAgICAgbW9kcyA9IHBhcnNlTW9kcyhtb2RzKTtcblxuICAgICAgc2V0TW9kcyhuYW1lLCAnJywgbW9kcywgdGhpcy5fbW9kcyB8fCB7fSwgZWxlbWVudCwgcmVuZGVyZXIpO1xuXG4gICAgICB0aGlzLl9tb2RzID0gdGhpcy5fbW9kcyA9PT0gbW9kcyA/IE9iamVjdC5hc3NpZ24oe30sIG1vZHMpIDogbW9kcztcbiAgICB9XG4gIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2VsZW1dJyxcbn0pXG5leHBvcnQgY2xhc3MgRWxlbURpcmVjdGl2ZSB7XG4gIHB1YmxpYyBlbGVtZW50OiBFbGVtZW50UmVmO1xuICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMjtcbiAgcHVibGljIGJsb2NrTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICBASW5wdXQoKSBwdWJsaWMgbW9kOiBzdHJpbmcgfCBzdHJpbmdbXSB8IG9iamVjdDtcbiAgcHJpdmF0ZSBfbW9kczogT2JqZWN0O1xuICBwcml2YXRlIF9tb2RTZXJpYWxpemVkOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgICAgICAgQEF0dHJpYnV0ZSgnZWxlbScpIG5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgYmxvY2s6IEJsb2NrRGlyZWN0aXZlKSB7XG5cbiAgICB0aGlzLmJsb2NrTmFtZSA9IGJsb2NrLm5hbWU7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMucmVuZGVyZXIgPSByZW5kZXJlcjtcblxuICAgIHJlbmRlcmVyLmFkZENsYXNzKGVsZW1lbnQubmF0aXZlRWxlbWVudCwgZ2VuZXJhdGVDbGFzcyhibG9jay5uYW1lLCBuYW1lKSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICBpZiAoSlNPTi5zdHJpbmdpZnkodGhpcy5tb2QpICE9PSB0aGlzLl9tb2RTZXJpYWxpemVkKSB7XG4gICAgICB0aGlzLl9tb2RTZXJpYWxpemVkID0gSlNPTi5zdHJpbmdpZnkodGhpcy5tb2QpO1xuXG4gICAgICBsZXQgbW9kcyA9IHRoaXMubW9kO1xuXG4gICAgICBsZXQge3JlbmRlcmVyLCBlbGVtZW50LCBibG9ja05hbWUsIG5hbWV9ID0gdGhpcztcblxuICAgICAgbW9kcyA9IHBhcnNlTW9kcyhtb2RzKTtcblxuICAgICAgc2V0TW9kcyhibG9ja05hbWUsIG5hbWUsIG1vZHMsIHRoaXMuX21vZHMgfHwge30sIGVsZW1lbnQsIHJlbmRlcmVyKTtcblxuICAgICAgdGhpcy5fbW9kcyA9IHRoaXMuX21vZHMgPT09IG1vZHMgPyBPYmplY3QuYXNzaWduKHt9LCBtb2RzKSA6IG1vZHM7XG4gICAgfVxuICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttb2RdJyxcbn0pXG5leHBvcnQgY2xhc3MgTW9kRGlyZWN0aXZlIHt9XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEJsb2NrRGlyZWN0aXZlLFxuICAgIEVsZW1EaXJlY3RpdmUsXG4gICAgTW9kRGlyZWN0aXZlLFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgQmxvY2tEaXJlY3RpdmUsXG4gICAgRWxlbURpcmVjdGl2ZSxcbiAgICBNb2REaXJlY3RpdmUsXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgQmVtTW9kdWxlIHtcbiAgc3RhdGljIGNvbmZpZyhkYXRhOiBCZW1Db25maWcpIHtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybiBCZW1Nb2R1bGU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuc2VwYXJhdG9ycykge1xuICAgICAgc2VwYXJhdG9ycy5lbCA9IGRhdGEuc2VwYXJhdG9yc1swXSB8fCAnX18nO1xuICAgICAgc2VwYXJhdG9ycy5tb2QgPSBkYXRhLnNlcGFyYXRvcnNbMV0gfHwgJy0tJztcbiAgICAgIHNlcGFyYXRvcnMudmFsID0gZGF0YS5zZXBhcmF0b3JzWzJdIHx8ICctJztcbiAgICB9XG5cbiAgICBpZiAoJ2lnbm9yZVZhbHVlcycgaW4gZGF0YSkge1xuICAgICAgaWdub3JlVmFsdWVzID0gISFkYXRhLmlnbm9yZVZhbHVlcztcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5tb2RDYXNlKSB7XG4gICAgICBpZiAoIX5bJ2tlYmFiJywgJ2NhbWVsJywgJ3NuYWtlJ10uaW5kZXhPZihkYXRhLm1vZENhc2UpKSB7XG4gICAgICAgIHRocm93ICdXcm9uZyBtb2QgY2FzZS4gWW91IGNhbiB1c2Ugb25seSB0aGVzZSBjYXNlczoga2ViYWIsIHNuYWtlLCBjYW1lbCc7XG4gICAgICB9XG5cbiAgICAgIG1vZENhc2UgPSBkYXRhLm1vZENhc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIEJlbU1vZHVsZTtcbiAgfVxufVxuIl19