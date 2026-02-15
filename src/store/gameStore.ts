import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Portfolio, StockPrices } from './types';
import { INITIAL_STOCK_PRICES, DESTINATION_AMOUNT } from '../config/constants';
import type { StockName } from '../config/constants';

const initialPortfolio: Portfolio = {
  solar: { shares: 0, avgPrice: 0 },
  koogle: { shares: 0, avgPrice: 0 },
  sesla: { shares: 0, avgPrice: 0 },
  lemon: { shares: 0, avgPrice: 0 },
};

const initialStockPrices: StockPrices = { ...INITIAL_STOCK_PRICES };

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Player
      playerName: '',
      language: 'he',

      // Finances
      cash: 0,
      assets: 0,
      destination: DESTINATION_AMOUNT,

      // Portfolio
      portfolio: { ...initialPortfolio },
      stockPrices: { ...initialStockPrices },

      // Game progress
      turn: 0,
      currentScene: 'Boot',
      hasComputer: false,
      computerPrice: 0,

      // Flags
      bankAccountOpened: false,
      barMitzvahComplete: false,
      guruMeetingComplete: false,
      lessonsCompleted: [],
      miniGamesCompleted: [],
      tradesCompleted: 0,

      // Actions
      setPlayerName: (name: string) => set({ playerName: name }),
      setLanguage: (lang: 'he' | 'en') => set({ language: lang }),
      setCash: (amount: number) => set({ cash: amount }),
      addCash: (amount: number) => set((state) => ({ cash: state.cash + amount })),
      setAssets: (amount: number) => set({ assets: amount }),
      setTurn: (turn: number) => set({ turn }),
      advanceTurn: () => set((state) => ({ turn: state.turn + 1 })),
      setCurrentScene: (scene: string) => set({ currentScene: scene }),

      buyStock: (stock: StockName, shares: number, price: number) =>
        set((state) => {
          const cost = shares * price;
          if (cost > state.cash) return state;

          const current = state.portfolio[stock];
          const totalShares = current.shares + shares;
          const totalCost = current.shares * current.avgPrice + cost;
          const newAvgPrice = totalShares > 0 ? totalCost / totalShares : 0;

          return {
            cash: state.cash - cost,
            portfolio: {
              ...state.portfolio,
              [stock]: { shares: totalShares, avgPrice: newAvgPrice },
            },
          };
        }),

      sellStock: (stock: StockName, shares: number, price: number) =>
        set((state) => {
          const current = state.portfolio[stock];
          if (shares > current.shares) return state;

          const revenue = shares * price;
          const remainingShares = current.shares - shares;

          return {
            cash: state.cash + revenue,
            portfolio: {
              ...state.portfolio,
              [stock]: {
                shares: remainingShares,
                avgPrice: remainingShares > 0 ? current.avgPrice : 0,
              },
            },
          };
        }),

      updateStockPrices: (prices: Partial<StockPrices>) =>
        set((state) => ({
          stockPrices: { ...state.stockPrices, ...prices },
        })),

      calculateAssets: () => {
        const state = get();
        let total = 0;
        for (const stock of ['solar', 'koogle', 'sesla', 'lemon'] as StockName[]) {
          total += state.portfolio[stock].shares * state.stockPrices[stock];
        }
        set({ assets: total });
        return total;
      },

      openBankAccount: () => set({ bankAccountOpened: true }),
      completeBarMitzvah: () => set({ barMitzvahComplete: true }),
      completeGuruMeeting: () => set({ guruMeetingComplete: true }),
      completeLesson: (lessonId: number) =>
        set((state) => ({
          lessonsCompleted: state.lessonsCompleted.includes(lessonId)
            ? state.lessonsCompleted
            : [...state.lessonsCompleted, lessonId],
        })),
      completeMiniGame: (gameId: string) =>
        set((state) => ({
          miniGamesCompleted: state.miniGamesCompleted.includes(gameId)
            ? state.miniGamesCompleted
            : [...state.miniGamesCompleted, gameId],
        })),
      completeTrade: () =>
        set((state) => ({ tradesCompleted: state.tradesCompleted + 1 })),
      setHasComputer: (has: boolean, price = 0) =>
        set({ hasComputer: has, computerPrice: price }),

      resetGame: () =>
        set({
          playerName: '',
          cash: 0,
          assets: 0,
          portfolio: { ...initialPortfolio },
          stockPrices: { ...initialStockPrices },
          turn: 0,
          currentScene: 'Boot',
          hasComputer: false,
          computerPrice: 0,
          bankAccountOpened: false,
          barMitzvahComplete: false,
          guruMeetingComplete: false,
          lessonsCompleted: [],
          miniGamesCompleted: [],
          tradesCompleted: 0,
        }),
    }),
    {
      name: 'young-investor-save',
      partialize: (state) => ({
        playerName: state.playerName,
        language: state.language,
        cash: state.cash,
        assets: state.assets,
        portfolio: state.portfolio,
        stockPrices: state.stockPrices,
        turn: state.turn,
        currentScene: state.currentScene,
        hasComputer: state.hasComputer,
        computerPrice: state.computerPrice,
        bankAccountOpened: state.bankAccountOpened,
        barMitzvahComplete: state.barMitzvahComplete,
        guruMeetingComplete: state.guruMeetingComplete,
        lessonsCompleted: state.lessonsCompleted,
        miniGamesCompleted: state.miniGamesCompleted,
        tradesCompleted: state.tradesCompleted,
      }),
    }
  )
);
