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
    top: '10px'
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

  function injectDebug($el, blockName, elemName, mods) {
    var pos = $el.css('position');
    mods = mods || {};
    mods = (function(mods) {
      return Object.keys(mods)
        .filter(function(mod) {return !!mods[mod];})
        .map(function(mod) {
          return mod + ':' + mods[mod];
        }).join(',');
    })(mods);
    var className = 'ng-bem-debug-' + (elemName ? 'element' : 'block');
    var text = (elemName ? '(' + elemName + ')' : '[' + blockName + ']')
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
    var _this = this,
      debug = false;

    this.debug = function(bool) {
      debug = !!bool;
    };

    this.debugInnerStyle = debugInnerStyle;

    this.debugOuterStyle = debugOuterStyle;

    this.generateClass = generateClass;

    this.$get = function() {
      return {
        debug: debug,
        generateClass: _this.generateClass,
        debugInnerStyle: _this.debugInnerStyle,
        debugOuterStyle: _this.debugOuterStyle
      }
    };
  });

  module.directive('block', function(bemConfig) {
    var debug = bemConfig.debug;
    return {
      restrict: 'A',
      require: 'block',
      controller: function BlockCtrl($scope, $element, $attrs) {
        if (!$attrs.block) return;

        var blockName = $attrs.block;
        this.blockName = blockName;
        this.block = true;

        $element[0].removeAttribute('block');
        addClass($element, bemConfig.generateClass(blockName));
      },
      link: {
        pre: function(scope, $el, attrs, ctrl) {
          if (debug) {
            ctrl.debugElement = injectDebug($el, ctrl.blockName);
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

  module.directive('elem', function(bemConfig) {
    var debug = bemConfig.debug;
    return {
      restrict: 'EA',
      require: ['^^block', 'elem'],
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

          $el[0].removeAttribute('elem');
          addClass($el, bemConfig.generateClass(elemCtrl.blockName, elemCtrl.elemName));

          if (debug) {
            this.debugElement = injectDebug($el, blockCtrl.blockName, elemCtrl.elemName);
          }
        },
        post: function(scope, $el, attrs, ctrls) {
          $el.append(this.debugElement);
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