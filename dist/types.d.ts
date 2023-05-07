export type AttributeRule = {
    name: string;
    value?: string | string[] | RegExp | {
        preset: string;
    };
};
export type TagRule = {
    name: string;
    attributes: AttributeRule[];
    dontRemoveComments?: boolean;
};
export interface HTMLParser {
    parse(html: string): Element;
    stringify(element: Element): string;
}
export interface MarkedElement extends Element {
    _d?: number;
}
export interface presetTestResult {
    remove: boolean;
}
//# sourceMappingURL=types.d.ts.map