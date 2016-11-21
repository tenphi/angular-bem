;(function(angular) {
  'use strict';

  if (!angular) {
    throw new Error('angular-bem: Angular is required');
  }

  if (angular.version.major !== 1 || angular.version.minor < 2) {
    throw new Error('angular-bem: unsupported version of Angular. Use >= 1.2.0');
  }

  var separators = {
    el: '__',
    mod: '--',
    value: '-'
  };
  var ignoreValues = false;
  var modCase = 'kebab';

  // modName -> mod-name
  function modNameHandler(str) {
    switch(modCase) {
      case 'kebab':
        return str ? str.replace(/[A-Z]/g, function(s) {return '-' + s.toLowerCase() }).replace(/$\-/, '') : '';
      case 'snake':
        return str ? str.replace(/[A-Z]/g, function(s) {return '_' + s.toLowerCase() }).replace(/$\-/, '') : '';
      default:
        return str;
    }
  }

  function isDynamic(str) {
    return !!~str.indexOf(':');
  }


  var getClasses = function(el) {
    return el[0].className.split(/\s/g);
  };

  var addClass = function(el, cls) {
    el.addClass(cls);
  };

  var removeClass = function(el, cls) {
    el.removeClass(cls);
  };


  function generateClass(blockName, elemName, modName, modValue) {
    modName = modNameHandler(modName);

    var cls = blockName;

    if (elemName) {
      cls += separators.el + elemName;
    }

    if (modName) {
      cls += separators.mod + modName;
      if (typeof(modValue) !== 'boolean' && modValue) {
        cls += separators.value + modValue;
      }
    }

    return cls;
  }

  function initMod($el, $scope, blockName, elemName, modAttr, watch) {
    var mods, oldMods, modsList, i, l, key;

    modAttr = '{' + modAttr
            .split(';')
            .filter(function(s) {
              return s.trim();
            })
            .map(function(s) {
              return s + (isDynamic(s) ? '' : ': true');
            })
            .join(',') + '}';

    function setMods(mods, oldMods) {
      for (i = 0, l = modsList.length; i < l; i++) {
        key = modsList[i];

        if (mods[key]) {
          if (oldMods[key] !== mods[key]) {
            if (oldMods[key]) {
              removeClass($el, generateClass(blockName, elemName, key, ignoreValues ? undefined : oldMods[key]));
            }
            addClass($el, generateClass(blockName, elemName, key, ignoreValues ? undefined : mods[key]));
          }
        } else {
          if (oldMods[key]) {
            removeClass($el, generateClass(blockName, elemName, key, ignoreValues ? undefined : oldMods[key]));
          }
        }
      }
    }

    if (watch) {
      $scope.$watch(function() {
        return $scope.$eval(modAttr);
      }, function(mods) {
        setMods(mods, oldMods);
        oldMods = mods;
      }, true);
    }

    mods = $scope.$eval(modAttr);
    modsList = Object.keys(mods)
    setMods(mods, {});
    oldMods = mods;
  }

  var module = angular.module('tenphi.bem', []);

  module.provider('bemConfig', function() {
    this.setSeparators = function(el, mod, value) {
      separators.el = el || separators.el;
      separators.mod = mod || separators.mod;
      separators.value = value || separators.value;
    };
    this.ignoreValues = function(bool) {
      ignoreValues = !!bool;
    };
    this.setModCase = function(newModCase) {
      if (!~['kebab', 'camel', 'snake'].indexOf(newModCase)) {
        throw 'Wrong mod case. You can use only these cases: kebab, snake, camel';
      }

      modCase = newModCase;
    };

    this.$get = function() {
      return {
        separators: separators,
        ignoreValues: ignoreValues
      };
    };
  });

  module.directive('block', [function() {
    return {
      restrict: 'A',
      require: 'block',
      scope: false,
      controller: ['$scope', '$element', '$attrs', function BlockCtrl($scope, $element, $attrs) {
        var blockName = this.name = $attrs.block;

        if (!this.name) return;

        this.block = true;

        $element[0].removeAttribute('block');
        addClass($element, generateClass(this.name));

        if ('mod' in $attrs) {
          initMod($element, $scope, blockName, null, $attrs.mod || $attrs.modOnce, $attrs.mod ? isDynamic($attrs.mod) : false);
          $element[0].removeAttribute('mod');
        } else if ('modOnce' in $attrs) {
          initMod($element, $scope, blockName, null, $attrs.modOnce, false);
          $element[0].removeAttribute('mod-once');
        }
      }]
    }
  }]);

  module.directive('elem', [function() {
    return {
      restrict: 'EA',
      require: ['^block', 'elem'],
      scope: false,
      controller: function ElemCtrl() {},
      link: {
        pre: function($scope, $element, $attrs, ctrls) {
          var blockCtrl = ctrls[0];
          var elemCtrl = ctrls[1];

          var name = elemCtrl.name = $attrs.elem;
          var blockName = blockCtrl.name;

          if (!elemCtrl.name) return;

          elemCtrl.blockName = blockCtrl.name;
          elemCtrl.elem = true;

          $element[0].removeAttribute('elem');
          addClass($element, generateClass(blockName, name));

          if ('mod' in $attrs) {
            initMod($element, $scope, blockName, name, $attrs.mod, isDynamic($attrs.mod));
            $element[0].removeAttribute('mod');
          } else if ('modOnce' in $attrs) {
            initMod($element, $scope, blockName, name, $attrs.modOnce, false);
            $element[0].removeAttribute('mod-once');
          }
        }
      }
    }
  }]);

})(window.angular);

/* commonjs package manager support (eg componentjs) */
if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
  module.exports = 'tenphi.bem';
}
