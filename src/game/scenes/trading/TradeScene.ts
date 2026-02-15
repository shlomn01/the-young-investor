import { BaseScene } from '../BaseScene';
import { formatCurrency } from '../../../utils/formatUtils';
import type { StockName } from '../../../config/constants';

interface StockInfo {
  key: StockName;
  nameHe: string;
  nameEn: string;
  prices: number[]; // Price history for chart
}

const ROUND_STOCKS: Record<number, StockInfo[]> = {
  1: [
    { key: 'solar', nameHe: 'סולאר', nameEn: 'Solar', prices: [100, 105, 110, 108, 115, 120, 118, 125, 130, 128] },
    { key: 'koogle', nameHe: 'קוגל', nameEn: 'Koogle', prices: [50, 48, 52, 55, 53, 58, 60, 62, 65, 63] },
  ],
  2: [
    { key: 'solar', nameHe: 'סולאר', nameEn: 'Solar', prices: [130, 135, 128, 140, 145, 150, 148, 155, 160, 158] },
    { key: 'koogle', nameHe: 'קוגל', nameEn: 'Koogle', prices: [63, 60, 65, 70, 68, 75, 80, 78, 82, 85] },
    { key: 'sesla', nameHe: 'ססלה', nameEn: 'Sesla', prices: [75, 78, 72, 80, 85, 82, 88, 90, 92, 95] },
  ],
  3: [
    { key: 'solar', nameHe: 'סולאר', nameEn: 'Solar', prices: [158, 162, 170, 165, 175, 180, 178, 185, 190, 195] },
    { key: 'koogle', nameHe: 'קוגל', nameEn: 'Koogle', prices: [85, 88, 92, 90, 95, 100, 98, 105, 110, 108] },
    { key: 'sesla', nameHe: 'ססלה', nameEn: 'Sesla', prices: [95, 98, 100, 105, 102, 108, 112, 110, 115, 118] },
    { key: 'lemon', nameHe: 'לימון', nameEn: 'Lemon', prices: [200, 195, 205, 210, 208, 215, 220, 218, 225, 230] },
  ],
};

export class TradeScene extends BaseScene {
  private round = 1;
  private stocks: StockInfo[] = [];
  private selectedStock: StockInfo | null = null;

  constructor() {
    super('Trade');
  }

  init(data: { round?: number }) {
    this.round = data?.round ?? 1;
  }

  create() {
    super.create();
    this.stocks = ROUND_STOCKS[this.round] || ROUND_STOCKS[1];
    this.selectedStock = this.stocks[0];

    // Update stock prices in store
    const priceUpdate: Record<string, number> = {};
    for (const stock of this.stocks) {
      priceUpdate[stock.key] = stock.prices[stock.prices.length - 1];
    }
    this.store.updateStockPrices(priceUpdate);

    // Trading floor background
    const g = this.add.graphics();
    g.fillStyle(0x1a1a2e, 1);
    g.fillRect(0, 0, this.w, this.h);

    // Title
    const roundLabel = this.lang === 'he' ? `סבב מסחר ${this.round}` : `Trading Round ${this.round}`;
    this.add.text(this.w / 2, 30, roundLabel, {
      fontSize: '36px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Cash display
    this.add.text(50, 30, `${this.lang === 'he' ? 'מזומן:' : 'Cash:'} ${formatCurrency(this.store.cash, this.lang)}`, {
      fontSize: '24px', color: '#50c878', fontFamily: 'Arial',
    });

    // Stock list (left panel)
    this.drawStockList(g);

    // Chart area (center)
    if (this.selectedStock) {
      this.drawStockChart(g, this.selectedStock);
    }

    // Trade controls (right panel)
    this.drawTradeControls(g);

    // Back button
    this.createButton(100, this.h - 40,
      this.lang === 'he' ? 'סיים מסחר' : 'Finish Trading',
      () => {
        this.store.completeTrade();
        if (this.round < 3) {
          this.goToScene('Waiting', { round: this.round });
        } else {
          this.goToScene('AsteroidsGame');
        }
      },
      200, 40);

    this.fadeIn();
  }

  private drawStockList(g: Phaser.GameObjects.Graphics) {
    g.fillStyle(0x16213e, 1);
    g.fillRoundedRect(30, 80, 350, this.stocks.length * 90 + 20, 12);

    for (let i = 0; i < this.stocks.length; i++) {
      const stock = this.stocks[i];
      const sy = 100 + i * 90;
      const currentPrice = stock.prices[stock.prices.length - 1];
      const prevPrice = stock.prices[stock.prices.length - 2];
      const change = ((currentPrice - prevPrice) / prevPrice) * 100;
      const isUp = change >= 0;

      const isSelected = this.selectedStock?.key === stock.key;
      if (isSelected) {
        g.fillStyle(0x2a3a5e, 1);
        g.fillRoundedRect(40, sy - 5, 330, 80, 8);
      }

      const name = this.lang === 'he' ? stock.nameHe : stock.nameEn;
      this.add.text(60, sy + 10, name, {
        fontSize: '24px', color: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
      });

      this.add.text(60, sy + 40, formatCurrency(currentPrice, this.lang), {
        fontSize: '20px', color: '#87ceeb', fontFamily: 'Arial',
      });

      this.add.text(250, sy + 25, `${isUp ? '▲' : '▼'} ${Math.abs(change).toFixed(1)}%`, {
        fontSize: '20px', color: isUp ? '#50c878' : '#e74c3c', fontFamily: 'Arial',
      });

      // Make clickable
      const zone = this.add.zone(205, sy + 35, 330, 80).setInteractive({ useHandCursor: true });
      zone.on('pointerdown', () => {
        this.selectedStock = stock;
        this.scene.restart({ round: this.round });
      });

      // Show holdings
      const holding = this.store.portfolio[stock.key];
      if (holding.shares > 0) {
        this.add.text(350, sy + 10, `${holding.shares}`, {
          fontSize: '16px', color: '#ffd700', fontFamily: 'Arial',
        }).setOrigin(1, 0);
      }
    }
  }

  private drawStockChart(g: Phaser.GameObjects.Graphics, stock: StockInfo) {
    const chartX = 420;
    const chartY = 100;
    const chartW = 800;
    const chartH = 450;

    // Chart background
    g.fillStyle(0x0a0a1e, 1);
    g.fillRoundedRect(chartX, chartY, chartW, chartH, 12);

    // Chart title
    const name = this.lang === 'he' ? stock.nameHe : stock.nameEn;
    this.add.text(chartX + chartW / 2, chartY + 20, name, {
      fontSize: '28px', color: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Draw price line
    const prices = stock.prices;
    const minPrice = Math.min(...prices) * 0.95;
    const maxPrice = Math.max(...prices) * 1.05;
    const priceRange = maxPrice - minPrice;

    const padX = 60;
    const padY = 60;
    const drawW = chartW - padX * 2;
    const drawH = chartH - padY * 2;

    // Grid lines
    g.lineStyle(1, 0x333333, 0.5);
    for (let i = 0; i <= 4; i++) {
      const y = chartY + padY + (drawH / 4) * i;
      g.moveTo(chartX + padX, y);
      g.lineTo(chartX + chartW - padX, y);
      g.stroke();

      const priceLabel = (maxPrice - (priceRange / 4) * i).toFixed(0);
      this.add.text(chartX + padX - 10, y, `₪${priceLabel}`, {
        fontSize: '14px', color: '#666', fontFamily: 'Arial',
      }).setOrigin(1, 0.5);
    }

    // Price line
    const isUp = prices[prices.length - 1] >= prices[0];
    g.lineStyle(3, isUp ? 0x50c878 : 0xe74c3c, 1);
    g.beginPath();

    for (let i = 0; i < prices.length; i++) {
      const x = chartX + padX + (drawW / (prices.length - 1)) * i;
      const y = chartY + padY + drawH - ((prices[i] - minPrice) / priceRange) * drawH;

      if (i === 0) {
        g.moveTo(x, y);
      } else {
        g.lineTo(x, y);
      }
    }
    g.strokePath();

    // Price dots
    for (let i = 0; i < prices.length; i++) {
      const x = chartX + padX + (drawW / (prices.length - 1)) * i;
      const y = chartY + padY + drawH - ((prices[i] - minPrice) / priceRange) * drawH;
      g.fillStyle(isUp ? 0x50c878 : 0xe74c3c, 1);
      g.fillCircle(x, y, 4);
    }

    // Current price display
    const currentPrice = prices[prices.length - 1];
    this.add.text(chartX + chartW / 2, chartY + chartH - 20, `${this.lang === 'he' ? 'מחיר נוכחי:' : 'Current:'} ${formatCurrency(currentPrice, this.lang)}`, {
      fontSize: '22px', color: '#ffd700', fontFamily: 'Arial',
    }).setOrigin(0.5);
  }

  private drawTradeControls(g: Phaser.GameObjects.Graphics) {
    if (!this.selectedStock) return;

    const panelX = 1260;
    const panelY = 100;
    const panelW = 630;

    g.fillStyle(0x16213e, 1);
    g.fillRoundedRect(panelX, panelY, panelW, 500, 12);

    const currentPrice = this.selectedStock.prices[this.selectedStock.prices.length - 1];
    const stockName = this.lang === 'he' ? this.selectedStock.nameHe : this.selectedStock.nameEn;
    const holding = this.store.portfolio[this.selectedStock.key];

    // Holdings info
    this.add.text(panelX + 20, panelY + 20, `${stockName}`, {
      fontSize: '24px', color: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
    });

    this.add.text(panelX + 20, panelY + 55, `${this.lang === 'he' ? 'מחיר:' : 'Price:'} ${formatCurrency(currentPrice, this.lang)}`, {
      fontSize: '20px', color: '#87ceeb', fontFamily: 'Arial',
    });

    this.add.text(panelX + 20, panelY + 85, `${this.lang === 'he' ? 'מניות:' : 'Shares:'} ${holding.shares}`, {
      fontSize: '20px', color: '#ffd700', fontFamily: 'Arial',
    });

    // Quick buy amounts
    const amounts = [1, 5, 10];
    const buyLabel = this.lang === 'he' ? 'קנה' : 'Buy';
    const sellLabel = this.lang === 'he' ? 'מכור' : 'Sell';

    this.add.text(panelX + panelW / 2, panelY + 140, buyLabel, {
      fontSize: '22px', color: '#50c878', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    for (let i = 0; i < amounts.length; i++) {
      const amt = amounts[i];
      this.createButton(
        panelX + 80 + i * 200, panelY + 190,
        `${amt}`,
        () => {
          if (this.selectedStock) {
            this.store.buyStock(this.selectedStock.key, amt, currentPrice);
            this.store.calculateAssets();
            this.scene.restart({ round: this.round });
          }
        },
        160, 40
      );
    }

    // Sell buttons (only from round 2+)
    if (this.round >= 2) {
      this.add.text(panelX + panelW / 2, panelY + 260, sellLabel, {
        fontSize: '22px', color: '#e74c3c', fontFamily: 'Arial', fontStyle: 'bold',
      }).setOrigin(0.5);

      for (let i = 0; i < amounts.length; i++) {
        const amt = amounts[i];
        this.createButton(
          panelX + 80 + i * 200, panelY + 310,
          `${amt}`,
          () => {
            if (this.selectedStock) {
              this.store.sellStock(this.selectedStock.key, amt, currentPrice);
              this.store.calculateAssets();
              this.scene.restart({ round: this.round });
            }
          },
          160, 40
        );
      }
    }

    // Portfolio summary
    const totalValue = holding.shares * currentPrice;
    this.add.text(panelX + 20, panelY + 380,
      `${this.lang === 'he' ? 'שווי אחזקה:' : 'Holdings value:'} ${formatCurrency(totalValue, this.lang)}`, {
      fontSize: '20px', color: '#aaa', fontFamily: 'Arial',
    });
  }
}
