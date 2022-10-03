# purify-html

![size](https://img.shields.io/github/languages/code-size/Aleksandr-JS-Developer/purify-html?style=flat-square)

A minimalistic library for sanitizing strings so that they can be safely used as HTML.

The main idea is to use the browser API to parse, parse and modify the DOM.

## Install

```bash
npm install purify-html
```

## Usage

```javascript
import Sanitizer from 'purify-html';

const allowedTags = [
  { name: 'br' },
  { name: 'b', attributes: ['class'] },
  { name: 'p', attributes: ['data-some'] },
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
`;

const safeString = sanitizer.sanitize(dangerString);

console.log(safeString);

/*
  &lt;img src="1" onerror="alert(1)"&gt;
  

  <b>Bold</b>
  <b class="red">Bold</b>
  <b class="red">Bold</b>
  <p data-some="123">123</p>

*/
```

## Browser support

Although browser support is already over 95%, the specification for DOMParser is not yet fully established. [More details](https://caniuse.com/mdn-api_domparser_parsefromstring_html).
