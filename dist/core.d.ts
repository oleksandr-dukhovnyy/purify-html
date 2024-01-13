/** @module core */
import { TagRule, HTMLParser } from './types';
/**
 * Purify instance.
 */
export declare class PurifyHTML {
    /**
     * Create PurifyHTML instance
     */
    /**
     * Is need to remove comments in root and in all nodes by default
     */
    protected removeComments: boolean;
    protected allowedTags: {
        [key: string]: TagRule;
    };
    protected whiteList: string[];
    constructor(allowedTags?: TagRule[] | string[]);
    /**
     * Sanitize a string.
     * @param {string} str to needs to sanitize.
     * @return {string} A string cleared according to the rules from this.allowedTags.
     */
    sanitize(str: string): string;
    /**
     * Convert a string to {@link https://www.w3schools.com/html/html_entities.asp HTML Entities}.
     */
    toHTMLEntities(str: string): string;
}
/**
 * Set HTML custom parser
 */
export declare const setParser: (customParser: HTMLParser | null | undefined) => number;
export default PurifyHTML;
//# sourceMappingURL=core.d.ts.map