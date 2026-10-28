# Selection Controls — Component Requirements Document

> **⚠️ Educational example — XConf Americas 2026**
> This CRD was created as an illustrative example for the conference talk "Your Design System Has a New User: AI" (Jeen, XConf Americas 2026). It demonstrates the CRD format using a fictional product called **Acme**. The Acme Switch component does not exist in this portfolio's design system. This document is not an authoritative component requirement for jeensdesign.com.

---

## Purpose

Selection controls let users choose between options. Choosing the right control requires knowing two things:

1. **Are the choices independent or mutually exclusive?**
2. **Do changes take effect immediately, or only on form submission?**

The visual appearance of a control carries meaning. Presenting the wrong control type creates a mismatch between what the interface implies and how it actually works — even if the layout looks reasonable at first glance.

Which control is "right" depends on the product's specific interaction model. The guidance below describes common conventions; the [Acme product rule](#acme-product-rule-notification-preferences-screen) below is a product-specific decision, not a universal requirement.

---

## Control types

### Checkbox
Conventionally used when selecting **independent options** that are **applied together on form submission**.

```
☑ Agree to terms and conditions
☑ Subscribe to newsletter
☐ Receive account alerts
```

The user makes selections, then confirms with a submit action. Checkboxes signal to the user that their choices will be reviewed before taking effect — this is a convention, not a technical constraint. A product that uses checkboxes for immediately applied settings is deviating from that convention.

### Switch
Conventionally used when **enabling or disabling an individual setting** that takes effect **immediately**, without a submit step.

```
Email notifications    [●  ON ]
SMS notifications      [●  ON ]
Push notifications     [○ OFF ]
```

The action is reversible and instant. No confirmation step is implied or required. Whether a switch is the required control for immediate-effect settings depends on the product's design system — it is the conventional choice, not the only valid one.

### Radio Group
Used when the user must **select exactly one option** from a mutually exclusive set.

```
( ) Free
(●) Pro
( ) Enterprise
```

Selecting one option automatically deselects the others. Radio groups are commonly used within forms, though like any control their exact context depends on product needs.

---

## Acme product rule: notification-preferences screen

**This is a product-specific decision made for the fictional Acme design system. It is not a universal UI rule.**

In Acme, the design system explicitly requires switches for the notification preferences screen because those settings take effect immediately — there is no save button on this screen. Acme's design system team decided that the immediate-effect interaction model is best communicated by switches, and has codified this as a product rule.

| Setting | Takes effect in Acme | Required control per Acme DS |
|---------|---------------------|------------------------------|
| Email notifications | Immediately | Switch |
| SMS notifications | Immediately | Switch |
| Push notifications | Immediately | Switch |
| Marketing emails | Immediately | Switch |

**Why not checkboxes in Acme?** Checkboxes signal a deferred-submission model. If an AI agent generates checkboxes for this screen, it is applying the conventional form pattern without reading Acme's product-specific rule — which is exactly the kind of drift a CRD is designed to prevent.

> **Note on scope:** The Acme Switch component referenced here is illustrative. It represents the intended component type for this product context. No Switch component is defined in the jeensdesign.com portfolio design system. The references below point to actual portfolio files.

---

## Behavior

| Control | On interaction | Multi-select | Submit typically required |
|---------|---------------|-------------|--------------------------|
| Checkbox | State queued until submission (conventional use) | Yes | Yes — by convention; depends on product interaction model |
| Switch | State applied immediately (conventional use) | No (each is independent) | No |
| Radio | Deselects others immediately | No | No — though a form submit may follow, the selection itself is immediate |

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

These constraints reflect Acme's product decisions, not universal UI rules.

| Pattern | Verdict in Acme | Reason |
|---------|----------------|--------|
| Checkbox for Acme notification settings | ✗ Wrong for Acme | Implies deferred submission; contradicts Acme's immediate-effect model |
| Radio for independent notification settings | ✗ Wrong | Radio implies mutual exclusivity |
| Mixing checkboxes and switches in the same setting group | ✗ Avoid | Inconsistent interaction model within a group |
| Switch for a form that has an explicit save action | ⚠ Avoid | Implies immediacy where deferral is intended |
| Checkbox for independent form selections with explicit submit | ✓ Correct — conventional use | Matches deferred-submission interaction model |
| Switch for immediately-applied settings per Acme DS | ✓ Correct for Acme | Matches Acme's immediate-effect product rule |

---

## References

These references point to actual files in this portfolio's repository. They are relevant to implementing real selection controls in the portfolio; they do not define or approve an Acme Switch component.

- **Token values:** [`src/styles/tokens.css`](../../../styles/tokens.css) — `--color-cta`, `--border-primary`, `--border-subtle`, `--radius-xs`, `--radius-full`
- **Accessibility contrast rules:** [`CLAUDE.md` → Accessibility contrast rules](../../../../CLAUDE.md#accessibility-contrast-rules)
- **Component index (portfolio components):** [`src/system/design-system/components.md`](../components.md)
- **Surface model and token families:** [`src/system/design-system/foundations.md`](../foundations.md)
