# Checkbox

> **Scope note** — This CRD describes the Checkbox component for **Acme**, a fictional product used as an illustrative example in the XConf Americas 2026 talk "Your Design System Has a New User: AI." It is not an authoritative component requirement for jeensdesign.com. Visual specifications reference tokens from the real portfolio design system (`src/styles/tokens.css`) as a baseline; proposed Acme-specific tokens are marked `[proposed]` and do not exist in the repository.
>
> Related controls: [Switch](./switch.crd.md) · [Radio Group](./radio-group.crd.md)

---

## Overview

A checkbox is a binary control that represents an independent selection. Checkboxes are typically used in groups where the user can select multiple options simultaneously, and those selections are collected and committed together by an explicit action — a Submit button, an Apply filter, a Next step.

The checkbox communicates: "I'm recording your choice, and it will take effect when you confirm." This is a semantic promise. Using a checkbox for a setting that actually applies immediately breaks that promise.

---

## Best practices

Use checkboxes when selections are independent and collected together for confirmation.

**Use checkboxes for:**
- Selecting multiple interests or categories
- Choosing optional services during a checkout flow
- Applying multiple search filters when an Apply action follows
- Accepting terms as part of a submission flow
- Any multi-select within a form that has an explicit commit action

**Use the indeterminate state** when a parent checkbox represents a partially selected group. This communicates that some — but not all — children are checked, and is the correct state for parent–child group patterns.

**Avoid checkboxes when:**
- A setting takes effect immediately without a submit step (use a switch)
- Only one option can be selected from a set (use a radio group)
- The interaction model implies immediacy but the visual implies deferred submission

---

## Anatomy

```
┌──────────────────────────────────┐
│ [■] Label text                   │ ← control row
│      Supporting text             │ ← optional
│      Error message               │ ← error state only
└──────────────────────────────────┘
```

| Part | Required | Description |
|------|----------|-------------|
| Selection box | Yes | 20×20px square with 2px border. Contains the checkmark or indeterminate indicator when active. |
| Checkmark | Conditional | White SVG icon visible in the checked state. Centered within the selection box. |
| Indeterminate indicator | Conditional | 10px horizontal bar, centered, used when the checkbox represents a partially selected group. |
| Visible label | Yes | Text describing the setting or option. Vertically centered with the selection box. |
| Supporting text | No | Secondary description below the label. Indented to the label's left edge. |
| Validation message | No | Appears below supporting text in the error state. Associated via `aria-describedby`. |

**Structural rules:**
- The label is always to the right of the selection box. Left-aligned labels are not supported in Acme.
- Supporting text and validation messages share the label's left edge (indented past the selection box).
- The interactive target extends to at least 44×44px around the selection box.

---

## Visual specifications

| Property | Value | Token |
|----------|-------|-------|
| Selection box width | 20px | `--acme-control-size` [proposed] |
| Selection box height | 20px | `--acme-control-size` [proposed] |
| Border width | 2px | `--acme-control-border-width` [proposed] |
| Corner radius | 4px | `--radius-xs` (portfolio) |
| Control-to-label gap | 8px | `--space-2` (portfolio) |
| Supporting text top spacing | 4px | `--space-1` (portfolio) |
| Minimum touch target | 44×44px | `--acme-control-touch-target` [proposed] |
| Label font | DM Sans | `--font-body` (portfolio) |
| Label font size | 14px | `--text-sm` (portfolio) |
| Label font weight | 500 | — |
| Label line height | 1.5 | `--leading-normal` (portfolio) |
| Supporting text font size | 12px | `--text-xs` (portfolio) |

---

## Token mapping

| Element | Property | Acme token [proposed] | Maps to (portfolio) | Resolved value | State |
|---------|----------|----------------------|---------------------|----------------|-------|
| Selection box | Background | `--acme-control-fill-empty` | `--color-white` | #FAFAFA | Default |
| Selection box | Background | `--acme-control-fill-selected` | `--color-black` | #0A0A0A | Checked |
| Selection box | Background | `--acme-control-fill-selected` | `--color-black` | #0A0A0A | Indeterminate |
| Selection box | Background | `--acme-control-fill-disabled` | `--color-gray-100` | #F5F5F0 | Disabled |
| Selection box | Border color | `--acme-control-border-default` | `--color-black` | #0A0A0A | Default |
| Selection box | Border color | `--acme-control-border-subtle` | `--color-gray-300` | #C8C8C0 | Disabled |
| Selection box | Border color | `--acme-control-border-error` | `--color-error` | #FF4444 | Error |
| Checkmark | Color | `--acme-control-indicator-color` | `--color-white` | #FAFAFA | Checked |
| Indeterminate bar | Color | `--acme-control-indicator-color` | `--color-white` | #FAFAFA | Indeterminate |
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
| Unchecked | White fill (#FAFAFA), black 2px border | `aria-checked="false"` |
| Checked | Black fill (#0A0A0A), white checkmark | `aria-checked="true"` |
| Indeterminate | Black fill (#0A0A0A), white 10px horizontal bar centered | `aria-checked="mixed"` |
| Hover | Border darkens slightly (opacity 0.8 on box) | No change |
| Focus-visible | 2px yellow (#F3FE52) outline, 2px offset | Always visible; never suppressed |
| Disabled | Gray fill (#F5F5F0), gray border (#C8C8C0), gray label (#9A9A90) | `disabled` attribute; no hover state |
| Error | Red border (#FF4444), red validation message below | `aria-invalid="true"`, `aria-describedby` → validation message id |

What stays consistent across all states: selection box dimensions, label position, and minimum touch target.

---

## Behavior

- Clicking anywhere within the touch target area toggles the checkbox state.
- Space bar toggles a focused checkbox.
- Visual state change is immediate (within one frame).
- For parent–child checkbox groups: checking the parent checks all children; unchecking the parent unchecks all children. If children have mixed states, the parent shows indeterminate. Checking an indeterminate parent checks all children.

---

## Accessibility

- Use `<input type="checkbox">` with a visible `<label>`. Never rely on `aria-label` alone when a visible label is present.
- For the indeterminate state, set `input.indeterminate = true` in JavaScript — there is no HTML attribute for this state.
- Associate supporting text and validation messages via `aria-describedby` on the input.
- Group related checkboxes in a `<fieldset>` with a `<legend>` describing the collection.
- Ensure the focus ring is always visible. Never suppress `:focus-visible`.
- The touch target must be at least 44×44px. Achieve this by padding the label element, not by increasing the visual selection box size.
- Do not communicate state through color alone. The checkmark and indeterminate bar are shape-based indicators.

---

## Composition

### Grouping checkboxes

Group related checkboxes in a `<fieldset>` with a `<legend>`. The legend should describe what the user is choosing (e.g. "Notification types", "Interests").

### Parent–child groups

When a parent checkbox controls a group of child checkboxes, the parent shows the indeterminate state when children have mixed selections. The parent must update when children are changed, and children must update when the parent is toggled.

### Spacing between checkboxes in a group

- Between checkbox rows: `--space-3` (12px)
- Between distinct groups: `--space-8` (32px)

### Label length

Keep labels concise. "Subscribe to newsletter" is correct. Move legal language or detailed explanations into supporting text below the label.

---

## Common mistakes

| Mistake | Why it's wrong | Correct approach |
|---------|----------------|-----------------|
| Using a checkbox for an immediately-applied setting | Checkboxes signal deferred commitment. Applying the change instantly breaks the implied promise. | Use a switch for settings that take effect without a submit step. |
| Mixing checkboxes and switches in the same group | Implies different interaction models for equivalent settings. | Standardize on one control type per logical group. |
| Skipping the indeterminate state for parent checkboxes | The parent's visual state is inconsistent with the children. Users lose trust in the control. | Implement `input.indeterminate = true` when children have mixed states. |
| `outline: none` on a focused checkbox | Removes the only visible focus indicator for keyboard users. | Use the documented focus ring (2px yellow, 2px offset). Never suppress `:focus-visible`. |
| Hardcoding hex values instead of tokens | Breaks consistency and makes future updates fragile. | Always use a token. Flag gaps rather than hardcoding. |
| Missing `<fieldset>` / `<legend>` for grouped checkboxes | Screen readers read options without context. The user doesn't know what they're selecting from. | Always wrap related checkboxes in a `<fieldset>` with a visible `<legend>`. |
| Touch target smaller than 44×44px | Fails WCAG 2.5.5 and is unusable on touch devices. | Expand the label's padding — not the visual box size — to meet the target. |

---

## Implementation checklist

Before submitting a Checkbox implementation for review:

**Control selection**
- [ ] Checkbox is used only for selections confirmed by an explicit submit action
- [ ] Not used for immediately-applied settings (those use a switch)
- [ ] Not used for mutually exclusive single-choice selections (those use a radio group)

**Anatomy**
- [ ] Selection box (20×20px), visible label, and checkmark (when checked) are present
- [ ] Indeterminate indicator implemented where parent–child groups exist
- [ ] Supporting text and validation message appear only when content warrants them
- [ ] Grouped checkboxes have a visible group label

**Visual tokens**
- [ ] No hardcoded hex values — all colors use proposed Acme tokens or portfolio tokens
- [ ] Unchecked: `--acme-control-fill-empty` (#FAFAFA), `--acme-control-border-default` (#0A0A0A)
- [ ] Checked: `--acme-control-fill-selected` (#0A0A0A), indicator: `--acme-control-indicator-color` (#FAFAFA)
- [ ] Focus ring: `--acme-control-focus-ring` → `--color-focus` (#F3FE52)
- [ ] Error: `--acme-control-border-error` → `--color-error` (#FF4444)
- [ ] Disabled: gray family tokens, not opacity-only treatment

**Dimensions and spacing**
- [ ] Selection box: 20×20px, 4px corner radius, 2px border
- [ ] Touch target: minimum 44×44px
- [ ] Label gap: 8px (`--space-2`)
- [ ] Option spacing: 12px (`--space-3`) within a group

**States**
- [ ] Unchecked, checked, indeterminate, hover, focus-visible, disabled, error implemented
- [ ] No state relies on color as the only differentiator

**Behavior**
- [ ] Space bar toggles a focused checkbox
- [ ] Click target covers the label area
- [ ] Parent–child group state logic implemented correctly

**Accessibility**
- [ ] `<input type="checkbox">` used (not a custom div alone)
- [ ] Visible label associated via `<label for>` or wrapper
- [ ] `aria-describedby` links supporting text and validation messages
- [ ] `aria-invalid="true"` present in error state
- [ ] `<fieldset>` + `<legend>` present for grouped checkboxes
- [ ] Focus ring never suppressed

**Documentation**
- [ ] No undocumented hardcoded values
- [ ] No invented variants outside this CRD
- [ ] Proposed Acme tokens not presented as existing portfolio tokens

---

## Specification completeness

### Fully specified
- Anatomy and required/optional parts
- All interactive states including indeterminate
- Accessibility requirements and semantic HTML pattern
- Keyboard interaction
- Parent–child group behavior
- Composition and grouping rules
- Common misuse patterns

### Proposed (illustrative) — not in the repository

| Token | Proposed value | Portfolio reference |
|-------|---------------|---------------------|
| `--acme-control-size` | 20px | — |
| `--acme-control-border-width` | 2px | — |
| `--acme-control-touch-target` | 44px | — |
| `--acme-control-fill-empty` | → `--color-white` | ✓ exists |
| `--acme-control-fill-selected` | → `--color-black` | ✓ exists |
| `--acme-control-fill-disabled` | → `--color-gray-100` | ✓ exists |
| `--acme-control-border-default` | → `--color-black` | ✓ exists |
| `--acme-control-border-subtle` | → `--color-gray-300` | ✓ exists |
| `--acme-control-border-error` | → `--color-error` | ✓ exists |
| `--acme-control-indicator-color` | → `--color-white` | ✓ exists |
| `--acme-control-focus-ring` | → `--color-focus` | ✓ exists |
| `--acme-label-color` | → `--fg-primary` | ✓ exists |
| `--acme-label-disabled-color` | → `--fg-tertiary` | ✓ exists |
| `--acme-error-text-color` | → `--color-error` | ✓ exists |

### Unresolved decisions
- **Dark-surface variant:** Specifications assume `--bg-primary`/`--bg-surface`. A dark-surface checkbox would require a separate token mapping using `--fg-on-dark-*` families. Not defined here.
- **Disabled cursor:** `cursor: not-allowed` is not specified. Add as an explicit decision if needed.
- **Indeterminate on disabled parent:** Visual treatment for a disabled checkbox in the indeterminate state is not specified.

### Verification still required
- Visual regression against rendered Acme screens
- Screen reader testing (NVDA/Windows, VoiceOver/macOS+iOS, TalkBack/Android) — particularly for indeterminate state announcement
- Physical touch target audit on mobile devices

---

## References

- **Related controls:** [Switch](./switch.crd.md) · [Radio Group](./radio-group.crd.md)
- **Token values:** [`src/styles/tokens.css`](../../../styles/tokens.css)
- **Surface token reasoning and cascade rules:** [`src/system/design-system/foundations.md`](../foundations.md)
- **Accessibility contrast rules:** [`CLAUDE.md` → Accessibility contrast rules](../../../../CLAUDE.md#accessibility-contrast-rules)
- **Component index (portfolio):** [`src/system/design-system/components.md`](../components.md)
- **AI collaboration failure patterns:** [`src/system/failure-modes.md`](../../failure-modes.md)
