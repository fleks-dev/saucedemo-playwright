// Default user credentials
export const DEFAULT_USER_PASSWORD = 'secret_sauce';

// Environment URLs
export const BASE_URLS = {
  STAGING: 'https://www.saucedemo.com/',
  LOCALHOST: 'http://localhost:5173',
};

// Default timeouts
export const DEFAULT_TIMEOUT = 30000;
export const DEFAULT_NAVIGATION_TIMEOUT = 30000;
export const DEFAULT_EXPECT_TIMEOUT = 10000;

// Browser Configuration
export const BROWSER_CONFIG = {
  viewport: { width: 1920, height: 1080 },
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

export const ERROR_MESSAGES = {
  LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
};

export type Product = {
  name: string;
  price: number;
  description: string;
  image: string;
};

export const PRODUCTS: Product[] = [
  {
    name: 'Sauce Labs Backpack',
    price: 29.99,
    description:
      'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
    image: 'static/media/sauce-backpack',
  },
  {
    name: 'Sauce Labs Bike Light',
    price: 9.99,
    description:
      "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
    image: 'static/media/bike-light',
  },
  {
    name: 'Sauce Labs Bolt T-Shirt',
    price: 15.99,
    description:
      'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
    image: 'static/media/bolt-shirt',
  },
  {
    name: 'Sauce Labs Fleece Jacket',
    price: 49.99,
    description:
      "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.",
    image: 'static/media/sauce-pullover',
  },
  {
    name: 'Sauce Labs Onesie',
    price: 7.99,
    description:
      "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.",
    image: 'static/media/red-onesie',
  },
  {
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: 15.99,
    description:
      'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.',
    image: 'static/media/red-tatt',
  },
];

export const DEFAULT_FILTER = 'Name (A to Z)';
export const FILTERS = [
  'Name (A to Z)',
  'Name (Z to A)',
  'Price (low to high)',
  'Price (high to low)',
];
