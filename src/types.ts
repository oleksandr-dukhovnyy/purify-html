export type AttributeRulePresetName =
  | '%correct-link%'
  | '%http-link%'
  | '%https-link%'
  | '%ftp-link%'
  | '%https-link-without-search-params%'
  | '%http-link-without-search-params%'
  | '%same-origin%';

export type AttributeRule = {
  name: string;
  // attribute name

  value?:
    | string
    | string[]
    | RegExp
    | { preset: AttributeRulePresetName }
    | ((attributeValue: string) => boolean);
  // rules for attribute value
};

export type TagRule = {
  name: string;
  // tagname
  attributes: AttributeRule[];
  // rules for attributes
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
