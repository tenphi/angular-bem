describe('angular-bem', function() {
  var compile, scope, timeout, modAttr;

  function compare($el, html) {
    expect($el[0].outerHTML).toBe(html);
  }

  beforeEach(function() {
    module('tenphi.bem');

    angular.module('app', ['tenphi.bem']);
  });

  beforeEach(function() {
    module('app');

    inject(function($compile, $rootScope, $timeout) {
      compile = function(str) {
        return $compile(str.replace(new RegExp(' mod="', 'g'), ' ' + modAttr + '="'));
      };
      scope = $rootScope.$new();
      timeout = $timeout;
    });
  });

  function sharedTests(modStr) {
    describe(modStr, function() {

      it('insert block name', function() {
        modAttr = modStr;
        var $el = compile('<div block="tnp-block"></div>')(scope);

        compare($el, '<div class="ng-scope tnp-block"></div>');
      });

      it('insert element name', function() {
        var $el = compile('<div block="tnp-block"><div elem="tnp-elem"></div></div>')(scope);

        compare($el, '<div class="ng-scope tnp-block"><div class="tnp-block__tnp-elem"></div></div>');
      });

      describe('insert modifiers in block', function() {

        beforeEach(function() {
          scope.bool = true;
          scope.text = 'value';
        });

        describe('with dynamic values', function() {

          it('single bool modifier', function() {
            var $el = compile('<div block="tnp-block" mod="tnpMod: bool"></div>')(scope);

            compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod"></div>');
          });

          it('single string modifier', function() {
            var $el = compile('<div block="tnp-block" mod="tnpMod: text"></div>')(scope);

            compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod-value"></div>');
          });

          it('mixed modifiers', function() {
            var $el = compile('<div block="tnp-block" mod="tnpMod: bool; tnpMod2: text"></div>')(scope);

            compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod tnp-block--tnp-mod2-value"></div>');
          });
        });

        describe('with static values', function() {

          it('single modifier', function() {
            var $el = compile('<div block="tnp-block" mod="tnpMod"></div>')(scope);

            compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod"></div>');
          });

          it('multiple modifiers', function() {
            scope.text = 'value value2';
            var $el = compile('<div block="tnp-block" mod="tnpMod; tnpMod2"></div>')(scope);

            compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod tnp-block--tnp-mod2"></div>');
          });
        });

      });

      describe('insert modifiers in element', function() {

        beforeEach(function() {
          scope.bool = true;
          scope.text = 'value';
        });

        describe('with dynamic values', function() {

          it('single bool modifier', function() {
            var $el = compile('<div block="tnp-block"><div elem="tnp-elem" mod="tnpMod: bool"></div></div>')(scope);

            compare($el, '<div class="ng-scope tnp-block"><div class="tnp-block__tnp-elem tnp-block__tnp-elem--tnp-mod"></div></div>');
          });

          it('single string modifier', function() {
            var $el = compile('<div block="tnp-block"><div elem="tnp-elem" mod="tnpMod: text"></div></div>')(scope);

            compare($el, '<div class="ng-scope tnp-block"><div class="tnp-block__tnp-elem tnp-block__tnp-elem--tnp-mod-value"></div></div>');
          });

          it('mixed modifiers', function() {
            var $el = compile('<div block="tnp-block"><div elem="tnp-elem" mod="tnpMod: bool; tnpMod2: text"></div></div>')(scope);

            compare($el, '<div class="ng-scope tnp-block"><div class="tnp-block__tnp-elem tnp-block__tnp-elem--tnp-mod tnp-block__tnp-elem--tnp-mod2-value"></div></div>');
          });
        });

        describe('with static values', function() {

          it('single modifier', function() {
            var $el = compile('<div block="tnp-block"><div elem="tnp-elem" mod="tnpMod"></div></div>')(scope);

            compare($el, '<div class="ng-scope tnp-block"><div class="tnp-block__tnp-elem tnp-block__tnp-elem--tnp-mod"></div></div>');
          });

          it('multiple modifiers', function() {
            scope.text = 'value value2';
            var $el = compile('<div block="tnp-block"><div elem="tnp-elem" mod="tnpMod; tnpMod2"></div></div>')(scope);

            compare($el, '<div class="ng-scope tnp-block"><div class="tnp-block__tnp-elem tnp-block__tnp-elem--tnp-mod tnp-block__tnp-elem--tnp-mod2"></div></div>');
          });
        });

        it('with mixed values', function() {
          var $el = compile('<div block="tnp-block"><div elem="tnp-elem" mod="tnpMod; tnpMod2: text"></div></div>')(scope);

          compare($el, '<div class="ng-scope tnp-block"><div class="tnp-block__tnp-elem tnp-block__tnp-elem--tnp-mod tnp-block__tnp-elem--tnp-mod2-value"></div></div>');
        });
      });
    });
  }

  ['mod-once', 'mod'].forEach(function(modStr) {
    sharedTests(modStr);
  });

  describe('change modifiers', function() {

    describe('mod-once should ignore changes', function() {

      it('add modifiers', function() {
        modAttr = 'mod-once';

        scope.mods = {};
        var $el = compile('<div block="tnp-block" mod="tnpMod: mods.tnpMod; tnpMod2: mods.tnpMod2"></div>')(scope);

        compare($el, '<div class="ng-scope tnp-block"></div>');
        scope.mods.tnpMod = true;
        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block"></div>');
        scope.mods.tnpMod2 = 'value';
        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block"></div>');
      });

      it('remove modifiers', function() {
        scope.mods = { tnpMod: true, tnpMod2: 'value' };
        var $el = compile('<div block="tnp-block" mod="tnpMod: mods.tnpMod; tnpMod2: mods.tnpMod2; tnpMod3: mods.tnpMod3"></div>')(scope);
        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod tnp-block--tnp-mod2-value"></div>');
        scope.mods.tnpMod2 = false;
        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod tnp-block--tnp-mod2-value"></div>');
        scope.mods.tnpMod = false;
        scope.mods.tnpMod3 = true;
        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod tnp-block--tnp-mod2-value"></div>');
        delete scope.mods.tnpMod3;
        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod tnp-block--tnp-mod2-value"></div>');
      });
    });

    describe('mod', function() {
      it('add modifiers', function() {
        modAttr = 'mod';

        scope.mods = {};
        var $el = compile('<div block="tnp-block" mod="tnpMod: mods.tnpMod; tnpMod2: mods.tnpMod2"></div>')(scope);

        compare($el, '<div class="ng-scope tnp-block"></div>');
        scope.mods.tnpMod = true;
        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod"></div>');
        scope.mods.tnpMod2 = 'value';
        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod tnp-block--tnp-mod2-value"></div>');
      });

      it('remove modifiers', function() {
        scope.mods = { tnpMod: true, tnpMod2: 'value' };
        var $el = compile('<div block="tnp-block" mod="tnpMod: mods.tnpMod; tnpMod2: mods.tnpMod2; tnpMod3: mods.tnpMod3"></div>')(scope);
        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod tnp-block--tnp-mod2-value"></div>');
        scope.mods.tnpMod2 = false;
        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod"></div>');
        scope.mods.tnpMod = false;
        scope.mods.tnpMod3 = true;
        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod3"></div>');
        delete scope.mods.tnpMod3;
        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block"></div>');
      });
    });

  });

});
