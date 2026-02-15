import { STOCK_ROUNDS } from '../data/stockData';
import { useGameStore } from '../../store/gameStore';
import type { StockName } from '../../config/constants';

export class TradingEngine {
  private round: number;

  constructor(round: number) {
    this.round = round;
  }

  getRoundData() {
    return STOCK_ROUNDS[this.round] || STOCK_ROUNDS[1];
  }

  getAvailableStocks(): StockName[] {
    return this.getRoundData().available;
  }

  canSell(): boolean {
    return this.getRoundData().canSell;
  }

  getPriceHistory(stock: StockName): number[] {
    return this.getRoundData().prices[stock] || [];
  }

  getCurrentPrice(stock: StockName): number {
    const prices = this.getPriceHistory(stock);
    return prices[prices.length - 1] || 0;
  }

  getPriceChange(stock: StockName): { absolute: number; percent: number } {
    const prices = this.getPriceHistory(stock);
    if (prices.length < 2) return { absolute: 0, percent: 0 };
    const current = prices[prices.length - 1];
    const previous = prices[prices.length - 2];
    const absolute = current - previous;
    const percent = (absolute / previous) * 100;
    return { absolute, percent };
  }

  getNews(stock: StockName, lang: 'he' | 'en'): string {
    const news = this.getRoundData().news[stock];
    if (!news) return '';
    return news[lang];
  }

  // Calculate max shares player can buy
  getMaxBuyShares(stock: StockName): number {
    const state = useGameStore.getState();
    const price = this.getCurrentPrice(stock);
    if (price <= 0) return 0;
    return Math.floor(state.cash / price);
  }

  // Calculate total portfolio value at current prices
  getPortfolioValue(): number {
    const state = useGameStore.getState();
    let total = 0;
    for (const stock of this.getAvailableStocks()) {
      const holding = state.portfolio[stock];
      total += holding.shares * this.getCurrentPrice(stock);
    }
    return total;
  }

  // Execute a buy order
  executeBuy(stock: StockName, shares: number): { success: boolean; error?: string } {
    const state = useGameStore.getState();
    const price = this.getCurrentPrice(stock);
    const cost = shares * price;

    if (cost > state.cash) {
      return { success: false, error: 'insufficientFunds' };
    }
    if (shares <= 0) {
      return { success: false, error: 'invalidAmount' };
    }

    state.buyStock(stock, shares, price);
    state.calculateAssets();
    return { success: true };
  }

  // Execute a sell order
  executeSell(stock: StockName, shares: number): { success: boolean; error?: string } {
    if (!this.canSell()) {
      return { success: false, error: 'sellingNotAvailable' };
    }

    const state = useGameStore.getState();
    const holding = state.portfolio[stock];

    if (shares > holding.shares) {
      return { success: false, error: 'insufficientShares' };
    }
    if (shares <= 0) {
      return { success: false, error: 'invalidAmount' };
    }

    const price = this.getCurrentPrice(stock);
    state.sellStock(stock, shares, price);
    state.calculateAssets();
    return { success: true };
  }

  // Apply end-of-round price updates to the store
  applyRoundPrices() {
    const state = useGameStore.getState();
    const prices: Record<string, number> = {};
    for (const stock of this.getAvailableStocks()) {
      prices[stock] = this.getCurrentPrice(stock);
    }
    state.updateStockPrices(prices);
    state.calculateAssets();
  }
}
