/** @module utils */
import {
  AttributeRule,
  TagRule,
  presetTestResult,
  MarkedElement,
} from './types';

/**
 * Remove attribute value, but dont remove attribute.
 */
export const removeAttributeValue = (node: Element, attributeName: string) =>
  node.setAttribute(attributeName, '');

/**
 * Remove all comments in childNodes.
 * Comments in child nodes are not removed
 *
 * @param {HTMLElement} node
 * @returns {undefined | false} undefined - ok, false - error
 */
export const removeComments = (node: Element): undefined | false => {
  if ('childNodes' in node) {
    for (
      let childIndex = 0;
      childIndex < node.childNodes.length;
      childIndex++
    ) {
      if (node.childNodes[childIndex].nodeType === 8) {
        node.childNodes[childIndex].remove();
      }
    }
  } else {
    return false;
  }
};

/**
 * @param {Element} node
 * @returns {Element[]} array of node childs sorted by child's max deep
 */
export const getSortedByMaxChildDeep = (() => {
  const markDeep = (node: MarkedElement, d = 0): number | undefined => {
    node._d = d;

    if (node.children.length) {
      [...node.children].forEach(n => markDeep(n, d + 1));
    } else {
      return d;
    }
  };

  return (node: Element): Element[] => {
    markDeep(node);

    return [...node.querySelectorAll('*')]
      .sort((a: MarkedElement, b: MarkedElement) => b._d - a._d)
      .map((el: MarkedElement): Element => {
        delete el._d;

        return el;
      });
  };
})();

/**
 * Normalize a TagRule.
 */
export const transformAttributes = (rule: TagRule): TagRule => {
  const res: AttributeRule[] = [];

  if (!Object.prototype.hasOwnProperty.call(rule, 'attributes')) {
    rule.attributes = [];
  }

  rule.attributes.forEach(attr => {
    switch (typeof attr) {
      case 'string':
        res.push({ name: attr });
        break;

      case 'object':
        res.push(attr);
        break;
    }
  });

  rule.attributes = res;

  return rule;
};

/**
 * Safely get link with try...catch.
 */
export const safelyGetLink = (str: string): URL | null => {
  try {
    return new URL(str);
  } catch (e) {
    return null;
  }
};

/**
 * Add prefix by check
 *
 * @returns {string} if check returns true - prefix + str, else str
 */
export const addPrefix = (str: string, check: RegExp, prefix: string) =>
  check.test(str) ? str : prefix + str;

/**
 * Deep clone an object
 */
export const deepClone = <T>(item: T): T => {
  if (typeof item === 'string') return item;
  if (Array.isArray(item))
    return item.map(arrItem => deepClone(arrItem)) as unknown as T;

  if (typeof item === 'object' && item !== null) {
    const res: Record<string, unknown> = {};

    for (const key in item) {
      if (item[key] instanceof RegExp) {
        res[key] = item[key];
      } else if (typeof item[key] === 'object') {
        res[key] = deepClone(item[key]);
      } else {
        res[key] = item[key];
      }
    }

    return res as T;
  }

  return item;
};

/**
 * Create clone of config for safe mutations
 *
 * @param {string[] | TagRule[]} config
 * @returns {string[] | TagRule[]} cloned config
 */
export const copyConfig = (
  config: (string | TagRule)[]
): (string | TagRule)[] => config.map(deepClone);

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
export const valuesPresets = {
  /**
   * Check is str a correct link
   */
  '%correct-link%'(str: string): presetTestResult {
    return {
      remove: safelyGetLink(str) === null,
    };
  },

  /**
   * Check is str a correct link and has HTTP protocol
   */
  '%http-link%'(str: string): presetTestResult {
    const url = safelyGetLink(str);

    return {
      remove: url === null || url.protocol !== 'http:',
    };
  },

  /**
   * Check is str a correct link and has HTTPS protocol
   */
  '%https-link%'(str: string): presetTestResult {
    const url = safelyGetLink(str);

    return {
      remove: url === null || url.protocol !== 'https:',
    };
  },

  /**
   * Check is str a correct link and has FTP protocol
   */
  '%ftp-link%'(str: string): presetTestResult {
    const url = safelyGetLink(str);

    return {
      remove: url === null || url.protocol !== 'ftp:',
    };
  },

  /**
   * Check is str a correct link and has HTTPS protocol and does not have a params
   *
   * @function
   */
  '%https-link-without-search-params%'(str: string): presetTestResult {
    const url = safelyGetLink(str);

    return {
      remove: url === null || url.search !== '' || url.protocol !== 'https:',
    };
  },

  /**
   * Check is str a correct link and has HTTP protocol and does not have a params
   */
  '%http-link-without-search-params%'(str: string): presetTestResult {
    const url = safelyGetLink(str);

    return {
      remove: url === null || url.search !== '' || url.protocol !== 'http:',
    };
  },

  /**
   * Check is str a correct link and has same origin with current `location.origin`
   */
  '%same-origin%'(str: string): presetTestResult {
    const url = safelyGetLink(str);

    return {
      remove: url === null || globalThis.location.origin !== url.origin,
    };
  },
};
