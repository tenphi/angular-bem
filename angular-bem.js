(function(angular) {
  'use strict';

  if (!angular) {
    throw new Error('angular-bem: angular required');
  }

  if (angular.version.major !== 1 || angular.version.minor < 4) {
    throw new Error('angular-bem: unsupported version of angular. use >= 1.4.0');
  }

  // modName -> mod_name
  function formatName(s) {
    return s.replace(/[A-Z]/g, function(s) {return '-' + s.toLowerCase();});
  }

  function handleModMap(modMap) {
    var tmp, i;
    if (Array.isArray(modMap)) {
      tmp = {};
      for (var i = 0; i < modMap.length; i++) {
        if (modMap[i]) {
          tmp[modMap[i]] = true;
        }
      }
    } else if (typeof(modMap) === 'string') {
      tmp = {};
      modMap = modMap.split(/\s+/)
      for (var i = 0; i < modMap.length; i++) {
        if (modMap[i]) {
          tmp[modMap[i]] = true;
        }
      }
    } else {
      tmp = modMap;
    }
    return tmp;
  }
  var classListSupport = !!document.createElement('div').classList, getClasses, addClass, removeClass;

  if (classListSupport) {
    getClasses = function(el) {
      return Array.prototype.slice.call(el[0].classList);
    };

    addClass = function(el, cls) {
      el[0].classList.add(cls);
    };

    removeClass = function(el, cls) {
      el[0].classList.remove(cls);
    };

  } else {
    getClasses = function(el) {
      return el[0].className.split(/\s/g);
    };

    addClass = function(el, cls) {
      el.addClass(cls);
    };

    removeClass = function(el, cls) {
      el.removeClass(cls);
    };
  }

  function removeClassesWithPrefix(el, prefix, except) {
    var classes = getClasses(el);
    var size = prefix.length, cls, i, len;
    for (i = 0, len = classes.length; i < len; i++) {
      cls = classes[i];
      if (cls.slice(0, size) === prefix && except !== cls) {
        removeClass(el, cls);
      }
    }
  }

  function generateClass(blockName, elemName, modName, modValue) {
    var cls = blockName;

    if (elemName != null) {
      cls += '__' + elemName;
    }

    if (modName != null) {
      cls += '--' + modName;
      if (typeof(modValue) !== 'boolean' && modValue != null) {
        cls += '-' + modValue;
      }
    }

    return cls;
  }

  var module = angular.module('tenphi.bem', []);

  module.provider('bemConfig', function() {
    var _this = this;

    this.generateClass = generateClass;

    this.$get = function() {
      return {
        generateClass: _this.generateClass
      }
    };
  });

  module.directive('block', ['bemConfig', function(bemConfig) {
    return {
      restrict: 'A',
      require: 'block',
      scope: false,
      controller: ['$scope', '$element', '$attrs', function BlockCtrl($scope, $element, $attrs) {
        this.blockName = $attrs.block;

        if (!this.blockName) return;

        this.block = true;

        $element[0].removeAttribute('block');
        addClass($element, bemConfig.generateClass(this.blockName));
      }]
    }
  }]);

  module.directive('elem', ['bemConfig', function(bemConfig) {
    return {
      restrict: 'EA',
      require: ['^block', 'elem'],
      scope: false,
      controller: function ElemCtrl() {},
      link: {
        pre: function(scope, $el, attrs, ctrls) {
          var blockCtrl = ctrls[0];
          var elemCtrl = ctrls[1];

          elemCtrl.elemName = attrs.elem;

          if (!elemCtrl.elemName) return;

          elemCtrl.blockName = blockCtrl.blockName;
          elemCtrl.elem = true;

          $el[0].removeAttribute('elem');
          addClass($el, bemConfig.generateClass(elemCtrl.blockName, elemCtrl.elemName));
        }
      }
    }
  }]);

  module.directive('mod', ['bemConfig', function(bemConfig) {
    return {
      restrict: 'A',
      require: ['?block', '?elem'],
      scope: false,
      link: function(scope, $el, attrs, ctrls) {
        var ctrl = ctrls[0] || ctrls[1],
          i, len, mod, mods, modValue, modName, className;

        if (!ctrl) {
          return;
        }

        function setMod(modMap, prevModMap) {
          if (!modMap) {
            removeClassesWithPrefix($el, bemConfig.generateClass(ctrl.blockName, ctrl.elemName), '');
            return;
          }

          if (typeof(modMap) === 'string') {
            mods = Object.keys(prevModMap);
            for (i = 0, len = mods.length; i < len; i++) {
              mod = mods[i];
              modValue = prevModMap[mod];
              modName = formatName(mod);

              if (!modName) continue;

              className = bemConfig.generateClass(ctrl.blockName, ctrl.elemName, modName);

              removeClassesWithPrefix($el, className);
            }
          }

          modMap = handleModMap(modMap);
          mods = Object.keys(modMap);

          for (i = 0, len = mods.length; i < len; i++) {
            mod = mods[i];
            modValue = modMap[mod];
            modName = formatName(mod);

            if (!modName) continue;

            className = bemConfig.generateClass(ctrl.blockName, ctrl.elemName, modName || '', modValue);

            removeClassesWithPrefix($el, bemConfig.generateClass(ctrl.blockName, ctrl.elemName, modName, ''), modValue ? className : null);
            if (modValue) {
              addClass($el, className);
            } else {
              removeClass($el, className);
            }
          }
        }

        scope.$watch(function() {
          return scope.$eval(attrs.mod);
        }, setMod, true);

        $el[0].removeAttribute('mod');
      }
    }
  }]);

})(window.angular);

/* commonjs package manager support (eg componentjs) */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
  module.exports = 'tenphi.bem';
}