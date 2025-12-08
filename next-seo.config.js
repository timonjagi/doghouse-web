/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: "Pethouse",
  titleTemplate: "%s | Pethouse",
  defaultTitle: "Pethouse",
  description: "",
  canonical: "https://pethouse.co.ke",
  openGraph: {
    url: "https://pethouse.co.ke",
    title: "Pethouse",
    description: "",
    images: [
      {
        url: "images/logo.png",
        alt: "Pethouse og-image",
      },
    ],
    site_name: "Pethouse",
  },
  twitter: {
    handle: "@pethouse_ea",
    cardType: "summary_large_image",
  },
};

export default defaultSEOConfig;
