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
* These directives don't use isolated scope. So you can freely use them in various cases even in templates of directives with `replace` option.
* You can specify multiple elements in one node: `<div element="my-element my-second-element"></div>`
* You can use `mods` with blocks too.
* You can specify elements of parent block and nested block in one node. `<div block="my-block"><div block="nested-block" element="my-element"></div></div>`
* There is **no way** to create an element of parent node **inside** nested block.

## License

[MIT](http://opensource.org/licenses/MIT) © [Andrey Yamanov](http://tenphi.me)
