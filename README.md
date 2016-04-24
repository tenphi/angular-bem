# angular-bem

[![Build Status](https://travis-ci.org/tenphi/angular-bem.svg?branch=master)](https://travis-ci.org/tenphi/angular-bem) [![Join the chat at https://gitter.im/tenphi/angular-bem](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/tenphi/angular-bem?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A set of directives to simplify your workflow with [BEM](https://bem.info)-markup in [AngularJS](https://angularjs.org) applications.

## Changelog

### 1.1.0
* New mod-once attribute to bind modifiers without watchers. Note that there is no sense or capability to use `mod` and `mod-once` attributes simultaneously on a single node.
* New bemConfigProvider with following API:
  * #setSeparators(el, mod, value) - Specify class separators for your own syntax approach.
  * #ignoreValues(bool) - If it's true then no value will add to the modifier class name. Use it if you don't need values in your markup and tired of having to write `!!` before modifier values. Default value is `false`.
  * setModCase(modCase) - Specify modifier name case. Use it if you have different naming approach. Posible values: `kebab`, `snake`, `camel`. If you will use the last option the modifier name will not be changed at all. Default value is `kebab`.

### 1.0.0
* New braces-free syntax
* Automatic one-time bindings without additional syntax
* Performance improvements
* New tests

### 0.4.1
* Add test coverage.
* Add one-time binding syntax. (it looks like angular 1.3 one-time binding syntax but it's not the same)
* Fix bugs

### 0.4.0
* Improved performance.

### 0.3.0
* Default syntax changed. ```block__elem--mod-value```
* ```mod``` can now accept array and string with ```space``` delimiter

## Install

```bash
$ bower install angular-bem
```

or

```bash
$ npm install angular-bem
```

## Example
Include this module to your app:

```javascript
angular.module('app', ['tenphi.bem']);
```

Create a simple markup:

```html
<body ng-app="app">
  <div block="my-block" mod="modName: 'value'">
    <div elem="my-element" mod="modName: 'value'; secondModName"></div>
  </div>
</body>
```

It will be transformed into following markup:

```html
<div class="my-block my-block--mod-name-value">
  <div class="my-block__my-element my-block__my-element--mod-name-value my-block__my-element--second-mod-name"></div>
</div>
```

## One-time binding syntax

Note that if you use only mod names in `mod` attribute (without values) then no watchers will be created on this node by `angular-bem`.

```html
<body ng-app="app">
  <div block="my-block" mod="modName"></div>
</body>
```

Use `mod-once` attribute instead of `mod` to prevent watcher creation.

```html
<body ng-app="app">
  <div block="my-block" mod-once="modName: $ctrl.model.modName"></div>
</body>
```

## Syntax customization
Create your own BEM-like syntax:

```javascript
app.config(function(bemConfigProvider) {
  bemConfigProvider.setSeparators('--', '__', '_');
});
```

Now output of previous example will look like:

```html
<div class="my-block my-block__mod-name_value">
  <div class="my-block--my-element my-block--my-element__mod-name_value my-block--my-element__second-mod-name"></div>
</div>
```

## Ignore values
If you don't use values in your markup and tired of having to write `!!` before modifier values you can easily disable value addition.

```javascript
app.config(function(bemConfigProvider) {
  bemConfigProvider.ignoreValues();
});
```

## Change modifier naming
By default modifer name will be converted to `kabeb` case after rendering but you can change it to 'snake' or 'camel' if you use different naming approach. `camel` option will disable transformation at all.

```javascript
app.config(function(bemConfigProvider) {
  bemConfigProvider.setModCase('snake');
});
```


## Need to know
* These directives don't affect scope or other directives. So you can use them at ease wherever you want.
* You can only specify one element or block on single node. This limitation greatly simplify code of module and your app.
* There is **no way** to create an element of parent block **inside** nested block. It's not a component-way. So please avoid it.

## License

[MIT](http://opensource.org/licenses/MIT) © [Andrey Yamanov](http://tenphi.me)
