/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: "Doghouse",
  titleTemplate: "%s | Doghouse",
  defaultTitle: "Doghouse",
  description: "",
  canonical: "https://doghouse.co.ke",
  openGraph: {
    url: "https://doghouse.co.ke",
    title: "Doghouse",
    description: "",
    images: [
      {
        url: "images/logo.png",
        alt: "Doghouse og-image",
      },
    ],
    site_name: "Doghouse",
  },
  twitter: {
    handle: "@doghousekenya",
    cardType: "summary_large_image",
  },
};

export default defaultSEOConfig;
