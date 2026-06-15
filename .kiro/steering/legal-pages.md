---
inclusion: manual
---

# Legal Pages Generator Skill

Generate a complete set of Hebrew legal pages for any web project. Ensures the site is legally covered with all required Israeli law compliance pages.

## Required Pages

When asked to add legal pages, always create ALL of the following:

1. **אודות** (`/legal/about`) — About the business/project
2. **יצירת קשר** (`/legal/contact`) — Contact information
3. **מדיניות פרטיות** (`/legal/privacy`) — Privacy policy (GDPR-aware)
4. **מדיניות עוגיות** (`/legal/cookies`) — Cookie policy
5. **הצהרת נגישות** (`/legal/accessibility`) — Accessibility statement (Israeli law: תקנות שוויון זכויות לאנשים עם מוגבלות, WCAG 2.1 AA)
6. **תנאי שימוש** (`/legal/terms`) — Terms of service
7. **תקנון רכישה** (`/legal/purchase`) — Purchase terms (if applicable)
8. **מדיניות ביטולים** (`/legal/cancellation`) — Cancellation policy (חוק הגנת הצרכן, תשמ"א-1981)

## Implementation Steps

1. **Inspect the project** — identify framework, router, styling approach
2. **Create a Legal component** — single component with sub-pages via route param
3. **Add routes** — `/legal/:page` accessible without authentication
4. **Add footer links** — link to terms, privacy, accessibility from the site footer
5. **Style consistently** — match the existing project design
6. **Ensure accessibility** — proper heading hierarchy, semantic HTML, keyboard nav

## Content Guidelines

- All content in Hebrew (RTL)
- Include "עודכן לאחרונה" date on each page
- Reference Israeli law where applicable (חוק הגנת הצרכן, תקנות נגישות)
- Include WCAG 2.1 AA reference in accessibility statement
- Do NOT copy generic English templates — write native Hebrew legal text
- Keep language clear and readable (not overly legalistic)
- Include internal navigation between all legal pages
- Add "חזרה" link to return to the main site

## Customization Points

Fill these in based on the project:

- **Business name**: extracted from project data
- **Business owners**: extracted from team/about data
- **Website URL**: extracted from deployment config
- **Contact methods**: email, social, form — whatever exists
- **Product type**: digital course, SaaS, physical product, etc.
- **Payment method**: if purchase page is needed
- **Cancellation window**: default 14 days per Israeli law

## Accessibility Checklist for the Site

When creating the accessibility statement, also verify the site actually meets these:

- [ ] Skip to content link
- [ ] Full keyboard navigation
- [ ] Screen reader compatibility (ARIA labels, semantic HTML)
- [ ] Sufficient color contrast
- [ ] Text resizing support
- [ ] Image alt text
- [ ] RTL layout
- [ ] Focus indicators visible
- [ ] Form labels associated with inputs
- [ ] Error messages accessible

## Footer Links Pattern

Always add these three links to the site footer (minimal legal coverage visible to users):

```
תנאי שימוש | פרטיות | נגישות
```

## Example Route Structure (React Router)

```jsx
<Route path="/legal/:page" element={<Legal />} />
```

## Example Navigation Between Pages

Use pill-shaped links at the bottom of each legal page so users can browse between them without returning to the main site.
