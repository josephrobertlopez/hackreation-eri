---
title: HTML, CSS and accessibility (WCAG 2.2 AA)
summary: Copy-paste patterns for accessible forms and results pages (labels, fieldset/legend, focus after results, live regions, contrast, dark mode, reduced motion, 44px targets, 320px reflow) and a 10-minute test routine.
tags: [stack, html, css, accessibility, wcag, aria, forms, testing]
last_verified: 2026-10-23
next_review: 2027-04-23
review_owner: ERI digital accessibility lead
confidence: high
sources:
  - title: Web Content Accessibility Guidelines (WCAG) 2.2, W3C Recommendation 12 December 2024
    url: https://www.w3.org/TR/WCAG22/
    accessed: 2026-10-23
  - title: Understanding SC 2.5.8 Target Size (Minimum)
    url: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
    accessed: 2026-10-23
  - title: Understanding SC 4.1.3 Status Messages
    url: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
    accessed: 2026-10-23
  - title: WAI Forms Tutorial, Grouping Controls
    url: https://www.w3.org/WAI/tutorials/forms/grouping/
    accessed: 2026-10-23
  - title: WAI Forms Tutorial, User Notifications
    url: https://www.w3.org/WAI/tutorials/forms/notifications/
    accessed: 2026-10-23
  - title: ARIA Authoring Practices Guide, Patterns (alert, table, landmarks)
    url: https://www.w3.org/WAI/ARIA/apg/patterns/
    accessed: 2026-10-23
  - title: ARIA APG Table pattern
    url: https://www.w3.org/WAI/ARIA/apg/patterns/table/
    accessed: 2026-10-23
  - title: MDN, ARIA live regions
    url: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions
    accessed: 2026-10-23
  - title: MDN, prefers-reduced-motion
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
    accessed: 2026-10-23
---

# HTML, CSS and accessibility (WCAG 2.2 AA)

## TL;DR
- Use **native HTML first**: `<label for>`, `<fieldset>`/`<legend>` for radio groups, `<button>`, `<table>`. The APG "strongly encourages" a native `table` over ARIA grids for static data.
- After a submit, **move focus to the result heading**. Use `role="status"` for short updates that shouldn't move focus, such as "12 of 60 jobs". WCAG 4.1.3 (AA) requires status messages to be announced without a focus change.
- Key numbers: text contrast **4.5:1** (large text 3:1), UI and focus contrast **3:1** (1.4.11), reflow at **320 CSS px** (1.4.10), targets at least **24x24 px** for AA (2.5.8). **ERI's bar is 44x44 px**, the AAA level in 2.5.5.
- WCAG 2.2 (2024-12-12) added 2.4.11 Focus Not Obscured, 2.5.8 Target Size, 3.3.7 Redundant Entry, 3.3.8 Accessible Authentication and 3.2.6 Consistent Help, and **removed 4.1.1 Parsing**.

## Minimal working example
It matches `challenges/02-job-fit-checker/web/` and adds an error summary.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Check a job - Hello ERI</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <main id="main">
    <h1>Is this job right for me?</h1>
    <div id="errors" role="alert"></div>            <!-- empty until submit fails -->
    <form id="fit-form" novalidate>
      <label for="hours">Hours each week</label>
      <input id="hours" name="hours" type="number" min="1" max="60" required
             inputmode="numeric" aria-describedby="hours-hint">
      <p id="hours-hint" class="hint">Example: 20</p>
      <fieldset>
        <legend>Do you get Social Security disability benefits?</legend>
        <label><input type="radio" id="benefit-ssi" name="benefit" value="SSI" required> SSI</label>
        <label><input type="radio" name="benefit" value="SSDI"> SSDI</label>
        <label><input type="radio" name="benefit" value="none"> No / not sure</label>
      </fieldset>
      <button type="submit">Check this job</button>
    </form>
    <p id="count" role="status" aria-live="polite"></p>  <!-- short, non-focus updates -->
    <section id="fit-result" aria-labelledby="result-h"></section>
  </main>
  <script src="app.js"></script>
</body>
</html>
```

```js
// app.js: validate, then show errors (and focus them) or show results (and focus the heading)
document.getElementById('fit-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var f = e.target, errors = document.getElementById('errors');
  errors.replaceChildren();
  var bad = !f.hours.value ? ['hours', 'Enter hours each week.']
          : !f.benefit.value ? ['benefit-ssi', 'Pick an answer about benefits.'] : null;
  if (bad) {
    var a = document.createElement('a');
    a.href = '#' + bad[0]; a.textContent = bad[1];
    errors.append(a);                                  // role="alert" announces it
    document.getElementById(bad[0]).focus();
    return;
  }
  var h2 = document.createElement('h2');
  h2.id = 'result-h'; h2.tabIndex = -1; h2.textContent = 'Good to know';
  document.getElementById('fit-result').replaceChildren(h2 /*, ...more nodes */);
  h2.focus();
});
```
The pattern: one message, linked to the field, and then focus goes to that field. Using `novalidate` swaps the browser's error bubbles for your own plain-language messages. Leave it off if you'd rather keep the native bubbles.

```css
:root { --fg:#1b1b1b; --bg:#fff; --accent:#0b5cad; --muted:#555; --error:#b00020; }
@media (prefers-color-scheme: dark) {
  :root { --fg:#f2f2f2; --bg:#141414; --accent:#7db7ff; --muted:#bbb; --error:#ff8a80; }
}
* { box-sizing: border-box; }
body { font: 18px/1.5 system-ui, sans-serif; color: var(--fg); background: var(--bg);
       margin: 0 auto; max-width: 48rem; padding: 1rem; }
img, table { max-width: 100%; }                        /* 320px reflow */
.skip { position: absolute; left: -999px; } .skip:focus { left: 1rem; top: 1rem; background: var(--bg); padding: .5rem; }
label { display: block; font-weight: 600; margin-top: 1rem; }
input, textarea, select { font: inherit; width: 100%; padding: .6rem; border: 2px solid var(--muted); border-radius: 6px; }
button, fieldset label { min-height: 44px; }           /* ERI target size */
fieldset label { display: flex; align-items: center; gap: .5rem; font-weight: 400; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
#errors a { color: var(--error); font-weight: 600; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}
```
The palette is the repo's own (`starters/static-web/style.css`). Recheck contrast if you change any color.

## Do / Don't checklist
- [ ] **Do** use one `h1`, headings in order, `main` with a skip link, and `lang="en"`.
- [ ] **Do** put a visible `<label>` on every input. A placeholder is not a label.
- [ ] **Do** group radios in `fieldset`/`legend`, and keep the legend short (some screen readers repeat it for each option).
- [ ] **Do** tie hints and errors to fields with `aria-describedby`, and say how to fix the error in text, not only in color.
- [ ] **Do** reflect the outcome in `<title>` or the `h1` on multi-step flows (WAI notifications tutorial).
- [ ] **Do** use `<table>` with `<caption>` and `<th scope="col">` for tabular results, such as a funding-gap list.
- [ ] **Don't** use `aria-live="assertive"` for routine updates. MDN: "extremely annoying… use sparingly".
- [ ] **Don't** inject a live region and fill it in the same tick. It must exist in the initial markup.
- [ ] **Don't** put `role="alert"` and `aria-live="assertive"` on the same element. MDN notes double speech on iOS VoiceOver.
- [ ] **Don't** remove focus outlines, use `tabindex` > 0, or build `div` buttons.
- [ ] **Don't** hide content behind sticky headers. 2.4.11 requires that focus is not entirely obscured.

## Security
- Accessibility code is still code. Error and status messages that echo user input go in through `textContent` ([javascript-jquery.md](javascript-jquery.md)).
- Login screens, if any: no cognitive puzzles or copy-blocking. Allow paste and password managers (3.3.8 Accessible Authentication). Better still, don't add login to a 4-hour prototype.

## Accessibility: 10-minute test routine
1. **Keyboard only:** unplug the mouse. Tab through every control. Is focus visible everywhere? Can you reach and use every control, with no trap? Do Enter and Space work?
2. **Zoom 200% and a 320px-wide window** (DevTools device toolbar, width 320): you should need no sideways scroll for text.
3. **Automated:** Chrome DevTools > Lighthouse > Accessibility, and `npx @axe-core/cli http://localhost:8000` (verify the CLI name and version). Automated tools catch only part of the problems, so fix what they find and keep testing by hand.
4. **Contrast:** WebAIM contrast checker on text, borders and focus rings, in both light and dark mode.
5. **Screen reader, 2 minutes:** VoiceOver (Cmd+F5) or NVDA. Submit the form. You should hear the result heading. Search and you should hear "12 of 60 jobs".
6. **Reduced motion:** turn on the OS setting and reload. Nothing should slide or pulse.
7. **Plain language:** read the result aloud. Aim for about a 6th-grade level, and spell out SSI and SSDI the first time.

### Note on the repo's result pattern
`challenges/02` and `03` put `aria-live="polite"` on the result section **and** move focus to it. Some screen readers may then read the result twice (verify with VoiceOver and NVDA). Pick one: move focus to a heading (good for submit results), or use a live region with no focus move (good for filters).

## Common AI-assistant mistakes to watch for
- `aria-label` on a `<div>` with no role. ARIA on non-interactive generic elements is often ignored.
- `role="button"` on a `div` without `tabindex="0"` and Enter/Space handlers. Use `<button>`.
- Claiming "WCAG 2.2 AA requires 44x44 targets". AA is 24x24 (2.5.8). 44x44 is AAA (2.5.5) and is ERI's chosen bar.
- Citing "4.1.1 Parsing". It was removed in WCAG 2.2.
- `outline: none` in a CSS reset, `placeholder` used as the label, or color as the only error signal.
- Live regions created by JS right before the message is set.
- An invented "WCAG 3.0 requirement". WCAG 2.2 is the current Recommendation.

## How to hand off to ERI
- Include a short **"Accessibility check"** section in the team README: what you tested (keyboard, zoom/320px, Lighthouse score, which screen reader) and what's still known to be broken.
- Keep the CSS in one file with color tokens on `:root`. ERI's theme can then override `--accent` and friends.
- Keep markup that works without JS where you can (a real `<form>`), so the WordPress version degrades gracefully.

## Sources
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/): criteria numbers and levels, 4.1.1 removed, published 2024-12-12
- [Understanding 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Understanding 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- [WAI Forms: Grouping](https://www.w3.org/WAI/tutorials/forms/grouping/) · [WAI Forms: Notifications](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [APG Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) · [APG Table](https://www.w3.org/WAI/ARIA/apg/patterns/table/)
- [MDN live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions) · [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
