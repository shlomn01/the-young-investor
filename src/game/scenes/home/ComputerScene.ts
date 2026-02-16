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

    // Room background - dark with slight blue tint
    const g = this.add.graphics();
    g.fillStyle(0x1a1a2e, 1);
    g.fillRect(0, 0, this.w, this.h);

    // Desk surface
    g.fillStyle(0x5c3d2e, 1);
    g.fillRect(100, this.h - 100, this.w - 200, 100);
    g.fillStyle(0x6b4a3a, 0.5);
    g.fillRect(100, this.h - 100, this.w - 200, 4);

    // Monitor stand
    const standX = this.w / 2;
    const standY = this.h - 100;
    g.fillStyle(0x2a2a2a, 1);
    g.fillRect(standX - 60, standY - 20, 120, 22);
    g.fillStyle(0x3a3a3a, 0.5);
    g.fillRect(standX - 60, standY - 20, 120, 4);
    // Stand neck
    g.fillStyle(0x333333, 1);
    g.fillRect(standX - 15, standY - 60, 30, 42);
    g.fillStyle(0x444444, 0.4);
    g.fillRect(standX - 13, standY - 58, 4, 38);

    // Monitor dimensions
    const monW = this.w - 300;
    const monH = this.h - 200;
    const monX = 150;
    const monY = 30;

    // Monitor outer bezel shadow
    g.fillStyle(0x000000, 0.3);
    g.fillRoundedRect(monX + 6, monY + 6, monW, monH, 12);

    // Monitor outer bezel
    g.fillStyle(0x2a2a2a, 1);
    g.fillRoundedRect(monX, monY, monW, monH, 12);

    // Bezel highlight (top edge)
    g.fillStyle(0x444444, 0.5);
    g.fillRoundedRect(monX + 2, monY + 2, monW - 4, 8, { tl: 10, tr: 10, bl: 0, br: 0 });

    // Inner bezel
    g.fillStyle(0x222222, 1);
    g.fillRoundedRect(monX + 14, monY + 14, monW - 28, monH - 28, 4);

    // Screen glow effect (subtle outer glow)
    g.fillStyle(0x4a90d9, 0.05);
    g.fillRoundedRect(monX - 8, monY - 8, monW + 16, monH + 16, 16);

    // Screen background
    g.fillStyle(0x0a0a1e, 1);
    g.fillRect(monX + 18, monY + 18, monW - 36, monH - 36);

    // Screen inner glow
    g.fillStyle(0x1a2a4e, 0.15);
    g.fillRect(monX + 18, monY + 18, monW - 36, monH - 36);

    // Power LED
    g.fillStyle(0x00ff00, 0.8);
    g.fillCircle(monX + monW - 30, monY + monH - 14, 3);
    g.fillStyle(0x00ff00, 0.2);
    g.fillCircle(monX + monW - 30, monY + monH - 14, 6);

    // Webcam dot at top center
    g.fillStyle(0x333333, 1);
    g.fillCircle(standX, monY + 8, 4);
    g.fillStyle(0x1a1a2e, 1);
    g.fillCircle(standX, monY + 8, 2);

    // Screen content area
    const screenX = monX + 22;
    const screenY = monY + 22;
    const screenW = monW - 44;
    /* screenH available: monH - 44 */

    // Title bar
    g.fillStyle(0x4a90d9, 1);
    g.fillRoundedRect(screenX, screenY, screenW, 50, { tl: 4, tr: 4, bl: 0, br: 0 });

    // Title bar buttons (window controls)
    g.fillStyle(0xff5f57, 1);
    g.fillCircle(screenX + 20, screenY + 25, 6);
    g.fillStyle(0xffbd2e, 1);
    g.fillCircle(screenX + 40, screenY + 25, 6);
    g.fillStyle(0x28c940, 1);
    g.fillCircle(screenX + 60, screenY + 25, 6);

    const title = this.lang === 'he' ? 'תיק ההשקעות שלי' : 'My Portfolio';
    this.add.text(screenX + screenW / 2, screenY + 25, title, {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Portfolio display
    const startY = screenY + 80;
    const state = this.store;
    const contentLeft = screenX + 80;
    const contentRight = screenX + screenW - 80;

    // Cash row with subtle background
    const g2 = this.add.graphics();
    g2.fillStyle(0x1a2a4e, 0.3);
    g2.fillRoundedRect(contentLeft - 20, startY - 8, contentRight - contentLeft + 40, 36, 6);

    this.add.text(contentLeft, startY, this.lang === 'he' ? 'מזומן:' : 'Cash:', {
      fontSize: '24px', color: '#87ceeb', fontFamily: 'Arial',
    });
    this.add.text(contentRight, startY, formatCurrency(state.cash, state.language), {
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

      // Alternating row background
      if (stocks.indexOf(stock) % 2 === 0) {
        g2.fillStyle(0x1a2a4e, 0.15);
        g2.fillRoundedRect(contentLeft - 20, y - 8, contentRight - contentLeft + 40, 40, 4);
      }

      this.add.text(contentLeft, y, stock.name, {
        fontSize: '22px', color: '#ffffff', fontFamily: 'Arial',
      });
      this.add.text(contentLeft + 300, y, `${holding.shares} ${this.lang === 'he' ? 'מניות' : 'shares'}`, {
        fontSize: '22px', color: '#aaa', fontFamily: 'Arial',
      });
      this.add.text(contentLeft + 600, y, `@ ${formatCurrency(price, state.language)}`, {
        fontSize: '22px', color: '#aaa', fontFamily: 'Arial',
      });
      this.add.text(contentRight, y, formatCurrency(value, state.language), {
        fontSize: '22px', color: value > 0 ? '#50c878' : '#888', fontFamily: 'Arial',
      }).setOrigin(1, 0);

      y += 45;
    }

    // Total divider
    y += 20;
    g2.lineStyle(2, 0x4a90d9);
    g2.moveTo(contentLeft, y);
    g2.lineTo(contentRight, y);
    g2.stroke();

    y += 15;
    const totalAssets = stocks.reduce((sum, s) => sum + state.portfolio[s.key].shares * state.stockPrices[s.key], 0);
    const total = state.cash + totalAssets;

    // Total row with highlight
    g2.fillStyle(0xffd700, 0.08);
    g2.fillRoundedRect(contentLeft - 20, y - 8, contentRight - contentLeft + 40, 40, 6);

    this.add.text(contentLeft, y, this.lang === 'he' ? 'סה"כ:' : 'Total:', {
      fontSize: '28px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    });
    this.add.text(contentRight, y, formatCurrency(total, state.language), {
      fontSize: '28px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(1, 0);

    // Goal progress
    y += 60;
    const progress = Math.min((total / state.destination) * 100, 100);
    this.add.text(contentLeft, y, `${this.lang === 'he' ? 'יעד:' : 'Goal:'} ${formatCurrency(state.destination, state.language)}`, {
      fontSize: '22px', color: '#87ceeb', fontFamily: 'Arial',
    });

    y += 35;
    // Progress bar background
    g2.fillStyle(0x333333, 1);
    g2.fillRoundedRect(contentLeft, y, contentRight - contentLeft, 30, 8);
    // Progress bar fill
    const barFillW = (contentRight - contentLeft) * (progress / 100);
    g2.fillStyle(progress >= 100 ? 0x50c878 : 0x4a90d9, 1);
    g2.fillRoundedRect(contentLeft, y, barFillW, 30, 8);
    // Progress bar shine
    g2.fillStyle(0xffffff, 0.1);
    g2.fillRoundedRect(contentLeft + 2, y + 2, barFillW - 4, 12, { tl: 6, tr: 6, bl: 0, br: 0 });

    this.add.text(this.w / 2, y + 15, `${progress.toFixed(1)}%`, {
      fontSize: '18px', color: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
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
