# Accessibility: the bar

ERI serves people with disabilities. **An inaccessible project can't win.** Target WCAG 2.2 AA.

## Must-haves (judges will check in 2 minutes)
- [ ] Works with **keyboard only**: Tab through everything, visible focus ring, no traps
- [ ] Every input has a **visible label**; errors are announced in text, not only by color
- [ ] Headings in order (one `h1`), landmarks (`main`, `nav`), and a skip link
- [ ] **Contrast** 4.5:1 for text; don't rely on color alone
- [ ] Images have `alt` text (decorative = `alt=""`)
- [ ] Usable at 200% zoom and 320px wide (phones)
- [ ] Touch targets at least 44x44 px
- [ ] Plain language: about a 6th-grade reading level for job seeker screens; define acronyms
- [ ] Status updates use `role="status"` / `aria-live="polite"`; mobile uses `accessibilityLabel`
- [ ] Test once with a screen reader: VoiceOver (Mac/iOS: Cmd+F5), NVDA (Windows), or TalkBack (Android)

## Quick tools
- Browser: Lighthouse (Chrome DevTools > Lighthouse > Accessibility)
- `npx @axe-core/cli http://localhost:8000`
- WebAIM contrast checker

## Beyond compliance
Design **with** disabled users. Teams that test with a person with lived experience during the day get a scoring bonus.
