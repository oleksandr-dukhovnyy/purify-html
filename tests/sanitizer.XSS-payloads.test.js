import Sanitizer from '@/core.ts';
import 'core-js/modules/web.structured-clone';
import fs from 'node:fs';

const payloads = fs.readFileSync('./tests/xss-payloads-list.txt', {
  encoding: 'utf8',
  flag: 'r',
});

const payloadsCleaned = fs.readFileSync('./tests/xss-payloads-list-clean.txt', {
  encoding: 'utf8',
  flag: 'r',
});

const normalize = str => str.replace(/\s/g, '');

describe('XSS payloads', () => {
  test('big payloads list', () => {
    const sanitizer = new Sanitizer(); // delete all

    expect(normalize(sanitizer.sanitize(payloads))).toEqual(
      normalize(payloadsCleaned)
    );
  });
});
