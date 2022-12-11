export const removeAttributeValue = (node, attributeName) =>
  node.setAttribute(attributeName, '');

export const transformAttributes = rule => {
  const res = [];

  if (!rule.hasOwnProperty('attributes')) {
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
