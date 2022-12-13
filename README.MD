# purify-html

![size](https://img.shields.io/github/languages/code-size/Aleksandr-JS-Developer/purify-html?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues-raw/Aleksandr-JS-Developer/purify-html?style=flat-square)
![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/Aleksandr-JS-Developer/purify-html?style=flat-square)

A minimalistic library for sanitizing strings so that they can be safely used as HTML.

The main idea is to use the browser API to parse, parse and modify the DOM.

## Install

npm

```bash
npm install purify-html
```

yarn

```bash
yarn add purify-html
```

## Usage

```javascript
import Sanitizer from 'purify-html';

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

const sanitizer = new Sanitizer(allowedTags);

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

## Attributes checks preset list

- `%correct-link%` - only currect link
- `%http-link%` - only http link
- `%https-link%` - only https link
- `%ftp-link%` - only ftp link
- `%https-link-without-search-params%` - delete all search params and force https protocol
- `%http-link-without-search-params%` - delete all search params and force https protocol
- `%same-https-origin%` - only link that lead to the same origin that is currently in `self.location.origin`. + force https protocol
- `%same-http-origin%` - only link that lead to the same origin that is currently in `self.location.origin`. + force http protocol

## Browser support

Although browser support is already over 97%, the specification for DOMParser is not yet fully established. [More details](https://caniuse.com/mdn-api_domparser_parsefromstring_html).
