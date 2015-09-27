# angular-bem

[![Join the chat at https://gitter.im/tenphi/angular-bem](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/tenphi/angular-bem?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A set of directives to simplify your workflow with [BEM](https://bem.info)-markup in [Angular](https://angularjs.org)-based applications.

## Changelog

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
  <div block="my-block" mod="{ modName: 'value' }">
    <div elem="my-element" mod="{ modName: 'value', secondModName: true }"></div>
  </div>
</body>
```

It will be transformed into following markup:

```html
<div class="my-block my-block--mod-name_value">
  <div class="my-block__my-element my-block__my-element--mod-name_value my-block__my-element--second-mod-name"></div>
</div>
```

## Customization
Create your own BEM-like syntax:

```javascript
app.config(function(bemConfigProvider) {
  bemConfigProvider.generateClass = function generateClass(blockName, elemName, modName, modValue) {
    var cls = blockName;

    if (elemName != null) {
      cls += '--' + elemName;
    }

    if (modName != null) {
      cls = '~' + modName;
      if ((typeof(modValue) !== 'boolean' && modValue != null)) {
        cls += '-' + modValue;
      }
    }

    return cls;
  };
});
```

Now output of previous example will look like:

```html
<div class="my-block ~mod-name-value">
  <div class="my-block--my-element ~mod-name-value ~second-mod-name"></div>
</div>
```


## Need to know
* These directives don't use isolated scope. So you can freely use them in various cases even in templates of directives with `replace` option.
* You can only specify one element or block in one node. This limitation greatly simplify code of module and your app. Anyway this is **BEM** good practice so you should follow it.
* There is **no way** to create an element of parent block **inside** nested block.

## License

[MIT](http://opensource.org/licenses/MIT) © [Andrey Yamanov](http://tenphi.me)
