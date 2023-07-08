(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["PurifyHTML"] = factory();
	else
		root["PurifyHTML"] = factory();
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core.ts":
/*!*********************!*\
  !*** ./src/core.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PurifyHTML": function() { return /* binding */ PurifyHTML; },
/* harmony export */   "setParser": function() { return /* binding */ setParser; }
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");

let parser = (() => {
    const elem = new DOMParser()
        .parseFromString('', 'text/html')
        .querySelector('body');
    return {
        parse(string) {
            elem.innerHTML = string;
            return elem;
        },
        stringify(elem) {
            return elem.innerHTML;
        },
    };
})();
/**
 * Purify instance.
 */
class PurifyHTML {
    /**
     * Create PurifyHTML instance
     */
    /**
     * Is need to remove comments in root and in all nodes by default
     */
    removeComments = true;
    allowedTags;
    whiteList;
    constructor(allowedTags = []) {
        /**
         * Copy and compile a rules
         */
        this.allowedTags = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.copyConfig)(allowedTags).reduce((acc, curr) => {
            switch (typeof curr) {
                case 'string': {
                    if (curr === '#comments') {
                        this.removeComments = false;
                    }
                    else {
                        acc[curr] = Object.assign(acc[curr] || {}, {});
                    }
                    break;
                }
                case 'object':
                    acc[curr.name] = Object.assign(acc[curr.name] || {}, (0,_utils__WEBPACK_IMPORTED_MODULE_0__.transformAttributes)(curr));
            }
            return acc;
        }, {});
        /**
         * Copy and compile a rules
         */
        this.whiteList = Object.keys(this.allowedTags);
        /**
         * Bind context for method sanitize
         */
        this.sanitize.bind(this);
    }
    /**
     * Sanitize a string.
     * @param {string} str to needs to sanitize.
     * @return {string} A string cleared according to the rules from this.allowedTags.
     */
    sanitize(str) {
        const wrapper = parser.parse(str);
        if (this.removeComments) {
            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.removeComments)(wrapper);
        }
        const allItems = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getSortedByMaxChildDeep)(wrapper);
        allItems.forEach((tag) => {
            const name = tag.tagName.toLowerCase();
            if (this.whiteList.includes(name)) {
                const tagConfig = this.allowedTags[name];
                if (this.removeComments && tagConfig.dontRemoveComments !== true) {
                    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.removeComments)(tag);
                }
                if (Object.prototype.hasOwnProperty.call(tagConfig, 'attributes') &&
                    tagConfig.attributes.length > 0) {
                    const deleteList = [];
                    const clearList = [];
                    for (let i = 0; i < tag.attributes.length; i++) {
                        const attr = tag.attributes[i];
                        // get attribute rules
                        const attributeRules = tagConfig.attributes.find((attrRule) => attrRule.name === attr.name);
                        if (!attributeRules) {
                            // if rules not defined
                            deleteList.push(attr.name);
                        }
                        else if (Object.prototype.hasOwnProperty.call(attributeRules, 'value')) {
                            // if rules defined
                            if (typeof attributeRules.value === 'string') {
                                if (attr.value !== attributeRules.value) {
                                    // if rules is string
                                    clearList.push(attr.name);
                                }
                            }
                            else if (attributeRules.value instanceof RegExp) {
                                // if rules is regexp
                                if (!attributeRules.value.test(attr.value)) {
                                    clearList.push(attr.name);
                                }
                            }
                            else if (Array.isArray(attributeRules.value)) {
                                // if rules is an array (an array of strings - valid values)
                                if (!attributeRules.value.includes(attr.value)) {
                                    clearList.push(attr.name);
                                }
                            }
                            else if (typeof attributeRules.value === 'object') {
                                if (Object.prototype.hasOwnProperty.call(attributeRules.value, 'preset')) {
                                    // if rules is preset
                                    if (Object.prototype.hasOwnProperty.call(_utils__WEBPACK_IMPORTED_MODULE_0__.valuesPresets, attributeRules.value.preset)) {
                                        const presetRes = _utils__WEBPACK_IMPORTED_MODULE_0__.valuesPresets[attributeRules.value.preset](attr.value);
                                        if (presetRes.remove) {
                                            clearList.push(attr.name);
                                        }
                                    }
                                    else {
                                        clearList.push(attr.name);
                                    }
                                }
                                else {
                                    // remove attribute if get empty object
                                    clearList.push(attr.name);
                                }
                            }
                            else {
                                // remove attribute value by default
                                clearList.push(attr.name);
                            }
                        }
                    }
                    deleteList.forEach((attrName) => tag.removeAttribute(attrName));
                    clearList.forEach((attrName) => (0,_utils__WEBPACK_IMPORTED_MODULE_0__.removeAttributeValue)(tag, attrName));
                }
                else {
                    const deleteList = [];
                    for (let i = 0; i < tag.attributes.length; i++) {
                        deleteList.push(tag.attributes[i].name);
                    }
                    deleteList.forEach((attrName) => tag.removeAttribute(attrName));
                }
            }
            else {
                if (this.removeComments) {
                    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.removeComments)(tag);
                }
                tag.insertAdjacentHTML('afterend', tag.innerHTML);
                tag.remove();
            }
        });
        return parser.stringify(wrapper);
    }
    /**
     * Convert a string to {@link https://www.w3schools.com/html/html_entities.asp HTML Entities}.
     */
    toHTMLEntities(str) {
        return str
            .split('')
            .map(n => `&#${n.charCodeAt(0)};`)
            .join('');
    }
}
/**
 * Set HTML custom parser
 */
const setParser = (customParser) => {
    if (!customParser) {
        console.error('customParser is null!');
        return 0;
    }
    if (!Object.prototype.hasOwnProperty.call(customParser, 'parse')) {
        console.error('cannot to find method "parse" in custom parser!', customParser);
        return 0;
    }
    if (!Object.prototype.hasOwnProperty.call(customParser, 'stringify')) {
        console.error('cannot to find method "stringify" in custom parser!', customParser);
        return 0;
    }
    parser = customParser;
    return 1;
};
/* harmony default export */ __webpack_exports__["default"] = (PurifyHTML);


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addPrefix": function() { return /* binding */ addPrefix; },
/* harmony export */   "copyConfig": function() { return /* binding */ copyConfig; },
/* harmony export */   "deepClone": function() { return /* binding */ deepClone; },
/* harmony export */   "getSortedByMaxChildDeep": function() { return /* binding */ getSortedByMaxChildDeep; },
/* harmony export */   "removeAttributeValue": function() { return /* binding */ removeAttributeValue; },
/* harmony export */   "removeComments": function() { return /* binding */ removeComments; },
/* harmony export */   "safelyGetLink": function() { return /* binding */ safelyGetLink; },
/* harmony export */   "transformAttributes": function() { return /* binding */ transformAttributes; },
/* harmony export */   "valuesPresets": function() { return /* binding */ valuesPresets; }
/* harmony export */ });
/**
 * Remove attribute value, but dont remove attribute.
 */
const removeAttributeValue = (node, attributeName) => node.setAttribute(attributeName, '');
/**
 * Remove all comments in childNodes.
 * Comments in child nodes are not removed
 *
 * @param {HTMLElement} node
 * @returns {undefined | false} undefined - ok, false - error
 */
const removeComments = (node) => {
    if ('childNodes' in node) {
        for (let childIndex = 0; childIndex < node.childNodes.length; childIndex++) {
            if (node.childNodes[childIndex].nodeType === 8) {
                node.childNodes[childIndex].remove();
            }
        }
    }
    else {
        return false;
    }
};
/**
 * @param {Element} node
 * @returns {Element[]} array of node childs sorted by child's max deep
 */
const getSortedByMaxChildDeep = (() => {
    const markDeep = (node, d = 0) => {
        node._d = d;
        if (node.children.length) {
            [...node.children].forEach(n => markDeep(n, d + 1));
        }
        else {
            return d;
        }
    };
    return (node) => {
        markDeep(node);
        return [...node.querySelectorAll('*')]
            .sort((a, b) => b._d - a._d)
            .map((el) => {
            delete el._d;
            return el;
        });
    };
})();
/**
 * Normalize a TagRule.
 */
const transformAttributes = (rule) => {
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
 */
const safelyGetLink = (str) => {
    try {
        return new URL(str);
    }
    catch (e) {
        return null;
    }
};
/**
 * Add prefix by check
 *
 * @returns {string} if check returns true - prefix + str, else str
 */
const addPrefix = (str, check, prefix) => check.test(str) ? str : prefix + str;
/**
 * Deep clone an object
 */
const deepClone = (item) => {
    if (typeof item === 'string')
        return item;
    if (Object.prototype.hasOwnProperty.call(globalThis, 'structuredClone'))
        return structuredClone(item);
    const res = {};
    for (const key in item) {
        if (typeof item[key] === 'object') {
            res[key] = deepClone(item[key]);
        }
        else {
            res[key] = item[key];
        }
    }
    return res;
};
/**
 * Create clone of config for safe mutations
 *
 * @param {string[] | TagRule[]} config
 * @returns {string[] | TagRule[]} cloned config
 */
const copyConfig = (config) => config.map(deepClone);
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
const valuesPresets = {
    /**
     * Check is str a correct link
     */
    '%correct-link%'(str) {
        return {
            remove: safelyGetLink(str) === null,
        };
    },
    /**
     * Check is str a correct link and has HTTP protocol
     */
    '%http-link%'(str) {
        const url = safelyGetLink(str);
        return {
            remove: url === null || url.protocol !== 'http:',
        };
    },
    /**
     * Check is str a correct link and has HTTPS protocol
     */
    '%https-link%'(str) {
        const url = safelyGetLink(str);
        return {
            remove: url === null || url.protocol !== 'https:',
        };
    },
    /**
     * Check is str a correct link and has FTP protocol
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
     */
    '%https-link-without-search-params%'(str) {
        const url = safelyGetLink(str);
        return {
            remove: url === null || url.search !== '' || url.protocol !== 'https:',
        };
    },
    /**
     * Check is str a correct link and has HTTP protocol and does not have a params
     */
    '%http-link-without-search-params%'(str) {
        const url = safelyGetLink(str);
        return {
            remove: url === null || url.search !== '' || url.protocol !== 'http:',
        };
    },
    /**
     * Check is str a correct link and has same origin with current `location.origin`
     */
    '%same-origin%'(str) {
        const url = safelyGetLink(str);
        return {
            remove: url === null || globalThis.location.origin !== url.origin,
        };
    },
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**************************!*\
  !*** ./src/index.esm.ts ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setParser": function() { return /* reexport safe */ _core__WEBPACK_IMPORTED_MODULE_0__.setParser; }
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core */ "./src/core.ts");


/* harmony default export */ __webpack_exports__["default"] = (_core__WEBPACK_IMPORTED_MODULE_0__.PurifyHTML);

}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});