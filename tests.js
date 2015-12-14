describe('angular-bem', function() {
  var compile, scope, timeout;

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
      compile = $compile;
      scope = $rootScope.$new();
      timeout = $timeout;
    });
  })

  it('insert block name', function() {
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

    describe('by object', function() {

      it('single bool modifier', function() {
        var $el = compile('<div block="tnp-block" mod="{ tnpMod: bool }"></div>')(scope);

        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod"></div>');
      });

      it('single string modifier', function() {
        var $el = compile('<div block="tnp-block" mod="{ tnpMod: text }"></div>')(scope);

        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod-value"></div>');
      });

      it('mixed modifiers', function() {
        var $el = compile('<div block="tnp-block" mod="{ tnpMod: bool, tnpMod2: text }"></div>')(scope);

        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod tnp-block--tnp-mod2-value"></div>');
      });
    });

    describe('by string', function() {

      it('single modifier', function() {
        var $el = compile('<div block="tnp-block" mod="text"></div>')(scope);

        compare($el, '<div class="ng-scope tnp-block tnp-block--value"></div>');
      });

      it('multiple modifiers', function() {
        scope.text = 'value value2';
        var $el = compile('<div block="tnp-block" mod="text"></div>')(scope);

        compare($el, '<div class="ng-scope tnp-block tnp-block--value tnp-block--value2"></div>');
      });
    });

  });

  describe('insert modifiers in element', function() {

    beforeEach(function() {
      scope.bool = true;
      scope.text = 'value';
    });

    describe('by object', function() {

      it('single bool modifier', function() {
        var $el = compile('<div block="tnp-block"><div elem="tnp-elem" mod="{ tnpMod: bool }"></div></div>')(scope);

        compare($el, '<div class="ng-scope tnp-block"><div class="tnp-block__tnp-elem tnp-block__tnp-elem--tnp-mod"></div></div>');
      });

      it('single string modifier', function() {
        var $el = compile('<div block="tnp-block"><div elem="tnp-elem" mod="{ tnpMod: text }"></div></div>')(scope);

        compare($el, '<div class="ng-scope tnp-block"><div class="tnp-block__tnp-elem tnp-block__tnp-elem--tnp-mod-value"></div></div>');
      });

      it('mixed modifiers', function() {
        var $el = compile('<div block="tnp-block"><div elem="tnp-elem" mod="{ tnpMod: bool, tnpMod2: text }"></div></div>')(scope);

        compare($el, '<div class="ng-scope tnp-block"><div class="tnp-block__tnp-elem tnp-block__tnp-elem--tnp-mod tnp-block__tnp-elem--tnp-mod2-value"></div></div>');
      });
    });

    describe('by string', function() {

      it('single modifier', function() {
        var $el = compile('<div block="tnp-block"><div elem="tnp-elem" mod="text"></div></div>')(scope);

        compare($el, '<div class="ng-scope tnp-block"><div class="tnp-block__tnp-elem tnp-block__tnp-elem--value"></div></div>');
      });

      it('multiple modifiers', function() {
        scope.text = 'value value2';
        var $el = compile('<div block="tnp-block"><div elem="tnp-elem" mod="text"></div></div>')(scope);

        compare($el, '<div class="ng-scope tnp-block"><div class="tnp-block__tnp-elem tnp-block__tnp-elem--value tnp-block__tnp-elem--value2"></div></div>');
      });
    });
  });

  describe('change modifiers', function() {

    describe('by object', function() {

      it('add modifiers', function() {
        scope.mods = {};
        var $el = compile('<div block="tnp-block" mod="mods"></div>')(scope);

        scope.$digest();
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
        var $el = compile('<div block="tnp-block" mod="mods"></div>')(scope);

        scope.$digest();
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

    describe('by string', function() {

      it('add modifiers', function() {
        scope.mods = '';
        var $el = compile('<div block="tnp-block" mod="mods"></div>')(scope);

        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block"></div>');
        scope.mods = 'tnp-mod';
        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod"></div>');
        scope.mods = 'tnp-mod tnp-mod2';
        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod tnp-block--tnp-mod2"></div>');
      });

      it('remove modifiers', function() {
        scope.mods = 'tnp-mod tnp-mod2';
        var $el = compile('<div block="tnp-block" mod="mods"></div>')(scope);

        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod tnp-block--tnp-mod2"></div>');
        scope.mods = 'tnp-mod';
        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod"></div>');
        delete scope.mods;
        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block"></div>');
      });
    });

    describe('by mixed variables', function() {

      it('object to string', function() {
        scope.mods = {};
        var $el = compile('<div block="tnp-block" mod="mods"></div>')(scope);

        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block"></div>');
        scope.mods = 'tnp-mod tnp-mod2';
        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod tnp-block--tnp-mod2"></div>');
      });

      it('string to object', function() {
        scope.mods = 'tnp-mod tnp-mod2';
        var $el = compile('<div block="tnp-block" mod="mods"></div>')(scope);

        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod tnp-block--tnp-mod2"></div>');
        scope.mods = { tnpMod: true, tnpMod2: 'value' };
        scope.$digest();
        compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod tnp-block--tnp-mod2-value"></div>');
      });
    });

  });

  describe('change modifiers when watch disabled', function() {

    it('by scope object', function() {
      scope.mods = { tnpMod: true };
      var $el = compile('<div block="tnp-block" mod="::mods"></div>')(scope);

      scope.$digest();
      compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod"></div>');
      scope.mods.tnpMod = false;
      scope.$digest();
      compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod"></div>');
    });

    it('by inline object', function() {
      scope.isMod = true;
      var $el = compile('<div block="tnp-block" mod="::{ tnpMod: isMod }"></div>')(scope);

      scope.$digest();
      compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod"></div>');
      scope.isMod = false;
      scope.$digest();
      compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod"></div>');
    });

    it('by scope string', function() {
      scope.mods = 'tnpMod';
      var $el = compile('<div block="tnp-block" mod="::mods"></div>')(scope);

      scope.$digest();
      compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod"></div>');
      scope.mods = '';
      scope.$digest();
      compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod"></div>');
    });

    it('by inline string', function() {
      scope.mods = 'tnpMod';
      var $el = compile('<div block="tnp-block" mod="::\'tnpMod\'"></div>')(scope);

      scope.$digest();
      compare($el, '<div class="ng-scope tnp-block tnp-block--tnp-mod"></div>');
    });
  });

});