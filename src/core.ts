/** @module core */
import { TagRule, AttributeRule, HTMLParser } from './types';

import {
  removeAttributeValue,
  transformAttributes,
  valuesPresets,
  getSortedByMaxChildDeep,
  copyConfig,
  removeComments,
} from './utils';

let parser: HTMLParser = ((): HTMLParser => {
  const elem: Element = new DOMParser()
    .parseFromString('', 'text/html')
    .querySelector('body');

  return {
    parse(string: string): Element {
      elem.innerHTML = string;
      return elem;
    },
    stringify(elem: Element): string {
      return elem.innerHTML;
    },
  };
})();

/**
 * Purify instance.
 */
export class PurifyHTML {
  /**
   * Create PurifyHTML instance
   */

  /**
   * Is need to remove comments in root and in all nodes by default
   */
  protected removeComments = true;
  protected allowedTags: { [key: string]: TagRule } = {};
  protected whiteList: string[];

  constructor(allowedTags: TagRule[] | string[] = []) {
    /**
     * Copy and compile a rules
     */
    this.allowedTags = copyConfig(allowedTags).reduce(
      (acc: object, curr: TagRule | string) => {
        switch (typeof curr) {
          case 'string': {
            if (curr === '#comments') {
              this.removeComments = false;
            } else {
              acc[curr] = Object.assign(acc[curr] || {}, {});
            }

            break;
          }
          case 'object':
            acc[curr.name] = Object.assign(
              acc[curr.name] || {},
              transformAttributes(curr)
            );
        }

        return acc;
      },
      {}
    );

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
  public sanitize(str: string): string {
    const wrapper: Element = parser.parse(str);

    if (this.removeComments) {
      removeComments(wrapper);
    }

    const allItems: Element[] = getSortedByMaxChildDeep(wrapper);

    allItems.forEach((tag: Element) => {
      const name = tag.tagName.toLowerCase();

      if (this.whiteList.includes(name)) {
        const tagConfig: TagRule = this.allowedTags[name];

        if (this.removeComments && tagConfig.dontRemoveComments !== true) {
          removeComments(tag);
        }

        if (
          Object.prototype.hasOwnProperty.call(tagConfig, 'attributes') &&
          tagConfig.attributes.length > 0
        ) {
          const deleteList: string[] = [];
          const clearList: string[] = [];

          for (let i = 0; i < tag.attributes.length; i++) {
            const attr: Attr = tag.attributes[i];

            // get attribute rules
            const attributeRules = tagConfig.attributes.find(
              (attrRule: AttributeRule) => attrRule.name === attr.name
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
              } else if (typeof attributeRules.value === 'function') {
                if (!attributeRules.value(attr.value)) {
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
                      valuesPresets,
                      attributeRules.value.preset
                    )
                  ) {
                    const presetRes = valuesPresets[
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

          deleteList.forEach((attrName: string) =>
            tag.removeAttribute(attrName)
          );
          clearList.forEach((attrName: string) =>
            removeAttributeValue(tag, attrName)
          );
        } else {
          const deleteList: string[] = [];

          for (let i = 0; i < tag.attributes.length; i++) {
            deleteList.push(tag.attributes[i].name);
          }

          deleteList.forEach((attrName: string) =>
            tag.removeAttribute(attrName)
          );
        }
      } else {
        if (this.removeComments) {
          removeComments(tag);
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
  public toHTMLEntities(str: string): string {
    return str
      .split('')
      .map(n => `&#${n.charCodeAt(0)};`)
      .join('');
  }
}

/**
 * Set HTML custom parser
 */
export const setParser = (
  customParser: HTMLParser | null | undefined
): number => {
  if (!customParser) {
    console.error('customParser is null!');
    return 0;
  }

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

export default PurifyHTML;
