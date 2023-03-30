export const removeAttributeValue = (node, attributeName) =>
  node.setAttribute(attributeName, '');

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

export const safelyGetLink = str => {
  try {
    return new URL(str);
  } catch (e) {
    return null;
  }
};

export const addPrefix = (str, check, prefix) =>
  check.test(str) ? str : prefix + str;

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

export const copyConfig = config => config.map(deepClone);

export const valuesPresets = {
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
