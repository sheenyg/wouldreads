# Wouldreads

Welcome to **Wouldreads**, an article aggregator designed for effortless daily news consumption.  
You can try out the live app here: [https://sheenyg.github.io/wouldreads/](https://sheenyg.github.io/wouldreads/)

## About

Wouldreads is currently at **version 1.1**. The app collects news articles from various sources, presenting them in a clean format for my daily reading.

---

## Tech stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| UI framework | React 19 |
| Build tool | Vite (with `@vitejs/plugin-react-swc`) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` |
| Component primitives | Radix UI |

---

## Local development

**Prerequisites:** Node.js LTS and npm.

```bash
# Install dependencies (clean install from lockfile)
npm ci

# Start the dev server (http://localhost:5173)
npm run dev

# Lint the codebase
npm run lint
```

---

## Build & deploy

```bash
# Compile TypeScript and bundle with Vite
npm run build

# Preview the production build locally
npm run preview
```

**GitHub Pages note:** Vite is configured with `base: "/wouldreads/"` in `vite.config.ts` so that assets resolve correctly when deployed to `https://sheenyg.github.io/wouldreads/`. If you fork this repo or deploy to a different URL, update the `base` value to match your repository name or deploy path.

---

## Contributing

Feel free to **fork** this repository and create your own version of Wouldreads!

If you’d like to contribute to this main version, here are some great ways to help:

- **Add additional news sources**  
  Bring in more feeds or specialized sources to diversify the content.

- **Improve filtering and categorization**  
  Make it even easier to find articles that matter most to each reader.

- **Design improvements**  
  Enhance the look and feel of the app for a better user experience.

- **Add new categories to the feed**  
  (For example: a dedicated *music* section would be awesome!)

---

## License

This project is open to community contributions!

```
MIT License

Copyright (c) 2023 GitHub

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---
