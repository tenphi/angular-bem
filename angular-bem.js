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
      console.log(cls, prefix);
      if (cls.slice(0, size) === prefix && except !== cls) {
        removeClass(el, cls);
      }
    }
  }

  var module = angular.module('tenphi.bem', []);

  module.directive('block', function($compile) {
    return {
      restrict: 'EA',
      controller: function BlockCtrl($scope, $element, $attrs) {
        this.$el = $element;
        var $tmp = $scope;
        while($tmp) {
          if ($tmp.blockController) {
            this.parent = $tmp.blockController;
          }
          $tmp = $tmp.$parent;
        }

        $scope.blockController = this;

        if (!$attrs.block) return;

        var blockName = $attrs.block;
        this.name = blockName;

        $element[0].removeAttribute('block');
        addClass($element, blockName);
      }
    }
  });

  module.directive('element', function() {
    return {
      restrict: 'EA',
      require: ['^block', 'element'],
      controller: function ElementCtrl($element) {
        this.$el = $element;
      },
      link: function(scope, el, attrs, ctrls) {
        var blockCtrl = ctrls[0];
        var elementCtrl = ctrls[1];

        if (elementCtrl && blockCtrl.$el[0] === elementCtrl.$el[0]) {
          blockCtrl = blockCtrl.parent;
          if (!blockCtrl) {
            throw new Error('angular-bem: element doesn\'t have parent block');
          }
        }

        elementCtrl.blockName = blockCtrl.name;
        elementCtrl.names = [];

        if (!attrs.element) return;

        // handle multiple elements attached to one node
        elementCtrl.names = attrs.element.split(/\s/g);

        elementCtrl.names.forEach(function(name) {
          removeClass(el, name);
          addClass(el, blockCtrl.name + '__' + name);
        });

        el[0].removeAttribute('element');
      }
    }
  });

  module.directive('blockMod', function() {
    return {
      restrict: 'A',
      require: 'block',
      link: function(scope, el, attrs, ctrl) {
        var modMap = {};
        var blockName = ctrl.name;

        function setMod() {
          if (!modMap) {
            removeClassesWithPrefix(el, blockName + '_');
            return;
          }

          modMap = handleModMap(modMap);
          var mods = Object.keys(modMap);

          for (var i = 0, len = mods.length; i < len; i++) {
            var mod = mods[i];
            var modValue = modMap[mod];
            var modName = formatName(mod);

            var classPrefix = blockName + '_';
            var className = classPrefix
              + modName
              + (typeof(modValue) === 'string' ? '_' + modValue : '');

            removeClassesWithPrefix(el, classPrefix + modName, modValue ? className : null);
            if (modValue) {
              addClass(el, className);
            }
          }
        }

        scope.$watch(function() {
          modMap = scope.$eval(attrs.blockMod);
          setMod();
        }, true);

        el[0].removeAttribute('block-mod');
      }
    }
  });

  module.directive('elementMod', function() {
    return {
      restrict: 'A',
      require: 'element',
      link: function(scope, el, attrs, ctrl) {
        var modMap = {};

        function setMod() {
          var blockName = ctrl.blockName;
          var elementNames = ctrl.names || [];

          if (!modMap) {
            elementNames.forEach(function(elementName) {
              removeClassesWithPrefix(el, blockName + '__' + elementName + '_');
            });
            return;
          }

          modMap = handleModMap(modMap);
          var mods = Object.keys(modMap);

          for (var i = 0, len = mods.length; i < len; i++) {
            var mod = mods[i];
            var modValue = modMap[mod];
            var modName = formatName(mod);

            elementNames.forEach(function(elementName) {
              var classPrefix = blockName
                + '__' + elementName
                + '_' + modName;
              var className = classPrefix
                + (typeof(modValue) === 'string' ? '_' + modValue : '');

              removeClassesWithPrefix(el, classPrefix, modValue ? className : null);
              if (modValue) {
                addClass(el, className);
              }
            });
          }
        }

        scope.$watch(function() {
          modMap = scope.$eval(attrs.elementMod);
          setMod();
        }, true);

        el[0].removeAttribute('element-mod');
      }
    }
  });

})(window.angular);