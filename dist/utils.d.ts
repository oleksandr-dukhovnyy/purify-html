/** @module utils */
import { TagRule, presetTestResult, HTMLParser } from './types';
/**
 * Setup default parser
 */
export declare const getDefaultParser: () => HTMLParser;
/**
 * Remove attribute value, but dont remove attribute.
 */
export declare const removeAttributeValue: (node: Element, attributeName: string) => void;
/**
 * Remove all comments in childNodes.
 * Comments in child nodes are not removed
 *
 * @param {HTMLElement} node
 * @returns {undefined | false} undefined - ok, false - error
 */
export declare const removeComments: (node: Element) => undefined | false;
/**
 * @param {Element} node
 * @returns {Element[]} array of node childs sorted by child's max deep
 */
export declare const getSortedByMaxChildDeep: (node: Element) => Element[];
/**
 * Normalize a TagRule.
 */
export declare const transformAttributes: (rule: TagRule) => TagRule;
/**
 * Safely get link with try...catch.
 */
export declare const safelyGetLink: (str: string) => URL | null;
/**
 * Add prefix by check
 *
 * @returns {string} if check returns true - prefix + str, else str
 */
export declare const addPrefix: (str: string, check: RegExp, prefix: string) => string;
/**
 * Deep clone an object
 */
export declare const deepClone: <T>(item: T) => T;
/**
 * Create clone of config for safe mutations
 *
 * @param {string[] | TagRule[]} config
 * @returns {string[] | TagRule[]} cloned config
 */
export declare const copyConfig: (config: (string | TagRule)[]) => (string | TagRule)[];
/**
 * @typedef PresetCheckResult
 * @type {object}
 * @property {boolean} remove if true - attribute value is incorrect
 */
export declare const valuesPresets: {
    /**
     * Check is str a correct link
     */
    '%correct-link%'(str: string): presetTestResult;
    /**
     * Check is str a correct link and has HTTP protocol
     */
    '%http-link%'(str: string): presetTestResult;
    /**
     * Check is str a correct link and has HTTPS protocol
     */
    '%https-link%'(str: string): presetTestResult;
    /**
     * Check is str a correct link and has FTP protocol
     */
    '%ftp-link%'(str: string): presetTestResult;
    /**
     * Check is str a correct link and has HTTPS protocol and does not have a params
     *
     * @function
     */
    '%https-link-without-search-params%'(str: string): presetTestResult;
    /**
     * Check is str a correct link and has HTTP protocol and does not have a params
     */
    '%http-link-without-search-params%'(str: string): presetTestResult;
    /**
     * Check is str a correct link and has same origin with current `location.origin`
     */
    '%same-origin%'(str: string): presetTestResult;
};
export declare function presetsDeprecationAlert(): void;
//# sourceMappingURL=utils.d.ts.map