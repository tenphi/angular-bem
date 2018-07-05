import { NgModule, Directive, Attribute, Renderer2, Input, ElementRef } from '@angular/core';

export class BemConfig {
  separators?: Array<string>;
  ignoreValues?: boolean;
  modCase?: string;
}

const separators = {
  el: '__',
  mod: '--',
  val: '-'
};
let ignoreValues = false;
let modCase = 'kebab';

function modNameHandler(str: string): string {
  switch (modCase) {
    case 'kebab':
      return str ? str.replace(/[A-Z]/g, function(s) {return '-' + s.toLowerCase(); }).replace(/$\-/, '') : '';
    case 'snake':
      return str ? str.replace(/[A-Z]/g, function(s) {return '_' + s.toLowerCase(); }).replace(/$\-/, '') : '';
    default:
      return str;
  }
}

function generateClass(blockName: string, elemName?: string, modName?: string, modValue?: boolean | string) {
  if (ignoreValues) {
    modValue = !!modValue;
  }

  if (typeof modValue !== 'string' && typeof modValue !== 'boolean') {
    modValue = !!modValue;
  }

  let cls = blockName;

  if (elemName) {
    cls += separators.el + elemName;
  }

  if (modName) {
    modName = modNameHandler(modName);
    cls += separators.mod + modName;
    if (typeof(modValue) !== 'boolean' && modValue != null) {
      cls += separators.val + modValue;
    }
  }

  return cls;
}

function parseMods(mods: string | string[] | object) {
  if (typeof mods === 'string') {
    mods = mods.split(/\s+/);
  }

  if (Array.isArray(mods)) {
    let arr = mods;

    mods = {};

    arr.forEach(key => {
      mods[key] = true;
    });
  } else if (typeof mods !== 'object') {
    return {};
  }

  return mods;
}

function setMods(blockName: string, elemName: string, mods: object, oldMods: object, element: ElementRef, renderer: Renderer2) {
  Object.keys(mods).forEach(key => {
    if (oldMods[key]) {
      if (mods[key] === oldMods[key]) {
        return;
      }

      renderer.removeClass(element.nativeElement, generateClass(blockName, elemName, key, oldMods[key]));
    }

    if (mods[key]) {
      renderer.addClass(element.nativeElement, generateClass(blockName, elemName, key, mods[key]));
    }
  });

  Object.keys(oldMods).forEach(key => {
    if (!(key in mods) && oldMods[key]) {
      renderer.removeClass(element.nativeElement, generateClass(blockName, elemName, key, oldMods[key]));
    }
  });
}

@Directive({
  selector: '[block]',
})
export class BlockDirective {
  public element: ElementRef;
  public renderer: Renderer2;
  public name: string;
  @Input() public mod: string | string[] | object;
  private _mods: Object;
  private _modSerialized: string;

  constructor(element: ElementRef,
              renderer: Renderer2,
              @Attribute('block') name: string) {

    this.name = name;
    this.element = element;
    this.renderer = renderer;

    renderer.addClass(element.nativeElement, generateClass(name));
  }

  ngOnChanges() {
    if (JSON.stringify(this.mod) !== this._modSerialized) {
      this._modSerialized = JSON.stringify(this.mod);

      let mods = this.mod;

      let {renderer, element, name} = this;

      mods = parseMods(mods);

      setMods(name, '', mods, this._mods || {}, element, renderer);

      this._mods = this._mods === mods ? Object.assign({}, mods) : mods;
    }
  }
}

@Directive({
  selector: '[elem]',
})
export class ElemDirective {
  public element: ElementRef;
  public renderer: Renderer2;
  public blockName: string;
  public name: string;
  @Input() public mod: string | string[] | object;
  private _mods: Object;
  private _modSerialized: string;

  constructor(element: ElementRef,
              renderer: Renderer2,
              @Attribute('elem') name: string,
              block: BlockDirective) {

    this.blockName = block.name;
    this.name = name;
    this.element = element;
    this.renderer = renderer;

    renderer.addClass(element.nativeElement, generateClass(block.name, name));
  }

  ngOnChanges() {
    if (JSON.stringify(this.mod) !== this._modSerialized) {
      this._modSerialized = JSON.stringify(this.mod);

      let mods = this.mod;

      let {renderer, element, blockName, name} = this;

      mods = parseMods(mods);

      setMods(blockName, name, mods, this._mods || {}, element, renderer);

      this._mods = this._mods === mods ? Object.assign({}, mods) : mods;
    }
  }
}

@Directive({
  selector: '[mod]',
})
export class ModDirective {}

@NgModule({
  declarations: [
    BlockDirective,
    ElemDirective,
    ModDirective,
  ],
  exports: [
    BlockDirective,
    ElemDirective,
    ModDirective,
  ]
})
export class BemModule {
  static config(data: BemConfig) {
    if (!data) {
      return BemModule;
    }

    if (data.separators) {
      separators.el = data.separators[0] || '__';
      separators.mod = data.separators[1] || '--';
      separators.val = data.separators[2] || '-';
    }

    if ('ignoreValues' in data) {
      ignoreValues = !!data.ignoreValues;
    }

    if (data.modCase) {
      if (!~['kebab', 'camel', 'snake'].indexOf(data.modCase)) {
        throw 'Wrong mod case. You can use only these cases: kebab, snake, camel';
      }

      modCase = data.modCase;
    }

    return BemModule;
  }
}
