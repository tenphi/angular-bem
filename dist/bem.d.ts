export declare class BemConfig {
    separators?: Array<string>;
    ignoreValues?: boolean;
    modCase?: string;
}
export declare class BemModule {
    static config(data: BemConfig): typeof BemModule;
}
