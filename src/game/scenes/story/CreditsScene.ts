import { BaseScene } from '../BaseScene';
import { formatCurrency } from '../../../utils/formatUtils';

export class CreditsScene extends BaseScene {
  constructor() {
    super('Credits');
  }

  create() {
    super.create();

    // Richer background gradient (deep indigo to dark purple)
    this.drawGradientBg(0x0d0b2e, 0x1a0830);

    const g = this.add.graphics();

    // Decorative stars/sparkles in background
    for (let i = 0; i < 80; i++) {
      const sx = Math.random() * this.w;
      const sy = Math.random() * this.h;
      const brightness = 0.1 + Math.random() * 0.5;
      g.fillStyle(0xffffff, brightness);
      g.fillCircle(sx, sy, 0.5 + Math.random() * 1.5);
    }

    // Final summary
    const totalAssets = this.store.calculateAssets();
    const total = this.store.cash + totalAssets;
    const reachedGoal = total >= this.store.destination;

    const resultTitle = reachedGoal
      ? (this.lang === 'he' ? '🎉 כל הכבוד! הגעת ליעד! 🎉' : '🎉 Congratulations! You reached the goal! 🎉')
      : (this.lang === 'he' ? 'סיימת את המשחק!' : 'You finished the game!');

    // Title with glow effect
    const titleGlow = this.add.text(this.w / 2, 80, resultTitle, {
      fontSize: '44px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
      wordWrap: { width: 1600 }, align: 'center',
    }).setOrigin(0.5).setAlpha(0.3).setScale(1.03);
    this.tweens.add({
      targets: titleGlow,
      alpha: 0.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
    });

    this.add.text(this.w / 2, 80, resultTitle, {
      fontSize: '44px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
      wordWrap: { width: 1600 }, align: 'center',
    }).setOrigin(0.5);

    // Results panel with frame
    const panelW = 800;
    const panelH = 560;
    const panelX = this.w / 2 - panelW / 2;
    const panelY = 130;

    // Panel shadow
    g.fillStyle(0x000000, 0.3);
    g.fillRoundedRect(panelX + 6, panelY + 6, panelW, panelH, 20);
    // Panel background
    g.fillStyle(0x0e0a2e, 0.9);
    g.fillRoundedRect(panelX, panelY, panelW, panelH, 20);
    // Panel border
    g.lineStyle(3, 0xffd700, 0.5);
    g.strokeRoundedRect(panelX, panelY, panelW, panelH, 20);
    // Inner border
    g.lineStyle(1, 0xffd700, 0.15);
    g.strokeRoundedRect(panelX + 8, panelY + 8, panelW - 16, panelH - 16, 16);

    // Portfolio total with animated scale
    const totalText = this.add.text(this.w / 2, panelY + 50,
      `${this.lang === 'he' ? 'סה"כ:' : 'Total:'} ${formatCurrency(total, this.lang)}`, {
      fontSize: '48px', color: '#50c878', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0).setScale(0.5);

    this.tweens.add({
      targets: totalText,
      alpha: 1,
      scale: 1,
      duration: 800,
      delay: 300,
      ease: 'Back.easeOut',
    });

    // Divider
    g.lineStyle(2, 0xffd700, 0.3);
    g.moveTo(panelX + 40, panelY + 90);
    g.lineTo(panelX + panelW - 40, panelY + 90);
    g.strokePath();

    // What you learned
    const lessonsTitle = this.lang === 'he' ? 'מה למדנו:' : 'What we learned:';
    const lessonsTitleText = this.add.text(this.w / 2, panelY + 120, lessonsTitle, {
      fontSize: '28px', color: '#87ceeb', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: lessonsTitleText,
      alpha: 1,
      duration: 500,
      delay: 600,
    });

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
      const t = this.add.text(this.w / 2, panelY + 165 + i * 35, lessons[i], {
        fontSize: '22px', color: '#ffffff', fontFamily: 'Arial',
      }).setOrigin(0.5);

      // Staggered fade-in with slide
      t.setAlpha(0);
      t.setX(this.w / 2 - 30);
      this.tweens.add({
        targets: t,
        alpha: 1,
        x: this.w / 2,
        duration: 500,
        delay: 800 + i * 250,
        ease: 'Power2',
      });
    }

    // Credits section
    const creditsY = panelY + panelH - 100;
    // Divider
    g.lineStyle(1, 0xffd700, 0.2);
    g.moveTo(panelX + 60, creditsY - 15);
    g.lineTo(panelX + panelW - 60, creditsY - 15);
    g.strokePath();

    const creditsTitle = this.add.text(this.w / 2, creditsY, this.lang === 'he' ? 'קרדיטים' : 'Credits', {
      fontSize: '24px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: creditsTitle,
      alpha: 1,
      duration: 500,
      delay: 800 + lessons.length * 250,
    });

    const credits = [
      this.lang === 'he' ? 'המשקיע הצעיר - משחק ללימוד השקעות' : 'The Young Investor - Investment Learning Game',
      this.lang === 'he' ? 'נבנה עם React + Phaser.js' : 'Built with React + Phaser.js',
    ];

    for (let i = 0; i < credits.length; i++) {
      const ct = this.add.text(this.w / 2, creditsY + 35 + i * 30, credits[i], {
        fontSize: '18px', color: '#888', fontFamily: 'Arial',
      }).setOrigin(0.5).setAlpha(0);

      this.tweens.add({
        targets: ct,
        alpha: 1,
        duration: 500,
        delay: 1000 + lessons.length * 250 + i * 200,
      });
    }

    // Buttons - fade in after content
    const btnDelay = 1200 + lessons.length * 250 + credits.length * 200;

    const btn1Container = this.createButton(this.w / 2 - 150, this.h - 60,
      this.lang === 'he' ? 'שחק שוב' : 'Play Again',
      () => {
        this.store.resetGame();
        this.goToScene('Boot');
      },
      200, 50);
    btn1Container.setAlpha(0);
    this.tweens.add({ targets: btn1Container, alpha: 1, duration: 500, delay: btnDelay });

    const btn2Container = this.createButton(this.w / 2 + 150, this.h - 60,
      this.lang === 'he' ? 'המשך...' : 'To be continued...',
      () => {},
      200, 50);
    btn2Container.setAlpha(0);
    this.tweens.add({ targets: btn2Container, alpha: 1, duration: 500, delay: btnDelay + 200 });

    this.fadeIn();
  }
}
