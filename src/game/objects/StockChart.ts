import Phaser from 'phaser';

export interface StockChartConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  prices: number[];
  label?: string;
  showGrid?: boolean;
  lineColor?: number;
}

// Draws a stock price chart using Phaser Graphics
export class StockChart {
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;
  private config: StockChartConfig;

  constructor(scene: Phaser.Scene, config: StockChartConfig) {
    this.scene = scene;
    this.config = config;
    this.graphics = scene.add.graphics();
    this.draw();
  }

  draw() {
    const { x, y, width, height, prices, showGrid = true } = this.config;
    const g = this.graphics;
    g.clear();

    // Background
    g.fillStyle(0x0a0a2e, 1);
    g.fillRoundedRect(x, y, width, height, 8);

    if (prices.length < 2) return;

    const padX = 50;
    const padY = 40;
    const drawW = width - padX * 2;
    const drawH = height - padY * 2;

    const minPrice = Math.min(...prices) * 0.95;
    const maxPrice = Math.max(...prices) * 1.05;
    const priceRange = maxPrice - minPrice || 1;

    // Grid
    if (showGrid) {
      g.lineStyle(1, 0x333333, 0.5);
      for (let i = 0; i <= 4; i++) {
        const gy = y + padY + (drawH / 4) * i;
        g.moveTo(x + padX, gy);
        g.lineTo(x + width - padX, gy);
        g.stroke();

        // Price label
        const priceLabel = (maxPrice - (priceRange / 4) * i).toFixed(0);
        this.scene.add.text(x + padX - 10, gy, `₪${priceLabel}`, {
          fontSize: '12px',
          color: '#666',
          fontFamily: 'Arial',
        }).setOrigin(1, 0.5);
      }
    }

    // Determine color based on trend
    const isUp = prices[prices.length - 1] >= prices[0];
    const lineColor = this.config.lineColor ?? (isUp ? 0x50c878 : 0xe74c3c);

    // Fill gradient under curve
    g.fillStyle(lineColor, 0.1);
    g.beginPath();
    g.moveTo(x + padX, y + padY + drawH);

    for (let i = 0; i < prices.length; i++) {
      const px = x + padX + (i / (prices.length - 1)) * drawW;
      const py = y + padY + drawH - ((prices[i] - minPrice) / priceRange) * drawH;
      g.lineTo(px, py);
    }

    g.lineTo(x + padX + drawW, y + padY + drawH);
    g.closePath();
    g.fillPath();

    // Price line
    g.lineStyle(3, lineColor, 1);
    g.beginPath();

    for (let i = 0; i < prices.length; i++) {
      const px = x + padX + (i / (prices.length - 1)) * drawW;
      const py = y + padY + drawH - ((prices[i] - minPrice) / priceRange) * drawH;

      if (i === 0) g.moveTo(px, py);
      else g.lineTo(px, py);
    }
    g.strokePath();

    // Price dots
    for (let i = 0; i < prices.length; i++) {
      const px = x + padX + (i / (prices.length - 1)) * drawW;
      const py = y + padY + drawH - ((prices[i] - minPrice) / priceRange) * drawH;
      g.fillStyle(lineColor, 1);
      g.fillCircle(px, py, 3);
    }

    // Current price highlight
    const lastPrice = prices[prices.length - 1];
    const lastX = x + width - padX;
    const lastY = y + padY + drawH - ((lastPrice - minPrice) / priceRange) * drawH;

    g.fillStyle(lineColor, 1);
    g.fillCircle(lastX, lastY, 6);
    g.lineStyle(2, 0xffffff, 0.5);
    g.strokeCircle(lastX, lastY, 6);

    // Label
    if (this.config.label) {
      this.scene.add.text(x + width / 2, y + 15, this.config.label, {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      }).setOrigin(0.5);
    }
  }

  updatePrices(prices: number[]) {
    this.config.prices = prices;
    this.draw();
  }

  destroy() {
    this.graphics.destroy();
  }
}
