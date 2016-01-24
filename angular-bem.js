(function(angular) {
  'use strict';

  function log() {
    //console.log.apply(console, Array.prototype.slice.call(arguments));
  }

  if (!angular) {
    throw new Error('angular-bem: angular required');
  }

  if (angular.version.major !== 1 || angular.version.minor < 2) {
    throw new Error('angular-bem: unsupported version of angular. use >= 1.4.0');
  }

  // modName -> mod_name
  function toKebabCase(str) {
    return str ? str.replace(/[A-Z]/g, function(s) {return '-' + s.toLowerCase() }).replace(/$\-/, '') : '';
  }

  function copyObject(obj) {
    var newObj = {};

    for (var key in obj) {
      newObj[key] = obj[key];
    }

    return newObj;
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
      if (modMap) {
        modMap = modMap.split(/\s+/)
        for (var i = 0; i < modMap.length; i++) {
          if (modMap[i]) {
            tmp[modMap[i]] = true;
          }
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
    blockName = toKebabCase(blockName);
    elemName = toKebabCase(elemName);
    modName = toKebabCase(modName);

    var cls = blockName;

    if (elemName) {
      cls += '__' + elemName;
    }

    if (modName) {
      cls += '--' + modName;
      if (typeof(modValue) !== 'boolean' && modValue != null) {
        cls += '-' + modValue;
      }
    }

    return cls;
  }

  function parseMods(mods) {
    if (typeof mods === 'string') {
      mods = mods.split(/\s+/);

      if (mods[0] === '') {
        mods = [];
      }
    }

    if (Array.isArray(mods)) {
      var arr = mods;

      mods = {};

      arr.forEach(function(key) {
        mods[key] = true;
      });
    } else if (typeof mods !== 'object') {
      return {};
    }

    for (var key in mods) {
      if (!mods[key]) {
        delete mods[key];
      }
    };

    return mods;
  }

  function setMods($el, blockName, elemName, mods, oldMods, classGen) {
    log('mods', mods, oldMods, mods === oldMods);
    Object.keys(mods).forEach(function(key) {
      if (oldMods[key]) {
        if (oldMods[key] !== mods[key]) {
          removeClass($el, classGen(blockName, elemName, key, oldMods[key]));
          addClass($el, classGen(blockName, elemName, key, mods[key]));
          log('change', classGen(blockName, elemName, key, oldMods[key]), ' -> ', classGen(blockName, elemName, key, mods[key]));
        }
      } else if (mods[key]) {
        addClass($el, classGen(blockName, elemName, key, mods[key]));
        log('add', classGen(blockName, elemName, key, mods[key]));
      }
    });

    Object.keys(oldMods).forEach(function(key) {
      if (!(key in mods)) {
        if (oldMods[key] && !(key in mods)) {
          removeClass($el, classGen(blockName, elemName, key, oldMods[key]));
          log('remove', classGen(blockName, elemName, key, oldMods[key]));
        }
      }
    });
  }

  function initMod($el, $scope, blockName, elemName, modAttr, classGen) {
    var watch = true, mods, oldMods = {};

    if (modAttr.slice(0, 2) === '::') {
      modAttr === modAttr.slice(2);
      watch = false;
    }

    if (watch) {
      $scope.$watch(function() {
        return $scope.$eval(modAttr);
      }, function(mods) {
        mods = parseMods(mods);
        setMods($el, blockName, elemName, mods, oldMods, classGen);

        oldMods = copyObject(mods);
      }, true);
    }

    mods = parseMods($scope.$eval(modAttr));
    setMods($el, blockName, elemName, mods, oldMods, classGen);

    oldMods = copyObject(mods);
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