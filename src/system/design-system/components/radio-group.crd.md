# Radio Group

> **Scope note** — This CRD describes the Radio Group component for **Acme**, a fictional product used as an illustrative example in the XConf Americas 2026 talk "Your Design System Has a New User: AI." It is not an authoritative component requirement for jeensdesign.com. Visual specifications reference tokens from the real portfolio design system (`src/styles/tokens.css`) as a baseline; proposed Acme-specific tokens are marked `[proposed]` and do not exist in the repository.
>
> Related controls: [Checkbox](./checkbox.crd.md) · [Switch](./switch.crd.md)

---

## Overview

A radio group lets a user choose exactly one option from a mutually exclusive set. Selecting any option immediately deselects all others in the same group — this is a structural property of radio inputs enforced by the browser, not a convention.

Radio groups are used when the choices are exclusive by nature: a user can only have one shipping method, one subscription plan, one payment option. For independent selections where multiple can be active, use checkboxes. For binary settings that apply immediately, use a switch.

---

## Best practices

Use a radio group when the user must commit to exactly one option.

**Use radio groups for:**
- Selecting a shipping method
- Choosing a subscription plan
- Picking a payment option
- Any single-choice selection within a form

**When the selection takes effect:** In most cases, the selected option is confirmed by a form submission. However, a radio group can drive immediate UI changes — for example, updating a pricing breakdown as the user switches plans. Whether a submit step follows depends on the product flow, not on the radio control itself.

**Always label the group:** Provide a visible group label (a `<legend>` inside a `<fieldset>`) that describes what the user is choosing. Individual option labels are not enough — screen readers need the group context.

**Avoid radio groups when:**
- Multiple options can be selected simultaneously (use checkboxes)
- The setting is binary and takes effect immediately (use a switch)
- There are more than 5–7 options (consider a select dropdown for longer lists)

---

## Anatomy

```
┌──────────────────────────────────┐
│ Group label (legend)             │
│                                  │
│ (●) Option one                   │ ← selected
│ ( ) Option two                   │
│ ( ) Option three                 │
│     Supporting text              │ ← optional per option
│                                  │
│     Validation message           │ ← error state, group level
└──────────────────────────────────┘
```

| Part | Required | Description |
|------|----------|-------------|
| Group label / legend | Yes | Describes what the user is choosing. Rendered as `<legend>` inside `<fieldset>`. Must be visible. |
| Circular control | Yes | 20×20px circle with 2px border. |
| Selected indicator | Conditional | 8px filled circle centered within the ring, visible in the selected state. |
| Option label | Yes | Text describing the option. To the right of the circular control. |
| Supporting text | No | Additional description below the option label, indented to the label's left edge. |
| Validation message | No | Displayed at the group level below all options in the error state. |

**Structural rules:**
- All options in a group must share a common group label.
- Options are stacked vertically. Horizontal radio groups are not supported in Acme.
- The gap between options is 12px (`--space-3`).
- The selected indicator is the same color as the ring border in the selected state, creating a concentric circle appearance.
- There is no "none selected" state after the first selection. If an empty initial state is required, communicate it explicitly as a default option or placeholder.

---

## Visual specifications

| Property | Value | Token |
|----------|-------|-------|
| Control width | 20px | `--acme-control-size` [proposed] |
| Control height | 20px | `--acme-control-size` [proposed] |
| Border width | 2px | `--acme-control-border-width` [proposed] |
| Corner radius | 9999px | `--radius-full` (portfolio) |
| Selected indicator diameter | 8px | `--acme-radio-indicator-size` [proposed] |
| Control-to-label gap | 8px | `--space-2` (portfolio) |
| Option row gap (vertical) | 12px | `--space-3` (portfolio) |
| Group label bottom spacing | 12px | `--space-3` (portfolio) |
| Supporting text top spacing | 4px | `--space-1` (portfolio) |
| Minimum touch target | 44×44px | `--acme-control-touch-target` [proposed] |
| Option label font | DM Sans | `--font-body` (portfolio) |
| Option label font size | 14px | `--text-sm` (portfolio) |
| Option label font weight | 500 | — |
| Group label font size | 14px | `--text-sm` (portfolio) |
| Group label font weight | 600 | — |
| Supporting text font size | 12px | `--text-xs` (portfolio) |

---

## Token mapping

| Element | Property | Acme token [proposed] | Maps to (portfolio) | Resolved value | State |
|---------|----------|----------------------|---------------------|----------------|-------|
| Circular control | Background | `--acme-control-fill-empty` | `--color-white` | #FAFAFA | Unselected |
| Circular control | Background | `--acme-control-fill-empty` | `--color-white` | #FAFAFA | Selected (ring only) |
| Circular control | Background | `--acme-control-fill-disabled` | `--color-gray-100` | #F5F5F0 | Disabled |
| Circular control | Border color | `--acme-control-border-default` | `--color-black` | #0A0A0A | Unselected |
| Circular control | Border color | `--acme-control-fill-selected` | `--color-black` | #0A0A0A | Selected |
| Circular control | Border color | `--acme-control-border-subtle` | `--color-gray-300` | #C8C8C0 | Disabled |
| Circular control | Border color | `--acme-control-border-error` | `--color-error` | #FF4444 | Error |
| Selected indicator | Fill | `--acme-control-fill-selected` | `--color-black` | #0A0A0A | Selected |
| Selected indicator | Fill | `--acme-control-border-subtle` | `--color-gray-300` | #C8C8C0 | Disabled + selected |
| Option label | Color | `--acme-label-color` | `--fg-primary` | #0A0A0A | Default |
| Option label | Color | `--acme-label-disabled-color` | `--fg-tertiary` | #9A9A90 | Disabled |
| Group label | Color | — | `--fg-primary` | #0A0A0A | Default |
| Supporting text | Color | — | `--fg-secondary` | #3A3A35 | Default |
| Validation message | Color | `--acme-error-text-color` | `--color-error` | #FF4444 | Error |
| Focus ring | Outline color | `--acme-control-focus-ring` | `--color-focus` | #F3FE52 | Focus-visible |
| Focus ring | Outline width | — | 2px | 2px | Focus-visible |
| Focus ring | Outline offset | — | 2px | 2px | Focus-visible |

---

## States

| State | Visual change | Accessibility |
|-------|--------------|---------------|
| Unselected | White fill (#FAFAFA), black 2px border, no indicator | `aria-checked="false"` |
| Selected | White fill (#FAFAFA), black 2px border, 8px black indicator (filled circle centered) | `aria-checked="true"` |
| Hover | Border opacity 0.8 | No change |
| Focus-visible | 2px yellow (#F3FE52) outline, 2px offset, on the currently focused option | Always visible; never suppressed |
| Disabled (option) | Gray fill (#F5F5F0), gray border (#C8C8C0), gray label (#9A9A90). Skipped in arrow-key navigation. | `disabled` attribute |
| Disabled (group) | All options disabled | `fieldset[disabled]` disables all children |
| Error | Red border (#FF4444) on all options, red group-level validation message | `aria-invalid="true"` on all inputs; `aria-describedby` → group error id |

What stays consistent: the group label position, vertical option stacking, control dimensions, and spacing.

---

## Behavior

- Arrow keys navigate between options within the group. Pressing an arrow key both moves focus and selects the new option simultaneously (the native roving selection behavior).
- The group as a whole receives one tab stop. Individual options within it are navigated with arrow keys — do not add individual `tabindex` to radio inputs.
- Selecting an option immediately deselects all others in the same group.
- Clicking a label or its circular control selects that option.
- Once an option is selected, the group cannot return to an unselected state without programmatic intervention. If an empty default is needed, design it explicitly.

---

## Accessibility

- Wrap all options in a `<fieldset>` with a `<legend>`. The legend is the group label — it must be visible and descriptive.
- Use `<input type="radio" name="group-name">` for each option. The shared `name` attribute creates the group; the browser enforces mutual exclusion.
- Associate per-option supporting text via `aria-describedby` on each input.
- Associate group-level validation messages via `aria-describedby` on each input, or by referencing the error in the legend text.
- Do not add custom `tabindex` to radio inputs — rely on the native roving behavior.
- Ensure the focus ring is visible on the currently focused option at all times.
- Do not communicate state through color alone. The selected indicator (the filled inner circle) is a shape-based differentiator.
- Touch target must be at least 44×44px per option. Achieve this by padding the option label element.

---

## Composition

### Grouping and spacing

All options in a radio group share a `<fieldset>` with a `<legend>`. The legend must be visible. Options are stacked vertically with 12px gaps. The group label sits 12px above the first option.

### Multiple radio groups in one view

When a form contains multiple radio groups, each group has its own `<fieldset>` + `<legend>`. The groups are separated by `--space-8` (32px).

### Label length

Keep option labels concise. If an option requires detailed explanation, use supporting text below the label — not inside the label itself.

---

## Common mistakes

| Mistake | Why it's wrong | Correct approach |
|---------|----------------|-----------------|
| Using radio buttons for independent settings | Radio inputs enforce mutual exclusion — selecting one deselects others. For independent toggles, this is incorrect behavior. | Use checkboxes or switches for independent settings. |
| Missing `<fieldset>` / `<legend>` | Screen readers announce each option without group context. The user doesn't know what they're choosing from. | Always wrap radio groups in a `<fieldset>` with a visible `<legend>`. |
| `outline: none` on a focused option | Removes the only visible focus indicator for keyboard users. | Use the documented focus ring (2px yellow, 2px offset). Never suppress `:focus-visible`. |
| Adding `tabindex` to individual radio inputs | Breaks the native roving tab index. The browser's arrow-key navigation no longer works correctly. | Do not set `tabindex` on radio inputs. The group gets one tab stop; arrow keys handle the rest. |
| Hardcoding hex values instead of tokens | Breaks consistency and makes updates fragile. | Always use a token. Flag gaps rather than hardcoding. |
| Touch target smaller than 44×44px per option | Fails WCAG 2.5.5 and is unusable on touch devices. | Expand the label's padding — not the visual control size. |

---

## Implementation checklist

Before submitting a Radio Group implementation for review:

**Control selection**
- [ ] Radio group is used only for mutually exclusive single-choice selections
- [ ] Not used for independent multi-select (that uses checkboxes)
- [ ] Not used for binary immediate-effect settings (that uses a switch)

**Anatomy**
- [ ] Circular control (20×20px), option label, and visible group label are present
- [ ] Selected indicator (8px filled circle) appears only in the selected state
- [ ] Supporting text and validation message appear only when content warrants them
- [ ] Group label is visible and descriptive

**Visual tokens**
- [ ] No hardcoded hex values
- [ ] Unselected: `--acme-control-fill-empty` (#FAFAFA), `--acme-control-border-default` (#0A0A0A)
- [ ] Selected: indicator fill `--acme-control-fill-selected` (#0A0A0A)
- [ ] Focus ring: `--acme-control-focus-ring` → `--color-focus` (#F3FE52)
- [ ] Error: `--acme-control-border-error` → `--color-error` (#FF4444)
- [ ] Disabled: gray family tokens, not opacity-only treatment

**Dimensions and spacing**
- [ ] Control: 20×20px circle, 2px border
- [ ] Selected indicator: 8px diameter, centered
- [ ] Touch target: minimum 44×44px per option
- [ ] Label gap: 8px (`--space-2`)
- [ ] Option spacing: 12px (`--space-3`)

**States**
- [ ] Unselected, selected, hover, focus-visible, disabled (per option and group), error implemented
- [ ] No state relies on color as the only differentiator

**Behavior**
- [ ] Arrow-key navigation selects and moves focus simultaneously
- [ ] One tab stop for the group; arrow keys move within
- [ ] Click target covers the label area

**Accessibility**
- [ ] `<input type="radio">` with shared `name` attribute used
- [ ] `<fieldset>` + `<legend>` wrapping the group
- [ ] `aria-describedby` links per-option supporting text
- [ ] Group-level error associated via `aria-describedby` or legend
- [ ] `aria-invalid="true"` present in error state
- [ ] No custom `tabindex` on radio inputs
- [ ] Focus ring never suppressed

**Documentation**
- [ ] No undocumented hardcoded values
- [ ] No invented variants outside this CRD
- [ ] Proposed Acme tokens not presented as existing portfolio tokens

---

## Specification completeness

### Fully specified
- Anatomy and required/optional parts
- All interactive states
- Accessibility requirements and semantic HTML pattern
- Keyboard interaction (native roving selection)
- Composition and grouping rules
- Common misuse patterns

### Proposed (illustrative) — not in the repository

| Token | Proposed value | Portfolio reference |
|-------|---------------|---------------------|
| `--acme-control-size` | 20px | — |
| `--acme-control-border-width` | 2px | — |
| `--acme-control-touch-target` | 44px | — |
| `--acme-radio-indicator-size` | 8px | — |
| `--acme-control-fill-empty` | → `--color-white` | ✓ exists |
| `--acme-control-fill-selected` | → `--color-black` | ✓ exists |
| `--acme-control-fill-disabled` | → `--color-gray-100` | ✓ exists |
| `--acme-control-border-default` | → `--color-black` | ✓ exists |
| `--acme-control-border-subtle` | → `--color-gray-300` | ✓ exists |
| `--acme-control-border-error` | → `--color-error` | ✓ exists |
| `--acme-control-focus-ring` | → `--color-focus` | ✓ exists |
| `--acme-label-color` | → `--fg-primary` | ✓ exists |
| `--acme-label-disabled-color` | → `--fg-tertiary` | ✓ exists |
| `--acme-error-text-color` | → `--color-error` | ✓ exists |

### Unresolved decisions
- **Indeterminate visual for radio:** Not defined. Indeterminate state is documented only for checkboxes. If a partial-selection state is needed for a radio variant in future, a separate decision is required.
- **Dark-surface variant:** Specifications assume `--bg-primary`/`--bg-surface`. A dark-surface radio group would require separate token mapping using `--fg-on-dark-*` families. Not defined here.
- **Disabled cursor:** `cursor: not-allowed` is not specified. Add as an explicit decision if needed.

### Verification still required
- Visual regression against rendered Acme screens
- Screen reader testing (NVDA/Windows, VoiceOver/macOS+iOS, TalkBack/Android) — particularly arrow-key selection announcement
- Physical touch target audit on mobile devices

---

## References

- **Related controls:** [Checkbox](./checkbox.crd.md) · [Switch](./switch.crd.md)
- **Token values:** [`src/styles/tokens.css`](../../../styles/tokens.css)
- **Surface token reasoning and cascade rules:** [`src/system/design-system/foundations.md`](../foundations.md)
- **Accessibility contrast rules:** [`CLAUDE.md` → Accessibility contrast rules](../../../../CLAUDE.md#accessibility-contrast-rules)
- **Component index (portfolio):** [`src/system/design-system/components.md`](../components.md)
- **AI collaboration failure patterns:** [`src/system/failure-modes.md`](../../failure-modes.md)
