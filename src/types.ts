// Presets are deprecated
export type AttributeRulePresetName =
  | '%correct-link%'
  | '%http-link%'
  | '%https-link%'
  | '%ftp-link%'
  | '%https-link-without-search-params%'
  | '%http-link-without-search-params%'
  | '%same-origin%';

export type AttributeRule = {
  // attribute name
  name: string;

  // rules for attribute value
  value?:
    | string
    | string[]
    | RegExp
    | { preset: AttributeRulePresetName }
    | ((attributeValue: string) => boolean);
};

export type TagRule = {
  // tagname
  name: string;

  // rules for attributes
  attributes: AttributeRule[];

  // comments control
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
