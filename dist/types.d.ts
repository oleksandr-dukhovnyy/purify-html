export type AttributeRulePresetName = '%correct-link%' | '%http-link%' | '%https-link%' | '%ftp-link%' | '%https-link-without-search-params%' | '%http-link-without-search-params%' | '%same-origin%';
export type AttributeRule = {
    name: string;
    value?: string | string[] | RegExp | {
        preset: AttributeRulePresetName;
    } | ((attributeValue: string) => boolean);
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