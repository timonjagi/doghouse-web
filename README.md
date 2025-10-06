# Doghouse Web

A modern web application built with Next.js, Chakra UI, and TypeScript, designed to provide a comprehensive platform for dog enthusiasts. This project aims to host a blog for articles and updates.

## ✨ Features

*   **Interactive Blog:** Stay updated with the latest news, articles, and tips on dog care and breeds.
*   **Responsive Design:** Seamless experience across all devices, powered by Chakra UI.
*   **SEO Optimized:** Enhanced search engine visibility with `next-seo` and `next-sitemap` configurations.
*   **Progressive Web App (PWA):** Offline capabilities and installability for a native-app like experience (can be enabled via `next.config.js`).
*   **Sanity.io CMS:** Content management for blog posts and other dynamic content.
*   **Algolia Search:** Fast and relevant search capabilities for dog breeds and blog content.
*   **Interactive Galleries & Videos:** Engaging display of dog imagery and video content using Keen Slider and Next Video.
*   **Code Quality Tooling:** Integrated `eslint`, `prettier`, `husky`, `lint-staged`, `commitlint`, `commitizen`, and `standard-version` for consistent code quality and development workflow.

## 🚀 Technologies Used

*   [Next.js](https://nextjs.org/) - React framework for production
*   [React](https://reactjs.org/) - A JavaScript library for building user interfaces
*   [Chakra UI](https://chakra-ui.com/) - A simple, modular and accessible component library for React
*   [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at Any Scale
*   [Sanity.io](https://www.sanity.io/) - The platform for structured content
*   [Algolia](https://www.algolia.com/) - Search-as-a-service for powerful search experiences
*   [Keen Slider](https://keen-slider.io/) - A free and open-source touch slider with native feeling
*   [Next Video](https://next-video.dev/) - Video component for Next.js
*   [Recoil](https://recoiljs.org/) - A state management library for React
*   [Playwright](https://playwright.dev/) - For reliable end-to-end testing

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed:

*   [Node.js](https://nodejs.org/en/) (LTS version recommended)
*   [Yarn](https://yarnpkg.com/)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/timonjagi/doghouse-web.git
    cd doghouse-web
    ```
2.  Install dependencies:
    ```bash
    yarn install
    ```

### Running Locally

To start the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application. The page will auto-update as you make changes.

## 🧪 How to Run End-to-End Tests

1.  Build the production version of the application:
    ```bash
    yarn build
    ```
2.  Start the production server:
    ```bash
    yarn start
    ```
3.  In a separate terminal, run the end-to-end tests:
    ```bash
    yarn test:e2e
    ```

## 🌐 Deployment

This project is configured for easy deployment to platforms like [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/), or [Railway](https://railway.app/).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftimonjagi%2Fdoghouse-web)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/timonjagi/doghouse-web)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/aqmmai?referralCode=9lKVVo)
