import Sanitizer from '@/core.ts';
import 'core-js/modules/web.structured-clone';
const fs = require('fs');

const payloads = fs.readFileSync('./tests/xss-payloads-list.txt', {
  encoding: 'utf8',
  flag: 'r',
});

const payloadsCleaned = fs.readFileSync('./tests/xss-payloads-list-clean.txt', {
  encoding: 'utf8',
  flag: 'r',
});

describe('XSS payloads', () => {
  test('big payloads list', () => {
    const sanitizer = new Sanitizer(); // delete all

    expect(sanitizer.sanitize(payloads)).toEqual(payloadsCleaned);
  });
});
