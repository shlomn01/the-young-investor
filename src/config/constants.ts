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

// --- Design System Colors ---
export const COLORS = {
  PRIMARY: 0x4a90d9,       // Trust Blue
  SECONDARY: 0x50c878,     // Money Green
  ACCENT: 0xffd700,        // Shekel Gold
  DANGER: 0xe74c3c,        // Alert Red
  BG_DARK: 0x1a1a2e,       // Night Navy
  BG_LIGHT: 0xfaf0e6,      // Linen
  TEXT_DARK: 0x2c3e50,
  TEXT_LIGHT: 0xffffff,
};

// CSS hex strings for React components
export const CSS_COLORS = {
  primary: '#4A90D9',
  secondary: '#50C878',
  accent: '#FFD700',
  danger: '#E74C3C',
  bgDark: 'rgba(26, 26, 46, 0.92)',
  bgDarkSolid: '#1A1A2E',
  bgLight: '#FAF0E6',
  textDark: '#2C3E50',
  textLight: '#FFFFFF',
  textMuted: '#8899AA',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassLight: 'rgba(255, 255, 255, 0.08)',
} as const;

// --- Fonts ---
export const FONTS = {
  he: "'Heebo', sans-serif",
  en: "'Poppins', sans-serif",
  mono: "'IBM Plex Mono', monospace",
} as const;

// Phaser font family strings (no CSS quotes needed)
export const PHASER_FONTS = {
  he: 'Heebo, sans-serif',
  en: 'Poppins, sans-serif',
  mono: 'IBM Plex Mono, monospace',
} as const;

// --- Stock Logo Colors ---
export const STOCK_COLORS: Record<StockName, number> = {
  solar: 0x4caf50,   // Green (solar/eco)
  koogle: 0x4285f4,  // Blue (search)
  sesla: 0x9c27b0,   // Purple (electric)
  lemon: 0xffc107,   // Yellow (fruit)
};

export const STOCK_CSS_COLORS: Record<StockName, string> = {
  solar: '#4CAF50',
  koogle: '#4285F4',
  sesla: '#9C27B0',
  lemon: '#FFC107',
};

// --- Audio Keys ---
export const MUSIC_KEYS = {
  TITLE: 'music_title',
  STREET: 'music_street',
  HOME: 'music_home',
  SCHOOL: 'music_school',
  BANK: 'music_bank',
  HOTEL: 'music_hotel',
  MINIGAME: 'music_minigame',
  BAR_MITZVAH: 'music_barmitzvah',
  CREDITS: 'music_credits',
  WAITING: 'music_waiting',
} as const;

export const SFX_KEYS = {
  UI_CLICK: 'sfx_click',
  UI_PANEL_OPEN: 'sfx_panel_open',
  UI_PANEL_CLOSE: 'sfx_panel_close',
  UI_NOTIFY: 'sfx_notify',
  COIN_CLINK: 'sfx_coin',
  CASH_REGISTER: 'sfx_register',
  BUY_SWOOSH: 'sfx_buy',
  SELL_SWOOSH: 'sfx_sell',
  DOOR_OPEN: 'sfx_door',
  FOOTSTEP: 'sfx_footstep',
  ELEVATOR_DING: 'sfx_elevator',
  LASER: 'sfx_laser',
  EXPLOSION: 'sfx_explosion',
  CORRECT: 'sfx_correct',
  WRONG: 'sfx_wrong',
  CHEER: 'sfx_cheer',
  FIREWORKS: 'sfx_fireworks',
  DIALOGUE_ADVANCE: 'sfx_dialogue',
} as const;

// --- Background Image Keys ---
export const BG_KEYS = {
  TITLE: 'bg_title',
  BANK: 'bg_bank_interior',
  SCHOOL: 'bg_school_interior',
  LIBRARY: 'bg_library_interior',
  BAR_MITZVAH: 'bg_bar_mitzvah_interior',
  GURU_ROOM: 'bg_guru_room',
  BEDROOM: 'bg_bedroom',
  LIVING_ROOM: 'bg_living_room_interior',
  STREET_DAY: 'bg_street_residential',
  STREET_COMMERCIAL: 'bg_street_commercial',
  STREET_URBAN: 'bg_street_urban',
  STREET_EVENING: 'bg_street_evening',
  HOTEL_LOBBY: 'bg_hotel_lobby',
  HOTEL_CORRIDOR: 'bg_hotel_corridor',
  COMPUTER_SHOP: 'bg_computer_shop',
  PERCENTS_GAME: 'bg_percents_game',
  QUIZ_STAGE: 'bg_quiz_stage',
} as const;

// --- Stock Logo Icon Keys ---
export const STOCK_ICON_KEYS: Record<StockName, string> = {
  solar: 'icon_solar',
  koogle: 'icon_koogle',
  sesla: 'icon_sesla',
  lemon: 'icon_lemon',
};

// --- Portrait Keys ---
export const PORTRAIT_KEYS = {
  player: 'portrait_player',
  npc_dad: 'portrait_dad',
  npc_mom: 'portrait_mom',
  npc_teacher: 'portrait_teacher',
  npc_banker: 'portrait_banker',
  npc_librarian: 'portrait_librarian',
  npc_shopkeeper: 'portrait_shopkeeper',
  npc_guru: 'portrait_guru',
  npc_receptionist: 'portrait_receptionist',
  npc_grandpa: 'portrait_grandpa',
  npc_grandma: 'portrait_grandma',
} as const;
