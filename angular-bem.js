(function(angular) {

  if (!angular) {
    throw new Error('angular-bem: angular required');
  }

  // modName -> mod_name
  function formatName(s) {
    return s.replace(/[A-Z]/g, function(s) {return '-' + s.toLowerCase();});
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

  function removeClassesWithPrefix(el, prefix) {
    var classes = getClasses(el);
    var size = prefix.length, cls, i, len;
    for (i = 0, len = classes.length; i < len; i++) {
      cls = classes[i];
      if (cls.slice(0, size) === prefix) {
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
        if ($scope.blockController) {
          $scope.parentBlockController = $scope.blockController;
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
          blockCtrl = scope.parentBlockController;
        }

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

  module.directive('mods', function() {

    return {
      restrict: 'A',
      require: ['^block', '?element'],
      link: function(scope, el, attrs, ctrls) {
        var modMap = {};
        var blockCtrl = ctrls[0] || ctrls[1];
        var elementCtrl = ctrls[1];

        var blockName = blockCtrl.name;

        function setMods() {
          var elementNames = (elementCtrl && elementCtrl.names) || [];

          if (!modMap) return;
          var mods = Object.keys(modMap);

          for (var i = 0, len = mods.length; i < len; i++) {
            var mod = mods[i];
            var modValue = modMap[mod];
            var modName = formatName(mod);

            var classPrefix = blockName
              + '_' + modName;
            var shortClass = classPrefix
              + (typeof(modValue) === 'string' ? '_' + modValue : '');

            if (!elementNames.length) {
              if (modValue) {
                addClass(el, shortClass)
              } else {
                removeClassesWithPrefix(el, classPrefix);
              }
            } else {
              elementNames.forEach(function(elementName) {
                var classPrefix = blockName
                  + '__' + elementName
                  + '_' + modName;
                var longClass = classPrefix
                  + (typeof(modValue) === 'string' ? '_' + modValue : '');

                if (modValue) {
                  addClass(el, longClass)
                } else {
                  removeClassesWithPrefix(el, classPrefix);
                }
              });
            }
          }
        }

        scope.$watch(function() {
          modMap = scope.$eval(attrs.mods);
          setMods();
        }, true);

        el[0].removeAttribute('mods');
      }
    }
  });

})(window.angular);