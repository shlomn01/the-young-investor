// Game constants

export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;

export const STOCK_NAMES = {
  SOLAR: 'solar',
  KOOGLE: 'koogle',
  SESLA: 'sesla',
  LEMON: 'lemon',
} as const;

export type StockName = (typeof STOCK_NAMES)[keyof typeof STOCK_NAMES];

export const STOCK_DISPLAY_NAMES = {
  he: {
    solar: 'סולאר',
    koogle: 'קוגל',
    sesla: 'ססלה',
    lemon: 'לימון',
  },
  en: {
    solar: 'Solar',
    koogle: 'Koogle',
    sesla: 'Sesla',
    lemon: 'Lemon',
  },
} as const;

export const INITIAL_STOCK_PRICES: Record<StockName, number> = {
  solar: 100,
  koogle: 50,
  sesla: 75,
  lemon: 200,
};

export const DESTINATION_AMOUNT = 10000;

export const PLAYER_SPEED = 300;
export const PLAYER_SPEED_PLATFORMER = 400;

export const COLORS = {
  PRIMARY: 0x4a90d9,
  SECONDARY: 0x50c878,
  ACCENT: 0xffd700,
  DANGER: 0xe74c3c,
  BG_DARK: 0x2c3e50,
  BG_LIGHT: 0xecf0f1,
  TEXT_DARK: 0x2c3e50,
  TEXT_LIGHT: 0xffffff,
};
