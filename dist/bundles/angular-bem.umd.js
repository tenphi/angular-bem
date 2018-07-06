(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('angular-bem', ['exports', '@angular/core'], factory) :
    (factory((global['angular-bem'] = {}),global.ng.core));
}(this, (function (exports,core) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var BemConfig = (function () {
        function BemConfig() {
        }
        return BemConfig;
    }());
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
    var BlockDirective = (function () {
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
            { type: core.Directive, args: [{
                        selector: '[block]',
                    },] },
        ];
        /** @nocollapse */
        BlockDirective.ctorParameters = function () {
            return [
                { type: core.ElementRef },
                { type: core.Renderer2 },
                { type: String, decorators: [{ type: core.Attribute, args: ['block',] }] }
            ];
        };
        BlockDirective.propDecorators = {
            mod: [{ type: core.Input }]
        };
        return BlockDirective;
    }());
    var ElemDirective = (function () {
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
            { type: core.Directive, args: [{
                        selector: '[elem]',
                    },] },
        ];
        /** @nocollapse */
        ElemDirective.ctorParameters = function () {
            return [
                { type: core.ElementRef },
                { type: core.Renderer2 },
                { type: String, decorators: [{ type: core.Attribute, args: ['elem',] }] },
                { type: BlockDirective }
            ];
        };
        ElemDirective.propDecorators = {
            mod: [{ type: core.Input }]
        };
        return ElemDirective;
    }());
    var ModDirective = (function () {
        function ModDirective() {
        }
        ModDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: '[mod]',
                    },] },
        ];
        return ModDirective;
    }());
    var BemModule = (function () {
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
            { type: core.NgModule, args: [{
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    exports.BemConfig = BemConfig;
    exports.BlockDirective = BlockDirective;
    exports.ElemDirective = ElemDirective;
    exports.ModDirective = ModDirective;
    exports.BemModule = BemModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1iZW0udW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9hbmd1bGFyLWJlbS9iZW0udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIERpcmVjdGl2ZSwgQXR0cmlidXRlLCBSZW5kZXJlcjIsIElucHV0LCBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBjbGFzcyBCZW1Db25maWcge1xuICBzZXBhcmF0b3JzPzogQXJyYXk8c3RyaW5nPjtcbiAgaWdub3JlVmFsdWVzPzogYm9vbGVhbjtcbiAgbW9kQ2FzZT86IHN0cmluZztcbn1cblxuY29uc3Qgc2VwYXJhdG9ycyA9IHtcbiAgZWw6ICdfXycsXG4gIG1vZDogJy0tJyxcbiAgdmFsOiAnLSdcbn07XG5sZXQgaWdub3JlVmFsdWVzID0gZmFsc2U7XG5sZXQgbW9kQ2FzZSA9ICdrZWJhYic7XG5cbmZ1bmN0aW9uIG1vZE5hbWVIYW5kbGVyKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgc3dpdGNoIChtb2RDYXNlKSB7XG4gICAgY2FzZSAna2ViYWInOlxuICAgICAgcmV0dXJuIHN0ciA/IHN0ci5yZXBsYWNlKC9bQS1aXS9nLCBmdW5jdGlvbihzKSB7cmV0dXJuICctJyArIHMudG9Mb3dlckNhc2UoKTsgfSkucmVwbGFjZSgvJFxcLS8sICcnKSA6ICcnO1xuICAgIGNhc2UgJ3NuYWtlJzpcbiAgICAgIHJldHVybiBzdHIgPyBzdHIucmVwbGFjZSgvW0EtWl0vZywgZnVuY3Rpb24ocykge3JldHVybiAnXycgKyBzLnRvTG93ZXJDYXNlKCk7IH0pLnJlcGxhY2UoLyRcXC0vLCAnJykgOiAnJztcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUNsYXNzKGJsb2NrTmFtZTogc3RyaW5nLCBlbGVtTmFtZT86IHN0cmluZywgbW9kTmFtZT86IHN0cmluZywgbW9kVmFsdWU/OiBib29sZWFuIHwgc3RyaW5nKSB7XG4gIGlmIChpZ25vcmVWYWx1ZXMpIHtcbiAgICBtb2RWYWx1ZSA9ICEhbW9kVmFsdWU7XG4gIH1cblxuICBpZiAodHlwZW9mIG1vZFZhbHVlICE9PSAnc3RyaW5nJyAmJiB0eXBlb2YgbW9kVmFsdWUgIT09ICdib29sZWFuJykge1xuICAgIG1vZFZhbHVlID0gISFtb2RWYWx1ZTtcbiAgfVxuXG4gIGxldCBjbHMgPSBibG9ja05hbWU7XG5cbiAgaWYgKGVsZW1OYW1lKSB7XG4gICAgY2xzICs9IHNlcGFyYXRvcnMuZWwgKyBlbGVtTmFtZTtcbiAgfVxuXG4gIGlmIChtb2ROYW1lKSB7XG4gICAgbW9kTmFtZSA9IG1vZE5hbWVIYW5kbGVyKG1vZE5hbWUpO1xuICAgIGNscyArPSBzZXBhcmF0b3JzLm1vZCArIG1vZE5hbWU7XG4gICAgaWYgKHR5cGVvZihtb2RWYWx1ZSkgIT09ICdib29sZWFuJyAmJiBtb2RWYWx1ZSAhPSBudWxsKSB7XG4gICAgICBjbHMgKz0gc2VwYXJhdG9ycy52YWwgKyBtb2RWYWx1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY2xzO1xufVxuXG5mdW5jdGlvbiBwYXJzZU1vZHMobW9kczogc3RyaW5nIHwgc3RyaW5nW10gfCBvYmplY3QpIHtcbiAgaWYgKHR5cGVvZiBtb2RzID09PSAnc3RyaW5nJykge1xuICAgIG1vZHMgPSBtb2RzLnNwbGl0KC9cXHMrLyk7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShtb2RzKSkge1xuICAgIGxldCBhcnIgPSBtb2RzO1xuXG4gICAgbW9kcyA9IHt9O1xuXG4gICAgYXJyLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIG1vZHNba2V5XSA9IHRydWU7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1vZHMgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcmV0dXJuIG1vZHM7XG59XG5cbmZ1bmN0aW9uIHNldE1vZHMoYmxvY2tOYW1lOiBzdHJpbmcsIGVsZW1OYW1lOiBzdHJpbmcsIG1vZHM6IG9iamVjdCwgb2xkTW9kczogb2JqZWN0LCBlbGVtZW50OiBFbGVtZW50UmVmLCByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gIE9iamVjdC5rZXlzKG1vZHMpLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAob2xkTW9kc1trZXldKSB7XG4gICAgICBpZiAobW9kc1trZXldID09PSBvbGRNb2RzW2tleV0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5yZW1vdmVDbGFzcyhlbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGdlbmVyYXRlQ2xhc3MoYmxvY2tOYW1lLCBlbGVtTmFtZSwga2V5LCBvbGRNb2RzW2tleV0pKTtcbiAgICB9XG5cbiAgICBpZiAobW9kc1trZXldKSB7XG4gICAgICByZW5kZXJlci5hZGRDbGFzcyhlbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGdlbmVyYXRlQ2xhc3MoYmxvY2tOYW1lLCBlbGVtTmFtZSwga2V5LCBtb2RzW2tleV0pKTtcbiAgICB9XG4gIH0pO1xuXG4gIE9iamVjdC5rZXlzKG9sZE1vZHMpLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAoIShrZXkgaW4gbW9kcykgJiYgb2xkTW9kc1trZXldKSB7XG4gICAgICByZW5kZXJlci5yZW1vdmVDbGFzcyhlbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGdlbmVyYXRlQ2xhc3MoYmxvY2tOYW1lLCBlbGVtTmFtZSwga2V5LCBvbGRNb2RzW2tleV0pKTtcbiAgICB9XG4gIH0pO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbYmxvY2tdJyxcbn0pXG5leHBvcnQgY2xhc3MgQmxvY2tEaXJlY3RpdmUge1xuICBwdWJsaWMgZWxlbWVudDogRWxlbWVudFJlZjtcbiAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjI7XG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHB1YmxpYyBtb2Q6IHN0cmluZyB8IHN0cmluZ1tdIHwgb2JqZWN0O1xuICBwcml2YXRlIF9tb2RzOiBPYmplY3Q7XG4gIHByaXZhdGUgX21vZFNlcmlhbGl6ZWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgICAgICAgICBAQXR0cmlidXRlKCdibG9jaycpIG5hbWU6IHN0cmluZykge1xuXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMucmVuZGVyZXIgPSByZW5kZXJlcjtcblxuICAgIHJlbmRlcmVyLmFkZENsYXNzKGVsZW1lbnQubmF0aXZlRWxlbWVudCwgZ2VuZXJhdGVDbGFzcyhuYW1lKSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICBpZiAoSlNPTi5zdHJpbmdpZnkodGhpcy5tb2QpICE9PSB0aGlzLl9tb2RTZXJpYWxpemVkKSB7XG4gICAgICB0aGlzLl9tb2RTZXJpYWxpemVkID0gSlNPTi5zdHJpbmdpZnkodGhpcy5tb2QpO1xuXG4gICAgICBsZXQgbW9kcyA9IHRoaXMubW9kO1xuXG4gICAgICBsZXQge3JlbmRlcmVyLCBlbGVtZW50LCBuYW1lfSA9IHRoaXM7XG5cbiAgICAgIG1vZHMgPSBwYXJzZU1vZHMobW9kcyk7XG5cbiAgICAgIHNldE1vZHMobmFtZSwgJycsIG1vZHMsIHRoaXMuX21vZHMgfHwge30sIGVsZW1lbnQsIHJlbmRlcmVyKTtcblxuICAgICAgdGhpcy5fbW9kcyA9IHRoaXMuX21vZHMgPT09IG1vZHMgPyBPYmplY3QuYXNzaWduKHt9LCBtb2RzKSA6IG1vZHM7XG4gICAgfVxuICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tlbGVtXScsXG59KVxuZXhwb3J0IGNsYXNzIEVsZW1EaXJlY3RpdmUge1xuICBwdWJsaWMgZWxlbWVudDogRWxlbWVudFJlZjtcbiAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjI7XG4gIHB1YmxpYyBibG9ja05hbWU6IHN0cmluZztcbiAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgQElucHV0KCkgcHVibGljIG1vZDogc3RyaW5nIHwgc3RyaW5nW10gfCBvYmplY3Q7XG4gIHByaXZhdGUgX21vZHM6IE9iamVjdDtcbiAgcHJpdmF0ZSBfbW9kU2VyaWFsaXplZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgICAgICAgIEBBdHRyaWJ1dGUoJ2VsZW0nKSBuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgIGJsb2NrOiBCbG9ja0RpcmVjdGl2ZSkge1xuXG4gICAgdGhpcy5ibG9ja05hbWUgPSBibG9jay5uYW1lO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XG5cbiAgICByZW5kZXJlci5hZGRDbGFzcyhlbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGdlbmVyYXRlQ2xhc3MoYmxvY2submFtZSwgbmFtZSkpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KHRoaXMubW9kKSAhPT0gdGhpcy5fbW9kU2VyaWFsaXplZCkge1xuICAgICAgdGhpcy5fbW9kU2VyaWFsaXplZCA9IEpTT04uc3RyaW5naWZ5KHRoaXMubW9kKTtcblxuICAgICAgbGV0IG1vZHMgPSB0aGlzLm1vZDtcblxuICAgICAgbGV0IHtyZW5kZXJlciwgZWxlbWVudCwgYmxvY2tOYW1lLCBuYW1lfSA9IHRoaXM7XG5cbiAgICAgIG1vZHMgPSBwYXJzZU1vZHMobW9kcyk7XG5cbiAgICAgIHNldE1vZHMoYmxvY2tOYW1lLCBuYW1lLCBtb2RzLCB0aGlzLl9tb2RzIHx8IHt9LCBlbGVtZW50LCByZW5kZXJlcik7XG5cbiAgICAgIHRoaXMuX21vZHMgPSB0aGlzLl9tb2RzID09PSBtb2RzID8gT2JqZWN0LmFzc2lnbih7fSwgbW9kcykgOiBtb2RzO1xuICAgIH1cbiAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbW9kXScsXG59KVxuZXhwb3J0IGNsYXNzIE1vZERpcmVjdGl2ZSB7fVxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBCbG9ja0RpcmVjdGl2ZSxcbiAgICBFbGVtRGlyZWN0aXZlLFxuICAgIE1vZERpcmVjdGl2ZSxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIEJsb2NrRGlyZWN0aXZlLFxuICAgIEVsZW1EaXJlY3RpdmUsXG4gICAgTW9kRGlyZWN0aXZlLFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIEJlbU1vZHVsZSB7XG4gIHN0YXRpYyBjb25maWcoZGF0YTogQmVtQ29uZmlnKSB7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICByZXR1cm4gQmVtTW9kdWxlO1xuICAgIH1cblxuICAgIGlmIChkYXRhLnNlcGFyYXRvcnMpIHtcbiAgICAgIHNlcGFyYXRvcnMuZWwgPSBkYXRhLnNlcGFyYXRvcnNbMF0gfHwgJ19fJztcbiAgICAgIHNlcGFyYXRvcnMubW9kID0gZGF0YS5zZXBhcmF0b3JzWzFdIHx8ICctLSc7XG4gICAgICBzZXBhcmF0b3JzLnZhbCA9IGRhdGEuc2VwYXJhdG9yc1syXSB8fCAnLSc7XG4gICAgfVxuXG4gICAgaWYgKCdpZ25vcmVWYWx1ZXMnIGluIGRhdGEpIHtcbiAgICAgIGlnbm9yZVZhbHVlcyA9ICEhZGF0YS5pZ25vcmVWYWx1ZXM7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEubW9kQ2FzZSkge1xuICAgICAgaWYgKCF+WydrZWJhYicsICdjYW1lbCcsICdzbmFrZSddLmluZGV4T2YoZGF0YS5tb2RDYXNlKSkge1xuICAgICAgICB0aHJvdyAnV3JvbmcgbW9kIGNhc2UuIFlvdSBjYW4gdXNlIG9ubHkgdGhlc2UgY2FzZXM6IGtlYmFiLCBzbmFrZSwgY2FtZWwnO1xuICAgICAgfVxuXG4gICAgICBtb2RDYXNlID0gZGF0YS5tb2RDYXNlO1xuICAgIH1cblxuICAgIHJldHVybiBCZW1Nb2R1bGU7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJEaXJlY3RpdmUiLCJFbGVtZW50UmVmIiwiUmVuZGVyZXIyIiwiQXR0cmlidXRlIiwiSW5wdXQiLCJOZ01vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLFFBRUE7Ozt3QkFGQTtRQU1DLENBQUE7QUFKRCxJQU1BLHFCQUFNLFVBQVUsR0FBRztRQUNqQixFQUFFLEVBQUUsSUFBSTtRQUNSLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLEdBQUc7S0FDVCxDQUFDO0lBQ0YscUJBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztJQUN6QixxQkFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDOzs7OztJQUV0Qix3QkFBd0IsR0FBVztRQUNqQyxRQUFRLE9BQU87WUFDYixLQUFLLE9BQU87Z0JBQ1YsT0FBTyxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsVUFBUyxDQUFDLElBQUcsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzNHLEtBQUssT0FBTztnQkFDVixPQUFPLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFTLENBQUMsSUFBRyxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDM0c7Z0JBQ0UsT0FBTyxHQUFHLENBQUM7U0FDZDtLQUNGOzs7Ozs7OztJQUVELHVCQUF1QixTQUFpQixFQUFFLFFBQWlCLEVBQUUsT0FBZ0IsRUFBRSxRQUEyQjtRQUN4RyxJQUFJLFlBQVksRUFBRTtZQUNoQixRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztTQUN2QjtRQUVE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