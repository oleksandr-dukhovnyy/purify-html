/** @module utils */

/**
 * Remove attribute value, but dont remove attribute.
 * @param {HTMLElement} node
 * @param {string} attributeName
 */
export const removeAttributeValue = (node, attributeName) =>
  node.setAttribute(attributeName, '');

/**
 * Remove all comments in childNodes.
 * Comments in child nodes are not removed
 *
 * @param {HTMLElement} node
 * @returns {undefined | false} undefined - ok, false - error
 */
export const removeComments = node => {
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
 * @param {HTMLElement} node
 * @returns {Array<HTMLElement>} array of node childs sorted by child's max deep
 */
export const getSortedByMaxChildDeep = (() => {
  const markDeep = (node, d = 0) => {
    node._d = d;

    if (node.children.length) {
      [...node.children].forEach(n => markDeep(n, d + 1));
    } else {
      return d;
    }
  };

  return node => {
    markDeep(node);

    return [...node.querySelectorAll('*')].sort((a, b) => b._d - a._d);
  };
})();

/**
 * Normalize a TagRule.
 *
 * @param {TagRule | string} rule
 * @returns {TagRule} see {@link TagRule}
 */
export const transformAttributes = rule => {
  const res = [];

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
 *
 * @param string} str
 * @returns {URL | null}
 */
export const safelyGetLink = str => {
  try {
    return new URL(str);
  } catch (e) {
    return null;
  }
};

/**
 * Add prefix by check
 *
 * @param {string} str
 * @param {RegExp} check
 * @param {string} prefix
 * @returns {string} if check returns true - prefix + str, else str
 */
export const addPrefix = (str, check, prefix) =>
  check.test(str) ? str : prefix + str;

/**
 * Clone an object
 *
 * @param {object} obj
 * @returns {object} cloned obj
 */
export const deepClone = obj => {
  if (Object.prototype.hasOwnProperty.call(globalThis, 'structuredClone'))
    return structuredClone(obj);

  const res = {};

  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      res[key] = deepClone(obj[key]);
    } else {
      res[key] = obj[key];
    }
  }

  return res;
};

/**
 * Create clone of config for safe mutations
 *
 * @param {Array<string | TagRule>} config
 * @returns {Array<string | TagRule>} cloned config
 */
export const copyConfig = config => config.map(deepClone);

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
   *
   * @function
   * @name valuesPresets#%correct-link%
   * @param {string} str
   * @returns {PresetCheckResult}
   */
  '%correct-link%'(str) {
    return {
      remove: safelyGetLink(str) === null,
    };
  },

  /**
   * Check is str a correct link and has HTTP protocol
   *
   * @function
   * @name valuesPresets#%http-link%
   * @param {string} str
   * @returns {PresetCheckResult}
   */
  '%http-link%'(str) {
    const url = safelyGetLink(str);

    return {
      remove: url === null || url.protocol !== 'http:',
    };
  },

  /**
   * Check is str a correct link and has HTTPS protocol
   *
   * @function
   * @name valuesPresets#%https-link%
   * @param {string} str
   * @returns {PresetCheckResult}
   */
  '%https-link%'(str) {
    const url = safelyGetLink(str);

    return {
      remove: url === null || url.protocol !== 'https:',
    };
  },

  /**
   * Check is str a correct link and has FTP protocol
   *
   * @function
   * @name valuesPresets#%ftp-link%
   * @param {string} str
   * @returns {PresetCheckResult}
   */
  '%ftp-link%'(str) {
    const url = safelyGetLink(str);

    return {
      remove: url === null || url.protocol !== 'ftp:',
    };
  },

  /**
   * Check is str a correct link and has HTTPS protocol and does not have a params
   *
   * @function
   * @name valuesPresets#%https-link-without-search-params%
   * @param {string} str
   * @returns {PresetCheckResult}
   */
  '%https-link-without-search-params%'(str) {
    const url = safelyGetLink(str);

    return {
      remove: url === null || url.search !== '' || url.protocol !== 'https:',
    };
  },

  /**
   * Check is str a correct link and has HTTP protocol and does not have a params
   *
   * @function
   * @name valuesPresets#%http-link-without-search-params%
   * @param {string} str
   * @returns {PresetCheckResult}
   */
  '%http-link-without-search-params%'(str) {
    const url = safelyGetLink(str);

    return {
      remove: url === null || url.search !== '' || url.protocol !== 'http:',
    };
  },

  /**
   * Check is str a correct link and has same origin with current `location.origin`
   *
   * @function
   * @name valuesPresets#%same-origin%
   * @param {string} str
   * @returns {PresetCheckResult}
   */
  '%same-origin%'(str) {
    const url = safelyGetLink(str);

    return {
      remove: url === null || globalThis.location.origin !== url.origin,
    };
  },
};
