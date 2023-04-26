/**
 * @typedef AttributeRules
 * @type {object}
 * @property {string} name - name of attribute. See more: {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes Element.attributes}.
 * @property {string | RegExp | Array<string> | { preset: string }} value - rule for tag
 */
/**
 * @typedef TagRule
 * @type {object}
 * @property {string} name - name of tag. See more: {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName tagName}.
 * @property {Array<string | AttributeRules>} attributes - rules for attributes. If set just string like 'class', it`s set allow for use attribute "class" with any value. For details about AttributesItem see [this]{@link AttributeRules}.
 */
/**
 * Purify instance.
 */
export class PurifyHTML {
    /**
     * Create PurifyHTML instance
     * @param {Array<TagRule | string>} allowedTags
     * @default []
     */
    constructor(allowedTags?: Array<TagRule | string>);
    /**
     * @property {bool} removeComments is need to remove comments in root and in all nodes by default
     * @default true
     */
    removeComments: boolean;
    /**
     * Copy and compile a rules
     * @type {Array<TagRule | string>}
     */
    allowedTags: Array<TagRule | string>;
    /**
     * Copy and compile a rules
     */
    whiteList: string[];
    /**
     * Sanitize a string.
     * @param {string} str to needs to sanitize.
     * @return {string} A string cleared according to the rules from this.allowedTags.
     */
    sanitize(str: string): string;
    /**
     * Convert a string to {@link https://www.w3schools.com/html/html_entities.asp HTML Entities}.
     * @param {string} str
     * @return {string} string of HTML Entities.
     */
    toHTMLEntities(str: string): string;
}
export function setParser(customParser?: HTMLParser): number;
export default PurifyHTML;
/**
 * HTMLParser interface
 */
export type HTMLParser = {};
export type AttributeRules = {
    /**
     * - name of attribute. See more: {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes Element.attributes}.
     */
    name: string;
    /**
     * - rule for tag
     */
    value: string | RegExp | Array<string> | {
        preset: string;
    };
};
export type TagRule = {
    /**
     * - name of tag. See more: {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName tagName}.
     */
    name: string;
    /**
     * - rules for attributes. If set just string like 'class', it`s set allow for use attribute "class" with any value. For details about AttributesItem see [this]{@link AttributeRules }.
     */
    attributes: Array<string | AttributeRules>;
};
//# sourceMappingURL=core.d.ts.map