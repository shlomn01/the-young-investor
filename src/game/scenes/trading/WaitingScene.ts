import { BaseScene } from '../BaseScene';
import { formatCurrency } from '../../../utils/formatUtils';
import type { StockName } from '../../../config/constants';

const GROWTH_DATA: Record<number, Record<string, number>> = {
  1: { solar: 130, koogle: 63 },
  2: { solar: 158, koogle: 85, sesla: 95 },
};

export class WaitingScene extends BaseScene {
  private round = 1;

  constructor() {
    super('Waiting');
  }

  init(data: { round?: number }) {
    this.round = data?.round ?? 1;
  }

  create() {
    super.create();

    // Background
    this.drawGradientBg(0x0e1a2e, 0x080e1a);

    const g = this.add.graphics();

    // Subtle decorative dots
    for (let i = 0; i < 40; i++) {
      g.fillStyle(0xffffff, 0.03 + Math.random() * 0.05);
      g.fillCircle(Math.random() * this.w, Math.random() * this.h, 1 + Math.random() * 3);
    }

    // Title
    const title = this.lang === 'he' ? 'זמן עובר...' : 'Time passes...';
    this.add.text(this.w / 2, 60, title, {
      fontSize: '48px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Calendar graphic
    const calX = this.w / 2;
    const calY = 200;
    const calW = 300;
    const calH = 220;

    // Calendar shadow
    g.fillStyle(0x000000, 0.3);
    g.fillRoundedRect(calX - calW / 2 + 6, calY - calH / 2 + 6, calW, calH, 12);
    // Calendar body
    g.fillStyle(0xf5f5f0, 1);
    g.fillRoundedRect(calX - calW / 2, calY - calH / 2, calW, calH, 12);
    // Calendar header bar
    g.fillStyle(0xe74c3c, 1);
    g.fillRoundedRect(calX - calW / 2, calY - calH / 2, calW, 50, { tl: 12, tr: 12, bl: 0, br: 0 });
    // Calendar rings
    g.fillStyle(0xcccccc, 1);
    g.fillCircle(calX - calW / 2 + 50, calY - calH / 2, 6);
    g.fillCircle(calX + calW / 2 - 50, calY - calH / 2, 6);
    g.fillStyle(0x888888, 1);
    g.fillRect(calX - calW / 2 + 48, calY - calH / 2 - 10, 4, 20);
    g.fillRect(calX + calW / 2 - 52, calY - calH / 2 - 10, 4, 20);

    // Calendar grid lines
    g.lineStyle(1, 0xdddddd, 0.5);
    for (let row = 0; row < 4; row++) {
      const ly = calY - calH / 2 + 70 + row * 38;
      g.moveTo(calX - calW / 2 + 15, ly);
      g.lineTo(calX + calW / 2 - 15, ly);
      g.strokePath();
    }
    for (let col = 0; col < 6; col++) {
      const lx = calX - calW / 2 + 30 + col * 42;
      g.moveTo(lx, calY - calH / 2 + 55);
      g.lineTo(lx, calY + calH / 2 - 10);
      g.strokePath();
    }

    // Month name display on calendar
    const calMonthText = this.add.text(calX, calY - calH / 2 + 25, '', {
      fontSize: '28px', color: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Large date number on calendar body
    const calDateText = this.add.text(calX, calY + 30, '', {
      fontSize: '72px', color: '#333333', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Animate through months
    const months = this.lang === 'he'
      ? ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני']
      : ['January', 'February', 'March', 'April', 'May', 'June'];

    let monthIdx = 0;
    this.time.addEvent({
      delay: 600,
      callback: () => {
        if (monthIdx < months.length) {
          calMonthText.setText(months[monthIdx]);
          calDateText.setText(`${monthIdx + 1}`);

          // Page flip effect
          calMonthText.setAlpha(0);
          calDateText.setAlpha(0);
          this.tweens.add({
            targets: [calMonthText, calDateText],
            alpha: 1,
            duration: 200,
          });

          // Calendar body flip animation
          const flipPage = this.add.graphics();
          flipPage.fillStyle(0xf0f0ea, 0.8);
          flipPage.fillRoundedRect(calX - calW / 2 + 5, calY - calH / 2 + 50, calW - 10, calH - 55, { tl: 0, tr: 0, bl: 10, br: 10 });
          flipPage.setAlpha(0.8);
          this.tweens.add({
            targets: flipPage,
            scaleY: 0,
            alpha: 0,
            duration: 300,
            onComplete: () => flipPage.destroy(),
          });

          monthIdx++;
        }
      },
      repeat: months.length - 1,
    });

    // After calendar animation, show portfolio growth
    this.time.delayedCall(months.length * 600 + 500, () => {
      this.showGrowthSummary();
    });

    this.fadeIn();
  }

  private showGrowthSummary() {
    const g = this.add.graphics();

    // Panel shadow
    g.fillStyle(0x000000, 0.3);
    g.fillRoundedRect(this.w / 2 - 394, 286, 800, 500, 16);
    // Panel
    g.fillStyle(0x0e1a2e, 0.95);
    g.fillRoundedRect(this.w / 2 - 400, 280, 800, 500, 16);
    // Border
    g.lineStyle(2, 0xffd700, 0.4);
    g.strokeRoundedRect(this.w / 2 - 400, 280, 800, 500, 16);

    const summaryTitle = this.lang === 'he' ? 'סיכום תקופה' : 'Period Summary';
    this.add.text(this.w / 2, 320, summaryTitle, {
      fontSize: '36px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Divider under title
    g.lineStyle(1, 0xffd700, 0.3);
    g.moveTo(this.w / 2 - 200, 352);
    g.lineTo(this.w / 2 + 200, 352);
    g.strokePath();

    // Update prices
    const growth = GROWTH_DATA[this.round] || {};
    this.store.updateStockPrices(growth);

    // Show each stock's growth
    let y = 380;
    const stocks: Array<{ key: StockName; nameHe: string; nameEn: string }> = [
      { key: 'solar', nameHe: 'סולאר', nameEn: 'Solar' },
      { key: 'koogle', nameHe: 'קוגל', nameEn: 'Koogle' },
      { key: 'sesla', nameHe: 'ססלה', nameEn: 'Sesla' },
      { key: 'lemon', nameHe: 'לימון', nameEn: 'Lemon' },
    ];

    let rowIndex = 0;
    for (const stock of stocks) {
      const holding = this.store.portfolio[stock.key];
      if (holding.shares === 0) continue;

      const newPrice = this.store.stockPrices[stock.key];
      const value = holding.shares * newPrice;
      const name = this.lang === 'he' ? stock.nameHe : stock.nameEn;

      // Row background (alternating)
      if (rowIndex % 2 === 0) {
        const rowBg = this.add.graphics();
        rowBg.fillStyle(0x1a2a4e, 0.2);
        rowBg.fillRoundedRect(this.w / 2 - 360, y - 8, 720, 40, 6);
        rowBg.setAlpha(0);
        this.time.delayedCall(rowIndex * 400, () => {
          this.tweens.add({ targets: rowBg, alpha: 1, duration: 300 });
        });
      }

      const text = this.add.text(this.w / 2 - 350, y, '', {
        fontSize: '22px', color: '#ffffff', fontFamily: 'Arial',
      });

      // Animate text appearing
      this.time.delayedCall(rowIndex * 400, () => {
        text.setText(`${name}: ${holding.shares} × ${formatCurrency(newPrice, this.lang)} = ${formatCurrency(value, this.lang)}`);
        text.setAlpha(0);
        text.setX(this.w / 2 - 370);
        this.tweens.add({
          targets: text,
          alpha: 1,
          x: this.w / 2 - 350,
          duration: 500,
          ease: 'Power2',
        });
      });

      y += 45;
      rowIndex++;
    }

    // Total
    this.time.delayedCall(1500, () => {
      const totalAssets = this.store.calculateAssets();
      const total = this.store.cash + totalAssets;

      // Divider line
      g.lineStyle(2, 0xffd700, 0.5);
      g.moveTo(this.w / 2 - 300, y + 10);
      g.lineTo(this.w / 2 + 300, y + 10);
      g.stroke();

      // Total panel highlight
      const totalBg = this.add.graphics();
      totalBg.fillStyle(0xffd700, 0.06);
      totalBg.fillRoundedRect(this.w / 2 - 250, y + 20, 500, 50, 10);

      const totalText = this.add.text(this.w / 2, y + 45, `${this.lang === 'he' ? 'סה"כ:' : 'Total:'} ${formatCurrency(total, this.lang)}`, {
        fontSize: '32px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
      }).setOrigin(0.5).setAlpha(0).setScale(0.8);

      this.tweens.add({
        targets: totalText,
        alpha: 1,
        scale: 1,
        duration: 600,
        ease: 'Back.easeOut',
      });

      // Continue button
      const btn = this.createButton(
        this.w / 2, y + 120,
        this.lang === 'he' ? 'המשך' : 'Continue',
        () => {
          this.store.advanceTurn();
          const nextStreet = this.round === 1 ? 5 : 7;
          this.goToScene('Street', { streetIndex: nextStreet });
        },
        200, 50
      );
      btn.setAlpha(0);
      this.tweens.add({
        targets: btn,
        alpha: 1,
        duration: 500,
        delay: 300,
      });
    });
  }
}
