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
    this.drawGradientBg(0x1a1a2e, 0x0a0a1e);

    // Title
    const title = this.lang === 'he' ? 'זמן עובר...' : 'Time passes...';
    this.add.text(this.w / 2, 80, title, {
      fontSize: '48px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Calendar animation
    const months = this.lang === 'he'
      ? ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני']
      : ['January', 'February', 'March', 'April', 'May', 'June'];

    const calText = this.add.text(this.w / 2, 200, '', {
      fontSize: '64px', color: '#ffffff', fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Animate through months
    let monthIdx = 0;
    this.time.addEvent({
      delay: 600,
      callback: () => {
        if (monthIdx < months.length) {
          calText.setText(months[monthIdx]);
          calText.setAlpha(0);
          this.tweens.add({
            targets: calText,
            alpha: 1,
            duration: 300,
            yoyo: true,
            hold: 200,
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
    g.fillStyle(0x0a0a2e, 0.9);
    g.fillRoundedRect(this.w / 2 - 400, 280, 800, 500, 16);

    const summaryTitle = this.lang === 'he' ? 'סיכום תקופה' : 'Period Summary';
    this.add.text(this.w / 2, 320, summaryTitle, {
      fontSize: '36px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

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

    for (const stock of stocks) {
      const holding = this.store.portfolio[stock.key];
      if (holding.shares === 0) continue;

      const newPrice = this.store.stockPrices[stock.key];
      const value = holding.shares * newPrice;
      const name = this.lang === 'he' ? stock.nameHe : stock.nameEn;

      const text = this.add.text(this.w / 2 - 350, y, '', {
        fontSize: '22px', color: '#ffffff', fontFamily: 'Arial',
      });

      // Animate text appearing
      this.time.delayedCall((y - 380) * 3, () => {
        text.setText(`${name}: ${holding.shares} × ${formatCurrency(newPrice, this.lang)} = ${formatCurrency(value, this.lang)}`);
        text.setAlpha(0);
        this.tweens.add({ targets: text, alpha: 1, duration: 500 });
      });

      y += 45;
    }

    // Total
    this.time.delayedCall(1500, () => {
      const totalAssets = this.store.calculateAssets();
      const total = this.store.cash + totalAssets;

      g.lineStyle(2, 0xffd700);
      g.moveTo(this.w / 2 - 300, y + 10);
      g.lineTo(this.w / 2 + 300, y + 10);
      g.stroke();

      this.add.text(this.w / 2, y + 40, `${this.lang === 'he' ? 'סה"כ:' : 'Total:'} ${formatCurrency(total, this.lang)}`, {
        fontSize: '32px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
      }).setOrigin(0.5);

      // Continue button
      this.createButton(
        this.w / 2, y + 120,
        this.lang === 'he' ? 'המשך' : 'Continue',
        () => {
          this.store.advanceTurn();
          const nextStreet = this.round === 1 ? 5 : 7;
          this.goToScene('Street', { streetIndex: nextStreet });
        },
        200, 50
      );
    });
  }
}
