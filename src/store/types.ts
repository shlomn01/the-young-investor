import type { StockName } from '../config/constants';

export interface StockHolding {
  shares: number;
  avgPrice: number;
}

export interface Portfolio {
  solar: StockHolding;
  koogle: StockHolding;
  sesla: StockHolding;
  lemon: StockHolding;
}

export interface StockPrices {
  solar: number;
  koogle: number;
  sesla: number;
  lemon: number;
}

export interface GameState {
  // Player
  playerName: string;
  language: 'he' | 'en';

  // Finances
  cash: number;
  assets: number;
  destination: number;

  // Portfolio
  portfolio: Portfolio;
  stockPrices: StockPrices;

  // Game progress
  turn: number;
  currentScene: string;
  hasComputer: boolean;
  computerPrice: number;

  // Flags
  bankAccountOpened: boolean;
  barMitzvahComplete: boolean;
  guruMeetingComplete: boolean;
  lessonsCompleted: number[];
  miniGamesCompleted: string[];
  tradesCompleted: number;

  // Actions
  setPlayerName: (name: string) => void;
  setLanguage: (lang: 'he' | 'en') => void;
  setCash: (amount: number) => void;
  addCash: (amount: number) => void;
  setAssets: (amount: number) => void;
  setTurn: (turn: number) => void;
  advanceTurn: () => void;
  setCurrentScene: (scene: string) => void;
  buyStock: (stock: StockName, shares: number, price: number) => void;
  sellStock: (stock: StockName, shares: number, price: number) => void;
  updateStockPrices: (prices: Partial<StockPrices>) => void;
  calculateAssets: () => number;
  openBankAccount: () => void;
  completeBarMitzvah: () => void;
  completeGuruMeeting: () => void;
  completeLesson: (lessonId: number) => void;
  completeMiniGame: (gameId: string) => void;
  completeTrade: () => void;
  setHasComputer: (has: boolean, price?: number) => void;
  resetGame: () => void;
}
