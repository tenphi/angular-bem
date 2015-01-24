(function(angular) {

  if (!angular) {
    throw new Error('angular-bem: angular required');
  }

  // modName -> mod_name
  function formatName(s) {
    return s.replace(/[A-Z]/g, function(s) {return '-' + s.toLowerCase();});
  }

  function handleModMap(modMap) {
    var tmp;
    if (typeof(modMap) === 'string') {
      tmp = {};
      tmp[modMap] = true;
      return tmp;
    } else {
      return modMap;
    }
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
      cls += '_' + modName;
      if ((typeof(modValue) !== 'boolean' && modValue != null)) {
        cls += '_' + modValue;
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

  module.directive('block', function(bemConfig) {
    return {
      restrict: 'A',
      require: 'block',
      controller: function BlockCtrl($scope, $element, $attrs) {
        if (!$attrs.block) return;

        var blockName = $attrs.block;
        this.blockName = blockName;
        this.block = true;

        $element[0].setAttribute('block', '');
        addClass($element, bemConfig.generateClass(blockName));
      }
    }
  });

  module.directive('elem', function(bemConfig) {
    return {
      restrict: 'EA',
      require: ['^block', 'elem'],
      controller: function ElemCtrl($element) {
        this.$el = $element;
      },
      link: {
        pre: function(scope, $el, attrs, ctrls) {
          var blockCtrl = ctrls[0];
          var elemCtrl = ctrls[1];

          if (!attrs.elem) return;

          elemCtrl.blockName = blockCtrl.blockName;
          elemCtrl.elemName = attrs.elem;
          elemCtrl.elem = true;

          $el[0].setAttribute('elem', '');
          addClass($el, bemConfig.generateClass(elemCtrl.blockName, elemCtrl.elemName));
        }
      }
    }
  });

  module.directive('mods', function(bemConfig) {
    return {
      restrict: 'A',
      require: ['?block', '?elem'],
      link: function(scope, el, attrs, ctrls) {
        var modMap = {};
        var ctrl = ctrls[0] || ctrls[1];

        if (!ctrl) {
          return;
        }

        function setMod() {
          if (!modMap) {
            removeClassesWithPrefix(el, bemConfig.generateClass(ctrl.blockName, ctrl.elemName), '');
            return;
          }

          modMap = handleModMap(modMap);
          var mods = Object.keys(modMap);

          for (var i = 0, len = mods.length; i < len; i++) {
            var mod = mods[i];
            var modValue = modMap[mod];
            var modName = formatName(mod);

            if (!modName) continue;

            var className = bemConfig.generateClass(ctrl.blockName, ctrl.elemName, modName || '', modValue);

            removeClassesWithPrefix(el, bemConfig.generateClass(ctrl.blockName, ctrl.elemName, modName, ''), modValue ? className : null);
            if (modValue) {
              addClass(el, className);
            } else {
              removeClass(el, className);
            }
          }
        }

        scope.$watch(function() {
          modMap = scope.$eval(attrs.mods);
          setMod();
        }, true);

        el[0].removeAttribute('mods');
      }
    }
  });

})(window.angular);