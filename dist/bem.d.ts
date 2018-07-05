import { Renderer2, ElementRef } from '@angular/core';
export declare class BemConfig {
    separators?: Array<string>;
    ignoreValues?: boolean;
    modCase?: string;
}
export declare class BlockDirective {
    element: ElementRef;
    renderer: Renderer2;
    name: string;
    mod: string | string[] | object;
    private _mods;
    private _modSerialized;
    constructor(element: ElementRef, renderer: Renderer2, name: string);
    ngOnChanges(): void;
}
export declare class ElemDirective {
    element: ElementRef;
    renderer: Renderer2;
    blockName: string;
    name: string;
    mod: string | string[] | object;
    private _mods;
    private _modSerialized;
    constructor(element: ElementRef, renderer: Renderer2, name: string, block: BlockDirective);
    ngOnChanges(): void;
}
export declare class ModDirective {
}
export declare class BemModule {
    static config(data: BemConfig): typeof BemModule;
}
