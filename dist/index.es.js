var w = Object.defineProperty;
var g = (e, t, r) => t in e ? w(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var f = (e, t, r) => (g(e, typeof t != "symbol" ? t + "" : t, r), r);
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
}, j = (e, t) => e.setAttribute(t, ""), m = (e) => {
  if ("childNodes" in e)
    Array.from(e.childNodes).forEach((r) => {
      r.nodeType === 8 && r.remove();
    });
  else
    return !1;
}, k = /* @__PURE__ */ (() => {
  const e = (t, r = 0) => {
    if (t._d = r, t.children.length)
      [...t.children].forEach((l) => e(l, r + 1));
    else
      return r;
  };
  return (t) => (e(t), [...t.querySelectorAll("*")].sort((r, l) => l._d - r._d).map((r) => (delete r._d, r)));
})(), L = (e) => {
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
}, y = (e) => {
  if (typeof e == "string")
    return e;
  if (Array.isArray(e))
    return e.map((t) => y(t));
  if (typeof e == "object" && e !== null) {
    const t = {};
    for (const r in e)
      e[r] instanceof RegExp ? t[r] = e[r] : typeof e[r] == "object" ? t[r] = y(e[r]) : t[r] = e[r];
    return t;
  }
  return e;
}, T = (e) => e.map(y), b = {
  /**
   * Check is str a correct link
   */
  "%correct-link%"(e) {
    return {
      remove: u(e) === null
    };
  },
  /**
   * Check is str a correct link and has HTTP protocol
   */
  "%http-link%"(e) {
    const t = u(e);
    return {
      remove: t === null || t.protocol !== "http:"
    };
  },
  /**
   * Check is str a correct link and has HTTPS protocol
   */
  "%https-link%"(e) {
    const t = u(e);
    return {
      remove: t === null || t.protocol !== "https:"
    };
  },
  /**
   * Check is str a correct link and has FTP protocol
   */
  "%ftp-link%"(e) {
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
    const t = u(e);
    return {
      remove: t === null || t.search !== "" || t.protocol !== "https:"
    };
  },
  /**
   * Check is str a correct link and has HTTP protocol and does not have a params
   */
  "%http-link-without-search-params%"(e) {
    const t = u(e);
    return {
      remove: t === null || t.search !== "" || t.protocol !== "http:"
    };
  },
  /**
   * Check is str a correct link and has same origin with current `location.origin`
   */
  "%same-origin%"(e) {
    const t = u(e);
    return {
      remove: t === null || globalThis.location.origin !== t.origin
    };
  }
};
function A() {
  console.warn(
    `[purify-html DEPRECATION ALERT]
Default presets is deprecated and will be removed in v2.0.0. See release notes for v1.5.4
https://github.com/oleksandr-dukhovnyy/purify-html/releases/tag/1.5.4`
  );
}
let p;
class E {
  constructor(t = []) {
    /**
     * Create PurifyHTML instance
     */
    /**
     * Is need to remove comments in root and in all nodes by default
     */
    f(this, "removeComments", !0);
    f(this, "allowedTags", {});
    f(this, "whiteList");
    p || (p = O()), this.allowedTags = T(t).reduce(
      (r, l) => {
        switch (typeof l) {
          case "string": {
            l === "#comments" ? this.removeComments = !1 : r[l] = Object.assign(r[l] || {}, {});
            break;
          }
          case "object":
            r[l.name] = Object.assign(
              r[l.name] || {},
              L(l)
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
    return this.removeComments && m(r), k(r).forEach((i) => {
      const d = i.tagName.toLowerCase();
      if (this.whiteList.includes(d)) {
        const h = this.allowedTags[d];
        if (this.removeComments && h.dontRemoveComments !== !0 && m(i), Object.prototype.hasOwnProperty.call(h, "attributes") && h.attributes.length > 0) {
          const c = [], s = [];
          for (let a = 0; a < i.attributes.length; a++) {
            const n = i.attributes[a], o = h.attributes.find(
              (v) => v.name === n.name
            );
            o ? Object.prototype.hasOwnProperty.call(o, "value") && (typeof o.value == "string" ? n.value !== o.value && s.push(n.name) : typeof o.value == "function" ? o.value(n.value) || s.push(n.name) : o.value instanceof RegExp ? o.value.test(n.value) || s.push(n.name) : Array.isArray(o.value) ? o.value.includes(n.value) || s.push(n.name) : typeof o.value == "object" && Object.prototype.hasOwnProperty.call(
              o.value,
              "preset"
            ) ? (A(), Object.prototype.hasOwnProperty.call(
              b,
              o.value.preset
            ) ? b[o.value.preset](n.value).remove && s.push(n.name) : s.push(n.name)) : s.push(n.name)) : c.push(n.name);
          }
          c.forEach(
            (a) => i.removeAttribute(a)
          ), s.forEach(
            (a) => j(i, a)
          );
        } else {
          const c = [];
          for (let s = 0; s < i.attributes.length; s++)
            c.push(i.attributes[s].name);
          c.forEach(
            (s) => i.removeAttribute(s)
          );
        }
      } else
        this.removeComments && m(i), i.insertAdjacentHTML("afterend", i.innerHTML), i.remove();
    }), p.stringify(r);
  }
  /**
   * Convert a string to {@link https://www.w3schools.com/html/html_entities.asp HTML Entities}.
   */
  toHTMLEntities(t) {
    return t.split("").map((r) => `&#${r.charCodeAt(0)};`).join("");
  }
}
const M = (e) => e ? Object.prototype.hasOwnProperty.call(e, "parse") ? Object.prototype.hasOwnProperty.call(e, "stringify") ? (p = e, 1) : (console.error(
  'cannot to find method "stringify" in custom parser!',
  e
), 0) : (console.error(
  'cannot to find method "parse" in custom parser!',
  e
), 0) : (console.error("customParser is null!"), 0);
export {
  E as default,
  E as sanitizer,
  M as setParser
};
//# sourceMappingURL=index.es.js.map
