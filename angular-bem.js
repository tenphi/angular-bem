(function(angular) {
  'use strict';

  if (!angular) {
    throw new Error('angular-bem: angular required');
  }

  if (angular.version.major !== 1 || angular.version.minor < 2) {
    throw new Error('angular-bem: unsupported version of angular. use >= 1.2.0');
  }

  // modName -> mod_name
  function toKebabCase(str) {
    return str ? str.replace(/[A-Z]/g, function(s) {return '-' + s.toLowerCase() }).replace(/$\-/, '') : '';
  }

  function isDynamic(str) {
    return !!~str.indexOf(':');
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

  function generateClass(blockName, elemName, modName, modValue) {
    modName = toKebabCase(modName);

    var cls = blockName;

    if (elemName) {
      cls += '__' + elemName;
    }

    if (modName) {
      cls += '--' + modName;
      if (typeof(modValue) !== 'boolean' && modValue) {
        cls += '-' + modValue;
      }
    }

    return cls;
  }

  function initMod($el, $scope, blockName, elemName, modAttr, classGen) {
    var watch = isDynamic(modAttr), mods, oldMods, modsList, watchList = [], i, key;

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
      for (i = 0; i < modsList.length; i++) {
        key = modsList[i];

        if (mods[key]) {
          if (oldMods[key] !== mods[key]) {
            if (oldMods[key]) {
              removeClass($el, classGen(blockName, elemName, key, oldMods[key]));
            }
            addClass($el, classGen(blockName, elemName, key, mods[key]));
          }
        } else {
          if (oldMods[key]) {
            removeClass($el, classGen(blockName, elemName, key, oldMods[key]));
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
    var _this = this;

    this.generateClass = generateClass;

    this.$get = function() {
      return { generateClass: _this.generateClass };
    };
  });

  module.directive('block', ['bemConfig', function(bemConfig) {
    return {
      restrict: 'A',
      require: 'block',
      scope: false,
      controller: ['$scope', '$element', '$attrs', function BlockCtrl($scope, $element, $attrs) {
        var blockName = this.name = $attrs.block;

        if (!this.name) return;

        this.block = true;

        $element[0].removeAttribute('block');
        addClass($element, bemConfig.generateClass(this.name));

        if ('mod' in $attrs) {
          initMod($element, $scope, blockName, null, $attrs.mod, bemConfig.generateClass);
          $element[0].removeAttribute('mod');
        }
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
        pre: function($scope, $element, $attrs, ctrls) {
          var blockCtrl = ctrls[0];
          var elemCtrl = ctrls[1];

          var name = elemCtrl.name = $attrs.elem;
          var blockName = blockCtrl.name;

          if (!elemCtrl.name) return;

          elemCtrl.blockName = blockCtrl.name;
          elemCtrl.elem = true;

          $element[0].removeAttribute('elem');
          addClass($element, bemConfig.generateClass(blockName, name));

          if ('mod' in $attrs) {
            initMod($element, $scope, blockName, name, $attrs.mod, bemConfig.generateClass);
            $element[0].removeAttribute('mod');
          }
        }
      }
    }
  }]);

})(window.angular);

/* commonjs package manager support (eg componentjs) */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
  module.exports = 'tenphi.bem';
}