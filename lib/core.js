import {
  removeAttributeValue,
  transformAttributes,
  valuesPresets,
} from './utils.js';

export class PurifyHTML {
  constructor(allowedTags = []) {
    // clone params for safe mutations
    if (self.hasOwnProperty('structuredClone')) {
      allowedTags = structuredClone(allowedTags);
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

      allowedTags = JSON.parse(JSON.stringify(allowedTags));
    }

    this.allowedTags = allowedTags.reduce((acc, curr) => {
      switch (typeof curr) {
        case 'string':
          acc[curr] = Object.assign(acc[curr] || {}, {});
          break;

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
    const wrapper = new DOMParser()
      .parseFromString(str, 'text/html')
      .querySelector('body');

    const allItems = wrapper.querySelectorAll('*');

    allItems.forEach(tag => {
      const name = tag.tagName.toLowerCase();

      if (this.whiteList.includes(name)) {
        const tagConfig = this.allowedTags[name];

        if (
          tagConfig.hasOwnProperty('attributes') &&
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
            } else if (attributeRules.hasOwnProperty('value')) {
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
                if (attributeRules.value.hasOwnProperty('preset')) {
                  // if rules is preset

                  if (
                    valuesPresets.hasOwnProperty(attributeRules.value.preset)
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
        // TODO: get rid of the recursive check. This requires that when the parent is parsed, all its child nodes are already validated and its innerHTML is already clean.
        tag.insertAdjacentHTML('afterend', this.sanitize(tag.innerHTML));
        tag.remove();
      }
    });

    return wrapper.innerHTML;
  }

  toHTMLEntities(str) {
    return str
      .split('')
      .map(n => `&#${n.charCodeAt()};`)
      .join('');
  }
}

export default PurifyHTML;
