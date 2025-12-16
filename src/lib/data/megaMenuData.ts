export interface MegaMenuItem {
  label: string;
  href: string;
  description?: string;
  image?: string;
  badge?: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export interface MegaMenuColumn {
  title: string;
  items: MegaMenuItem[];
  featured?: MegaMenuItem;
}

export interface MegaMenuData {
  [key: string]: MegaMenuColumn[];
}

// Mega menu data structure exactly like MobileSentrix
export const megaMenuData: MegaMenuData = {
  'apple': [
    {
      title: 'iPhone Series',
      items: [
        { label: 'iPhone 15 Pro Max', href: '/apple/iphone-15-pro-max', description: 'Latest flagship with titanium design' },
        { label: 'iPhone 15 Pro', href: '/apple/iphone-15-pro', description: 'Professional camera system' },
        { label: 'iPhone 15 Plus', href: '/apple/iphone-15-plus', description: 'Larger display option' },
        { label: 'iPhone 15', href: '/apple/iphone-15', description: 'Standard model with advanced features' },
        { label: 'iPhone 14 Series', href: '/apple/iphone-14-series', description: 'Previous generation models' },
        { label: 'iPhone SE', href: '/apple/iphone-se', description: 'Compact and affordable' },
      ]
    },
    {
      title: 'iPad & Mac',
      items: [
        { label: 'iPad Pro 12.9"', href: '/apple/ipad-pro-12-9', description: 'Ultimate productivity tablet' },
        { label: 'iPad Pro 11"', href: '/apple/ipad-pro-11', description: 'Portable professional tablet' },
        { label: 'iPad Air', href: '/apple/ipad-air', description: 'Versatile all-purpose tablet' },
        { label: 'iPad', href: '/apple/ipad', description: 'Perfect for everyday use' },
        { label: 'MacBook Pro', href: '/apple/macbook-pro', description: 'Professional laptop series' },
        { label: 'MacBook Air', href: '/apple/macbook-air', description: 'Ultra-portable laptop' },
      ]
    },
    {
      title: 'Featured MidasGold 7.0 Screens',
      items: [
        { label: 'iPhone 15 Pro Max Screen', href: '/apple/screens/iphone-15-pro-max', description: 'Premium OLED replacement', badge: 'Best Seller', isPopular: true },
        { label: 'iPhone 15 Pro Screen', href: '/apple/screens/iphone-15-pro', description: 'Ultra Retina XDR display', badge: 'New', isNew: true },
        { label: 'iPad Pro Screen', href: '/apple/screens/ipad-pro', description: 'Liquid Retina XDR', badge: 'Premium' },
        { label: 'MacBook Screen', href: '/apple/screens/macbook', description: 'Retina display replacement' },
      ],
      featured: {
        label: 'MidasGold 7.0 Technology',
        href: '/apple/midasgold-7',
        description: 'Revolutionary screen repair technology with 99.9% color accuracy',
        image: '/images/midasgold-7-banner.jpg'
      }
    },
    {
      title: 'Top Sellers',
      items: [
        { label: 'iPhone Battery', href: '/apple/battery', description: 'Original Apple battery', isPopular: true },
        { label: 'Lightning Cable', href: '/apple/cable', description: 'USB-C to Lightning' },
        { label: 'AirPods Cases', href: '/apple/airpods-cases', description: 'Protective cases' },
        { label: 'Screen Protectors', href: '/apple/screen-protectors', description: 'Tempered glass screens' },
        { label: 'Charging Adapters', href: '/apple/adapters', description: '20W USB-C power adapter' },
        { label: 'Phone Cases', href: '/apple/cases', description: 'Premium protective cases' },
      ]
    }
  ],

  'samsung': [
    {
      title: 'Galaxy S Series',
      items: [
        { label: 'Galaxy S24 Ultra', href: '/samsung/s24-ultra', description: 'AI-powered flagship' },
        { label: 'Galaxy S24+', href: '/samsung/s24-plus', description: 'Premium Android experience' },
        { label: 'Galaxy S24', href: '/samsung/s24', description: 'Standard flagship model' },
        { label: 'Galaxy S23 Series', href: '/samsung/s23-series', description: 'Previous generation' },
      ]
    },
    {
      title: 'Galaxy A & Tab Series',
      items: [
        { label: 'Galaxy A54', href: '/samsung/a54', description: 'Mid-range powerhouse' },
        { label: 'Galaxy A34', href: '/samsung/a34', description: 'Affordable premium features' },
        { label: 'Galaxy Tab S9', href: '/samsung/tab-s9', description: 'Android tablet series' },
        { label: 'Galaxy Tab A8', href: '/samsung/tab-a8', description: 'Budget tablet option' },
      ]
    },
    {
      title: 'Batteries & Screens',
      items: [
        { label: 'Galaxy S24 Ultra Battery', href: '/samsung/battery/s24-ultra', description: '5000mAh replacement', badge: 'Fast Shipping' },
        { label: 'Galaxy S24 Screen', href: '/samsung/screen/s24', description: 'Dynamic AMOLED 2X', badge: 'Premium', isPopular: true },
        { label: 'Galaxy A54 Battery', href: '/samsung/battery/a54', description: '5000mAh high capacity' },
        { label: 'Galaxy Tab Screen', href: '/samsung/screen/tab', description: 'TFT LCD replacement' },
        { label: 'Battery Testing Kit', href: '/samsung/battery-kit', description: 'Professional diagnostic tool' },
        { label: 'Screen Digitizer', href: '/samsung/digitizer', description: 'Touch screen replacement' },
      ]
    }
  ],

  'tools-supplies': [
    {
      title: 'Midas Precision Toolkits',
      items: [
        { label: 'iPhone Pro Toolkit', href: '/tools/iphone-pro-toolkit', description: 'Complete iPhone repair kit', badge: 'Best Seller', isPopular: true },
        { label: 'Samsung Pro Toolkit', href: '/tools/samsung-pro-toolkit', description: 'Samsung repair essentials', isPopular: true },
        { label: 'Opening Tools Set', href: '/tools/opening-tools', description: 'Plastic and metal pry tools' },
        { label: 'Screwdriver Set', href: '/tools/screwdrivers', description: 'Precision screwdriver kit' },
        { label: 'Tweezers Set', href: '/tools/tweezers', description: 'Anti-static precision tweezers' },
        { label: 'Suction Cups', href: '/tools/suction-cups', description: 'Screen removal tools' },
      ]
    },
    {
      title: 'Adhesives & Tapes',
      items: [
        { label: 'B7000 Adhesive', href: '/tools/b7000', description: 'Premium screen adhesive' },
        { label: 'Tesa Tape', href: '/tools/tesa-tape', description: 'Double-sided repair tape' },
        { label: 'Precut Adhesive', href: '/tools/precuts', description: 'Pre-cut adhesive strips' },
        { label: 'Glue Gun Kit', href: '/tools/glue-gun', description: 'Hot glue application' },
        { label: 'Conductive Tape', href: '/tools/conductive', description: 'EMI shielding tape' },
        { label: 'Heat Resistant Tape', href: '/tools/heat-tape', description: 'High temperature tape' },
      ]
    },
    {
      title: 'Fixtures & Holders',
      items: [
        { label: 'Phone Opening Fixture', href: '/tools/opening-fixture', description: 'Magnetic phone holder' },
        { label: 'Screen Holder', href: '/tools/screen-holder', description: 'LCD screen fixture' },
        { label: 'Battery Jig', href: '/tools/battery-jig', description: 'Battery disconnection tool' },
        { label: 'Logic Board Holder', href: '/tools/board-holder', description: 'Motherboard fixture' },
        { label: 'Cable Clamps', href: '/tools/clamps', description: 'Cable management clamps' },
        { label: 'Alignment Tools', href: '/tools/alignment', description: 'Precision alignment jigs' },
      ]
    },
    {
      title: 'Parts & Components',
      items: [
        { label: 'Flex Cables', href: '/tools/flex-cables', description: 'Replacement ribbon cables' },
        { label: 'Connectors', href: '/tools/connectors', description: 'Charging port connectors' },
        { label: 'Buttons & Switches', href: '/tools/buttons', description: 'Power and volume buttons' },
        { label: 'Cameras & Sensors', href: '/tools/cameras', description: 'Front/rear camera modules' },
        { label: 'Speakers & Microphones', href: '/tools/audio', description: 'Audio component replacements' },
        { label: 'Vibrators & Motors', href: '/tools/vibrators', description: 'Haptic feedback motors' },
      ],
      featured: {
        label: 'Professional Repair Bundle',
        href: '/tools/pro-bundle',
        description: 'Complete toolkit with 200+ tools and parts for professional repairs',
        image: '/images/pro-bundle-banner.jpg'
      }
    }
  ]
};

// Navigation items that have mega menus
export const megaMenuNavItems = [
  { label: 'Apple', href: '/apple', hasMegaMenu: true, menuKey: 'apple' },
  { label: 'Samsung', href: '/samsung', hasMegaMenu: true, menuKey: 'samsung' },
  { label: 'Tools & Supplies', href: '/tools', hasMegaMenu: true, menuKey: 'tools-supplies' },
  { label: 'Repairs', href: '/repairs', hasMegaMenu: false },
  { label: 'Accessories', href: '/accessories', hasMegaMenu: false },
  { label: 'Support', href: '/support', hasMegaMenu: false },
];

// Helper function to get mega menu data
export const getMegaMenuData = (key: string): MegaMenuColumn[] => {
  return megaMenuData[key] || [];
};
