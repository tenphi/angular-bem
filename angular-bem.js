(function(angular) {

  if (!angular) {
    throw new Error('angular-bem: angular required');
  }

  function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  function intToRGB(i){
    return ('00' + ((i>>16)&0xFF/1.5).toString(16)).slice(-2) +
    ('00' + ((i>>8)&0xFF/1.5).toString(16)).slice(-2) +
    ('00' + (i&0xFF/1.5).toString(16)).slice(-2);
  }

  function colorByString(str) {
    return '#' + intToRGB(hashCode(str));
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

  var debugOuterStyle = {
    minHeight: '9px',
    outline: '1px solid #888',
    paddingTop: '10px'
  };

  var debugInnerStyle = {
    fontFamily: 'monospace',
    position: 'absolute',
    left: 0,
    top: 0,
    fontSize: '8px',
    color: 'white',
    outline: '1px solid #888'
  };

  function injectDebug($el, blockName, elementNames, mods) {
    var pos = $el.css('position');
    mods = mods || {};
    mods = (function(mods) {
      return Object.keys(mods)
        .filter(function(mod) {return !!mods[mod];})
        .map(function(mod) {
          return mod + ':' + mods[mod];
        }).join(',');
    })(mods);
    var className = 'ng-bem-debug-' + (elementNames ? 'element' : 'block');
    var text = (elementNames ? '(' + elementNames.join(',') + ')' : '[' + blockName + ']')
      + (mods ? '{' + mods + '}' : '');

    var $debug = angular.element($el.children()[$el.children().length - 1]);
    if (!$debug.length || !~getClasses($debug).indexOf(className)) {
      $debug = angular.element('<div>').addClass(className);
    }

    $debug.text(text);

    if (pos !== 'absolute' && pos !== 'relative') {
      $el.css('position', 'relative');
    }

    $el.css(debugOuterStyle);

    $debug.css(debugInnerStyle);

    $debug.css('backgroundColor', colorByString(blockName));

    return $debug;
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

  var module = angular.module('tenphi.bem', []);

  module.provider('bemConfig', function() {
    var debug = false;

    this.debug = function(bool) {
      debug = !!bool;
    };

    this.debugInnerStyle = debugInnerStyle;

    this.debugOuterStyle = debugOuterStyle;

    this.$get = function() {
      return {
        debug: debug
      }
    };
  });

  module.directive('block', function(bemConfig) {
    var debug = bemConfig.debug;
    return {
      restrict: 'EA',
      require: 'block',
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
        this.$el = $element;

        $element[0].removeAttribute('block');
        addClass($element, blockName);
      },
      link: {
        pre: function(scope, $el, attrs, ctrl) {
          if (debug) {
            ctrl.debugElement = injectDebug($el, ctrl.name);
          }
        },
        post: function(scope, $el, attrs, ctrl) {
          if (debug) {
            $el.append(ctrl.debugElement);
          }
        }
      }
    }
  });

  module.directive('element', function(bemConfig) {
    var debug = bemConfig.debug;
    return {
      restrict: 'EA',
      require: ['^block', 'element'],
      controller: function ElementCtrl($element) {
        this.$el = $element;
      },
      link: {
        pre: function(scope, $el, attrs, ctrls) {
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
            removeClass($el, name);
            addClass($el, blockCtrl.name + '__' + name);
          });

          $el[0].removeAttribute('element');

          if (debug) {
            this.debugElement = injectDebug($el, blockCtrl.name, elementCtrl.names);
          }
        },
        post: function(scope, $el, attrs, ctrls) {
          $el.append(this.debugElement);
        }
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

  module.directive('elementMod', function(bemConfig) {
    var debug = bemConfig.debug;
    return {
      restrict: 'A',
      require: 'element',
      link: function(scope, $el, attrs, ctrl) {
        var modMap = {};

        function setMod() {
          var blockName = ctrl.blockName;
          var elementNames = ctrl.names || [];

          if (!modMap) {
            elementNames.forEach(function(elementName) {
              removeClassesWithPrefix($el, blockName + '__' + elementName + '_');
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

              removeClassesWithPrefix($el, classPrefix, modValue ? className : null);
              if (modValue) {
                addClass($el, className);
              }
            });
          }

          if (debug) {
            this.debugElement = injectDebug($el, blockName, elementNames, modMap);
          }
        }

        scope.$watch(function() {
          modMap = scope.$eval(attrs.elementMod);
          setMod();
        }, true);

        $el[0].removeAttribute('element-mod');
      }
    }
  });

})(window.angular);