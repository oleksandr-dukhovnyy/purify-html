import Sanitizer, { setParser } from '@/core.ts';
import 'core-js/modules/web.structured-clone';

describe('Sanitizer', () => {
  test('normal setParser', () => {
    const str = 'some string';
    let strFromParser = null;

    let createdDiv;
    let divFromParser = null;

    const customParser = {
      parse(string) {
        const div = document.createElement('div');
        createdDiv = div;

        strFromParser = string;

        return div;
      },
      stringify(el) {
        divFromParser = el;
        return el.innerHTML;
      },
    };

    const setUpCode = setParser(customParser);

    const sanitizer = new Sanitizer();
    sanitizer.sanitize(str);

    expect(str).toEqual(strFromParser);
    expect(createdDiv).toEqual(divFromParser);
    expect(setUpCode).toEqual(1);
  });

  test('no .parse method', () => {
    const str = 'some string';
    let called = false;

    const customParser = {
      // parse() {},
      stringify(el) {
        called = true;
        return el.innerHTML;
      },
    };

    const setUpCode = setParser(customParser);

    const sanitizer = new Sanitizer();
    sanitizer.sanitize(str);

    expect(called).toEqual(false);
    expect(setUpCode).toEqual(0);
  });

  test('no .stringify method', () => {
    const str = 'some string';
    let called = false;

    const customParser = {
      parse() {
        const div = document.createElement('div');
        called = true;

        return div;
      },
      // stringify() {},
    };

    const setUpCode = setParser(customParser);

    const sanitizer = new Sanitizer();
    sanitizer.sanitize(str);

    expect(called).toEqual(false);
    expect(setUpCode).toEqual(0);
  });

  test('undefined instead of parser', () => {
    const str = 'some string';
    const setUpCode = setParser();

    const sanitizer = new Sanitizer();
    sanitizer.sanitize(str);

    expect(setUpCode).toEqual(0);
  });
});
