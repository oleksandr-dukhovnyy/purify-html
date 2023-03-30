!function(){var t=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e={};!function(){"use strict";t(e);const r=(()=>{const t=function(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;if(e._d=r,!e.children.length)return r;[...e.children].forEach((e=>t(e,r+1)))};return e=>(t(e),[...e.querySelectorAll("*")].sort(((t,e)=>e._d-t._d)))})(),n=t=>{try{return new URL(t)}catch(t){return null}},o=t=>{if(Object.prototype.hasOwnProperty.call(globalThis,"structuredClone"))return structuredClone(t);const e={};for(let r in t)"object"==typeof t[r]?e[r]=o(t[r]):e[r]=t[r];return e},s={"%correct-link%"(t){return{remove:null===n(t)}},"%http-link%"(t){const e=n(t);return{remove:null===e||"http:"!==e.protocol}},"%https-link%"(t){const e=n(t);return{remove:null===e||"https:"!==e.protocol}},"%ftp-link%"(t){const e=n(t);return{remove:null===e||"ftp:"!==e.protocol}},"%https-link-without-search-params%"(t){const e=n(t);return{remove:null===e||""!==e.search||"https:"!==e.protocol}},"%http-link-without-search-params%"(t){const e=n(t);return{remove:null===e||""!==e.search||"http:"!==e.protocol}},"%same-origin%"(t){const e=n(t);return{remove:null===e||self.location.origin!==e.origin}}};let a=(()=>{const t=(new DOMParser).parseFromString("","text/html").querySelector("body");return{parse(e){return t.innerHTML=e,t},stringify(t){return t.innerHTML}}})();self.PurifyHTML={sanitizer:class{constructor(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];var e;this.allowedTags=(e=t,e.map(o)).reduce(((t,e)=>{switch(typeof e){case"string":t[e]=Object.assign(t[e]||{},{});break;case"object":t[e.name]=Object.assign(t[e]||{},(t=>{const e=[];return Object.prototype.hasOwnProperty.call(t,"attributes")||(t.attributes=[]),t.attributes.forEach((t=>{switch(typeof t){case"string":e.push({name:t});break;case"object":e.push(t)}})),t.attributes=e,t})(e))}return t}),{}),this.whiteList=Object.keys(this.allowedTags),this.sanitize.bind(this)}sanitize(t){const e=a.parse(t);return r(e).forEach((t=>{const e=t.tagName.toLowerCase();if(this.whiteList.includes(e)){const r=this.allowedTags[e];if(Object.prototype.hasOwnProperty.call(r,"attributes")&&r.attributes.length>0){let e=[],n=[];for(let o=0;o<t.attributes.length;o++){const a=t.attributes[o],l=r.attributes.find((t=>t.name===a.name));l?Object.prototype.hasOwnProperty.call(l,"value")&&("string"==typeof l.value?a.value!==l.value&&n.push(a.name):l.value instanceof RegExp?l.value.test(a.value)||n.push(a.name):Array.isArray(l.value)?l.value.includes(a.value)||n.push(a.name):"object"==typeof l.value&&Object.prototype.hasOwnProperty.call(l.value,"preset")&&Object.prototype.hasOwnProperty.call(s,l.value.preset)?s[l.value.preset](a.value).remove&&n.push(a.name):n.push(a.name)):e.push(a.name)}e.forEach((e=>t.removeAttribute(e))),n.forEach((e=>{return r=e,t.setAttribute(r,"");var r}))}else{const e=[];for(let r=0;r<t.attributes.length;r++)e.push(t.attributes[r].name);e.forEach((e=>t.removeAttribute(e)))}}else t.insertAdjacentHTML("afterend",t.innerHTML),t.remove()})),a.stringify(e)}toHTMLEntities(t){return t.split("").map((t=>`&#${t.charCodeAt()};`)).join("")}},setParser:function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return Object.prototype.hasOwnProperty.call(t,"parse")?Object.prototype.hasOwnProperty.call(t,"stringify")?(a=t,1):(console.error('cannot to find method "stringify" in custom parser!',t),0):(console.error('cannot to find method "parse" in custom parser!',t),0)}}}();var r=PurifyHTML="undefined"==typeof PurifyHTML?{}:PurifyHTML;for(var n in e)r[n]=e[n];e.__esModule&&Object.defineProperty(r,"__esModule",{value:!0})}();