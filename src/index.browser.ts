import { PurifyHTML, setParser } from './core';

globalThis.PurifyHTML = {
  sanitizer: PurifyHTML,
  setParser,
};
