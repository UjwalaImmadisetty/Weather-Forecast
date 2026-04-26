# Weather Forecast App 🌤️

A React weather app with **username/password login page**.

## Live Demo

**🚀 Try it now:** [https://soft-treacle-0b016f.netlify.app](https://soft-treacle-0b016f.netlify.app)

## Features

- ✅ **Login Page** - Username & password authentication
- ✅ **Weather Display** - Shows current weather for selected city
- ✅ **Search Cities** - Search for any city's weather
- ✅ **Recent Searches** - View search history
- ✅ **Favorites** - Save favorite locations
- ✅ **Weather Alerts** - Get weather alerts

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Routing:** React Router
- **Styling:** CSS
- **Authentication:** Mock authentication with localStorage
- **Deployment:** Netlify

## Local Setup

```bash
# Clone the repo
git clone https://github.com/UjwalaImmadisetty/Weather-Forecast.git

# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build
```

## Default Login

- **Username:** Any text (e.g., "user123")
- **Password:** Any text (e.g., "password")

## GitHub Repository

[https://github.com/UjwalaImmadisetty/Weather-Forecast](https://github.com/UjwalaImmadisetty/Weather-Forecast)

## Author

Ujwala Immadisetty
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
