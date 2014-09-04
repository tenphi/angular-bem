# angular-bem

A set of directives to simplify your workflow with [BEM](https://bem.info)-markup in [Angular](https://angularjs.org)-based applications.

## Install

```bash
$ bower install angular-bem
```

## Example
Include this module to your app:

```javascript
angular.module('app', ['tenphi.bem']);
```

Create a simple markup:

```html
<body ng-app="app">
  <div block="my-block">
    <div element="my-element" mods="{ myMod: 'my-value'}"></div>
  </div>
</body>
```

It will be transformed into following markup:

```html
<div class="my-block">
  <div class="my-block__my-element my-block__my-element_my-mod_my-value"></div>
</div>
```

## Need to know
Those directives don't use isolated scope. So you can freely use them in various cases even in templates of directives with `replace` option.

## License

[MIT](http://opensource.org/licenses/MIT) © [Andrey Yamanov](http://tenphi.me)