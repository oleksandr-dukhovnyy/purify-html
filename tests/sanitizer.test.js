import Sanitizer from '@/core.ts';
import 'core-js/modules/web.structured-clone';

describe('Sanitizer', () => {
  test('delete all tags', () => {
    const sanitizer = new Sanitizer();
    const str = [
      '<hr>',
      '<br>',
      '<a href="https://google.com">google</a>',
      '<a href="http://google.com/some">same origin</a>',
      '<<div></div>img/src/onerror=alert(1)>',
      '<b class="bold">bold</b>',
      '<div>just div</div>',
    ].join('');

    expect(sanitizer.sanitize(str)).toEqual(
      'googlesame origin&lt;img/src/onerror=alert(1)&gt;boldjust div'
    );
  });

  test('only br and hr', () => {
    const sanitizer = new Sanitizer(['br', 'hr']);
    const str = [
      '<hr>',
      '<br>',
      '<a href="https://google.com">google</a>',
      '<a href="http://google.com/some">same origin</a>',
      '<<div></div>img/src/onerror=alert(1)>',
      '<b class="bold">bold</b>',
      '<div>just div</div>',
    ].join('');

    expect(sanitizer.sanitize(str)).toEqual(
      '<hr><br>googlesame origin&lt;img/src/onerror=alert(1)&gt;boldjust div'
    );
  });

  test('only div[class=*]', () => {
    const sanitizer = new Sanitizer([{ name: 'div', attributes: ['class'] }]);
    const str = '<div class="abc" id="app" some="else" value="15">div</div>';

    expect(sanitizer.sanitize(str)).toEqual('<div class="abc">div</div>');
  });

  test('only div[class="class-value"]', () => {
    const sanitizer = new Sanitizer([
      { name: 'div', attributes: [{ name: 'class', value: 'class-value' }] },
    ]);
    const str =
      '<div class="class-value" id="app" some="else" value="15">div</div>';

    expect(sanitizer.sanitize(str)).toEqual(
      '<div class="class-value">div</div>'
    );
  });

  test('presets %https-link%', () => {
    const sanitizer = new Sanitizer([
      {
        name: 'a',
        attributes: [{ name: 'href', value: { preset: '%https-link%' } }],
      },
    ]);
    const str = '<a href="https://google.com">google.com</a>';

    expect(sanitizer.sanitize(str)).toEqual(
      '<a href="https://google.com">google.com</a>'
    );
  });

  test('attribute equal str', () => {
    const sanitizer = new Sanitizer([
      {
        name: 'a',
        attributes: [{ name: 'href', value: 'https://google.com' }],
      },
    ]);
    const str = '<a href="https://google.com">google.com</a>';

    expect(sanitizer.sanitize(str)).toEqual(
      '<a href="https://google.com">google.com</a>'
    );
  });

  test('attribute equal str 2', () => {
    const sanitizer = new Sanitizer([
      {
        name: 'div',
        attributes: [{ name: 'id', value: 'app' }],
      },
    ]);
    const str = '<div id="appp">div</a>';

    expect(sanitizer.sanitize(str)).toEqual('<div id="">div</div>');
  });

  test('attribute uncurrect link', () => {
    const sanitizer = new Sanitizer([
      {
        name: 'a',
        attributes: [{ name: 'href', value: {} }],
      },
    ]);
    const str = '<a href="https://google.com">google.com</a>';

    expect(sanitizer.sanitize(str)).toEqual('<a href="">google.com</a>');
  });

  test('attribute preset remove', () => {
    const sanitizer = new Sanitizer([
      {
        name: 'a',
        attributes: [{ name: 'href', value: { preset: '%correct-link%' } }],
      },
    ]);
    const str = '<a href="11google.com">google.com</a>';

    expect(sanitizer.sanitize(str)).toEqual('<a href="">google.com</a>');
  });

  test('attribute regexp test', () => {
    const sanitizer = new Sanitizer([
      { name: 'abc', attributes: [{ name: 'href', value: /^https:\/\// }] },
    ]);

    const str =
      '<abc href="11google.com">google.com</abc><abc href="https://some.com">google.com</abc>';

    expect(sanitizer.sanitize(str)).toEqual(
      '<abc href="">google.com</abc><abc href="https://some.com">google.com</abc>'
    );
  });

  test('attribute array test', () => {
    const sanitizer = new Sanitizer([
      { name: 'div', attributes: [{ name: 'id', value: ['app', 'oops'] }] },
    ]);
    const str = '<div id="app">app</div><div id="aaaappp"></div>';

    expect(sanitizer.sanitize(str)).toEqual(
      '<div id="app">app</div><div id=""></div>'
    );
  });

  test('attribute function test', () => {
    const sanitizer = new Sanitizer([
      {
        name: 'hr',
        attributes: [
          {
            name: 'id',
            value: value => value.startsWith('t-'),
          },
        ],
      },
    ]);

    const str = '<hr id="some-id-t-123"><hr id="t-123">';

    expect(sanitizer.sanitize(str)).toEqual('<hr id=""><hr id="t-123">');
  });

  test('delete attributes', () => {
    const sanitizer = new Sanitizer([{ name: 'div' }]);
    const str = '<div id="app">app</div><div id="aaaappp"></div>';

    expect(sanitizer.sanitize(str)).toEqual('<div>app</div><div></div>');
  });

  test('delete attributes', () => {
    const sanitizer = new Sanitizer([
      { name: 'a', attributes: [{ name: 'href', value: undefined }] },
    ]);
    const str = '<a href="https://some.com">google.com</a>';

    expect(sanitizer.sanitize(str)).toEqual('<a href="">google.com</a>');
  });

  test('delete attributes', () => {
    const sanitizer = new Sanitizer([
      {
        name: 'a',
        attributes: [{ name: 'href', value: { preset: '%correct-link%' } }],
      },
    ]);
    const str = '<a href="123">google.com</a>';

    expect(sanitizer.sanitize(str)).toEqual('<a href="">google.com</a>');
  });

  test('unknow preset', () => {
    const sanitizer = new Sanitizer([
      {
        name: 'div',
        attributes: [{ name: 'id', value: { preset: '%la-la-la%' } }],
      },
    ]);
    const str = '<div id="app">app</div><div id="aaaappp"></div>';

    expect(sanitizer.sanitize(str)).toEqual(
      '<div id="">app</div><div id=""></div>'
    );
  });

  test('remove comments', () => {
    const sanitizer = new Sanitizer();
    const str = '<div id="app">app</div><!-- <div></div> -->';

    expect(sanitizer.sanitize(str)).toEqual('app');
  });

  test('dont remove comments', () => {
    const sanitizer = new Sanitizer(['#comments']);
    const str = '<div>app</div><!-- <div></div> -->';

    expect(sanitizer.sanitize(str)).toEqual('app<!-- <div></div> -->');
  });

  test('remove comments, but in div', () => {
    const sanitizer = new Sanitizer([
      { name: 'div', dontRemoveComments: true },
    ]);

    const str = '<div><!-- <span></span> --></div><!-- <div></div> -->';

    expect(sanitizer.sanitize(str)).toEqual(
      '<div><!-- <span></span> --></div>'
    );
  });

  test('toHTMLEntities', () => {
    const sanitizer = new Sanitizer();
    const str = [
      '<hr>',
      '<br>',
      '<a href="https://google.com">google</a>',
      '<a href="http://google.com/some">same origin</a>',
      '<<div></div>img/src/onerror=alert(1)>',
      '<b class="bold">bold</b>',
      '<div>just div</div>',
    ].join('');

    expect(sanitizer.toHTMLEntities(str)).toEqual(
      '&#60;&#104;&#114;&#62;&#60;&#98;&#114;&#62;&#60;&#97;&#32;&#104;&#114;&#101;&#102;&#61;&#34;&#104;&#116;&#116;&#112;&#115;&#58;&#47;&#47;&#103;&#111;&#111;&#103;&#108;&#101;&#46;&#99;&#111;&#109;&#34;&#62;&#103;&#111;&#111;&#103;&#108;&#101;&#60;&#47;&#97;&#62;&#60;&#97;&#32;&#104;&#114;&#101;&#102;&#61;&#34;&#104;&#116;&#116;&#112;&#58;&#47;&#47;&#103;&#111;&#111;&#103;&#108;&#101;&#46;&#99;&#111;&#109;&#47;&#115;&#111;&#109;&#101;&#34;&#62;&#115;&#97;&#109;&#101;&#32;&#111;&#114;&#105;&#103;&#105;&#110;&#60;&#47;&#97;&#62;&#60;&#60;&#100;&#105;&#118;&#62;&#60;&#47;&#100;&#105;&#118;&#62;&#105;&#109;&#103;&#47;&#115;&#114;&#99;&#47;&#111;&#110;&#101;&#114;&#114;&#111;&#114;&#61;&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;&#62;&#60;&#98;&#32;&#99;&#108;&#97;&#115;&#115;&#61;&#34;&#98;&#111;&#108;&#100;&#34;&#62;&#98;&#111;&#108;&#100;&#60;&#47;&#98;&#62;&#60;&#100;&#105;&#118;&#62;&#106;&#117;&#115;&#116;&#32;&#100;&#105;&#118;&#60;&#47;&#100;&#105;&#118;&#62;'
    );
  });
});
