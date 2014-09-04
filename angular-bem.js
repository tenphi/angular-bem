(function(angular) {

  if (!angular) {
    throw new Error('angular-bem: angular required');
  }

  // modName -> mod_name
  function formatName(s) {
    return s.replace(/[A-Z]/g, function(s) {return '-' + s.toLowerCase();});
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

        $element.removeAttr('block');
        $element.addClass(blockName);
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

        console.log(scope.parentBlockController);
        if (elementCtrl && blockCtrl.$el[0] === elementCtrl.$el[0]) {
          blockCtrl = scope.parentBlockController;
        }

        elementCtrl.names = [];

        if (!attrs.element) return;

        // handle multiple elements attached to one node
        elementCtrl.names = attrs.element.split(/\s/g);

        elementCtrl.names.forEach(function(name) {
          el.removeClass(name);
          el.addClass(blockCtrl.name + '__' + name);
        });

        el.removeAttr('element');
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

            var shortClass = blockName
              + '_' + modName
              + (typeof(modValue) === 'string' ? '_' + modValue : '');

            if (!elementNames.length) {
              if (modValue) {
                el.addClass(shortClass);
              } else {
                el.removeClass(shortClass);
              }
            } else {
              elementNames.forEach(function(elementName) {
                var longClass = blockName
                  + '__' + elementName
                  + '_' + modName
                  + (typeof(modValue) === 'string' ? '_' + modValue : '');

                if (modValue) {
                  el.addClass(longClass);
                } else {
                  el.removeClass(longClass);
                }
              });
            }
          }
        }

        scope.$watch(function() {
          modMap = scope.$eval(attrs.mods);
          setMods();
        }, true);

        el.removeAttr('mods');
      }
    }
  });

})(window.angular);