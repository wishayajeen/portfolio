# CSS Class Inventory

Raw reference of all CSS classes in this project. Used by `/review-ds` Step 5 to detect duplicates.

**Source of truth:** the actual CSS files — this document is a maintained index, not a definition.
- Homepage + shared classes → `src/styles/homepage.css`
- Design system page classes → `src/styles/design-system.css`

---

## Homepage classes (`homepage.css`)

### Navigation
`nav-link`, `mobile-menu-btn`

### Hero
`hero-badge`, `hero-badge-dot`, `hero-badge-label`, `hero-headline`, `hero-headline-accent`, `hero-headline-squiggle`, `hero-sub`, `hero-ctas`, `hero-cta-primary`, `hero-cta-secondary`, `hero-grid`, `hero-bg-grid`, `hero-scroll-indicator`, `hero-scroll-mouse`, `hero-scroll-dot`, `hero-scroll-label`, `hero-social-row`, `hero-social-link`, `hero-social-label`

### Work section
`work-section`, `work-inner`, `work-eyebrow`, `work-headline`, `work-header`, `work-table-header`, `work-row`, `work-row-grid`, `work-col-label`, `work-num`, `work-tag-row`, `work-tag`, `work-title`, `work-desc`, `work-detail-row`, `work-meta-label`, `work-meta-dot`, `work-year`, `work-year-col`, `work-tools`, `work-tool`, `work-count`, `work-arrow`, `work-expand`, `work-coming-soon-badge`, `work-coming-soon-badge-label`, `work-coming-soon-dot`

### Playground section
`playground-section`, `playground-inner`, `pg-section-header`, `pg-header-row`, `pg-eyebrow`, `pg-headline`, `pg-subhead`, `pg-cards-grid`, `pg-diary-header`, `pg-diary-title`, `pg-diary-count`, `pg-diary-list`, `pg-diary-link`, `play-card`, `play-card--accent`, `play-card-header`, `play-card-tag`, `play-card-title`, `play-card-desc`, `play-card-cta`

### About section
`about-section`, `about-inner`, `about-eyebrow`, `about-headline`, `about-grid`, `about-card`, `about-card-avatar`, `about-card-profile`, `about-card-name`, `about-card-role`, `about-card-quote`, `about-card-stats`, `about-stat`, `about-stat-num`, `about-stat-label`, `about-body`, `about-text-body`, `about-skills`, `about-skill-tag`, `pocky-circle`, `pocky-img`

### Diary cards
`diary-card`, `diary-content`, `diary-date-block`, `diary-date-day`, `diary-date-month`, `diary-tag`, `diary-title`, `diary-meta`, `diary-read-time`, `diary-arrow`

### Footer
`footer-inner`, `footer-cols`, `footer-brand-header`, `footer-brand-logo`, `footer-brand-name`, `footer-brand-desc`, `footer-nav-cols`, `footer-nav-col`, `footer-nav-heading`, `footer-nav-link`, `footer-status-col`, `footer-status-badge`, `footer-status-dot`, `footer-status-heading`, `footer-cta`, `footer-cta-inner`, `footer-cta-content`, `footer-eyebrow`, `footer-headline`, `footer-sub`, `footer-email-row`, `footer-email-input`, `footer-email-btn`, `footer-email-copy-group`, `footer-copy-btn`, `footer-copy-icon`, `footer-contact-row`, `footer-contact-divider`, `footer-social-links`, `footer-success`, `footer-success--inline`, `footer-success-dot`, `footer-bottom`, `footer-bottom-bar`, `footer-copyright`, `footer-version`, `footer-powered`, `footer-powered-avatar`, `footer-powered-label`

### Article / Diary page
`article-page`, `article-header`, `article-header-inner`, `article-eyebrow`, `article-title`, `article-description`, `article-meta`, `article-content`, `article-footer`, `article-footer-inner`

### Link utilities *(also serve as Link component variant targets)*
`back-link` (dark surface, muted→white), `nav-link` (dark surface, pill), `hero-social-link` (dark surface, box-shadow), `footer-nav-link` (dark surface, plain)

### Animation utilities
`fade-up`, `fade-up-1`, `fade-up-2`, `fade-up-3`, `fade-up-4`

---

## Design system page classes (`design-system.css`)

Scoped to `/design-system/*` routes only. Do not reuse in other pages.

### Layout
`ds-page`, `ds-topbar`, `ds-topbar-sep`, `ds-topbar-title`, `ds-hero`, `ds-hero-inner`, `ds-hero-eyebrow`, `ds-hero-title`, `ds-hero-sub`, `ds-hero-meta`, `ds-hero-meta-item`, `ds-section`, `ds-section-header`, `ds-section-num`, `ds-section-title`, `ds-subsection`, `ds-sub-label`, `ds-row`, `ds-col`, `ds-divider`, `ds-card`, `ds-code`, `toc`, `toc-dot`, `ds-footer`, `ds-footer-inner`, `ds-footer-link`

### Components
`ds-btn`, `ds-btn-primary`, `ds-btn-dark`, `ds-btn-outline`, `ds-btn-ghost`, `ds-btn-sm`, `ds-badge`, `ds-badge-yellow`, `ds-badge-dark`, `ds-badge-outline`, `ds-badge-gray`, `ds-badge-success`, `ds-badge-error`, `ds-badge-ghost`, `ds-badge-coming`, `ds-tag`, `ds-tag-yellow`, `ds-tag-mono`, `ds-project-card`, `ds-project-card-dark`, `ds-project-card-accent`, `card-tag-inner`, `card-title-inner`, `card-body-inner`, `ds-input`, `ds-input-wrap`, `ds-field`, `ds-field-label`, `ds-helper`, `ds-ask-bar`, `ds-ask-input`, `ds-ask-btn`, `ds-table`, `principle-card`, `principles-grid`, `principle-icon`, `principle-title`, `principle-body`, `disc-card`, `disc-card-header`, `disc-card-title`, `disc-card-body`

### State modifiers (DS demo only)
`state-hover`, `state-active`, `dot` — simulate interactive states in documentation. Do not use in product pages.

### Display helpers
`swatch-grid`, `swatch-item`, `swatch-color`, `swatch-info`, `swatch-name`, `swatch-hex`, `swatch-use`, `semantic-grid`, `semantic-chip`, `semantic-dot`, `semantic-info`, `semantic-token`, `semantic-hex`, `semantic-desc`, `dark-text-demo`, `dark-text-item`, `dark-text-sample`, `dark-text-token`, `dark-text-ratio`, `type-specimen`, `type-meta`, `type-sample`, `space-row`, `space-bar`, `space-label`, `shadow-box`, `shadow-item`, `shadow-meta`, `radius-box`, `bg-swatch`, `bg-label`, `anim-row`, `anim-demo`, `anim-info`, `anim-name`, `anim-value`, `border-token-row`, `border-token-preview`, `border-token-demo`, `border-token-info`, `border-token-name`, `border-token-value`, `border-token-use`

### Dashboard (`/design-system/dashboard` only)
**Section intro:** `dash-section-desc`

**System Pulse (§01):** `dash-pulse`, `dash-stat`, `dash-stat--warn`, `dash-stat--critical`, `dash-stat--ok`, `dash-stat-value`, `dash-stat-label`, `dash-stat-sub`

**System Health (§02):** `dash-counts`, `dash-count-item`, `dash-count-num`, `dash-count-num--critical`, `dash-count-desc`, `dash-counts-divider`, `dash-spotlight`, `dash-spotlight-card`, `dash-spotlight-card--critical`, `dash-spotlight-eyebrow`, `dash-spotlight-title`, `dash-spotlight-body`, `dash-spotlight-date`, `dash-issue-list`, `dash-issue-row`, `dash-issue-badges`, `dash-issue-content`, `dash-issue-title`, `dash-issue-body`, `dash-issue-date`

**Token Overview (§03):** `dash-token-grid`, `dash-token-cat`, `dash-token-cat-left`, `dash-token-cat-icon`, `dash-token-name`, `dash-token-sub`, `dash-token-count`, `dash-color-model`, `dash-color-group`, `dash-color-group-label`, `dash-color-group-desc`, `dash-color-pills`, `dash-rules-list`, `dash-rule-row`, `dash-rule-body`

**Component Overview (§04):** `dash-comp-grid`, `dash-comp-cat`, `dash-comp-cat-header`, `dash-comp-cat-label`, `dash-comp-cat-count`, `dash-comp-cat-desc`, `dash-comp-list`, `dash-comp-item`, `dash-comp-item-left`, `dash-comp-item-right`, `dash-comp-name`, `dash-comp-file`, `dash-comp-variants`, `dash-comp-adopted`, `dash-comp-isolated`, `dash-comp-status`, `dash-comp-status--stable`, `dash-comp-status--experimental`

**Relationships (§05):** `dash-rel-block`, `dash-rel-row`, `dash-rel-key`, `dash-rel-values`, `dash-rel-pill`, `dash-rel-empty`

**Recent Activity (§06):** `dash-timeline`, `dash-timeline-item`, `dash-timeline-dot`, `dash-timeline-dot--release`, `dash-timeline-dot--diary`, `dash-timeline-dot--resolved`, `dash-timeline-dot--open`, `dash-timeline-dot--decision`, `dash-timeline-content`, `dash-timeline-meta`, `dash-timeline-title`, `dash-timeline-body`
