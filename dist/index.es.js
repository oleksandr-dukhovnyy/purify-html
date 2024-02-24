var w = Object.defineProperty;
var g = (e, t, r) => t in e ? w(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var h = (e, t, r) => (g(e, typeof t != "symbol" ? t + "" : t, r), r);
const O = () => {
  if (globalThis.DOMParser === void 0)
    throw `globalThis.DOMParser is not defined!
It seems that you use purify-html in node environment.
For node environment you need to add HTML parser by yourself.
See https://github.com/oleksandr-dukhovnyy/purify-html?tab=readme-ov-file#node-js for details.`;
  const e = new DOMParser().parseFromString("", "text/html").querySelector("body");
  return {
    parse(t) {
      return e.innerHTML = t, e;
    },
    stringify(t) {
      return t.innerHTML;
    }
  };
}, j = (e, t) => e.setAttribute(t, ""), d = (e) => {
  if ("childNodes" in e)
    for (let t = e.childNodes.length - 1; t > 0; t--)
      e.childNodes[t].nodeType === 8 && e.childNodes[t].remove();
  else
    return !1;
}, L = /* @__PURE__ */ (() => {
  const e = (t, r = 0) => {
    if (t._d = r, t.children.length)
      [...t.children].forEach((a) => e(a, r + 1));
    else
      return r;
  };
  return (t) => (e(t), [...t.querySelectorAll("*")].sort((r, a) => a._d - r._d).map((r) => (delete r._d, r)));
})(), k = (e) => {
  const t = [];
  return Object.prototype.hasOwnProperty.call(e, "attributes") || (e.attributes = []), e.attributes.forEach((r) => {
    switch (typeof r) {
      case "string":
        t.push({ name: r });
        break;
      case "object":
        t.push(r);
        break;
    }
  }), e.attributes = t, e;
}, u = (e) => {
  try {
    return new URL(e);
  } catch (t) {
    return null;
  }
}, m = (e) => {
  if (typeof e == "string")
    return e;
  if (Array.isArray(e))
    return e.map((t) => m(t));
  if (typeof e == "object" && e !== null) {
    const t = {};
    for (const r in e)
      e[r] instanceof RegExp ? t[r] = e[r] : typeof e[r] == "object" ? t[r] = m(e[r]) : t[r] = e[r];
    return t;
  }
  return e;
}, T = (e) => e.map(m), y = {
  /**
   * Check is str a correct link
   */
  "%correct-link%"(e) {
    return console.warn(
      "Default presets is deprecated and will be removed in 2.0.0. See release notes for v1.5.4"
    ), {
      remove: u(e) === null
    };
  },
  /**
   * Check is str a correct link and has HTTP protocol
   */
  "%http-link%"(e) {
    console.warn(
      "Default presets is deprecated and will be removed in 2.0.0. See release notes for v1.5.4"
    );
    const t = u(e);
    return {
      remove: t === null || t.protocol !== "http:"
    };
  },
  /**
   * Check is str a correct link and has HTTPS protocol
   */
  "%https-link%"(e) {
    console.warn(
      "Default presets is deprecated and will be removed in 2.0.0. See release notes for v1.5.4"
    );
    const t = u(e);
    return {
      remove: t === null || t.protocol !== "https:"
    };
  },
  /**
   * Check is str a correct link and has FTP protocol
   */
  "%ftp-link%"(e) {
    console.warn(
      "Default presets is deprecated and will be removed in 2.0.0. See release notes for v1.5.4"
    );
    const t = u(e);
    return {
      remove: t === null || t.protocol !== "ftp:"
    };
  },
  /**
   * Check is str a correct link and has HTTPS protocol and does not have a params
   *
   * @function
   */
  "%https-link-without-search-params%"(e) {
    console.warn(
      "Default presets is deprecated and will be removed in 2.0.0. See release notes for v1.5.4"
    );
    const t = u(e);
    return {
      remove: t === null || t.search !== "" || t.protocol !== "https:"
    };
  },
  /**
   * Check is str a correct link and has HTTP protocol and does not have a params
   */
  "%http-link-without-search-params%"(e) {
    console.warn(
      "Default presets is deprecated and will be removed in 2.0.0. See release notes for v1.5.4"
    );
    const t = u(e);
    return {
      remove: t === null || t.search !== "" || t.protocol !== "http:"
    };
  },
  /**
   * Check is str a correct link and has same origin with current `location.origin`
   */
  "%same-origin%"(e) {
    console.warn(
      "Default presets is deprecated and will be removed in 2.0.0. See release notes for v1.5.4"
    );
    const t = u(e);
    return {
      remove: t === null || globalThis.location.origin !== t.origin
    };
  }
};
let p;
class D {
  constructor(t = []) {
    /**
     * Create PurifyHTML instance
     */
    /**
     * Is need to remove comments in root and in all nodes by default
     */
    h(this, "removeComments", !0);
    h(this, "allowedTags", {});
    h(this, "whiteList");
    p || (p = O()), this.allowedTags = T(t).reduce(
      (r, a) => {
        switch (typeof a) {
          case "string": {
            a === "#comments" ? this.removeComments = !1 : r[a] = Object.assign(r[a] || {}, {});
            break;
          }
          case "object":
            r[a.name] = Object.assign(
              r[a.name] || {},
              k(a)
            );
        }
        return r;
      },
      {}
    ), this.whiteList = Object.keys(this.allowedTags), this.sanitize.bind(this);
  }
  /**
   * Sanitize a string.
   * @param {string} str to needs to sanitize.
   * @return {string} A string cleared according to the rules from this.allowedTags.
   */
  sanitize(t) {
    const r = p.parse(t);
    return this.removeComments && d(r), L(r).forEach((l) => {
      const v = l.tagName.toLowerCase();
      if (this.whiteList.includes(v)) {
        const f = this.allowedTags[v];
        if (this.removeComments && f.dontRemoveComments !== !0 && d(l), Object.prototype.hasOwnProperty.call(f, "attributes") && f.attributes.length > 0) {
          const c = [], s = [];
          for (let i = 0; i < l.attributes.length; i++) {
            const n = l.attributes[i], o = f.attributes.find(
              (b) => b.name === n.name
            );
            o ? Object.prototype.hasOwnProperty.call(o, "value") && (typeof o.value == "string" ? n.value !== o.value && s.push(n.name) : typeof o.value == "function" ? o.value(n.value) || s.push(n.name) : o.value instanceof RegExp ? o.value.test(n.value) || s.push(n.name) : Array.isArray(o.value) ? o.value.includes(n.value) || s.push(n.name) : typeof o.value == "object" && Object.prototype.hasOwnProperty.call(
              o.value,
              "preset"
            ) && Object.prototype.hasOwnProperty.call(
              y,
              o.value.preset
            ) ? y[o.value.preset](n.value).remove && s.push(n.name) : s.push(n.name)) : c.push(n.name);
          }
          c.forEach(
            (i) => l.removeAttribute(i)
          ), s.forEach(
            (i) => j(l, i)
          );
        } else {
          const c = [];
          for (let s = 0; s < l.attributes.length; s++)
            c.push(l.attributes[s].name);
          c.forEach(
            (s) => l.removeAttribute(s)
          );
        }
      } else
        this.removeComments && d(l), l.insertAdjacentHTML("afterend", l.innerHTML), l.remove();
    }), p.stringify(r);
  }
  /**
   * Convert a string to {@link https://www.w3schools.com/html/html_entities.asp HTML Entities}.
   */
  toHTMLEntities(t) {
    return t.split("").map((r) => `&#${r.charCodeAt(0)};`).join("");
  }
}
const A = (e) => e ? Object.prototype.hasOwnProperty.call(e, "parse") ? Object.prototype.hasOwnProperty.call(e, "stringify") ? (p = e, 1) : (console.error(
  'cannot to find method "stringify" in custom parser!',
  e
), 0) : (console.error(
  'cannot to find method "parse" in custom parser!',
  e
), 0) : (console.error("customParser is null!"), 0);
export {
  D as default,
  D as sanitizer,
  A as setParser
};
//# sourceMappingURL=index.es.js.map
