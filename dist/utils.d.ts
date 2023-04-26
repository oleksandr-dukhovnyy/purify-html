export function removeAttributeValue(node: HTMLElement, attributeName: string): void;
export function removeComments(node: HTMLElement): undefined | false;
export function getSortedByMaxChildDeep(node: any): any[];
export function transformAttributes(rule: TagRule | string): TagRule;
export function safelyGetLink(str: any): URL | null;
export function addPrefix(str: string, check: RegExp, prefix: string): string;
export function deepClone(obj: object): object;
export function copyConfig(config: Array<string | TagRule>): Array<string | TagRule>;
/**
 * @typedef PresetCheckResult
 * @type {object}
 * @property {boolean} remove if true - attribute value is incorrect
 */
/**
 * Interface for pressets.
 *
 * @interface
 */
export const valuesPresets: {
    /**
     * Check is str a correct link
     *
     * @function
     * @name valuesPresets#%correct-link%
     * @param {string} str
     * @returns {PresetCheckResult}
     */
    '%correct-link%'(str: string): PresetCheckResult;
    /**
     * Check is str a correct link and has HTTP protocol
     *
     * @function
     * @name valuesPresets#%http-link%
     * @param {string} str
     * @returns {PresetCheckResult}
     */
    '%http-link%'(str: string): PresetCheckResult;
    /**
     * Check is str a correct link and has HTTPS protocol
     *
     * @function
     * @name valuesPresets#%https-link%
     * @param {string} str
     * @returns {PresetCheckResult}
     */
    '%https-link%'(str: string): PresetCheckResult;
    /**
     * Check is str a correct link and has FTP protocol
     *
     * @function
     * @name valuesPresets#%ftp-link%
     * @param {string} str
     * @returns {PresetCheckResult}
     */
    '%ftp-link%'(str: string): PresetCheckResult;
    /**
     * Check is str a correct link and has HTTPS protocol and does not have a params
     *
     * @function
     * @name valuesPresets#%https-link-without-search-params%
     * @param {string} str
     * @returns {PresetCheckResult}
     */
    '%https-link-without-search-params%'(str: string): PresetCheckResult;
    /**
     * Check is str a correct link and has HTTP protocol and does not have a params
     *
     * @function
     * @name valuesPresets#%http-link-without-search-params%
     * @param {string} str
     * @returns {PresetCheckResult}
     */
    '%http-link-without-search-params%'(str: string): PresetCheckResult;
    /**
     * Check is str a correct link and has same origin with current `location.origin`
     *
     * @function
     * @name valuesPresets#%same-origin%
     * @param {string} str
     * @returns {PresetCheckResult}
     */
    '%same-origin%'(str: string): PresetCheckResult;
};
export type PresetCheckResult = {
    /**
     * if true - attribute value is incorrect
     */
    remove: boolean;
};
//# sourceMappingURL=utils.d.ts.map