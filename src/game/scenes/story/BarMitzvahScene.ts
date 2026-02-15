import { BaseScene } from '../BaseScene';
import { COLORS } from '../../../config/constants';
import { formatCurrency } from '../../../utils/formatUtils';

const BAR_MITZVAH_MONEY = 5000;

export class BarMitzvahScene extends BaseScene {
  constructor() {
    super('BarMitzvah');
  }

  create() {
    super.create();

    // Synagogue interior
    const g = this.add.graphics();
    g.fillStyle(0xfaf0e6, 1);
    g.fillRect(0, 0, this.w, this.h);
    g.fillStyle(0xdaa520, 0.2);
    g.fillRect(0, 0, this.w, this.h);

    // Arched ceiling
    g.fillStyle(0x8b7355, 1);
    for (let i = 0; i < 5; i++) {
      const ax = 200 + i * 380;
      g.lineStyle(8, 0x8b4513);
      g.beginPath();
      g.arc(ax, 200, 150, Math.PI, 0, false);
      g.strokePath();
    }

    // Floor
    g.fillStyle(0xb8860b, 0.3);
    g.fillRect(0, this.h - 120, this.w, 120);

    // Stained glass windows
    const windowColors = [0xff0000, 0x0000ff, 0x00ff00, 0xffd700, 0xff00ff];
    for (let i = 0; i < 5; i++) {
      g.fillStyle(windowColors[i], 0.3);
      g.fillRect(200 + i * 380 - 40, 60, 80, 140);
      g.lineStyle(3, 0x8b4513);
      g.strokeRect(200 + i * 380 - 40, 60, 80, 140);
    }

    // Title
    this.add.text(this.w / 2, 30, this.lang === 'he' ? '🎉 בר מצווה! 🎉' : '🎉 Bar Mitzvah! 🎉', {
      fontSize: '48px', color: '#daa520', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Characters - family gathering
    const npcs = [
      { x: 300, color: 0x2f4f4f, name: this.lang === 'he' ? 'אבא' : 'Dad' },
      { x: 500, color: 0x800080, name: this.lang === 'he' ? 'אמא' : 'Mom' },
      { x: 1400, color: 0x808080, name: this.lang === 'he' ? 'סבא' : 'Grandpa' },
      { x: 1600, color: 0xcd853f, name: this.lang === 'he' ? 'סבתא' : 'Grandma' },
    ];

    for (const npc of npcs) {
      this.drawCharacterPlaceholder(npc.x, this.h - 200, npc.color, npc.name);
    }

    // Player (center, celebrating)
    this.drawCharacterPlaceholder(this.w / 2, this.h - 200, COLORS.ACCENT, this.store.playerName || undefined);

    // Falling candy animation
    for (let i = 0; i < 30; i++) {
      const candyColors = [0xff6347, 0xffd700, 0x00bfff, 0x32cd32, 0xff69b4];
      const candy = this.add.circle(
        Math.random() * this.w,
        -50 - Math.random() * 500,
        5 + Math.random() * 5,
        candyColors[Math.floor(Math.random() * candyColors.length)]
      );

      this.tweens.add({
        targets: candy,
        y: this.h + 50,
        x: candy.x + (Math.random() - 0.5) * 200,
        duration: 3000 + Math.random() * 3000,
        delay: Math.random() * 2000,
        repeat: -1,
        onRepeat: () => {
          candy.y = -50;
          candy.x = Math.random() * this.w;
        },
      });
    }

    // Firework particles
    this.time.addEvent({
      delay: 1500,
      callback: () => this.createFirework(),
      repeat: 5,
    });

    // Dialogue sequence
    this.time.delayedCall(1000, async () => {
      await this.showDialogue(
        this.lang === 'he' ? 'אבא' : 'Dad',
        this.lang === 'he' ? 'מזל טוב! היום אתה נהיה גבר!' : 'Congratulations! Today you become a man!'
      );
      await this.showDialogue(
        this.lang === 'he' ? 'סבא' : 'Grandpa',
        this.lang === 'he'
          ? `יש לנו מתנה בשבילך - ${formatCurrency(BAR_MITZVAH_MONEY, 'he')}! תשתמש בזה בחוכמה.`
          : `We have a gift for you - ${formatCurrency(BAR_MITZVAH_MONEY, 'en')}! Use it wisely.`
      );

      // Give money
      this.store.addCash(BAR_MITZVAH_MONEY);
      this.store.completeBarMitzvah();

      await this.showDialogue(
        this.lang === 'he' ? 'אמא' : 'Mom',
        this.lang === 'he'
          ? 'איזה יופי! עכשיו אתה יכול להשקיע את הכסף הזה.'
          : 'How wonderful! Now you can invest this money.'
      );

      // Show continue button
      this.createButton(this.w / 2, this.h - 50,
        this.lang === 'he' ? 'המשך' : 'Continue',
        () => this.goToScene('Street', { streetIndex: 8 }),
        200, 50);
    });

    this.fadeIn();
  }

  private createFirework() {
    const fx = 200 + Math.random() * (this.w - 400);
    const fy = 100 + Math.random() * 300;
    const colors = [0xff0000, 0xffd700, 0x00ff00, 0x00bfff, 0xff69b4, 0xffffff];

    for (let i = 0; i < 20; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const particle = this.add.circle(fx, fy, 3, color);
      const angle = (i / 20) * Math.PI * 2;
      const dist = 50 + Math.random() * 80;

      this.tweens.add({
        targets: particle,
        x: fx + Math.cos(angle) * dist,
        y: fy + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.1,
        duration: 800 + Math.random() * 400,
        onComplete: () => particle.destroy(),
      });
    }
  }
}
