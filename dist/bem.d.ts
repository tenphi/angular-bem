import { ElementRef, Renderer } from '@angular/core';
export declare class Block {
    element: ElementRef;
    renderer: Renderer;
    name: string;
    mod: any;
    private _mods;
    private _modSerialized;
    constructor(element: ElementRef, renderer: Renderer, name: string);
    ngOnChanges(): void;
}
export declare class Elem {
    element: ElementRef;
    renderer: Renderer;
    blockName: string;
    name: string;
    mod: any;
    private _mods;
    private _modSerialized;
    constructor(element: ElementRef, renderer: Renderer, name: string, block: Block);
    ngOnChanges(): void;
}
