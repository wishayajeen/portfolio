# Switch

> **Scope note** — This CRD describes the Switch component for **Acme**, a fictional product used as an illustrative example in the XConf Americas 2026 talk "Your Design System Has a New User: AI." It is not an authoritative component requirement for jeensdesign.com. Visual specifications reference tokens from the real portfolio design system (`src/styles/tokens.css`) as a baseline; proposed Acme-specific tokens are marked `[proposed]` and do not exist in the repository.
>
> Related controls: [Checkbox](./checkbox.crd.md) · [Radio Group](./radio-group.crd.md)

---

## Overview

A switch is a binary control that takes effect immediately when toggled — without a save button or confirmation step. It communicates that the change is instant and reversible. When a user toggles a switch, the setting updates at that moment.

Switches are distinct from checkboxes not just visually but semantically: the toggle metaphor implies immediacy. Placing a switch inside a form that requires submission creates a contradiction between the control's implied behavior and the page's actual interaction model.

---

## Best practices

Use a switch when a setting applies on change, with no confirmation step required.

**Use switches for:**
- Notification preferences (email, SMS, push, marketing)
- Privacy settings and data-sharing toggles
- Feature flags a user enables for their account
- Automatic updates or sync settings
- Any binary preference that takes effect on toggle

**Avoid switches when:**
- The setting is collected alongside others and submitted together (use a checkbox)
- The change has significant, hard-to-reverse consequences that warrant a confirmation dialog (use a button with a confirmation pattern instead)
- An explicit save or submit action follows the user's choices

**Labeling:** The label should describe the setting, not the toggle state. "Email notifications" is correct. "Enable email" or "On/Off" alone is not. The current state must be clear from the visual position of the thumb — not from the label alone.

**Notification preferences example:** A notification preferences screen that applies settings immediately — no save button — uses one switch per notification type. Each is labeled with the notification type; supporting text explains what the notification covers. This is a direct application of the guidance above.

---

## Anatomy

```
┌──────────────────────────────────┐
│ Label text       [○──────]       │ ← off state
│ Supporting text                  │ ← optional
│                                  │
│ Label text       [──────●]       │ ← on state
└──────────────────────────────────┘
```

| Part | Required | Description |
|------|----------|-------------|
| Track | Yes | 46×26px pill-shaped background. Communicates on/off state via fill color. |
| Thumb | Yes | 20×20px circle, inset 3px from the track edge. Slides left (off) or right (on). |
| Visible label | Yes | Text describing the setting. In Acme, placed to the left of the switch track. |
| Supporting text | No | Secondary description below the label, sharing the label's left edge. |
| Validation message | No | Appears below supporting text in the error state. Associated via `aria-describedby`. |

**Structural rules:**
- The label is to the left of the switch track in Acme's notification and settings contexts. Label placement must be consistent within a group.
- The interactive target covers the full label + switch row, minimum 44px tall.
- The thumb must be fully visible in both the on and off positions.
- Supporting text and validation messages are indented to the label's left edge.

---

## Visual specifications

| Property | Value | Token |
|----------|-------|-------|
| Track width | 46px | `--acme-switch-track-width` [proposed] |
| Track height | 26px | `--acme-switch-track-height` [proposed] |
| Track corner radius | 9999px | `--radius-full` (portfolio) |
| Thumb diameter | 20px | `--acme-switch-thumb-size` [proposed] |
| Thumb inset from track edge | 3px | `--acme-switch-thumb-inset` [proposed] |
| Control-to-label gap | 8px | `--space-2` (portfolio) |
| Supporting text top spacing | 4px | `--space-1` (portfolio) |
| Minimum touch target height | 44px | `--acme-control-touch-target` [proposed] |
| Transition duration | 150ms | `--duration-fast` (portfolio) |
| Transition easing | cubic-bezier(0.22, 1, 0.36, 1) | `--ease-out` (portfolio) |
| Label font | DM Sans | `--font-body` (portfolio) |
| Label font size | 14px | `--text-sm` (portfolio) |
| Label font weight | 500 | — |
| Supporting text font size | 12px | `--text-xs` (portfolio) |

---

## Token mapping

| Element | Property | Acme token [proposed] | Maps to (portfolio) | Resolved value | State |
|---------|----------|----------------------|---------------------|----------------|-------|
| Track | Background | `--acme-switch-track-off` | `--color-gray-200` | #E8E8E0 | Off |
| Track | Background | `--acme-switch-track-on` | `--color-black` | #0A0A0A | On |
| Track | Background | `--acme-switch-track-disabled` | `--color-gray-100` | #F5F5F0 | Disabled |
| Track | Border | — | none | — | Default |
| Track | Border | `--acme-control-border-error` | `--color-error` | #FF4444 | Error |
| Thumb | Background | `--acme-switch-thumb-off` | `--color-white` | #FAFAFA | Off |
| Thumb | Background | `--acme-switch-thumb-on` | `--color-yellow` | #F3FE52 | On |
| Thumb | Background | `--acme-switch-thumb-disabled` | `--color-gray-300` | #C8C8C0 | Disabled |
| Thumb | Shadow | — | `--shadow-xs` | 1px 1px 0 0 #0A0A0A | Default |
| Label | Color | `--acme-label-color` | `--fg-primary` | #0A0A0A | Default |
| Label | Color | `--acme-label-disabled-color` | `--fg-tertiary` | #9A9A90 | Disabled |
| Supporting text | Color | — | `--fg-secondary` | #3A3A35 | Default |
| Validation message | Color | `--acme-error-text-color` | `--color-error` | #FF4444 | Error |
| Focus ring | Outline color | `--acme-control-focus-ring` | `--color-focus` | #F3FE52 | Focus-visible |
| Focus ring | Outline width | — | 2px | 2px | Focus-visible |
| Focus ring | Outline offset | — | 2px | 2px | Focus-visible |

---

## States

| State | Visual change | Accessibility |
|-------|--------------|---------------|
| Off | Gray track (#E8E8E0), white thumb at left position | `role="switch"`, `aria-checked="false"` |
| On | Black track (#0A0A0A), yellow thumb (#F3FE52) at right position | `aria-checked="true"` |
| Hover (off) | Track lightens slightly (opacity 0.85) ⚠️ *unresolved — see §Specification completeness* | No change |
| Hover (on) | Track darkens slightly (opacity 0.85) ⚠️ *unresolved* | No change |
| Focus-visible | 2px yellow (#F3FE52) outline on the track, 2px offset | Always visible; never suppressed |
| Disabled | Gray track (#F5F5F0), gray thumb (#C8C8C0), gray label (#9A9A90). No hover or active states. | `aria-disabled="true"`; remove from tab order with `tabindex="-1"` if fully inactive |
| Error | Red border on track, red validation message below | `aria-invalid="true"`, `aria-describedby` → validation message id ⚠️ *error border unresolved* |

The thumb slides between positions with a 150ms ease-out transition. The track fill changes at the same duration. What stays consistent across all states: track and thumb dimensions, label position, and minimum touch target.

---

## Behavior

- Clicking or tapping anywhere on the label or track toggles the switch.
- Space bar or Enter toggles a focused switch.
- State change is immediate. Do not use switches for actions that require a loading state, a confirmation dialog, or any step before the change commits.
- A switch should never open a new page, trigger a complex multi-step flow, or perform a destructive action.

---

## Accessibility

- Use a native `<input type="checkbox">` with `role="switch"` and `aria-checked`. This is currently the best-supported pattern across screen readers.
- Alternatively, use a `<button>` with `role="switch"`, `aria-checked`, and explicit keyboard handling — but native inputs are preferred.
- The visible label must be programmatically associated via `<label for>` or by wrapping the input.
- Associate supporting text and validation messages via `aria-describedby` on the input.
- Switches in a related group should be wrapped in a `<fieldset>` with a `<legend>` describing the group.
- Do not suppress the focus ring. The focus state must be visible at all times.
- Communicate state through thumb position and track color — never through color alone. The thumb's position is a shape-based, color-independent indicator.
- Touch target must be at least 44×44px. Achieve this by padding the label element, not by increasing the visual track size.

---

## Composition

### Grouping switches

When multiple switches relate to the same category (e.g. notification types), group them with a visible section heading. A `<fieldset>` + `<legend>` is optional for switches but appropriate when the group label needs to be programmatically associated.

### Mixed control types

Avoid mixing switches and checkboxes within the same logical group. If a settings panel includes both immediately-applied and form-submitted preferences, separate them visually and communicate the difference clearly through section headings or supporting text.

### Spacing between switches in a group

- Between switch rows: `--space-3` (12px) minimum
- Between distinct setting groups: `--space-8` (32px)

### Label length

Keep labels concise. "Email notifications" is correct. "I would like to receive email notifications from Acme and its partners" belongs in supporting text, not the label.

---

## Common mistakes

| Mistake | Why it's wrong | Correct approach |
|---------|----------------|-----------------|
| Using a switch inside a form with an explicit save button | A switch signals immediacy. A save button contradicts that promise. | Use a checkbox when a submit step follows the user's choices. |
| Mixing switches and checkboxes in the same group | Implies different interaction models for equivalent settings. | Standardize on one control type per logical group. |
| Icon-only switch label | Screen readers and users who cannot distinguish color need a visible text label. | Always provide a visible text label. |
| `outline: none` on a focused switch | Removes the only visible indicator for keyboard users. | Use the documented focus ring (2px yellow, 2px offset). Never suppress `:focus-visible`. |
| Hardcoding hex values instead of tokens | Breaks consistency and makes future updates fragile. | Always use a token. If no token covers the use case, flag it rather than hardcoding. |
| Touch target smaller than 44×44px | Fails WCAG 2.5.5 and is unusable on touch devices. | Expand the label's padding to meet the target — not the visual track size. |

---

## Implementation checklist

Before submitting a Switch implementation for review:

**Control selection**
- [ ] The switch is used only for a setting that takes effect without a submit step
- [ ] No save button or confirmation dialog follows the toggle

**Anatomy**
- [ ] Track (46×26px), thumb (20×20px), and visible label are present
- [ ] Supporting text and validation message appear only when content warrants them
- [ ] Switches in a related group have a visible group label

**Visual tokens**
- [ ] No hardcoded hex values — all colors use proposed Acme tokens or portfolio tokens
- [ ] Track off: `--acme-switch-track-off` → `--color-gray-200` (#E8E8E0)
- [ ] Track on: `--acme-switch-track-on` → `--color-black` (#0A0A0A)
- [ ] Thumb on: `--acme-switch-thumb-on` → `--color-yellow` (#F3FE52)
- [ ] Focus ring: `--acme-control-focus-ring` → `--color-focus` (#F3FE52)
- [ ] Error state: `--acme-control-border-error` → `--color-error` (#FF4444)
- [ ] Disabled state uses gray family tokens, not opacity-only treatment

**Dimensions and spacing**
- [ ] Track: 46×26px
- [ ] Thumb: 20px diameter, 3px inset
- [ ] Touch target: minimum 44px height
- [ ] Label gap: 8px (`--space-2`)

**States**
- [ ] Off, on, hover, focus-visible, disabled, and error states implemented
- [ ] Thumb slides 150ms ease-out on toggle
- [ ] No state relies on color as the only differentiator

**Behavior**
- [ ] Toggle is immediate (no pending or loading state)
- [ ] Click target covers the full label and track
- [ ] Space and Enter toggle a focused switch

**Accessibility**
- [ ] `<input type="checkbox">` with `role="switch"` and `aria-checked` used
- [ ] Visible label programmatically associated via `<label for>` or wrapper
- [ ] `aria-describedby` links supporting text and validation messages
- [ ] `aria-invalid="true"` present in error state
- [ ] Focus ring is never suppressed

**Documentation**
- [ ] No undocumented hardcoded values
- [ ] No invented variants outside this CRD
- [ ] Proposed Acme tokens not presented as existing portfolio tokens

---

## Specification completeness

### Fully specified
- Anatomy and required/optional parts
- All interactive states and their visual changes
- Accessibility requirements and semantic HTML pattern
- Keyboard interaction
- Composition and grouping rules
- Common misuse patterns

### Proposed (illustrative) — not in the repository

| Token | Proposed value | Portfolio reference |
|-------|---------------|---------------------|
| `--acme-switch-track-width` | 46px | — |
| `--acme-switch-track-height` | 26px | — |
| `--acme-switch-thumb-size` | 20px | — |
| `--acme-switch-thumb-inset` | 3px | — |
| `--acme-switch-track-off` | → `--color-gray-200` | ✓ exists |
| `--acme-switch-track-on` | → `--color-black` | ✓ exists |
| `--acme-switch-track-disabled` | → `--color-gray-100` | ✓ exists |
| `--acme-switch-thumb-off` | → `--color-white` | ✓ exists |
| `--acme-switch-thumb-on` | → `--color-yellow` | ✓ exists |
| `--acme-switch-thumb-disabled` | → `--color-gray-300` | ✓ exists |
| `--acme-control-touch-target` | 44px | — |
| `--acme-control-focus-ring` | → `--color-focus` | ✓ exists |
| `--acme-label-color` | → `--fg-primary` | ✓ exists |
| `--acme-label-disabled-color` | → `--fg-tertiary` | ✓ exists |
| `--acme-error-text-color` | → `--color-error` | ✓ exists |
| `--acme-control-border-error` | → `--color-error` | ✓ exists |

### Unresolved decisions
- **Hover treatment:** Opacity 0.85 on the track is a starting point, not a validated value. Confirm with visual design before implementing.
- **Error state:** Red border on the track is proposed. An alternative — error icon or text below without a border change — has not been decided.
- **Dark-surface variant:** Specifications assume `--bg-primary`/`--bg-surface`. A dark-surface switch would require a separate token mapping using `--fg-on-dark-*` families. Not defined here.
- **Disabled cursor:** `cursor: not-allowed` is not specified. Add as an explicit decision if needed.

### Verification still required
- Visual regression against rendered Acme screens
- Screen reader testing (NVDA/Windows, VoiceOver/macOS+iOS, TalkBack/Android)
- Physical touch target audit (44px logical ≠ 44px physical on high-DPI screens)

Documentation alone does not guarantee consistent rendering. Reference implementations and visual regression tests are required before treating these specifications as production-ready.

---

## References

- **Related controls:** [Checkbox](./checkbox.crd.md) · [Radio Group](./radio-group.crd.md)
- **Token values:** [`src/styles/tokens.css`](../../../styles/tokens.css)
- **Surface token reasoning and cascade rules:** [`src/system/design-system/foundations.md`](../foundations.md)
- **Accessibility contrast rules:** [`CLAUDE.md` → Accessibility contrast rules](../../../../CLAUDE.md#accessibility-contrast-rules)
- **Component index (portfolio):** [`src/system/design-system/components.md`](../components.md)
- **AI collaboration failure patterns:** [`src/system/failure-modes.md`](../../failure-modes.md)
