---
title: JavaScript and jQuery for ERI prototypes
summary: Write plain JavaScript first, use jQuery where ERI or WordPress already loads it, keep the DOM safe from XSS, handle fetch errors, and test core logic in Node without a framework.
tags: [stack, javascript, jquery, dom, security, testing, wordpress]
last_verified: 2026-10-23
next_review: 2027-01-23
review_owner: ERI web team lead
confidence: high
sources:
  - title: jQuery 4.0.0 release post (blog.jquery.com)
    url: https://blog.jquery.com/?p=5047
    accessed: 2026-10-23
  - title: jQuery download page
    url: https://jquery.com/download/
    accessed: 2026-10-23
  - title: jQuery version support
    url: https://jquery.com/support/
    accessed: 2026-10-23
  - title: jQuery API, .text()
    url: https://api.jquery.com/text/
    accessed: 2026-10-23
  - title: MDN, Node.textContent
    url: https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
    accessed: 2026-10-23
  - title: MDN, Element.innerHTML (security considerations)
    url: https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
    accessed: 2026-10-23
  - title: MDN, Using the Fetch API
    url: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    accessed: 2026-10-23
  - title: MDN, JavaScript modules guide
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
    accessed: 2026-10-23
---

# JavaScript and jQuery for ERI prototypes

## TL;DR
- **Write plain JavaScript first.** Keep the logic in a file that doesn't touch the DOM and wraps itself in the repo's IIFE/UMD pattern. Then it runs in the browser, inside the WordPress plugin, and in `node tests/test.js`.
- **jQuery is fine** when the page already loads it (ERI's WordPress does, and `starters/static-web` vendors **jQuery 3.7.1**). **jQuery 4.0.0 shipped on 2026-01-17.** 3.x now gets only "critical security patches and bug fixes".
- **Put user text in with `textContent` or jQuery `.text()`.** Never pass user text to `innerHTML` or `.html()` unless you escape it first.
- `fetch()` **does not reject on 404 or 500**. Check `response.ok`. Never put API keys in front-end code.

## Minimal working example
The same three-file shape as `challenges/02-job-fit-checker/web/`: core logic, page glue, and a Node test.

```js
// web/hours.js: core logic with no DOM. Works in browsers, in WordPress and in Node.
(function (root) {
  var WEEKS_PER_MONTH = 4.33;
  function monthlyEarnings(hoursPerWeek, wagePerHour) {
    var h = Number(hoursPerWeek) || 0, w = Number(wagePerHour) || 0;
    return Math.round(h * w * WEEKS_PER_MONTH);
  }
  var api = { monthlyEarnings: monthlyEarnings };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; // Node tests
  else root.eriHours = api;                                                   // browser global, eri_ prefix
})(this);
```

```js
// web/app.js: page glue. Builds nodes with textContent, so there is no XSS risk.
document.getElementById('hours-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var f = e.target;
  var out = document.getElementById('hours-result');
  var monthly = eriHours.monthlyEarnings(f.hours.value, f.wage.value);
  var h2 = document.createElement('h2');
  h2.tabIndex = -1;                       // so we can move focus here
  h2.textContent = 'About $' + monthly + ' a month from this job';
  var p = document.createElement('p');
  p.textContent = 'Estimate only. Talk to a benefits specialist: WIPA 1-877-826-1752.';
  out.replaceChildren(h2, p);
  h2.focus();
});
```

```js
// tests/test.js: run with `node tests/test.js`. Exits non-zero on failure, so CI and tools/check.sh notice.
const assert = require('node:assert/strict');
const { monthlyEarnings } = require('../web/hours.js');
let failed = 0;
function test(name, fn) {
  try { fn(); console.log('PASS ' + name); }
  catch (e) { failed++; console.log('FAIL ' + name + ': ' + e.message); }
}
test('20 h x $15 = $1299/month', () => assert.equal(monthlyEarnings(20, 15), 1299));
test('blank input is 0, not NaN', () => assert.equal(monthlyEarnings('', ''), 0));
process.exitCode = failed ? 1 : 0;
```

Load order in HTML: `<script src="hours.js"></script>` and then `<script src="app.js"></script>`, both at the end of `<body>`, the same as the challenge pages.

### The same render with jQuery (when `$` is already on the page)
```js
jQuery(function ($) {                       // safe in WordPress, where $ may not be global (verify)
  var $list = $('#jobs');
  function render(jobs) {
    $list.empty();
    jobs.forEach(function (j) {
      $('<li>').append($('<strong>').text(j.title), document.createTextNode(' - ' + j.employer))
               .appendTo($list);
    });
    $('#count').text(jobs.length + ' jobs');  // #count has role="status"
  }
  // ...call render(...) after loading data
});
```

### fetch with real error handling
```js
async function loadJobs(url) {
  const status = document.getElementById('count');
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) }); // timeout support: (verify)
    if (!res.ok) throw new Error('Server said ' + res.status);
    return await res.json();                    // throws if the body isn't JSON
  } catch (err) {
    status.textContent = 'Could not load jobs. Please try again.'; // plain words, announced
    console.error(err);
    return [];
  }
}
```

### If you must build HTML strings
```js
function esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
list.innerHTML = jobs.map(j => `<li><strong>${esc(j.title)}</strong> - ${esc(j.employer)}</li>`).join('');
```
`challenges/03-job-post-checker/web/app.js` escapes the pasted phrase this way. `starters/static-web/app.js` puts CSV fields into `.html()` without escaping. That's fine for the bundled synthetic file, but **don't copy that pattern** once any value comes from a user, an API or an LLM.

## Do / Don't checklist
- [ ] **Do** keep business rules in a DOM-free IIFE file and test them in Node.
- [ ] **Do** use `addEventListener('submit', ...)` on the `<form>`, not `click` on the button. Then Enter works, and so does native `required` validation.
- [ ] **Do** call `e.preventDefault()` and read values with `form.elements` or `form.fieldName.value`.
- [ ] **Do** prefix globals, CSS classes and IDs with `eri` / `eri_` so they don't clash inside WordPress.
- [ ] **Do** use `Array.isArray`, `JSON.parse` and `String.prototype.trim`. jQuery 4 removed `$.isArray`, `$.parseJSON`, `$.trim` and `$.type`.
- [ ] **Don't** use inline `onclick=""` handlers. They break a strict CSP and mix markup with logic.
- [ ] **Don't** add a bundler, a framework or npm packages for a 4-hour prototype. ERI has to maintain it.
- [ ] **Don't** use ES modules (`type="module"`) unless you serve over HTTP. They fail over `file://` with CORS errors, and they don't put anything in global scope, so the IIFE pattern is simpler here.
- [ ] **Don't** load jQuery from a CDN at the venue without a fallback. Vendor it, as `starters/static-web/vendor/` does.

## Security
- **XSS:** MDN calls `innerHTML` "probably the most common vector for cross-site scripting". It won't run `<script>`, but `<img src=x onerror=...>` does run. Use `textContent`, `.text()`, `createElement`, or `esc()`.
- **LLM output is user input.** Escape it, or render it with `textContent`.
- **No secrets in the browser.** Anything in a `.js` file or a `<script>` is public. LLM calls go through PHP (`starters/ai-helpers/php/llm.php`) with keys read from env vars.
- **Don't log data you shouldn't have.** Even with synthetic data, don't `console.log` whole records in code you'll hand off.
- jQuery 4 adds Trusted Types support, which helps if ERI ever enforces a CSP (`require-trusted-types-for`).

## Accessibility
- After a submit, render results into an existing container and **move focus to the result heading** (`tabIndex = -1`, then `.focus()`). See [html-css-accessibility.md](html-css-accessibility.md).
- Live-region text (`role="status"`) must change **after** the region is already in the DOM. Put it in the initial HTML.
- jQuery 4 changed the focus event order to the W3C order (blur, focusout, focus, focusin). Retest any focus or blur handlers if you upgrade.
- Don't build fake controls (`<div onclick>`). Use `<button>`, which you get keyboard support for free.

## Common AI-assistant mistakes to watch for
| The assistant writes | Fix |
| --- | --- |
| `el.innerHTML = '<li>' + userText + '</li>'` | `textContent` or `esc()` |
| `fetch(url).then(r => r.json())` with no `r.ok` check | Check `ok` and show a plain-language error |
| `$.trim`, `$.isArray`, `.size()`, `.bind()` style APIs | Native equivalents. Check [the 4.0 upgrade guide](https://jquery.com/upgrade-guide/4.0/) (verify, linked from the release post) |
| An `OPENAI_API_KEY` constant in `app.js` | Move the call to PHP and read the key from env |
| `import`/`export` plus a webpack config | Use the IIFE pattern above, with no build step |
| A test file that only `console.log`s | Set `process.exitCode = 1` on failure |
| `$(document).ready(...)` using `$` inside WordPress | `jQuery(function ($) { ... })` |

## How to hand off to ERI
1. Put the core logic in its own file, with tests: `node tests/test.js` prints PASS lines and exits 0.
2. Make no build step and load files with plain `<script>` tags, so they drop into `wp_enqueue_script` (see `challenges/02-job-fit-checker/wp-plugin/`).
3. Write down in the README which jQuery version you tested against. On a WordPress page, check it in the browser console with `jQuery.fn.jquery`. The version WordPress bundles is a (verify) item.
4. List every external URL the code calls, and confirm none of them needs a secret in the browser.

## Sources
- [jQuery 4.0.0 release post](https://blog.jquery.com/?p=5047): released 2026-01-17, drops IE<11, removed APIs, slim build drops Deferreds/Callbacks, focus order, Trusted Types
- [jQuery download](https://jquery.com/download/): 4.0.0 is current, Migrate 3.6.0
- [jQuery version support](https://jquery.com/support/): 3.x gets only critical security and bug fixes
- [jQuery .text()](https://api.jquery.com/text/)
- [MDN textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) · [MDN innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
- [MDN Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) · [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
