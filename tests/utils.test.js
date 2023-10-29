import * as utils from '@/utils.ts';

describe('utils', () => {
  test('removeAttributeValue', () => {
    const elem = document.createElement('div');
    elem.setAttribute('id', 'app');

    utils.removeAttributeValue(elem, 'id');

    expect(elem.getAttribute('id')).toBe('');
  });

  test('transformAttributes', () => {
    const rule = {
      name: 'div',
      attributes: [
        'class',
        { name: 'id' },
        { name: 'data-value', value: '123' },
      ],
    };

    const transformed = utils.transformAttributes(rule);

    expect(transformed).toMatchObject({
      name: 'div',
      attributes: [
        { name: 'class' },
        { name: 'id' },
        { name: 'data-value', value: '123' },
      ],
    });
  });

  test('safelyGetLink', () => {
    // TODO: need more tests for linkIsValid
    const links = [
      ['google.com', false], // need protocol
      ['....d12', false],
      ['http://some.com', true],
    ];

    expect(
      links.map(([link]) => utils.safelyGetLink(link) !== null)
    ).toMatchObject(links.map(item => item[1]));
  });

  test('addPrefix', () => {
    const str1 = 'https://google.com';
    const check1 = /^https/;
    const prefix1 = 'https://';
    const toEqual1 = 'https://google.com';

    expect(utils.addPrefix(str1, check1, prefix1)).toEqual(toEqual1);

    const str2 = 'google.com';
    const check2 = /^https/;
    const prefix2 = 'https://';
    const toEqual2 = 'https://google.com';

    expect(utils.addPrefix(str2, check2, prefix2)).toEqual(toEqual2);
  });

  test('[valuesPresets] %correct-link%', () => {
    const preset = utils.valuesPresets['%correct-link%'];

    expect(preset('https://google.com?q=123').remove).toEqual(false);
    expect(preset('ftp://some.com').remove).toEqual(false);
    expect(preset('http://some.com?q=123&a=321').remove).toEqual(false);
    expect(preset('google.com').remove).toEqual(true);
  });

  test('[valuesPresets] %http-link%', () => {
    const preset = utils.valuesPresets['%http-link%'];

    expect(preset('https://google.com?q=123').remove).toEqual(true);
    expect(preset('ftp://some.com').remove).toEqual(true);
    expect(preset('http://some.com?q=123&a=321').remove).toEqual(false);
  });

  test('[valuesPresets] %https-link%', () => {
    const preset = utils.valuesPresets['%https-link%'];

    expect(preset('https://google.com?q=123').remove).toEqual(false);
    expect(preset('ftp://some.com').remove).toEqual(true);
    expect(preset('http://some.com?q=123&a=321').remove).toEqual(true);
  });

  test('[valuesPresets] %ftp-link%', () => {
    const preset = utils.valuesPresets['%ftp-link%'];

    expect(preset('https://google.com?q=123').remove).toEqual(true);
    expect(preset('ftp://some.com').remove).toEqual(false);
    expect(preset('http://some.com?q=123&a=321').remove).toEqual(true);
    expect(preset('https://some.com').remove).toEqual(true);
  });

  test('[valuesPresets] %https-link-without-search-params%', () => {
    const preset = utils.valuesPresets['%https-link-without-search-params%'];

    expect(preset('https://google.com?q=123').remove).toEqual(true);
    expect(preset('ftp://some.com').remove).toEqual(true);
    expect(preset('http://some.com?q=123&a=321').remove).toEqual(true);
    expect(preset('https://some.com').remove).toEqual(false);
  });

  test('[valuesPresets] %http-link-without-search-params%', () => {
    const preset = utils.valuesPresets['%http-link-without-search-params%'];

    expect(preset('https://google.com?q=123').remove).toEqual(true);
    expect(preset('ftp://some.com').remove).toEqual(true);
    expect(preset('http://some.com?q=123&a=321').remove).toEqual(true);
    expect(preset('https://some.com').remove).toEqual(true);
    expect(preset('http://some.com').remove).toEqual(false);
  });

  test('[valuesPresets] %same-origin%', () => {
    const preset = utils.valuesPresets['%same-origin%'];

    expect(preset('https://google.com?q=123').remove).toEqual(true);
    expect(preset('ftp://some.com').remove).toEqual(true);
    expect(preset('http://some.com?q=123&a=321').remove).toEqual(true);
    expect(preset('https://some.com').remove).toEqual(true);
    expect(preset(new URL('api/counter', location.origin).href).remove).toEqual(
      false
    );
  });

  // test('[deepClone]', () => {
  //   delete globalThis.structuredClone;

  //   const obj = {
  //     data: {
  //       deepData: {
  //         key: 'value',
  //       },
  //     },
  //   };

  //   const clonedObj = utils.deepClone(obj);

  //   expect(obj.data.deepData === clonedObj.data.deepData).toEqual(false);
  // });

  // test('[deepClone]', () => {
  //   delete globalThis.structuredClone;

  //   const val = 5;
  //   const copiedVal = utils.deepClone(val);

  //   expect(val === copiedVal).toEqual(true);
  // });

  test('[removeComments]', () => {
    const node = new DOMParser().parseFromString(
      '<div>content</div><!-- <div>comment</div> -->',
      'text/html'
    ).body;

    utils.removeComments(node);

    expect(/<!--|-->|comment/g.test(node.innerHTML)).toEqual(false);
  });

  test('[removeComments]', () => {
    expect(utils.removeComments({})).toEqual(false);
  });
});

describe('utils.deepClone', () => {
  it('should return the same string', () => {
    const input = 'Hello, world!';
    const cloned = utils.deepClone(input);
    expect(cloned).toBe(input);
  });

  it('should clone an array', () => {
    const input = [1, 2, [3, 4]];
    const cloned = utils.deepClone(input);
    expect(cloned).toEqual(input);
    expect(cloned).not.toBe(input);
  });

  it('should clone an object', () => {
    const input = { name: 'John', age: 30 };
    const cloned = utils.deepClone(input);
    expect(cloned).toEqual(input);
    expect(cloned).not.toBe(input);
  });

  it('should handle RegExp objects', () => {
    const input = { pattern: /test/i };
    const cloned = utils.deepClone(input);
    expect(cloned).toEqual(input);
    expect(cloned).not.toBe(input);
  });

  it('should handle nested objects and arrays', () => {
    const input = { numbers: [1, 2, 3], person: { name: 'Alice' } };
    const cloned = utils.deepClone(input);
    expect(cloned).toEqual(input);
    expect(cloned).not.toBe(input);
  });

  it('should return the same value for null or other types', () => {
    const input = null;
    const cloned = utils.deepClone(input);
    expect(cloned).toBe(input);

    const numberInput = 42;
    const numberCloned = utils.deepClone(numberInput);
    expect(numberCloned).toBe(numberInput);
  });

  it('should handle object properties with hasOwnProperty check', () => {
    const input = { name: 'John', age: 30 };
    const cloned = utils.deepClone(input);

    for (const key in cloned) {
      if (Object.prototype.hasOwnProperty.call(cloned, key)) {
        expect(cloned[key]).toEqual(input[key]);
      }
    }
  });
});
