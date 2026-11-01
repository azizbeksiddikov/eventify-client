# Eventify design rules

The one reference for how Eventify looks and behaves. Check every UI change against it.

Owner preference: **familiar design**, in the spirit of Apple's interface guidelines. Standard patterns people already know beat clever ones. Nothing ships unless it passes the checklist at the bottom.

Sources: [Figma, UI design principles](https://www.figma.com/resource-library/ui-design-principles/), [UX Design Institute, UX principles 2026](https://www.uxdesigninstitute.com/blog/ux-design-principles-2026/), Apple Human Interface Guidelines (from general knowledge; check exact values on developer.apple.com/design), [Mynavi TechTus, 10 principles in UI design](https://medium.com/@MynaviTechTusVietnam/10-principles-in-ui-design-enhancing-user-experience-through-practical-examples-9d519e91b515).

## Principles

| #   | Principle                         | In practice                                                                                                                                 |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Clarity**                       | Every element has a purpose and is legible at a glance. Text over decoration.                                                               |
| 2   | **Deference**                     | The interface serves the content. For Eventify the content is the event: photo, title, date, place, price.                                  |
| 3   | **Hierarchy**                     | One main thing per screen, a few secondary things, the rest quiet. Size, weight, contrast and spacing carry the order. One `h1` per page.   |
| 4   | **Consistency**                   | Same component, same look, same behaviour everywhere. One spacing scale, one radius, one shadow, one set of icons.                          |
| 5   | **Familiar patterns**             | Standard navigation (header with menu), native date and select controls on phones, confirm dialogs, back always works.                      |
| 6   | **Proximity and alignment**       | Group what belongs together, separate what does not, align to a grid.                                                                       |
| 7   | **Contrast**                      | The primary action is the loudest thing (filled violet button). Secondary actions are quieter. Destructive actions are red and confirmable. |
| 8   | **Progressive disclosure**        | Show only what this step needs. Filters, advanced options and long text collapse.                                                           |
| 9   | **Context**                       | Design for a phone in one hand, on a bad connection, in sunlight, in a hurry.                                                               |
| 10  | **User control**                  | Undo, cancel, clear filters, and a way out of every state. Cancel comes first in confirm dialogs.                                           |
| 11  | **Accessibility**                 | Contrast, tap size, labels, keyboard use, readable text sizes, reduced motion.                                                              |
| 12  | **Usability**                     | Easy to learn, fast to use, hard to get wrong.                                                                                              |
| 13  | **Simplicity**                    | Less to read, less to decide, fewer elements per screen. Remove what the screen works without.                                              |
| 14  | **Feedback and responsiveness**   | Every tap gets an immediate visible response (pressed state, spinner, toast, status).                                                       |
| 15  | **Error prevention and recovery** | Validate while typing, disable impossible actions, explain errors in plain words and say how to fix them.                                   |
| 16  | **Aesthetics**                    | Clean look, generous white space, good photos, one brand style (colour, type, radius). Beauty supports the content, never competes with it. |
| 17  | **Adaptability**                  | One consistent experience from small phone to desktop, portrait and landscape.                                                              |

## Rules you can check

**Layout: phone first (360 to 430 px wide), then tablet and desktop**

- Side margins 16px. Spacing from one scale: 4, 8, 12, 16, 24, 32, 48.
- Tap targets at least 44 x 44px, with at least 8px between neighbours. Compact sizes apply only to wide screens with a mouse (the `fine:` variant), so tablets and landscape phones keep 44px.
- No horizontal scrolling of the page. Wide content scrolls inside its own container. Must also hold at 200% text and at 320px.
- The first screen shows real content (events), not an empty banner.
- Keep content clear of the notch and the home indicator (safe-area insets; `viewport-fit=cover`).
- Text columns never narrower than about 60% of the screen. No one-word lines in titles.

**Type**

- Body text and inputs 16px or more (smaller makes iOS zoom into inputs). Page title 24 to 30px on a phone. Section titles 18 to 22px.
- Never a heading on 3 lines. Clamp hero titles to 2 lines. Detail-page titles keep the full text instead of clipping.
- Text sizes in rem, never fixed px, so text scales with the user's font setting. No text under 12px.
- Target: one typeface (Manrope), a scale of 5 to 6 sizes, 2 weights in common use.

**Colour**

- Text contrast at least 4.5 : 1 (large text 3 : 1). Colour never carries meaning alone: pair it with text, an icon or `aria-pressed`.
- One accent colour (violet) for the main action and links. Semantic colours (green, amber, red) only for status, errors and destructive actions.
- Light and dark theme both work. Text over photos sits on a 60 to 70% black overlay.

**Motion**

- Respect "reduce motion": no auto-advancing carousels, instant scrolling, no running animations.
- Pressed state on tappable things is CSS and instant (opacity 0.9, scale 0.97).

**Forms**

- Validate as the user types, not only on submit. Keep the submit button enabled and explain what is missing. Focus the first error.
- Keep what the user typed after an error.
- Right keyboard for each field: `type=date/time`, `inputmode=decimal` for price, numeric for capacity, `inputmode=email`, `tel` for phone.
- Show optional fields only when they apply (currency only when a price is entered; recurrence only for recurring events).

**Photos**

- Event and group images keep one aspect ratio (cards 16:9, avatars 1:1), never stretch. Detail photo uses `contain` on a neutral backdrop.
- Calm placeholder while loading and when missing or broken. Every image has alt text.

**Every state is designed**

- Loading (skeleton, not a blank page), empty (say what to do next), error (say what went wrong and how to fix it), long name, no image, offline.
- No raw translation keys anywhere in the UI.

**Behaviour**

- One primary action per screen. Do not render a disabled "Create" bar for users who cannot create.
- Destructive actions (leave group, cancel ticket, delete, cancel event) ask first with a confirm dialog. Reversible one-tap actions (follow, like) do not need one but show a toast.
- Every mutation gives feedback within 100 ms: pressed state, pending text or spinner on the button, toast on success and error.
- Filters and search: collapsed behind a "Filters" button on phones, with a count of active filters and a "Clear" button that is disabled when nothing is selected. Typing in search does not push a history entry per keystroke.
- Phones show a compact counter ("3 / 12") instead of many carousel dots.

## Deliberate exceptions

- Card details are 14px and chips 12px.
- Links inside user-written event descriptions can be under 44px (WCAG 2.5.8 inline-link exception).
- Home calendar: 7 columns cannot fit 8px gaps at 360px, so cells are 44px with tighter gaps.
- Filters use an inline disclosure, not a bottom sheet.

## Known gaps (not done)

- Spacing scale not audited everywhere: some components still use 6, 10 and 14px values.
- Four font weights (400, 500, 600, 700) are in use instead of two; sizes are 6 to 7 instead of 5 to 6.
- Six webfonts load in the page head (Manrope, Inter, Noto Sans KR, Noto Sans, JetBrains Mono, Lora) though only one is used per language.
- The i18n loader renders nothing until translations are fetched, so a very slow connection shows a blank page first. No skeleton.
- No offline banner (network errors show a toast).
- Sign-up account-type cards show the selection only by border colour.
- Very long event titles (about 76 characters) still take 3 lines on 360px detail pages.
- Text over real production photos has not been contrast-checked.

## Definition of done for a design change

1. Looked at in screenshots at 360, 390, 768 and 1280 px, light and dark, plus phone landscape.
2. Script check: no horizontal overflow, no tap target under 44px.
3. Contrast checked on new colours. Dark mode checked.
4. Type check, lint and build pass. Logic changes tested end to end.
5. One logical change per commit.
