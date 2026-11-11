# Cyber-EV2X Dataset Website Style Guide

## 1. Visual Identity

The website should look like a modern research dataset documentation portal.

The visual style should be:

```text
Modern
Academic
Clean
Professional
Readable
Smooth
Documentation-oriented
```

The design should be inspired by VitePress, but customized for the Cyber-EV2X dataset.

The primary brand color is:

```text
Deep Blue: #1b45bb
```

The secondary accent color is:

```text
Deep Red: #cf112b
```

Deep blue should be used as the main identity color.

Deep red should be used only for attack-related elements, warning blocks, DoS badges, and important alerts.

---

## 2. Color System

Use CSS variables for all colors.

### 2.1. Light Theme

```css
:root {
  --color-primary: #1b45bb;
  --color-primary-hover: #163a9f;
  --color-primary-soft: #eef3ff;
  --color-primary-border: rgba(27, 69, 187, 0.24);

  --color-danger: #cf112b;
  --color-danger-hover: #a90e23;
  --color-danger-soft: #fff1f3;
  --color-danger-border: rgba(207, 17, 43, 0.24);

  --color-success: #16a34a;
  --color-success-soft: #ecfdf3;
  --color-warning: #f59e0b;
  --color-warning-soft: #fffbeb;

  --color-bg: #ffffff;
  --color-bg-soft: #f7f8fb;
  --color-bg-mute: #f2f4f7;

  --color-sidebar-bg: #f8f9fc;
  --color-navbar-bg: rgba(255, 255, 255, 0.86);
  --color-card-bg: #ffffff;

  --color-text: #20242c;
  --color-text-soft: #3f4654;
  --color-text-muted: #667085;
  --color-text-subtle: #98a2b3;

  --color-border: #e5e7eb;
  --color-border-soft: #eef0f4;

  --color-code-bg: #f3f4f6;
  --color-code-text: #1f2937;

  --shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.06);
  --shadow-md: 0 8px 24px rgba(16, 24, 40, 0.08);
  --shadow-lg: 0 16px 40px rgba(27, 69, 187, 0.12);
}
```

### 2.2. Dark Theme

```css
[data-theme="dark"] {
  --color-primary: #6f8cff;
  --color-primary-hover: #8fa4ff;
  --color-primary-soft: rgba(111, 140, 255, 0.14);
  --color-primary-border: rgba(111, 140, 255, 0.32);

  --color-danger: #ff4d64;
  --color-danger-hover: #ff7184;
  --color-danger-soft: rgba(255, 77, 100, 0.14);
  --color-danger-border: rgba(255, 77, 100, 0.32);

  --color-success: #4ade80;
  --color-success-soft: rgba(74, 222, 128, 0.12);
  --color-warning: #fbbf24;
  --color-warning-soft: rgba(251, 191, 36, 0.12);

  --color-bg: #0b1020;
  --color-bg-soft: #111827;
  --color-bg-mute: #172033;

  --color-sidebar-bg: #0f172a;
  --color-navbar-bg: rgba(11, 16, 32, 0.86);
  --color-card-bg: #111827;

  --color-text: #f8fafc;
  --color-text-soft: #dbe4f0;
  --color-text-muted: #94a3b8;
  --color-text-subtle: #64748b;

  --color-border: #1f2937;
  --color-border-soft: #263244;

  --color-code-bg: #020617;
  --color-code-text: #e5e7eb;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.28);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.32);
  --shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.42);
}
```

---

## 3. Typography

Use a clean sans-serif font.

Recommended font stack:

```css
font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

### 3.1. Base Text

```css
body {
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-text);
  background: var(--color-bg);
}
```

### 3.2. Headings

Headings must be clear and academic.

```css
h1 {
  font-size: 40px;
  line-height: 1.15;
  font-weight: 750;
  letter-spacing: -0.03em;
  margin-bottom: 24px;
}

h2 {
  font-size: 28px;
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-top: 56px;
  margin-bottom: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-soft);
}

h3 {
  font-size: 21px;
  line-height: 1.35;
  font-weight: 680;
  margin-top: 32px;
  margin-bottom: 12px;
}

h4 {
  font-size: 17px;
  font-weight: 650;
  margin-top: 24px;
  margin-bottom: 8px;
}
```

### 3.3. Paragraphs

```css
p {
  margin: 0 0 18px;
  color: var(--color-text-soft);
}
```

### 3.4. Links

```css
a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  text-underline-offset: 3px;
}

a:hover {
  text-decoration: underline;
}
```

---

## 4. Layout Styling

### 4.1. Top Navbar

```css
.top-navbar {
  height: 64px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0 24px;
  background: var(--color-navbar-bg);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(14px);
}
```

Navbar inner layout:

```css
.navbar-inner {
  width: 100%;
  max-width: 1280px;

  display: flex;
  align-items: center;
  gap: 24px;
}
```

### 4.2. Search Bar

The search bar should be soft, rounded, and prominent.

```css
.navbar-search {
  flex: 1;
  max-width: 760px;
  height: 42px;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 0 14px;
  border-radius: 12px;

  background: var(--color-bg-soft);
  border: 1px solid transparent;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.navbar-search:focus-within {
  background: var(--color-bg);
  border-color: var(--color-primary-border);
  box-shadow: 0 0 0 4px var(--color-primary-soft);
}

.navbar-search input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-text);
  font-size: 15px;
}

.navbar-search .shortcut {
  padding: 2px 7px;
  border-radius: 7px;
  font-size: 12px;
  color: var(--color-text-muted);
  background: var(--color-bg-mute);
  border: 1px solid var(--color-border);
}
```

### 4.3. Navbar Buttons

```css
.icon-button {
  width: 38px;
  height: 38px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text-muted);

  cursor: pointer;

  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.icon-button:hover {
  color: var(--color-primary);
  border-color: var(--color-primary-border);
  background: var(--color-primary-soft);
  transform: translateY(-1px);
}
```

---

## 5. Sidebar Styling

```css
.left-sidebar {
  position: fixed;
  top: 64px;
  bottom: 0;
  left: 0;
  width: 260px;

  padding: 24px 18px;

  overflow-y: auto;

  background: var(--color-sidebar-bg);
  border-right: 1px solid var(--color-border);
}
```

### 5.1. Sidebar Logo

```css
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;

  margin-bottom: 28px;
  padding: 0 4px;
}

.sidebar-logo img {
  width: 34px;
  height: 34px;
  border-radius: 9px;
}

.sidebar-logo span {
  font-size: 18px;
  font-weight: 750;
  letter-spacing: -0.02em;
  color: var(--color-text);
}
```

### 5.2. Navigation Groups

```css
.nav-group {
  margin-bottom: 28px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--color-border-soft);
}

.nav-group-title {
  margin: 0 0 10px;
  padding: 0 10px;

  font-size: 13px;
  font-weight: 700;
  color: var(--color-text);
}
```

### 5.3. Sidebar Items

```css
.nav-item {
  display: flex;
  align-items: center;

  min-height: 36px;
  padding: 7px 10px;
  margin: 2px 0;

  border-radius: 10px;

  color: var(--color-text-muted);
  font-size: 15px;
  font-weight: 500;

  transition:
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.nav-item:hover {
  color: var(--color-primary);
  background: var(--color-primary-soft);
  text-decoration: none;
  transform: translateX(3px);
}

.nav-item.active {
  color: var(--color-primary);
  background: var(--color-primary-soft);
  font-weight: 650;
}
```

---

## 6. Main Content Styling

```css
.main-layout {
  margin-left: 260px;
  padding-top: 64px;

  min-height: 100vh;

  display: grid;
  grid-template-columns: minmax(0, 880px) 240px;
  justify-content: center;
  column-gap: 48px;

  background: var(--color-bg);
}

.content-container {
  min-width: 0;
  padding: 56px 0 96px;
}
```

For better readability:

```css
.content-container > * {
  max-width: 100%;
}
```

---

## 7. Right Aside Styling

```css
.right-aside {
  position: sticky;
  top: 96px;

  height: calc(100vh - 96px);
  padding-top: 32px;

  overflow-y: auto;
}
```

### 7.1. TOC Title

```css
.toc-title {
  margin-bottom: 12px;

  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
}
```

### 7.2. TOC Links

```css
.toc-link {
  display: block;

  padding: 5px 0 5px 12px;
  border-left: 2px solid var(--color-border);

  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.45;

  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.toc-link:hover {
  color: var(--color-primary);
  text-decoration: none;
  transform: translateX(2px);
}

.toc-link.active {
  color: var(--color-primary);
  border-left-color: var(--color-primary);
  font-weight: 650;
}
```

---

## 8. Cards

Cards are used for dataset features, statistics, institutions, and download links.

### 8.1. Base Card

```css
.card {
  padding: 22px 24px;

  border-radius: 18px;
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);

  box-shadow: var(--shadow-sm);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-border);
}
```

### 8.2. Feature Grid

```css
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  margin: 24px 0 32px;
}
```

### 8.3. Feature Card

```css
.feature-card {
  padding: 22px;

  border-radius: 18px;
  border: 1px solid var(--color-border);
  background:
    linear-gradient(
      180deg,
      var(--color-card-bg),
      var(--color-bg-soft)
    );

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-border);
}

.feature-card h3 {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 17px;
}

.feature-card p {
  margin-bottom: 0;
  font-size: 14.5px;
  color: var(--color-text-muted);
}
```

### 8.4. Statistics Card

```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  margin: 24px 0 32px;
}

.stat-card {
  padding: 20px;

  border-radius: 18px;
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
}

.stat-value {
  font-size: 30px;
  line-height: 1;
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: -0.03em;
}

.stat-label {
  margin-top: 8px;
  font-size: 13.5px;
  color: var(--color-text-muted);
}
```

---

## 9. Badges

Badges are used for labels such as scenario names, message types, and attack labels.

### 9.1. Base Badge

```css
.badge {
  display: inline-flex;
  align-items: center;

  height: 26px;
  padding: 0 10px;

  border-radius: 999px;

  font-size: 12.5px;
  font-weight: 650;
  line-height: 1;
}
```

### 9.2. Primary Badge

```css
.badge-primary {
  color: var(--color-primary);
  background: var(--color-primary-soft);
  border: 1px solid var(--color-primary-border);
}
```

### 9.3. Danger Badge

Use only for DoS, attack, or warning labels.

```css
.badge-danger {
  color: var(--color-danger);
  background: var(--color-danger-soft);
  border: 1px solid var(--color-danger-border);
}
```

### 9.4. Neutral Badge

```css
.badge-neutral {
  color: var(--color-text-muted);
  background: var(--color-bg-mute);
  border: 1px solid var(--color-border);
}
```

---

## 10. Callout Blocks

Callout blocks highlight important information.

### 10.1. Info Callout

```css
.callout {
  margin: 24px 0;
  padding: 18px 20px;

  border-radius: 16px;
  border: 1px solid var(--color-primary-border);
  background: var(--color-primary-soft);
}

.callout-title {
  margin-bottom: 6px;
  font-weight: 700;
  color: var(--color-primary);
}

.callout p {
  margin-bottom: 0;
}
```

### 10.2. Danger Callout

Use for DoS attack descriptions or limitations.

```css
.danger-callout {
  margin: 24px 0;
  padding: 18px 20px;

  border-radius: 16px;
  border: 1px solid var(--color-danger-border);
  background: var(--color-danger-soft);
}

.danger-callout strong,
.danger-callout .callout-title {
  color: var(--color-danger);
}
```

### 10.3. Warning Callout

```css
.warning-callout {
  margin: 24px 0;
  padding: 18px 20px;

  border-radius: 16px;
  border: 1px solid rgba(245, 158, 11, 0.3);
  background: var(--color-warning-soft);
}
```

---

## 11. Code Blocks

Code blocks are important for dataset structure, JSON examples, command snippets, and citation blocks.

### 11.1. Inline Code

```css
:not(pre) > code {
  padding: 2px 6px;

  border-radius: 6px;
  background: var(--color-code-bg);
  color: var(--color-primary);

  font-size: 0.9em;
  font-family:
    "SFMono-Regular",
    Consolas,
    "Liberation Mono",
    Menlo,
    monospace;
}
```

### 11.2. Code Block Container

```css
pre {
  position: relative;

  margin: 22px 0;
  padding: 18px 20px;

  overflow-x: auto;

  border-radius: 16px;
  border: 1px solid var(--color-border);

  background: var(--color-code-bg);
  color: var(--color-code-text);

  font-size: 14px;
  line-height: 1.65;
  box-shadow: var(--shadow-sm);
}
```

### 11.3. Code Text

```css
pre code {
  padding: 0;
  background: transparent;
  color: inherit;

  font-family:
    "SFMono-Regular",
    Consolas,
    "Liberation Mono",
    Menlo,
    monospace;
}
```

### 11.4. BibTeX Blocks

BibTeX citation blocks should use the same code block style.

Optional label:

```css
.code-label {
  position: absolute;
  top: 10px;
  right: 12px;

  padding: 3px 8px;

  border-radius: 999px;
  background: var(--color-bg-mute);
  color: var(--color-text-muted);

  font-size: 12px;
  font-weight: 600;
}
```

---

## 12. Tables

Tables are used for data schema and scenario descriptions.

```css
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  margin: 24px 0;
  border: 1px solid var(--color-border);
  border-radius: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14.5px;
}

th {
  background: var(--color-bg-soft);
  color: var(--color-text);
  font-weight: 700;
  text-align: left;
}

th,
td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border-soft);
}

td {
  color: var(--color-text-soft);
}

tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background: var(--color-bg-soft);
}
```

---

## 13. Buttons

### 13.1. Base Button

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  height: 40px;
  padding: 0 16px;

  border-radius: 999px;

  font-size: 14px;
  font-weight: 650;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}
```

### 13.2. Primary Button

```css
.button-primary {
  color: #ffffff;
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.button-primary:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(27, 69, 187, 0.22);
  text-decoration: none;
}
```

### 13.3. Secondary Button

```css
.button-secondary {
  color: var(--color-primary);
  background: var(--color-primary-soft);
  border: 1px solid var(--color-primary-border);
}

.button-secondary:hover {
  background: var(--color-bg);
  transform: translateY(-1px);
  text-decoration: none;
}
```

### 13.4. Danger Button

Use only for attack-related demo actions or warning actions.

```css
.button-danger {
  color: var(--color-danger);
  background: var(--color-danger-soft);
  border: 1px solid var(--color-danger-border);
}
```

---

## 14. Map Component Styling

The map should appear inside a rounded container.

```css
.map-card {
  margin: 24px 0 32px;

  overflow: hidden;

  border-radius: 20px;
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  box-shadow: var(--shadow-sm);
}

.ev2x-map {
  width: 100%;
  height: 420px;
}
```

### 14.1. Map Legend

```css
.map-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  padding: 14px 16px;

  border-top: 1px solid var(--color-border);
  background: var(--color-bg-soft);
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  font-size: 13px;
  color: var(--color-text-muted);
}

.legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
}

.legend-dot.ev {
  background: var(--color-primary);
}

.legend-dot.cs {
  background: var(--color-success);
}

.legend-dot.attack {
  background: var(--color-danger);
}
```

---

## 15. Chart Component Styling

Charts should use card containers.

```css
.chart-card {
  margin: 24px 0;
  padding: 20px;

  border-radius: 20px;
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  box-shadow: var(--shadow-sm);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 16px;
}

.chart-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
}

.chart-subtitle {
  margin-top: 4px;
  font-size: 13px;
  color: var(--color-text-muted);
}
```

Recommended chart colors:

```text
Primary data series: #1b45bb
Attack data series: #cf112b
Charging station: #16a34a
Neutral series: #94a3b8
```

---

## 16. Animation Rules

Animations must be smooth but not excessive.

Use short transitions:

```css
transition-duration: 0.2s to 0.3s;
transition-timing-function: ease;
```

### 16.1. Global Smooth Scroll

```css
html {
  scroll-behavior: smooth;
}
```

### 16.2. Page Enter Animation

```css
.page-content {
  animation: page-fade-in 0.28s ease both;
}

@keyframes page-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 16.3. Hover Animation

Cards and buttons can move slightly:

```text
translateY(-1px) for buttons
translateY(-4px) for cards
translateX(2px to 3px) for sidebar and TOC links
```

Do not use large bouncing, rotating, or distracting animations.

---

## 17. Border Radius System

Use soft rounded corners consistently.

```css
--radius-xs: 6px;
--radius-sm: 10px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-full: 999px;
```

Usage:

```text
Search bar: 12px
Sidebar item: 10px
Card: 18px to 20px
Map container: 20px
Buttons: 999px
Badges: 999px
Code block: 16px
Tables: 16px
Callouts: 16px
```

---

## 18. Spacing System

Use consistent spacing.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-14: 56px;
--space-16: 64px;
```

Recommended usage:

```text
Navbar horizontal padding: 24px
Sidebar padding: 24px 18px
Content top padding: 56px
Section margin-top: 56px
Card padding: 20px to 24px
Grid gap: 16px to 20px
Main column gap: 48px
```

---

## 19. Dark Mode Requirements

Dark mode must apply to:

```text
- Body background
- Navbar
- Sidebar
- Cards
- Code blocks
- Tables
- Map container
- Search bar
- Buttons
- Badges
- Callouts
- TOC
```

The theme switch must toggle a root attribute:

```html
<html data-theme="dark">
```

or:

```html
<body data-theme="dark">
```

Persist the selected theme using:

```text
localStorage
```

Default behavior:

```text
Use system preference if the user has not selected a theme.
```

---

## 20. Responsive Styling

### 20.1. Large Desktop

```css
@media (min-width: 1200px) {
  .right-aside {
    display: block;
  }
}
```

### 20.2. Tablet

```css
@media (max-width: 1199px) {
  .main-layout {
    grid-template-columns: minmax(0, 820px);
    padding-left: 32px;
    padding-right: 32px;
  }

  .right-aside {
    display: none;
  }
}
```

### 20.3. Mobile

```css
@media (max-width: 768px) {
  .left-sidebar {
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .left-sidebar.open {
    transform: translateX(0);
  }

  .main-layout {
    margin-left: 0;
    padding-left: 20px;
    padding-right: 20px;
  }

  .content-container {
    padding-top: 36px;
  }

  .feature-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 32px;
  }

  h2 {
    font-size: 24px;
  }
}
```

---

## 21. Accessibility Requirements

The website must be accessible.

Required:

```text
- Use semantic HTML tags.
- Buttons must have aria-label when using icons only.
- Color contrast must be readable in light and dark mode.
- Focus states must be visible.
- Search input must have accessible label.
- Theme switch must indicate current state.
- Sidebar navigation should be keyboard accessible.
```

Focus style:

```css
:focus-visible {
  outline: 3px solid var(--color-primary-border);
  outline-offset: 3px;
}
```

---

## 22. Final Design Rules

The AI agent must follow these design rules:

1. Use deep blue `#1b45bb` as the main brand color.
2. Use deep red `#cf112b` only for attack-related or warning-related elements.
3. Keep the design clean and documentation-oriented.
4. Use soft rounded corners.
5. Use smooth but subtle animations.
6. Keep text highly readable.
7. Use cards for dataset features and statistics.
8. Use tables for data schema.
9. Use code blocks for folder structure, JSON, commands, and BibTeX.
10. Support both light and dark themes.
11. Make the layout responsive.
12. Avoid excessive visual effects that make the website look like a marketing landing page.
