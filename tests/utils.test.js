import * as utils from '@/utils.js';

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
    ).toMatchObject(links.map(([_, bool]) => bool));
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
});
