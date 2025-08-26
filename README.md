# Doghouse Web

A modern web application built with Next.js, Chakra UI, and TypeScript, designed to provide a comprehensive platform for dog enthusiasts. This project aims to offer detailed dog breed information, facilitate user interactions through profiles and authentication, and host a blog for articles and updates. Backend functionalities are powered by Firebase.

## ✨ Features

*   **Dog Breed Directory:** Explore a rich collection of dog breeds with detailed information and high-quality imagery.
*   **User Authentication & Profiles:** Secure user registration, login, and personalized profiles.
*   **Interactive Blog:** Stay updated with the latest news, articles, and tips on dog care and breeds.
*   **Responsive Design:** Seamless experience across all devices, powered by Chakra UI.
*   **SEO Optimized:** Enhanced search engine visibility with `next-seo` and `next-sitemap` configurations.
*   **Progressive Web App (PWA):** Offline capabilities and installability for a native-app like experience (can be enabled via `next.config.js`).
*   **Firebase Integration:** Robust backend services including authentication and serverless functions.
*   **Code Quality Tooling:** Integrated `eslint`, `prettier`, `husky`, `lint-staged`, `commitlint`, `commitizen`, and `standard-version` for consistent code quality and development workflow.

## 🚀 Technologies Used

*   [Next.js](https://nextjs.org/) - React framework for production
*   [React](https://reactjs.org/) - A JavaScript library for building user interfaces
*   [Chakra UI](https://chakra-ui.com/) - A simple, modular and accessible component library for React
*   [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at Any Scale
*   [Firebase](https://firebase.google.com/) - Backend as a Service (BaaS) for authentication and serverless functions
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
