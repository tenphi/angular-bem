import { NgModule, Directive, Attribute, ElementRef, Renderer } from '@angular/core';

function toKebabCase(str) {
  return str ? str.replace(/[A-Z]/g, s => '-' + s.toLowerCase()).replace(/$\-/, '') : '';
}

function generateClass(blockName: string, elemName?: string, modName?: string, modValue?) {
  blockName = blockName;
  elemName = elemName;
  modName = toKebabCase(modName);

  if (typeof modValue !== 'string' && typeof modValue !== 'boolean') {
    modValue = !!modValue;
  }

  let cls = blockName;

  if (elemName) {
    cls += '__' + elemName;
  }

  if (modName) {
    cls += '--' + modName;
    if (typeof(modValue) !== 'boolean' && modValue != null) {
      cls += '-' + modValue;
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
export class BemModule {}
