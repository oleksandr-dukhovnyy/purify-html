export type AttributeRule = {
  name: string;
  // attribute name

  value?: string | string[] | RegExp | { preset: string };
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
