# Selection Controls

> **Scope note** — This CRD describes selection controls for **Acme**, a fictional product used as an illustrative example in the XConf Americas 2026 talk "Your Design System Has a New User: AI." It is not an authoritative component requirement for jeensdesign.com. The visual specifications reference tokens from the real portfolio design system (`src/styles/tokens.css`) as a baseline; proposed Acme-specific tokens are marked `[proposed]` and do not exist in the repository.

---

## 1 Overview

Selection controls let people make choices. The three controls — **checkbox**, **switch**, and **radio group** — look similar but encode different interaction promises:

- A **checkbox** says *"I'm collecting your selections. They'll take effect when you confirm."*
- A **switch** says *"This takes effect right now."*
- A **radio group** says *"Choose exactly one."*

Choosing the wrong control misrepresents how the interface works, even when the layout looks reasonable at first glance. Notificationpreferences that use checkboxes instead of switches tell the user their change is queued — then apply it immediately, breaking the implicit contract. Getting the control right is a semantic decision, not a visual preference.

---

## 2 Scope

This document covers:

- Standalone checkboxes, switches, and radio buttons
- Grouped checkboxes and radio groups
- All interactive states (default, hover, focus-visible, disabled, error)
- Accessibility requirements and keyboard behavior
- Visual specifications and token mappings for Acme

It does not cover:

- Select dropdowns or comboboxes
- Segmented controls or button groups used for single-selection
- Custom control implementations without semantic HTML

---

## 3 Best practices

### Switches

Use a switch when a setting takes effect immediately — without a save button or confirmation step. Switches communicate that toggling them has instant, reversible consequences.

**Use switches for:**
- Notification preferences (email, SMS, push)
- Privacy settings and data-sharing toggles
- Feature flags a user enables for their account
- Automatic updates or sync settings
- Any binary preference that applies on change

**Avoid switches when:**
- The setting is collected alongside others and submitted together
- The change is not easily reversible or has significant downstream effects
- An explicit confirmation step is required before the change takes effect

**Clarity:** Label the current state unambiguously. The label should describe the setting, not the toggle state ("Email notifications" not "Enable email"). Do not use "On" or "Off" as the only label.

### Checkboxes

Use checkboxes when selections are independent and confirmed together — in a form, a filter panel, or a multi-step flow where an explicit action (Submit, Apply, Next) commits the choices.

**Use checkboxes for:**
- Selecting multiple interests or categories
- Choosing optional services during checkout
- Applying multiple search filters where an Apply button follows
- Accepting terms as part of a submission flow

**Use the indeterminate state** when a parent checkbox represents a partially selected group. This communicates that some, but not all, children are selected.

**Avoid checkboxes when:**
- A setting takes effect immediately (use a switch)
- Only one option can be selected from a group (use a radio group)

### Radio groups

Use a radio group when the user must choose exactly one option from a mutually exclusive set. Selecting one option immediately deselects the others — this is a structural property of radio inputs, not a convention.

**Use radio groups for:**
- Selecting a shipping method
- Choosing a subscription plan
- Picking a payment option
- Any exclusive single-choice within a form

**When the selection takes effect:** In most cases, the radio selection is confirmed by a form submission. However, a radio group can drive immediate UI changes — for example, updating a pricing breakdown as the user switches plans. Whether submission is required depends on the product flow, not on the control type.

**Label the group:** Always provide a visible group label (`<legend>` or equivalent) that describes what the user is choosing.

---

## 4 Checkbox

### Anatomy

```
┌──────────────────────────────────┐
│ [■] Label text                   │ ← control row
│      Supporting text             │ ← optional
│      Error message               │ ← error state only
└──────────────────────────────────┘
```

| Part | Required | Description |
|------|----------|-------------|
| Selection box | Yes | 20×20px square with 2px border. Contains checkmark or indeterminate indicator when active. |
| Checkmark | Conditional | White SVG icon visible in the checked state. Centered within the selection box. |
| Indeterminate indicator | Conditional | 10px horizontal bar, centered, used when the checkbox represents a partially selected group. |
| Visible label | Yes | Text describing the setting or option. Aligned to the vertical center of the selection box. |
| Supporting text | No | Secondary description below the label. Same horizontal indent as the label. |
| Validation message | No | Appears below supporting text in the error state. Associated via `aria-describedby`. |

**Structural rules:**
- The label is always to the right of the selection box. Left-aligned labels are not supported in Acme.
- Supporting text and validation messages share the label's left edge (indented past the selection box).
- The interactive target extends to at least 44×44px around the selection box.

### Visual specifications

| Property | Value | Token |
|----------|-------|-------|
| Selection box width | 20px | `--acme-control-size` [proposed] |
| Selection box height | 20px | `--acme-control-size` [proposed] |
| Border width | 2px | `--acme-control-border-width` [proposed] |
| Corner radius | 4px | `--radius-xs` (portfolio) |
| Control-to-label gap | 8px | `--space-2` (portfolio) |
| Supporting text top spacing | 4px | `--space-1` (portfolio) |
| Minimum touch target | 44×44px | `--acme-control-touch-target` [proposed] |

### Token mapping

| Element | Property | Acme token [proposed] | Maps to (portfolio) | Resolved value | State |
|---------|----------|----------------------|---------------------|----------------|-------|
| Selection box | Background | `--acme-control-fill-empty` | `--color-white` | #FAFAFA | Default |
| Selection box | Background | `--acme-control-fill-selected` | `--color-black` | #0A0A0A | Checked |
| Selection box | Background | `--acme-control-fill-disabled` | `--color-gray-100` | #F5F5F0 | Disabled |
| Selection box | Border color | `--acme-control-border-default` | `--color-black` | #0A0A0A | Default |
| Selection box | Border color | `--acme-control-border-subtle` | `--color-gray-300` | #C8C8C0 | Disabled |
| Selection box | Border color | `--acme-control-border-error` | `--color-error` | #FF4444 | Error |
| Checkmark / indicator | Color | `--acme-control-indicator-color` | `--color-white` | #FAFAFA | Checked |
| Label | Color | `--acme-label-color` | `--fg-primary` | #0A0A0A | Default |
| Label | Color | `--acme-label-disabled-color` | `--fg-tertiary` | #9A9A90 | Disabled |
| Label | Font | — | `--font-body` | DM Sans | All |
| Label | Font size | — | `--text-sm` | 14px | All |
| Label | Font weight | — | 500 | 500 | All |
| Label | Line height | — | `--leading-normal` | 1.5 | All |
| Supporting text | Color | — | `--fg-secondary` | #3A3A35 | Default |
| Supporting text | Font size | — | `--text-xs` | 12px | All |
| Validation message | Color | `--acme-error-text-color` | `--color-error` | #FF4444 | Error |
| Focus ring | Outline color | `--acme-control-focus-ring` | `--color-focus` | #F3FE52 | Focus-visible |
| Focus ring | Outline width | — | 2px | 2px | Focus-visible |
| Focus ring | Outline offset | — | 2px | 2px | Focus-visible |

### States

| State | Visual change | Accessibility |
|-------|--------------|---------------|
| Unchecked | White fill, black 2px border | `aria-checked="false"` |
| Checked | Black fill, white checkmark | `aria-checked="true"` |
| Indeterminate | Black fill, white horizontal bar | `aria-checked="mixed"` |
| Hover | Border darkens slightly (opacity 0.8 on box) | No change |
| Focus-visible | 2px yellow (`#F3FE52`) outline, 2px offset | Keyboard-navigable; do not hide focus |
| Disabled | Gray fill (#F5F5F0), gray border (#C8C8C0), gray label (#9A9A90) | `disabled` attribute; label reads "unavailable" to assistive tech if appropriate |
| Error | Red border (#FF4444), red validation message below | `aria-invalid="true"`, `aria-describedby` → validation message id |

What stays consistent across all states: the selection box dimensions, label position, and minimum touch target.

### Behavior

- Clicking anywhere within the touch target area toggles the checkbox state.
- Space bar toggles a focused checkbox.
- State change is immediate (visual feedback within one frame).
- For parent–child checkbox groups, checking the parent checks all children; unchecking the parent unchecks all children. If children have mixed states, the parent shows indeterminate.

### Accessibility

- Use `<input type="checkbox">` with a visible `<label>`. Never rely on `aria-label` alone when a visible label is present.
- Associate supporting text and validation messages via `aria-describedby` on the input.
- Group related checkboxes in a `<fieldset>` with a `<legend>` describing the collection.
- Ensure the focus ring is always visible and never suppressed with `outline: none`.
- The touch target must be at least 44×44px. This is typically achieved by padding the label element rather than increasing the visual control size.
- Do not communicate state through color alone. The checkmark and indeterminate bar are shape-based indicators.

---

## 5 Switch

### Anatomy

```
┌──────────────────────────────────┐
│ Label text       [○──────]       │ ← off state
│ Supporting text                  │ ← optional
│ Label text       [──────●]       │ ← on state
└──────────────────────────────────┘
```

| Part | Required | Description |
|------|----------|-------------|
| Track | Yes | 46×26px pill-shaped background. Communicates on/off state via fill. |
| Thumb | Yes | 20×20px circle, inset 3px from the track edge. Slides left (off) to right (on). |
| Visible label | Yes | Text describing the setting. Typically to the left of the switch in Acme. |
| Supporting text | No | Secondary description below the label. |
| Validation message | No | Appears below supporting text in the error state. |

**Structural rules:**
- Label is to the left of the switch track in Acme's notification and settings contexts. Position may vary in other layouts, but label placement must be consistent within a group.
- The interactive target is the full label + switch row, minimum 44px tall.
- The thumb must be fully visible in both the on and off positions.

### Visual specifications

| Property | Value | Token |
|----------|-------|-------|
| Track width | 46px | `--acme-switch-track-width` [proposed] |
| Track height | 26px | `--acme-switch-track-height` [proposed] |
| Track corner radius | 9999px | `--radius-full` (portfolio) |
| Thumb diameter | 20px | `--acme-switch-thumb-size` [proposed] |
| Thumb inset from track edge | 3px | `--acme-switch-thumb-inset` [proposed] |
| Control-to-label gap | 8px | `--space-2` (portfolio) |
| Minimum touch target height | 44px | `--acme-control-touch-target` [proposed] |
| Transition duration | 150ms | `--duration-fast` (portfolio) |
| Transition easing | cubic-bezier(0.22, 1, 0.36, 1) | `--ease-out` (portfolio) |

### Token mapping

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
| Label | Font | — | `--font-body` | DM Sans | All |
| Label | Font size | — | `--text-sm` | 14px | All |
| Label | Font weight | — | 500 | 500 | All |
| Supporting text | Color | — | `--fg-secondary` | #3A3A35 | Default |
| Supporting text | Font size | — | `--text-xs` | 12px | All |
| Validation message | Color | `--acme-error-text-color` | `--color-error` | #FF4444 | Error |
| Focus ring | Outline color | `--acme-control-focus-ring` | `--color-focus` | #F3FE52 | Focus-visible |
| Focus ring | Outline width | — | 2px | 2px | Focus-visible |
| Focus ring | Outline offset | — | 2px | 2px | Focus-visible |

### States

| State | Visual change | Accessibility |
|-------|--------------|---------------|
| Off | Gray track (#E8E8E0), white thumb at left position | `aria-checked="false"`, `role="switch"` |
| On | Black track (#0A0A0A), yellow thumb (#F3FE52) at right position | `aria-checked="true"` |
| Hover (off) | Track lightens slightly (opacity 0.85) | No change |
| Hover (on) | Track darkens slightly (opacity 0.85) | No change |
| Focus-visible | 2px yellow outline on the track, 2px offset | Keyboard-navigable; always visible |
| Disabled | Gray track (#F5F5F0), gray thumb (#C8C8C0), gray label (#9A9A90). No hover or active states. | `aria-disabled="true"`; remove from tab order with `tabindex="-1"` if fully inactive |
| Error | Red border on track, red validation message | `aria-invalid="true"`, `aria-describedby` → validation message id |

The thumb slides from its off position to its on position with a 150ms ease-out transition. The track fill transitions at the same duration.

### Behavior

- Clicking or tapping anywhere on the label or track toggles the switch.
- Space bar or Enter toggles a focused switch.
- State change is immediate. Do not use switches for actions that require a loading state or confirmation dialog (use a button instead).
- A switch should never open a new page, start a complex flow, or perform a destructive action.

### Accessibility

- Use a native `<input type="checkbox">` with `role="switch"` and `aria-checked`. This is currently the best-supported pattern across screen readers.
- Alternatively, use a `<button>` element with `role="switch"`, `aria-checked`, and explicit keyboard handling — but native inputs are preferred.
- The visible label must be programmatically associated via `<label for>` or by wrapping the input.
- Associate supporting text and validation messages via `aria-describedby`.
- Switches in a related group should be wrapped in a `<fieldset>` with a `<legend>`.
- Do not suppress the focus ring. The focus state must be visible at all times.
- Communicate state through the thumb position and track color — not through color alone.

---

## 6 Radio Group

### Anatomy

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
| Supporting text | No | Additional description below the option label, indented to align with the label. |
| Validation message | No | Displayed at the group level below all options in the error state. |

**Structural rules:**
- All options in a group must share a common group label.
- Options are stacked vertically. Horizontal radio groups are not supported in Acme.
- The gap between options is 12px (`--space-3`).
- The selected indicator is always the same color as the border in the selected state, creating a concentric circle appearance.

### Visual specifications

| Property | Value | Token |
|----------|-------|-------|
| Control width | 20px | `--acme-control-size` [proposed] |
| Control height | 20px | `--acme-control-size` [proposed] |
| Border width | 2px | `--acme-control-border-width` [proposed] |
| Corner radius | 9999px | `--radius-full` (portfolio) |
| Selected indicator diameter | 8px | `--acme-radio-indicator-size` [proposed] |
| Control-to-label gap | 8px | `--space-2` (portfolio) |
| Option row gap (vertical) | 12px | `--space-3` (portfolio) |
| Supporting text top spacing | 4px | `--space-1` (portfolio) |
| Minimum touch target | 44×44px | `--acme-control-touch-target` [proposed] |

### Token mapping

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
| Option label | Font | — | `--font-body` | DM Sans | All |
| Option label | Font size | — | `--text-sm` | 14px | All |
| Option label | Font weight | — | 500 | 500 | All |
| Group label | Font | — | `--font-body` | DM Sans | All |
| Group label | Font size | — | `--text-sm` | 14px | All |
| Group label | Font weight | — | 600 | 600 | All |
| Group label | Color | — | `--fg-primary` | #0A0A0A | Default |
| Group label bottom spacing | — | — | `--space-3` | 12px | All |
| Supporting text | Color | — | `--fg-secondary` | #3A3A35 | Default |
| Supporting text | Font size | — | `--text-xs` | 12px | All |
| Validation message | Color | `--acme-error-text-color` | `--color-error` | #FF4444 | Error |
| Focus ring | Outline color | `--acme-control-focus-ring` | `--color-focus` | #F3FE52 | Focus-visible |
| Focus ring | Outline width | — | 2px | 2px | Focus-visible |
| Focus ring | Outline offset | — | 2px | 2px | Focus-visible |

### States

| State | Visual change | Accessibility |
|-------|--------------|---------------|
| Unselected | White fill, black 2px border, no indicator | `aria-checked="false"` |
| Selected | White fill, black 2px border, 8px black indicator (filled circle) | `aria-checked="true"` |
| Hover | Border opacity 0.8 | No change |
| Focus-visible | 2px yellow outline, 2px offset, on the focused option | Keyboard-navigable |
| Disabled (option) | Gray fill (#F5F5F0), gray border (#C8C8C0), gray label (#9A9A90) | `disabled` attribute; option skipped by arrow-key navigation |
| Disabled (group) | All options disabled | `fieldset[disabled]` disables all children |
| Error | Red border on all options, red group-level message | `aria-invalid="true"` on all inputs; `aria-describedby` → group error id |

What stays consistent: the group label position, option stacking, control dimensions, and spacing.

### Behavior

- Arrow keys navigate between options within the group. Pressing an arrow key moves focus and selects the new option simultaneously (roving tabindex pattern).
- The group as a whole receives one tab stop; individual options are navigated with arrow keys.
- Selecting an option deselects all others in the same group.
- Clicking a label or control selects that option.
- There is no "none selected" state after the first selection. If an empty state is needed, ensure it is the default and communicate it explicitly.

### Accessibility

- Wrap the group in `<fieldset>` with a `<legend>`. The `<legend>` is the group label visible to screen readers and sighted users.
- Use `<input type="radio" name="group-name">` for each option. The `name` attribute groups them.
- Associate supporting text per option via `aria-describedby` on each input.
- Group-level validation messages are associated via `aria-describedby` on each input, or by describing the error in the legend.
- Do not use `tabindex` on individual radio inputs — rely on the native roving behavior.
- Ensure the focus ring is visible on the focused option.

---

## 7 Composition and interaction

### Grouping related controls

When multiple checkboxes or switches relate to the same topic (notification types, privacy settings), group them with a visible section heading. Use a `<fieldset>` + `<legend>` for checkboxes and radio groups. For switches, a `<fieldset>` is optional but useful when the group has a clear heading.

### Mixed control types in one view

Avoid mixing checkboxes and switches within the same logical group. If a settings panel includes both immediately-applied and form-submitted preferences, separate them visually and communicate the difference clearly (section headings, supporting text, or a visible save button that appears only for the deferred section).

### Spacing between controls in a group

- Between options in a checkbox or radio group: `--space-3` (12px)
- Between distinct setting groups: `--space-8` (32px)
- Between a label and its control row: `--space-2` (8px)

### Label length

Keep labels concise. A label like "Receive marketing emails" is correct. A label like "I would like to receive marketing emails from Acme and its partners" belongs in supporting text or a legal disclosure, not the label itself.

### Notification preferences example

A notification preferences screen that applies settings immediately uses switches — one per notification type (Email, SMS, Push, Marketing). Each switch is labeled with the notification type and, where relevant, supporting text explaining what the notification covers. There is no save button, because switches communicate immediate effect. This applies the switch guidance above directly.

---

## 8 Common mistakes

| Mistake | Why it's wrong | Correct approach |
|---------|----------------|-----------------|
| Using checkboxes for immediately-applied settings | Checkboxes signal deferred commitment. Applying instantly breaks the implied promise. | Use a switch for settings that take effect without a submit step. |
| Using switches inside a form with an explicit save button | Switches signal immediacy. A save button contradicts this. | Use checkboxes when a submit step follows. |
| Using radio buttons for independent settings | Radio inputs are mutually exclusive by nature. Selecting one deselects others, which is wrong for independent toggles. | Use checkboxes or switches for independent settings. |
| Mixing checkboxes and switches in the same group | Implies different interaction models for the same category. Confuses the user about whether changes apply immediately. | Standardize on one control type per logical group. |
| Icon-only switch labels | Screen readers and users who cannot distinguish color need a visible text label. | Always provide a visible text label alongside the switch. |
| `outline: none` on focused controls | Removes the only visible focus indicator for keyboard users. | Use the documented focus ring (2px yellow, 2px offset). Never suppress `:focus-visible`. |
| Setting semantic tokens from the wrong surface family | `--fg-secondary` fails on dark backgrounds. `--fg-tertiary` fails on light backgrounds for small text. | Refer to `src/system/design-system/foundations.md` — surface determines the token family. |
| Hardcoding hex values instead of using tokens | Breaks theming, makes future updates fragile, and creates silent inconsistencies. | Always use a token. If no token covers the use case, flag it rather than hardcoding. |
| Missing `<fieldset>` / `<legend>` for grouped controls | Screen readers read options without context — the user doesn't know what they're choosing. | Always group related radios and checkboxes in a `<fieldset>` with a visible `<legend>`. |
| Interactive target smaller than 44×44px | Fails WCAG 2.5.5 (AAA) and is practically unusable on touch devices. | Expand the label's padding — not the visual control size — to meet the target. |

---

## 9 Implementation checklist

Before submitting a selection control implementation for review, confirm:

**Control selection**
- [ ] The correct control type was chosen for the interaction model (immediate vs. deferred vs. exclusive)
- [ ] Switches are used only for settings that take effect without a submit step
- [ ] Checkboxes are used only for selections confirmed by an explicit action
- [ ] Radio groups are used only for mutually exclusive single-choice selections

**Anatomy**
- [ ] All required anatomy parts are present (selection box / track + thumb / ring, label, indicator)
- [ ] Optional parts (supporting text, validation message) appear only when the content warrants them
- [ ] Grouped controls have a visible group label
- [ ] Related controls are wrapped in `<fieldset>` + `<legend>` in the markup

**Visual tokens**
- [ ] No hardcoded hex values — all colors reference Acme tokens (`[proposed]`) or portfolio tokens
- [ ] Semantic token families match the surface (light vs. dark vs. accent)
- [ ] Focus ring uses `--acme-control-focus-ring` → `--color-focus` (#F3FE52)
- [ ] Error state uses `--acme-control-border-error` → `--color-error` (#FF4444)
- [ ] Disabled state uses gray family tokens, not opacity-only treatment

**Dimensions and spacing**
- [ ] Control size: 20×20px (checkbox, radio), 46×26px track (switch)
- [ ] Border width: 2px on all controls
- [ ] Touch target: minimum 44×44px
- [ ] Label gap: 8px (`--space-2`)
- [ ] Option spacing: 12px (`--space-3`)

**States**
- [ ] All states documented above are implemented: default, hover, focus-visible, disabled, error
- [ ] Checked / on / selected states use the correct fill and indicator
- [ ] Indeterminate state implemented for checkboxes where parent–child groups exist
- [ ] No state relies on color as the only differentiator

**Behavior**
- [ ] Switch state changes are immediate (no pending state)
- [ ] Checkbox state changes queue for form submission unless explicitly documented otherwise
- [ ] Radio arrow-key navigation implemented (roving tabindex or native behavior)
- [ ] Click target covers the label, not only the visual control

**Accessibility**
- [ ] `<input type="checkbox">` or `<input type="radio">` used (not custom divs alone)
- [ ] Switches use `role="switch"` and `aria-checked`
- [ ] All controls have a programmatically associated visible label
- [ ] `aria-describedby` links supporting text and validation messages
- [ ] `aria-invalid="true"` present in error state
- [ ] Focus ring is never suppressed
- [ ] `<fieldset>` + `<legend>` present for grouped controls

**Documentation**
- [ ] No undocumented hardcoded values introduced
- [ ] No invented variants or component APIs not covered by this CRD
- [ ] No Acme `[proposed]` tokens presented as existing repository tokens

---

## 10 Specification completeness

### Fully specified
- Anatomy and required/optional parts for all three controls
- All interactive states and their visual changes
- Accessibility requirements and semantic HTML patterns
- Keyboard interaction
- Composition and grouping rules
- Common misuse patterns

### Proposed (illustrative) — not in the repository
The following are proposed Acme design decisions. They are internally consistent and reference portfolio tokens, but do not exist as committed values in the codebase. They are marked `[proposed]` throughout this document.

| Property | Proposed value | Portfolio token reference |
|----------|---------------|--------------------------|
| `--acme-control-size` | 20px | — |
| `--acme-control-border-width` | 2px | — |
| `--acme-control-touch-target` | 44px | — |
| `--acme-switch-track-width` | 46px | — |
| `--acme-switch-track-height` | 26px | — |
| `--acme-switch-thumb-size` | 20px | — |
| `--acme-switch-thumb-inset` | 3px | — |
| `--acme-radio-indicator-size` | 8px | — |
| `--acme-control-fill-empty` | → `--color-white` | ✓ exists |
| `--acme-control-fill-selected` | → `--color-black` | ✓ exists |
| `--acme-control-fill-disabled` | → `--color-gray-100` | ✓ exists |
| `--acme-control-border-default` | → `--color-black` | ✓ exists |
| `--acme-control-border-subtle` | → `--color-gray-300` | ✓ exists |
| `--acme-control-border-error` | → `--color-error` | ✓ exists |
| `--acme-control-indicator-color` | → `--color-white` | ✓ exists |
| `--acme-switch-track-off` | → `--color-gray-200` | ✓ exists |
| `--acme-switch-track-on` | → `--color-black` | ✓ exists |
| `--acme-switch-thumb-off` | → `--color-white` | ✓ exists |
| `--acme-switch-thumb-on` | → `--color-yellow` | ✓ exists |
| `--acme-switch-thumb-disabled` | → `--color-gray-300` | ✓ exists |
| `--acme-control-focus-ring` | → `--color-focus` | ✓ exists |
| `--acme-label-color` | → `--fg-primary` | ✓ exists |
| `--acme-label-disabled-color` | → `--fg-tertiary` | ✓ exists |
| `--acme-error-text-color` | → `--color-error` | ✓ exists |

### Unresolved decisions
- **Hover treatment for switch track:** Opacity 0.85 is a reasonable starting point but has not been validated against the full Acme palette. Confirm with visual design before implementing.
- **Error state for switch:** Red border on the track is proposed but not Figma-approved. An alternative is an error icon or text below the switch without a border change on the track itself.
- **Indeterminate visual for radio:** Not defined. Indeterminate state is only documented for checkboxes. If a partial-selection state is needed for a radio variant in future, a separate decision is required.
- **Dark-surface variants:** All specifications above assume `--bg-primary` or `--bg-surface` (light surfaces). Controls on `--bg-dark` would require a separate token mapping using `--fg-on-dark-*` families. This is not defined here.
- **Hover treatment for disabled controls:** No hover change is specified for disabled controls. If a cursor change (`cursor: not-allowed`) is needed, this must be added as an explicit decision.

### Verification still required
- Visual regression against rendered Acme screens
- Screen reader testing across NVDA (Windows), VoiceOver (macOS/iOS), and TalkBack (Android)
- Touch target audit on mobile device (44×44px physical, not logical)
- Contrast verification: proposed gray-300 (#C8C8C0) on white — 2.3:1 — used only for disabled borders (decorative), not text

Documentation alone does not guarantee consistent rendering. Reference implementations and visual regression tests are required before treating these specifications as production-ready.

---

## 11 References

These references point to actual files in the portfolio repository. They are relevant to implementing real selection controls in the portfolio; they do not define or approve Acme component tokens.

- **Token values and semantic token table:** [`src/styles/tokens.css`](../../../styles/tokens.css)
- **Surface token reasoning and cascade rules:** [`src/system/design-system/foundations.md`](../foundations.md)
- **Accessibility contrast ratios and pass/fail verdicts:** [`CLAUDE.md` → Accessibility contrast rules](../../../../CLAUDE.md#accessibility-contrast-rules)
- **Component index (portfolio components):** [`src/system/design-system/components.md`](../components.md)
- **AI collaboration failure patterns:** [`src/system/failure-modes.md`](../../failure-modes.md)
