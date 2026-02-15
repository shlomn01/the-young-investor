import { BaseScene } from '../BaseScene';
import { formatCurrency } from '../../../utils/formatUtils';

export class ComputerScene extends BaseScene {
  private variant = 1;

  constructor() {
    super('Computer');
  }

  init(data: { variant?: number }) {
    this.variant = data?.variant ?? 1;
  }

  create() {
    super.create();

    // Computer screen background
    const g = this.add.graphics();
    g.fillStyle(0x1a1a2e, 1);
    g.fillRect(0, 0, this.w, this.h);

    // Monitor frame
    g.lineStyle(8, 0x333333);
    g.strokeRect(200, 50, this.w - 400, this.h - 150);
    g.fillStyle(0x0a0a1e, 1);
    g.fillRect(208, 58, this.w - 416, this.h - 166);

    // Title bar
    g.fillStyle(0x4a90d9, 1);
    g.fillRect(208, 58, this.w - 416, 50);

    const title = this.lang === 'he' ? 'תיק ההשקעות שלי' : 'My Portfolio';
    this.add.text(this.w / 2, 83, title, {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Portfolio display
    const startY = 160;
    const state = this.store;

    // Cash row
    this.add.text(300, startY, this.lang === 'he' ? 'מזומן:' : 'Cash:', {
      fontSize: '24px', color: '#87ceeb', fontFamily: 'Arial',
    });
    this.add.text(this.w - 300, startY, formatCurrency(state.cash, state.language), {
      fontSize: '24px', color: '#50c878', fontFamily: 'Arial',
    }).setOrigin(1, 0);

    // Stocks
    const stocks = [
      { key: 'solar', name: this.lang === 'he' ? 'סולאר' : 'Solar' },
      { key: 'koogle', name: this.lang === 'he' ? 'קוגל' : 'Koogle' },
      { key: 'sesla', name: this.lang === 'he' ? 'ססלה' : 'Sesla' },
      { key: 'lemon', name: this.lang === 'he' ? 'לימון' : 'Lemon' },
    ] as const;

    let y = startY + 60;
    for (const stock of stocks) {
      const holding = state.portfolio[stock.key];
      const price = state.stockPrices[stock.key];
      const value = holding.shares * price;

      this.add.text(300, y, stock.name, {
        fontSize: '22px', color: '#ffffff', fontFamily: 'Arial',
      });
      this.add.text(600, y, `${holding.shares} ${this.lang === 'he' ? 'מניות' : 'shares'}`, {
        fontSize: '22px', color: '#aaa', fontFamily: 'Arial',
      });
      this.add.text(900, y, `@ ${formatCurrency(price, state.language)}`, {
        fontSize: '22px', color: '#aaa', fontFamily: 'Arial',
      });
      this.add.text(this.w - 300, y, formatCurrency(value, state.language), {
        fontSize: '22px', color: value > 0 ? '#50c878' : '#888', fontFamily: 'Arial',
      }).setOrigin(1, 0);

      y += 45;
    }

    // Total
    y += 20;
    const g2 = this.add.graphics();
    g2.lineStyle(2, 0x4a90d9);
    g2.moveTo(300, y);
    g2.lineTo(this.w - 300, y);
    g2.stroke();

    y += 15;
    const totalAssets = stocks.reduce((sum, s) => sum + state.portfolio[s.key].shares * state.stockPrices[s.key], 0);
    const total = state.cash + totalAssets;

    this.add.text(300, y, this.lang === 'he' ? 'סה"כ:' : 'Total:', {
      fontSize: '28px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    });
    this.add.text(this.w - 300, y, formatCurrency(total, state.language), {
      fontSize: '28px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(1, 0);

    // Goal progress
    y += 60;
    const progress = Math.min((total / state.destination) * 100, 100);
    this.add.text(300, y, `${this.lang === 'he' ? 'יעד:' : 'Goal:'} ${formatCurrency(state.destination, state.language)}`, {
      fontSize: '22px', color: '#87ceeb', fontFamily: 'Arial',
    });

    y += 35;
    g2.fillStyle(0x333333, 1);
    g2.fillRoundedRect(300, y, this.w - 600, 30, 8);
    g2.fillStyle(progress >= 100 ? 0x50c878 : 0x4a90d9, 1);
    g2.fillRoundedRect(300, y, (this.w - 600) * (progress / 100), 30, 8);

    this.add.text(this.w / 2, y + 15, `${progress.toFixed(1)}%`, {
      fontSize: '18px', color: '#ffffff', fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Back button
    this.createButton(
      this.w / 2, this.h - 50,
      this.lang === 'he' ? 'חזרה' : 'Back',
      () => this.goToScene('Bedroom', { variant: this.variant }),
      160, 40
    );

    this.fadeIn();
  }
}
