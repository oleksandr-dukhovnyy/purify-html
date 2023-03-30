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

/***/ "./lib/core.js":
/*!*********************!*\
  !*** ./lib/core.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PurifyHTML": function() { return /* binding */ PurifyHTML; },
/* harmony export */   "setParser": function() { return /* binding */ setParser; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");


let parser = {
  parse(string) {
    return new DOMParser()
      .parseFromString(string, 'text/html')
      .querySelector('body');
  },
  stringify(elem) {
    return elem.innerHTML;
  },
};

class PurifyHTML {
  constructor(allowedTags = []) {
    // clone params for safe mutations
    if (Object.prototype.hasOwnProperty.call(self, 'structuredClone')) {
      //allowedTags = structuredClone(allowedTags);
    } else {
      // self.structuredClone support: https://caniuse.com/mdn-api_structuredclone
      console.warn(
        [
          '\n',
          'The "self.structuredClone" method is not supported in this browser.',
          'This means that you cannot use regular expressions to validate attribute content.',
          'You might consider using a polyfill from core-js: https://github.com/zloirock/core-js#structuredclone`',
          '\n',
        ].join('\n')
      );

      //allowedTags = JSON.parse(JSON.stringify(allowedTags));
    }

    this.allowedTags = allowedTags.reduce((acc, curr) => {
      switch (typeof curr) {
        case 'string':
          acc[curr] = Object.assign(acc[curr] || {}, {});
          break;

        case 'object':
          acc[curr.name] = Object.assign(
            acc[curr] || {},
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.transformAttributes)(curr)
          );
      }

      return acc;
    }, {});

    this.whiteList = Object.keys(this.allowedTags);

    this.sanitize.bind(this);
  }
  sanitize(str) {
    const wrapper = parser.parse(str);

    const allItems = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.getSortedByMaxChildDeep)(wrapper);

    allItems.forEach(tag => {
      const name = tag.tagName.toLowerCase();

      if (this.whiteList.includes(name)) {
        const tagConfig = this.allowedTags[name];

        if (
          Object.prototype.hasOwnProperty.call(tagConfig, 'attributes') &&
          tagConfig.attributes.length > 0
        ) {
          let deleteList = [];
          let clearList = [];

          for (let i = 0; i < tag.attributes.length; i++) {
            const attr = tag.attributes[i];

            // get attribute rules
            const attributeRules = tagConfig.attributes.find(
              attrRule => attrRule.name === attr.name
            );

            if (!attributeRules) {
              // if rules not defined
              deleteList.push(attr.name);
            } else if (
              Object.prototype.hasOwnProperty.call(attributeRules, 'value')
            ) {
              // if rules defined

              if (typeof attributeRules.value === 'string') {
                if (attr.value !== attributeRules.value) {
                  // if rules is string
                  clearList.push(attr.name);
                }
              } else if (attributeRules.value instanceof RegExp) {
                // if rules is regexp
                if (!attributeRules.value.test(attr.value)) {
                  clearList.push(attr.name);
                }
              } else if (Array.isArray(attributeRules.value)) {
                // if rules is an array (an array of strings - valid values)
                if (!attributeRules.value.includes(attr.value)) {
                  clearList.push(attr.name);
                }
              } else if (typeof attributeRules.value === 'object') {
                if (
                  Object.prototype.hasOwnProperty.call(
                    attributeRules.value,
                    'preset'
                  )
                ) {
                  // if rules is preset

                  if (
                    Object.prototype.hasOwnProperty.call(
                      _utils_js__WEBPACK_IMPORTED_MODULE_0__.valuesPresets,
                      attributeRules.value.preset
                    )
                  ) {
                    const presetRes = _utils_js__WEBPACK_IMPORTED_MODULE_0__.valuesPresets[
                      attributeRules.value.preset
                    ](attr.value);

                    if (presetRes.remove) {
                      clearList.push(attr.name);
                    }
                  } else {
                    clearList.push(attr.name);
                  }
                } else {
                  // remove attribute if get empty object
                  clearList.push(attr.name);
                }
              } else {
                // remove attribute value by default
                clearList.push(attr.name);
              }
            }
          }

          deleteList.forEach(attrName => tag.removeAttribute(attrName));
          clearList.forEach(attrName => (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.removeAttributeValue)(tag, attrName));
        } else {
          const deleteList = [];

          for (let i = 0; i < tag.attributes.length; i++) {
            deleteList.push(tag.attributes[i].name);
          }

          deleteList.forEach(attrName => tag.removeAttribute(attrName));
        }
      } else {
        tag.insertAdjacentHTML('afterend', tag.innerHTML);
        tag.remove();
      }
    });

    return parser.stringify(wrapper);
  }

  toHTMLEntities(str) {
    return str
      .split('')
      .map(n => `&#${n.charCodeAt()};`)
      .join('');
  }
}

const setParser = (customParser = {}) => {
  if (!Object.prototype.hasOwnProperty.call(customParser, 'parse')) {
    console.error(
      'cannot to find method "parse" in custom parser!',
      customParser
    );

    return 0;
  }

  if (!Object.prototype.hasOwnProperty.call(customParser, 'stringify')) {
    console.error(
      'cannot to find method "stringify" in custom parser!',
      customParser
    );

    return 0;
  }

  parser = customParser;
  return 1;
};

/* harmony default export */ __webpack_exports__["default"] = (PurifyHTML);


/***/ }),

/***/ "./lib/utils.js":
/*!**********************!*\
  !*** ./lib/utils.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addPrefix": function() { return /* binding */ addPrefix; },
/* harmony export */   "getSortedByMaxChildDeep": function() { return /* binding */ getSortedByMaxChildDeep; },
/* harmony export */   "removeAttributeValue": function() { return /* binding */ removeAttributeValue; },
/* harmony export */   "safelyGetLink": function() { return /* binding */ safelyGetLink; },
/* harmony export */   "transformAttributes": function() { return /* binding */ transformAttributes; },
/* harmony export */   "valuesPresets": function() { return /* binding */ valuesPresets; }
/* harmony export */ });
const removeAttributeValue = (node, attributeName) =>
  node.setAttribute(attributeName, '');

const getSortedByMaxChildDeep = (() => {
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

const transformAttributes = rule => {
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

const safelyGetLink = str => {
  try {
    return new URL(str);
  } catch (e) {
    return null;
  }
};

const addPrefix = (str, check, prefix) =>
  check.test(str) ? str : prefix + str;

const valuesPresets = {
  '%correct-link%'(str) {
    return {
      remove: safelyGetLink(str) === null,
    };
  },
  '%http-link%'(str) {
    const url = safelyGetLink(str);

    return {
      remove: url === null || url.protocol !== 'http:',
    };
  },
  '%https-link%'(str) {
    const url = safelyGetLink(str);

    return {
      remove: url === null || url.protocol !== 'https:',
    };
  },
  '%ftp-link%'(str) {
    const url = safelyGetLink(str);

    return {
      remove: url === null || url.protocol !== 'ftp:',
    };
  },
  '%https-link-without-search-params%'(str) {
    const url = safelyGetLink(str);

    return {
      remove: url === null || url.search !== '' || url.protocol !== 'https:',
    };
  },
  '%http-link-without-search-params%'(str) {
    const url = safelyGetLink(str);

    return {
      remove: url === null || url.search !== '' || url.protocol !== 'http:',
    };
  },
  '%same-origin%'(str) {
    const url = safelyGetLink(str);

    return {
      remove: url === null || self.location.origin !== url.origin,
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
  !*** ./lib/index.esm.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setParser": function() { return /* reexport safe */ _core_js__WEBPACK_IMPORTED_MODULE_0__.setParser; }
/* harmony export */ });
/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core.js */ "./lib/core.js");



/* harmony default export */ __webpack_exports__["default"] = (_core_js__WEBPACK_IMPORTED_MODULE_0__.PurifyHTML);

}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});