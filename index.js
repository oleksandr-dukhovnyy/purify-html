class Sanitizer {
  constructor(allowedTags = []) {
    this.allowedTags = allowedTags.reduce((acc, curr) => {
      acc[curr.name] = curr;

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

    allItems.forEach((tag) => {
      const name = tag.tagName.toLowerCase();

      if (this.whiteList.includes(name)) {
        const tagConfig = this.allowedTags[name];

        if (tagConfig.attributes !== undefined) {
          for (let i = 0; i < tag.attributes.length; i++) {
            const attr = tag.attributes[i];

            if (!tagConfig.attributes.includes(attr.name)) {
              tag.removeAttribute(attr.name);
            }
          }
        } else {
          for (let i = 0; i < tag.attributes.length; i++) {
            tag.removeAttribute(tag.attributes[i].name);
          }
        }
      } else {
        tag.insertAdjacentHTML('afterend', this.sanitize(tag.innerHTML));
        tag.remove();
      }
    });

    return wrapper.innerHTML;
  }
}

module.exports = Sanitizer;
