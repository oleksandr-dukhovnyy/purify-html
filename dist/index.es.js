const y = () => {
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
}, w = (e, t) => e.setAttribute(t, ""), h = (e) => {
  if ("childNodes" in e)
    for (let t = e.childNodes.length - 1; t > 0; t--)
      e.childNodes[t].nodeType === 8 && e.childNodes[t].remove();
  else
    return !1;
}, g = /* @__PURE__ */ (() => {
  const e = (t, r = 0) => {
    if (t._d = r, t.children.length)
      [...t.children].forEach((a) => e(a, r + 1));
    else
      return r;
  };
  return (t) => (e(t), [...t.querySelectorAll("*")].sort((r, a) => a._d - r._d).map((r) => (delete r._d, r)));
})(), O = (e) => {
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
  } catch {
    return null;
  }
}, d = (e) => {
  if (typeof e == "string")
    return e;
  if (Array.isArray(e))
    return e.map((t) => d(t));
  if (typeof e == "object" && e !== null) {
    const t = {};
    for (const r in e)
      e[r] instanceof RegExp ? t[r] = e[r] : typeof e[r] == "object" ? t[r] = d(e[r]) : t[r] = e[r];
    return t;
  }
  return e;
}, j = (e) => e.map(d), b = {
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
class L {
  /**
   * Create PurifyHTML instance
   */
  /**
   * Is need to remove comments in root and in all nodes by default
   */
  removeComments = !0;
  allowedTags = {};
  whiteList;
  constructor(t = []) {
    p || (p = y()), this.allowedTags = j(t).reduce(
      (r, a) => {
        switch (typeof a) {
          case "string": {
            a === "#comments" ? this.removeComments = !1 : r[a] = Object.assign(r[a] || {}, {});
            break;
          }
          case "object":
            r[a.name] = Object.assign(
              r[a.name] || {},
              O(a)
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
    return this.removeComments && h(r), g(r).forEach((l) => {
      const m = l.tagName.toLowerCase();
      if (this.whiteList.includes(m)) {
        const f = this.allowedTags[m];
        if (this.removeComments && f.dontRemoveComments !== !0 && h(l), Object.prototype.hasOwnProperty.call(f, "attributes") && f.attributes.length > 0) {
          const c = [], s = [];
          for (let i = 0; i < l.attributes.length; i++) {
            const n = l.attributes[i], o = f.attributes.find(
              (v) => v.name === n.name
            );
            o ? Object.prototype.hasOwnProperty.call(o, "value") && (typeof o.value == "string" ? n.value !== o.value && s.push(n.name) : typeof o.value == "function" ? o.value(n.value) || s.push(n.name) : o.value instanceof RegExp ? o.value.test(n.value) || s.push(n.name) : Array.isArray(o.value) ? o.value.includes(n.value) || s.push(n.name) : typeof o.value == "object" && Object.prototype.hasOwnProperty.call(
              o.value,
              "preset"
            ) && Object.prototype.hasOwnProperty.call(
              b,
              o.value.preset
            ) ? b[o.value.preset](n.value).remove && s.push(n.name) : s.push(n.name)) : c.push(n.name);
          }
          c.forEach(
            (i) => l.removeAttribute(i)
          ), s.forEach(
            (i) => w(l, i)
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
        this.removeComments && h(l), l.insertAdjacentHTML("afterend", l.innerHTML), l.remove();
    }), p.stringify(r);
  }
  /**
   * Convert a string to {@link https://www.w3schools.com/html/html_entities.asp HTML Entities}.
   */
  toHTMLEntities(t) {
    return t.split("").map((r) => `&#${r.charCodeAt(0)};`).join("");
  }
}
const k = (e) => e ? Object.prototype.hasOwnProperty.call(e, "parse") ? Object.prototype.hasOwnProperty.call(e, "stringify") ? (p = e, 1) : (console.error(
  'cannot to find method "stringify" in custom parser!',
  e
), 0) : (console.error(
  'cannot to find method "parse" in custom parser!',
  e
), 0) : (console.error("customParser is null!"), 0);
export {
  L as default,
  L as sanitizer,
  k as setParser
};
//# sourceMappingURL=index.es.js.map
