import { PurifyHTML, setParser } from './core.js';

globalThis.PurifyHTML = {
  sanitizer: PurifyHTML,
  setParser,
};
