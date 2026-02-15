import { BaseScene } from '../BaseScene';
import { formatCurrency } from '../../../utils/formatUtils';

export class CreditsScene extends BaseScene {
  constructor() {
    super('Credits');
  }

  create() {
    super.create();

    this.drawGradientBg(0x1a1a2e, 0x0a0a1e);

    // Final summary
    const totalAssets = this.store.calculateAssets();
    const total = this.store.cash + totalAssets;
    const reachedGoal = total >= this.store.destination;

    const resultTitle = reachedGoal
      ? (this.lang === 'he' ? '🎉 כל הכבוד! הגעת ליעד! 🎉' : '🎉 Congratulations! You reached the goal! 🎉')
      : (this.lang === 'he' ? 'סיימת את המשחק!' : 'You finished the game!');

    this.add.text(this.w / 2, 100, resultTitle, {
      fontSize: '44px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
      wordWrap: { width: 1600 }, align: 'center',
    }).setOrigin(0.5);

    // Portfolio summary
    this.add.text(this.w / 2, 200, `${this.lang === 'he' ? 'סה"כ:' : 'Total:'} ${formatCurrency(total, this.lang)}`, {
      fontSize: '48px', color: '#50c878', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // What you learned
    const lessonsTitle = this.lang === 'he' ? 'מה למדנו:' : 'What we learned:';
    this.add.text(this.w / 2, 300, lessonsTitle, {
      fontSize: '28px', color: '#87ceeb', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    const lessons = this.lang === 'he'
      ? [
        '✓ מה זה מניה וחברה ציבורית',
        '✓ איך הבורסה עובדת',
        '✓ חישובי אחוזים בהשקעות',
        '✓ ריבית דריבית - הכוח החזק ביותר',
        '✓ פיזור סיכונים',
        '✓ סבלנות בהשקעות',
        '✓ פקודות מסחר: Limit Buy, Limit Sell',
      ]
      : [
        '✓ What stocks and public companies are',
        '✓ How the stock exchange works',
        '✓ Percentage calculations in investing',
        '✓ Compound interest - the most powerful force',
        '✓ Diversification',
        '✓ Patience in investing',
        '✓ Trading orders: Limit Buy, Limit Sell',
      ];

    for (let i = 0; i < lessons.length; i++) {
      const t = this.add.text(this.w / 2, 350 + i * 35, lessons[i], {
        fontSize: '22px', color: '#ffffff', fontFamily: 'Arial',
      }).setOrigin(0.5);

      // Fade in animation
      t.setAlpha(0);
      this.tweens.add({
        targets: t, alpha: 1, duration: 500, delay: i * 200,
      });
    }

    // Credits
    const creditsY = 650;
    this.add.text(this.w / 2, creditsY, this.lang === 'he' ? 'קרדיטים' : 'Credits', {
      fontSize: '28px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    const credits = [
      this.lang === 'he' ? 'המשקיע הצעיר - משחק ללימוד השקעות' : 'The Young Investor - Investment Learning Game',
      this.lang === 'he' ? 'נבנה עם React + Phaser.js' : 'Built with React + Phaser.js',
    ];

    for (let i = 0; i < credits.length; i++) {
      this.add.text(this.w / 2, creditsY + 40 + i * 30, credits[i], {
        fontSize: '18px', color: '#888', fontFamily: 'Arial',
      }).setOrigin(0.5);
    }

    // Play again
    this.createButton(this.w / 2 - 150, this.h - 60,
      this.lang === 'he' ? 'שחק שוב' : 'Play Again',
      () => {
        this.store.resetGame();
        this.goToScene('Boot');
      },
      200, 50);

    this.createButton(this.w / 2 + 150, this.h - 60,
      this.lang === 'he' ? 'המשך...' : 'To be continued...',
      () => {},
      200, 50);

    this.fadeIn();
  }
}
