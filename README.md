# Kailani Restaurant Website

A modern, responsive website for Kailani restaurant built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Beautiful UI with smooth animations using Framer Motion
- Responsive design for all device sizes
- Restaurant menu gallery
- About page with restaurant story
- Contact form with email functionality
- Job application system with email notifications
- Location and hours information

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Nodemailer (for email functionality)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd kailani
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your email credentials:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_RECIPIENT=recipient@example.com
   ```
   See `EMAIL_SETUP.md` for detailed instructions on setting up email functionality.

4. Start the development server
   ```bash
   npm run dev
   ```

## Deployment

This project is designed to be deployed on Vercel.

1. Install the Vercel CLI
   ```bash
   npm install -g vercel
   ```

2. Deploy
   ```bash
   vercel
   ```

Make sure to add your environment variables in the Vercel dashboard for the production deployment.

## Email Functionality

The website includes email functionality for:
- The contact form
- Job application submissions

Configuration details can be found in `EMAIL_SETUP.md`.
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
