import {
  removeAttributeValue,
  transformAttributes,
  valuesPresets,
  getSortedByMaxChildDeep,
  copyConfig,
  removeComments,
} from './utils.js';

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

export class PurifyHTML {
  constructor(allowedTags = []) {
    this.removeComments = true;
    this.allowedTags = copyConfig(allowedTags).reduce((acc, curr) => {
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
            acc[curr] || {},
            transformAttributes(curr)
          );
      }

      return acc;
    }, {});

    this.whiteList = Object.keys(this.allowedTags);

    this.sanitize.bind(this);
  }
  sanitize(str) {
    const wrapper = parser.parse(str);

    if (this.removeComments) {
      removeComments(wrapper);
    }

    const allItems = getSortedByMaxChildDeep(wrapper);

    allItems.forEach(tag => {
      const name = tag.tagName.toLowerCase();

      if (this.whiteList.includes(name)) {
        const tagConfig = this.allowedTags[name];

        if (this.removeComments && tagConfig.dontRemoveComments !== true) {
          removeComments(tag);
        }

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

          deleteList.forEach(attrName => tag.removeAttribute(attrName));
          clearList.forEach(attrName => removeAttributeValue(tag, attrName));
        } else {
          const deleteList = [];

          for (let i = 0; i < tag.attributes.length; i++) {
            deleteList.push(tag.attributes[i].name);
          }

          deleteList.forEach(attrName => tag.removeAttribute(attrName));
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

  toHTMLEntities(str) {
    return str
      .split('')
      .map(n => `&#${n.charCodeAt()};`)
      .join('');
  }
}

export const setParser = (customParser = {}) => {
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
