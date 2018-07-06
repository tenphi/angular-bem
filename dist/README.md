# angular-bem

A set of directives to simplify your workflow with [BEM](https://bem.info)-markup in [Angular](https://angularjs.org) (v2+) applications.

[ANGULAR 1.X VERSION IS HERE](https://github.com/tenphi/angular-bem/tree/v1)

## Changelog

### 2.1.0
* Support for Angular v6+
* Refactoring

### 2.0.0
* Initial release for Angular v2+

## Install

```bash
$ npm install angular-bem
```

## Example
Import this module to your app:

```javascript
import { BemModule } from 'angular-bem';

@NgModule({
  imports: [ BemModule ]
})
export class AppModule {}
```

Now anywhere in your app you can use following syntax:

```html
<div block="my-block" mod="modName">
  <div elem="my-element" mod="modName secondModName"></div>
</div>
```

or

```html
<div block="my-block" [mod]="{ modName: true }">
  <div elem="my-element" [mod]="{ modName: true, secondModName: true }"></div>
</div>
```

Instead of `true` you can use any property from the component. Value `true` will add mod to the block (or elem) and `false` will remove it.

As a result of module's work the following markup may be produced:

```html
<div class="my-block my-block--mod-name">
  <div class="my-block__my-element my-block__my-element--mod-name my-block__my-element--second-mod-name"></div>
</div>
```

If you use `string` or `number` as a value then this value will be used as addition for the mod class like `my-block__my-element--mod-name-value`.

## Configuration

You can change module behaviour with BemConfig:

```javascript
import { BemModule } from 'angular-bem';

BemModule.config({
  separators: ['__', '--', '-'], // el / mod / val separators
  modCase: 'kebab', // case of modifiers names
  ignoreValues: false // cast mod values to booleans
}); // method returns BemModule
```

It is recommended to set `ignoreValues` to `true` but it is set to `false` by default to support traditional bem-syntax.

## Need to know
* These directives don't affect scope or other directives. So you can use them at ease wherever you want.
* You can only specify one element or block on single node. This limitation greatly simplify code of module and your app.
* There is **no way** to create an element of parent block **inside** nested block. It's not a component-way. So please avoid it.

## License

[MIT](http://opensource.org/licenses/MIT) © [Andrey Yamanov](http://tenphi.me)
