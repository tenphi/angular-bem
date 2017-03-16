import { NgModule, Directive, Attribute, ElementRef, Renderer } from '@angular/core';

export class BemConfig {
  separators?: Array<string>
  ignoreValues?: boolean
  modCase?: string
  blockPrefix?: string
}

const separators = {
  el: '__',
  mod: '--',
  val: '-'
};
var ignoreValues = false;
var modCase = 'kebab';
var blockPrefix = '';

function modNameHandler(str) {
  switch(modCase) {
    case 'kebab':
      return str ? str.replace(/[A-Z]/g, function(s) {return '-' + s.toLowerCase() }).replace(/$\-/, '') : '';
    case 'snake':
      return str ? str.replace(/[A-Z]/g, function(s) {return '_' + s.toLowerCase() }).replace(/$\-/, '') : '';
    default:
      return str;
  }
}

function generateClass(blockName: string, elemName?: string, modName?: string, modValue?) {
  if (ignoreValues) {
    modValue = !!modValue;
  }

  blockName = blockName;
  elemName = elemName;
  modName = modNameHandler(modName);

  if (typeof modValue !== 'string' && typeof modValue !== 'boolean') {
    modValue = !!modValue;
  }

  let cls = blockPrefix + blockName;

  if (elemName) {
    cls += separators.el + elemName;
  }

  if (modName) {
    cls += separators.mod + modName;
    if (typeof(modValue) !== 'boolean' && modValue != null) {
      cls += separators.val + modValue;
    }
  }

  return cls;
}

function parseMods(mods) {
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

function setMods(blockName, elemName, mods, oldMods, element, renderer) {
  Object.keys(mods).forEach(key => {
    if (oldMods[key]) {
      if (mods[key] === oldMods[key]) return;

      renderer.setElementClass(element.nativeElement, generateClass(blockName, elemName, key, oldMods[key]), false);
    }

    if (mods[key]) {
      renderer.setElementClass(element.nativeElement, generateClass(blockName, elemName, key, mods[key]), true);
    }
  });

  Object.keys(oldMods).forEach(key => {
    if (!(key in mods) && oldMods[key]) {
      renderer.setElementClass(element.nativeElement, generateClass(blockName, elemName, key, oldMods[key]), false);
    }
  });
}

@Directive({
  selector: '[block]',
  inputs: ['mod']
})
class Block {
  public element: ElementRef;
  public renderer: Renderer;
  public name: string;
  public mod;
  private _mods: Object;
  private _modSerialized: string;

  constructor(element: ElementRef,
              renderer: Renderer,
              @Attribute('block') name: string) {

    this.name = name;
    this.element = element;
    this.renderer = renderer;

    renderer.setElementClass(element.nativeElement, generateClass(name), true);
  };

  ngOnChanges() {
    if (JSON.stringify(this.mod) !== this._modSerialized) {
      this._modSerialized = JSON.stringify(this.mod);

      let mods = this.mod;

      let {renderer, element, name} = this;

      mods = parseMods(mods);

      setMods(name, null, mods, this._mods || {}, element, renderer);

      this._mods = this._mods === mods ? Object.assign({}, mods) : mods;
    }
  }
}

@Directive({
  selector: '[elem]',
  inputs: ['mod']
})
class Elem {
  public element: ElementRef;
  public renderer: Renderer;
  public blockName: string;
  public name: string;
  public mod;
  private _mods: Object;
  private _modSerialized;

  constructor(element: ElementRef,
              renderer: Renderer,
              @Attribute('elem') name: string,
              block: Block) {

    this.blockName = block.name;
    this.name = name;
    this.element = element;
    this.renderer = renderer;

    renderer.setElementClass(element.nativeElement, generateClass(block.name, name), true);
  };

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

@NgModule({
  declarations: [
    Block,
    Elem
  ],
  exports: [
    Block,
    Elem
  ]
})
export class BemModule {
  static config(data: BemConfig) {
    if (!data) return BemModule;

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

    if (data.blockPrefix) {
      blockPrefix = data.blockPrefix
    }

    return BemModule;
  }
};
