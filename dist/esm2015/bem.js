/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { NgModule, Directive, Attribute, Renderer2, Input, ElementRef } from '@angular/core';
export class BemConfig {
}
function BemConfig_tsickle_Closure_declarations() {
    /** @type {?} */
    BemConfig.prototype.separators;
    /** @type {?} */
    BemConfig.prototype.ignoreValues;
    /** @type {?} */
    BemConfig.prototype.modCase;
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
export class BlockDirective {
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
export class ElemDirective {
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
export class ModDirective {
}
ModDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mod]',
            },] },
];
export class BemModule {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVtLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1iZW0vIiwic291cmNlcyI6WyJiZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RixNQUFNO0NBSUw7Ozs7Ozs7OztBQUVELHVCQUFNLFVBQVUsR0FBRztJQUNqQixFQUFFLEVBQUUsSUFBSTtJQUNSLEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLEdBQUc7Q0FDVCxDQUFDO0FBQ0YscUJBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztBQUN6QixxQkFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDOzs7OztBQUV0Qix3QkFBd0IsR0FBVztJQUNqQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLEtBQUssT0FBTztZQUNWLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFVBQVMsQ0FBQyxJQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMzRyxLQUFLLE9BQU87WUFDVixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFTLENBQUMsSUFBRyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDM0c7WUFDRSxNQUFNLENBQUMsR0FBRyxDQUFDO0tBQ2Q7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LEdBQUcsQ0FBQztTQUM1QztRQUVELEVBQUUsQ0FBQyxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzNCLFlBQVksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztTQUNwQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELE1BQU0sbUVBQW1FLENBQUM7YUFDM0U7WUFFRCxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUN4QjtRQUVELE1BQU0sQ0FBQyxTQUFTLENBQUM7S0FDbEI7OztZQXJDRixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLGNBQWM7b0JBQ2QsYUFBYTtvQkFDYixZQUFZO2lCQUNiO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxjQUFjO29CQUNkLGFBQWE7b0JBQ2IsWUFBWTtpQkFDYjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIERpcmVjdGl2ZSwgQXR0cmlidXRlLCBSZW5kZXJlcjIsIElucHV0LCBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBjbGFzcyBCZW1Db25maWcge1xuICBzZXBhcmF0b3JzPzogQXJyYXk8c3RyaW5nPjtcbiAgaWdub3JlVmFsdWVzPzogYm9vbGVhbjtcbiAgbW9kQ2FzZT86IHN0cmluZztcbn1cblxuY29uc3Qgc2VwYXJhdG9ycyA9IHtcbiAgZWw6ICdfXycsXG4gIG1vZDogJy0tJyxcbiAgdmFsOiAnLSdcbn07XG5sZXQgaWdub3JlVmFsdWVzID0gZmFsc2U7XG5sZXQgbW9kQ2FzZSA9ICdrZWJhYic7XG5cbmZ1bmN0aW9uIG1vZE5hbWVIYW5kbGVyKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgc3dpdGNoIChtb2RDYXNlKSB7XG4gICAgY2FzZSAna2ViYWInOlxuICAgICAgcmV0dXJuIHN0ciA/IHN0ci5yZXBsYWNlKC9bQS1aXS9nLCBmdW5jdGlvbihzKSB7cmV0dXJuICctJyArIHMudG9Mb3dlckNhc2UoKTsgfSkucmVwbGFjZSgvJFxcLS8sICcnKSA6ICcnO1xuICAgIGNhc2UgJ3NuYWtlJzpcbiAgICAgIHJldHVybiBzdHIgPyBzdHIucmVwbGFjZSgvW0EtWl0vZywgZnVuY3Rpb24ocykge3JldHVybiAnXycgKyBzLnRvTG93ZXJDYXNlKCk7IH0pLnJlcGxhY2UoLyRcXC0vLCAnJykgOiAnJztcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUNsYXNzKGJsb2NrTmFtZTogc3RyaW5nLCBlbGVtTmFtZT86IHN0cmluZywgbW9kTmFtZT86IHN0cmluZywgbW9kVmFsdWU/OiBib29sZWFuIHwgc3RyaW5nKSB7XG4gIGlmIChpZ25vcmVWYWx1ZXMpIHtcbiAgICBtb2RWYWx1ZSA9ICEhbW9kVmFsdWU7XG4gIH1cblxuICBpZiAodHlwZW9mIG1vZFZhbHVlICE9PSAnc3RyaW5nJyAmJiB0eXBlb2YgbW9kVmFsdWUgIT09ICdib29sZWFuJykge1xuICAgIG1vZFZhbHVlID0gISFtb2RWYWx1ZTtcbiAgfVxuXG4gIGxldCBjbHMgPSBibG9ja05hbWU7XG5cbiAgaWYgKGVsZW1OYW1lKSB7XG4gICAgY2xzICs9IHNlcGFyYXRvcnMuZWwgKyBlbGVtTmFtZTtcbiAgfVxuXG4gIGlmIChtb2ROYW1lKSB7XG4gICAgbW9kTmFtZSA9IG1vZE5hbWVIYW5kbGVyKG1vZE5hbWUpO1xuICAgIGNscyArPSBzZXBhcmF0b3JzLm1vZCArIG1vZE5hbWU7XG4gICAgaWYgKHR5cGVvZihtb2RWYWx1ZSkgIT09ICdib29sZWFuJyAmJiBtb2RWYWx1ZSAhPSBudWxsKSB7XG4gICAgICBjbHMgKz0gc2VwYXJhdG9ycy52YWwgKyBtb2RWYWx1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY2xzO1xufVxuXG5mdW5jdGlvbiBwYXJzZU1vZHMobW9kczogc3RyaW5nIHwgc3RyaW5nW10gfCBvYmplY3QpIHtcbiAgaWYgKHR5cGVvZiBtb2RzID09PSAnc3RyaW5nJykge1xuICAgIG1vZHMgPSBtb2RzLnNwbGl0KC9cXHMrLyk7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShtb2RzKSkge1xuICAgIGxldCBhcnIgPSBtb2RzO1xuXG4gICAgbW9kcyA9IHt9O1xuXG4gICAgYXJyLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIG1vZHNba2V5XSA9IHRydWU7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1vZHMgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcmV0dXJuIG1vZHM7XG59XG5cbmZ1bmN0aW9uIHNldE1vZHMoYmxvY2tOYW1lOiBzdHJpbmcsIGVsZW1OYW1lOiBzdHJpbmcsIG1vZHM6IG9iamVjdCwgb2xkTW9kczogb2JqZWN0LCBlbGVtZW50OiBFbGVtZW50UmVmLCByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gIE9iamVjdC5rZXlzKG1vZHMpLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAob2xkTW9kc1trZXldKSB7XG4gICAgICBpZiAobW9kc1trZXldID09PSBvbGRNb2RzW2tleV0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5yZW1vdmVDbGFzcyhlbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGdlbmVyYXRlQ2xhc3MoYmxvY2tOYW1lLCBlbGVtTmFtZSwga2V5LCBvbGRNb2RzW2tleV0pKTtcbiAgICB9XG5cbiAgICBpZiAobW9kc1trZXldKSB7XG4gICAgICByZW5kZXJlci5hZGRDbGFzcyhlbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGdlbmVyYXRlQ2xhc3MoYmxvY2tOYW1lLCBlbGVtTmFtZSwga2V5LCBtb2RzW2tleV0pKTtcbiAgICB9XG4gIH0pO1xuXG4gIE9iamVjdC5rZXlzKG9sZE1vZHMpLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAoIShrZXkgaW4gbW9kcykgJiYgb2xkTW9kc1trZXldKSB7XG4gICAgICByZW5kZXJlci5yZW1vdmVDbGFzcyhlbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGdlbmVyYXRlQ2xhc3MoYmxvY2tOYW1lLCBlbGVtTmFtZSwga2V5LCBvbGRNb2RzW2tleV0pKTtcbiAgICB9XG4gIH0pO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbYmxvY2tdJyxcbn0pXG5leHBvcnQgY2xhc3MgQmxvY2tEaXJlY3RpdmUge1xuICBwdWJsaWMgZWxlbWVudDogRWxlbWVudFJlZjtcbiAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjI7XG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHB1YmxpYyBtb2Q6IHN0cmluZyB8IHN0cmluZ1tdIHwgb2JqZWN0O1xuICBwcml2YXRlIF9tb2RzOiBPYmplY3Q7XG4gIHByaXZhdGUgX21vZFNlcmlhbGl6ZWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgICAgICAgICBAQXR0cmlidXRlKCdibG9jaycpIG5hbWU6IHN0cmluZykge1xuXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMucmVuZGVyZXIgPSByZW5kZXJlcjtcblxuICAgIHJlbmRlcmVyLmFkZENsYXNzKGVsZW1lbnQubmF0aXZlRWxlbWVudCwgZ2VuZXJhdGVDbGFzcyhuYW1lKSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICBpZiAoSlNPTi5zdHJpbmdpZnkodGhpcy5tb2QpICE9PSB0aGlzLl9tb2RTZXJpYWxpemVkKSB7XG4gICAgICB0aGlzLl9tb2RTZXJpYWxpemVkID0gSlNPTi5zdHJpbmdpZnkodGhpcy5tb2QpO1xuXG4gICAgICBsZXQgbW9kcyA9IHRoaXMubW9kO1xuXG4gICAgICBsZXQge3JlbmRlcmVyLCBlbGVtZW50LCBuYW1lfSA9IHRoaXM7XG5cbiAgICAgIG1vZHMgPSBwYXJzZU1vZHMobW9kcyk7XG5cbiAgICAgIHNldE1vZHMobmFtZSwgJycsIG1vZHMsIHRoaXMuX21vZHMgfHwge30sIGVsZW1lbnQsIHJlbmRlcmVyKTtcblxuICAgICAgdGhpcy5fbW9kcyA9IHRoaXMuX21vZHMgPT09IG1vZHMgPyBPYmplY3QuYXNzaWduKHt9LCBtb2RzKSA6IG1vZHM7XG4gICAgfVxuICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tlbGVtXScsXG59KVxuZXhwb3J0IGNsYXNzIEVsZW1EaXJlY3RpdmUge1xuICBwdWJsaWMgZWxlbWVudDogRWxlbWVudFJlZjtcbiAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjI7XG4gIHB1YmxpYyBibG9ja05hbWU6IHN0cmluZztcbiAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgQElucHV0KCkgcHVibGljIG1vZDogc3RyaW5nIHwgc3RyaW5nW10gfCBvYmplY3Q7XG4gIHByaXZhdGUgX21vZHM6IE9iamVjdDtcbiAgcHJpdmF0ZSBfbW9kU2VyaWFsaXplZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgICAgICAgIEBBdHRyaWJ1dGUoJ2VsZW0nKSBuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgIGJsb2NrOiBCbG9ja0RpcmVjdGl2ZSkge1xuXG4gICAgdGhpcy5ibG9ja05hbWUgPSBibG9jay5uYW1lO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XG5cbiAgICByZW5kZXJlci5hZGRDbGFzcyhlbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGdlbmVyYXRlQ2xhc3MoYmxvY2submFtZSwgbmFtZSkpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KHRoaXMubW9kKSAhPT0gdGhpcy5fbW9kU2VyaWFsaXplZCkge1xuICAgICAgdGhpcy5fbW9kU2VyaWFsaXplZCA9IEpTT04uc3RyaW5naWZ5KHRoaXMubW9kKTtcblxuICAgICAgbGV0IG1vZHMgPSB0aGlzLm1vZDtcblxuICAgICAgbGV0IHtyZW5kZXJlciwgZWxlbWVudCwgYmxvY2tOYW1lLCBuYW1lfSA9IHRoaXM7XG5cbiAgICAgIG1vZHMgPSBwYXJzZU1vZHMobW9kcyk7XG5cbiAgICAgIHNldE1vZHMoYmxvY2tOYW1lLCBuYW1lLCBtb2RzLCB0aGlzLl9tb2RzIHx8IHt9LCBlbGVtZW50LCByZW5kZXJlcik7XG5cbiAgICAgIHRoaXMuX21vZHMgPSB0aGlzLl9tb2RzID09PSBtb2RzID8gT2JqZWN0LmFzc2lnbih7fSwgbW9kcykgOiBtb2RzO1xuICAgIH1cbiAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbW9kXScsXG59KVxuZXhwb3J0IGNsYXNzIE1vZERpcmVjdGl2ZSB7fVxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBCbG9ja0RpcmVjdGl2ZSxcbiAgICBFbGVtRGlyZWN0aXZlLFxuICAgIE1vZERpcmVjdGl2ZSxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIEJsb2NrRGlyZWN0aXZlLFxuICAgIEVsZW1EaXJlY3RpdmUsXG4gICAgTW9kRGlyZWN0aXZlLFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIEJlbU1vZHVsZSB7XG4gIHN0YXRpYyBjb25maWcoZGF0YTogQmVtQ29uZmlnKSB7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICByZXR1cm4gQmVtTW9kdWxlO1xuICAgIH1cblxuICAgIGlmIChkYXRhLnNlcGFyYXRvcnMpIHtcbiAgICAgIHNlcGFyYXRvcnMuZWwgPSBkYXRhLnNlcGFyYXRvcnNbMF0gfHwgJ19fJztcbiAgICAgIHNlcGFyYXRvcnMubW9kID0gZGF0YS5zZXBhcmF0b3JzWzFdIHx8ICctLSc7XG4gICAgICBzZXBhcmF0b3JzLnZhbCA9IGRhdGEuc2VwYXJhdG9yc1syXSB8fCAnLSc7XG4gICAgfVxuXG4gICAgaWYgKCdpZ25vcmVWYWx1ZXMnIGluIGRhdGEpIHtcbiAgICAgIGlnbm9yZVZhbHVlcyA9ICEhZGF0YS5pZ25vcmVWYWx1ZXM7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEubW9kQ2FzZSkge1xuICAgICAgaWYgKCF+WydrZWJhYicsICdjYW1lbCcsICdzbmFrZSddLmluZGV4T2YoZGF0YS5tb2RDYXNlKSkge1xuICAgICAgICB0aHJvdyAnV3JvbmcgbW9kIGNhc2UuIFlvdSBjYW4gdXNlIG9ubHkgdGhlc2UgY2FzZXM6IGtlYmFiLCBzbmFrZSwgY2FtZWwnO1xuICAgICAgfVxuXG4gICAgICBtb2RDYXNlID0gZGF0YS5tb2RDYXNlO1xuICAgIH1cblxuICAgIHJldHVybiBCZW1Nb2R1bGU7XG4gIH1cbn1cbiJdfQ==