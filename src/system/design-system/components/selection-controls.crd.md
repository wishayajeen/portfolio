# Selection Controls — Component Requirements Document

> **⚠️ Educational example — XConf Americas 2026**
> This CRD was created as an illustrative example for the conference talk "Your Design System Has a New User: AI" (Jeen, XConf Americas 2026). It demonstrates the CRD format using a fictional product called **Acme**. The Acme Switch component does not exist in this portfolio's design system. This document is not an authoritative component requirement for jeensdesign.com.

---

## Purpose

Selection controls let users choose between options. Choosing the right control requires knowing two things:

1. **Are the choices independent or mutually exclusive?**
2. **Do changes take effect immediately, or only on form submission?**

The visual appearance of a control carries meaning. Presenting the wrong control type creates a mismatch between what the interface implies and how it actually works — even if the layout looks reasonable at first glance.

---

## Control types

### Checkbox
Use when selecting **independent options** as part of a form, where all changes are **applied on submission**.

```
☑ Agree to terms and conditions
☑ Subscribe to newsletter
☐ Receive account alerts
```

The user makes selections, then confirms with a submit action. Unchecking does not take effect until the form is submitted.

### Switch
Use when **enabling or disabling an individual setting** that takes effect **immediately**, without a submit step.

```
Email notifications    [●  ON ]
SMS notifications      [●  ON ]
Push notifications     [○ OFF ]
```

The action is reversible and instant. No confirmation step is implied or required.

### Radio Group
Use when the user must **select exactly one option** from a mutually exclusive set.

```
( ) Free
(●) Pro
( ) Enterprise
```

Selecting one option automatically deselects the others.

---

## Acme product rule: notification-preferences screen

**This is a fictional product-specific decision, not a universal UI rule.**

In the Acme product, notification preferences take effect immediately — there is no save button on this screen. The interaction model determines the required control:

| Setting | Takes effect | Required control |
|---------|-------------|-----------------|
| Email notifications | Immediately | Switch |
| SMS notifications | Immediately | Switch |
| Push notifications | Immediately | Switch |
| Marketing emails | Immediately | Switch |

**Why not checkboxes?** Checkboxes imply deferred submission. Presenting checkboxes for settings that activate immediately creates a mismatch between the implied and actual interaction model. The user may expect to confirm their selections before they apply — but they already have.

> **Note on scope:** The Acme Switch component referenced here is illustrative. It represents the intended component type for this product context. No Switch component is defined in the jeensdesign.com portfolio design system. The references below point to actual portfolio files.

---

## Behavior

| Control | On interaction | Multi-select | Submit required |
|---------|---------------|-------------|-----------------|
| Checkbox | State queued until submission | Yes | Yes |
| Switch | State applied immediately | No (each is independent) | No |
| Radio | Deselects others immediately | No | No (form submit may follow, but selection is immediate) |

---

## Accessibility and labeling

- Every control must have a visible label. Never use placeholder text or icon-only labels.
- Labels describe the **effect**, not the control type: "Receive email notifications" — not "Email toggle."
- Group related controls with a `<fieldset>` and `<legend>` describing the group.
- For switches, use `role="switch"` and `aria-checked` when using a custom implementation.
- Keyboard: Space toggles checkboxes and switches. Arrow keys navigate within a radio group.
- Provide a minimum touch target of 44×44px.

---

## Constraints and common misuse

| Pattern | Verdict | Reason |
|---------|---------|--------|
| Checkbox for settings that apply immediately | ✗ Wrong | Implies deferred submission |
| Radio for independent notification settings | ✗ Wrong | Radio implies mutual exclusivity |
| Mixing checkboxes and switches in the same group | ✗ Wrong | Inconsistent interaction model within a group |
| Switch for a form that has an explicit save action | ⚠ Avoid | Implies immediacy where deferral is intended |
| Checkbox for independent form selections | ✓ Correct | Matches deferred-submission interaction model |
| Switch for immediately-applied settings | ✓ Correct | Matches immediate-effect interaction model |

---

## References

These references point to actual files in this portfolio's repository. They are relevant to implementing real selection controls in the portfolio; they do not define or approve an Acme Switch component.

- **Token values:** [`src/styles/tokens.css`](../../../../styles/tokens.css) — `--color-cta`, `--border-primary`, `--border-subtle`, `--radius-xs`, `--radius-full`
- **Accessibility contrast rules:** [`CLAUDE.md` → Accessibility contrast rules](../../../../CLAUDE.md#accessibility-contrast-rules)
- **Component index (portfolio components):** [`src/system/design-system/components.md`](../components.md)
- **Surface model and token families:** [`src/system/design-system/foundations.md`](../foundations.md)
