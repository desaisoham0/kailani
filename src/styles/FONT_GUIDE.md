# Kailani Restaurant Font Guide

This document outlines the fonts used in the Kailani restaurant website and how to use them.

## Available Fonts

| Tailwind Class | CSS Class | Font Name | Usage |
|----------------|-----------|-----------|-------|
| `font-navigation` | `jua-regular` | Jua | Restaurant name, branding, main headers |
| `font-body` | `nunito-sans` | Nunito Sans | Regular text content, paragraphs |
| `font-heading` | `nunito-sans-bold` | Nunito Sans Bold | Section headers, emphasis |
| `font-mono` | `roboto-mono` | Roboto Mono | Code snippets, technical info |

## How to Use

### Using Tailwind Classes in JSX/TSX Components:
```tsx
// Restaurant name with Jua font
<div className="font-navigation text-xl">Kailani</div>

// Section header with Nunito Sans Bold
<h2 className="font-heading text-2xl font-bold">Our Menu</h2>

// Regular content with Nunito Sans
<p className="font-body">Welcome to Kailani restaurant...</p>

// Code or special content with Roboto Mono
<code className="font-mono">Special code here</code>
```

### Using CSS Classes in JSX/TSX Components:
```tsx
// Restaurant name with Jua font
<div className="jua-regular text-xl">Kailani</div>

// Regular content with Nunito Sans
<p className="nunito-sans">Welcome to Kailani restaurant...</p>

// Bold content with Nunito Sans Bold
<p className="nunito-sans-bold">Important information</p>

// Code with Roboto Mono
<code className="roboto-mono">Code example</code>
```

### Combining Tailwind and CSS Classes:
```tsx
// Best practice - combining the classes for maximum compatibility
<h1 className="font-navigation jua-regular text-2xl">Kailani</h1>
```

## Adding New Fonts

1. Add the font import to:
   - HTML: Update the link tag in `/index.html`
   - CSS: Update the import in `/src/styles/fonts.css`
2. Define CSS classes in `/src/styles/fonts.css`
3. Define the font family in `/src/styles/fontConfig.js`
4. Use the new font with the appropriate class names

Example:
```html
<!-- In index.html -->
<link href="https://fonts.googleapis.com/css2?family=YourNewFont&display=swap" rel="stylesheet">
```

```css
/* In fonts.css */
@import url('https://fonts.googleapis.com/css2?family=YourNewFont&display=swap');

.your-new-font {
  font-family: "YourNewFont", serif;
  font-weight: 400;
  font-style: normal;
}
```

```js
/* In fontConfig.js */
'custom-name': ['"YourNewFont"', 'serif'],
```

```tsx
/* In your component */
<div className="font-custom-name your-new-font">Text with custom font</div>
```
