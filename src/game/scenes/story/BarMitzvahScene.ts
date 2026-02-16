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

    const g = this.add.graphics();

    // Synagogue interior - warm stone walls with gradient
    const wallSteps = 20;
    for (let i = 0; i < wallSteps; i++) {
      const t = i / wallSteps;
      const r = Math.floor(Phaser.Math.Linear(0xfa, 0xe8, t));
      const gr = Math.floor(Phaser.Math.Linear(0xf0, 0xd8, t));
      const b = Math.floor(Phaser.Math.Linear(0xe6, 0xc8, t));
      g.fillStyle((r << 16) | (gr << 8) | b, 1);
      g.fillRect(0, (i * this.h) / wallSteps, this.w, this.h / wallSteps + 1);
    }
    // Golden overlay
    g.fillStyle(0xdaa520, 0.1);
    g.fillRect(0, 0, this.w, this.h);

    // Stone wall texture - subtle brick pattern
    g.fillStyle(0x000000, 0.03);
    for (let row = 0; row < Math.floor(this.h / 30); row++) {
      const ry = row * 30;
      g.fillRect(0, ry, this.w, 1);
      const offset = row % 2 === 0 ? 0 : 40;
      for (let col = offset; col < this.w; col += 80) {
        g.fillRect(col, ry, 1, 30);
      }
    }

    // Stone arches with depth
    for (let i = 0; i < 5; i++) {
      const ax = 200 + i * 380;
      // Arch shadow (depth)
      g.lineStyle(12, 0x7a6345, 0.3);
      g.beginPath();
      g.arc(ax + 3, 203, 152, Math.PI, 0, false);
      g.strokePath();
      // Main arch
      g.lineStyle(10, 0x8b4513, 1);
      g.beginPath();
      g.arc(ax, 200, 150, Math.PI, 0, false);
      g.strokePath();
      // Inner arch highlight
      g.lineStyle(4, 0xa0764f, 0.6);
      g.beginPath();
      g.arc(ax, 200, 140, Math.PI, 0, false);
      g.strokePath();
      // Pillar bases
      g.fillStyle(0x8b4513, 1);
      g.fillRect(ax - 155, 200, 14, 200);
      g.fillRect(ax + 141, 200, 14, 200);
      // Pillar highlights
      g.fillStyle(0xa0764f, 0.4);
      g.fillRect(ax - 153, 200, 4, 200);
      g.fillRect(ax + 143, 200, 4, 200);
    }

    // Wooden floor with plank texture
    const floorY = this.h - 120;
    const plankColors = [0xb8860b, 0xa87808, 0xc89418];
    for (let py = floorY; py < this.h; py += 20) {
      const idx = Math.floor((py - floorY) / 20) % plankColors.length;
      g.fillStyle(plankColors[idx], 1);
      g.fillRect(0, py, this.w, 20);
      // Plank line
      g.fillStyle(0x000000, 0.05);
      g.fillRect(0, py, this.w, 1);
    }
    // Floor edge
    g.fillStyle(0x8b6914, 1);
    g.fillRect(0, floorY - 4, this.w, 6);

    // Stained glass windows with jewel colors and decorative frames
    const windowPositions = [200, 580, 960, 1340, 1720];
    const jewelColors = [
      [0xcc0000, 0xff3333, 0x880000], // Ruby
      [0x0000cc, 0x3355ff, 0x000088], // Sapphire
      [0x00aa00, 0x33cc33, 0x006600], // Emerald
      [0xddaa00, 0xffcc33, 0x886600], // Topaz
      [0xcc00cc, 0xff33ff, 0x880088], // Amethyst
    ];
    for (let i = 0; i < 5; i++) {
      const wx = windowPositions[i] - 45;
      const wy = 60;
      const ww = 90;
      const wh = 150;

      // Window frame (ornate)
      g.fillStyle(0x7a5c10, 1);
      g.fillRect(wx - 8, wy - 8, ww + 16, wh + 16);
      g.fillStyle(0x8b6914, 1);
      g.fillRect(wx - 5, wy - 5, ww + 10, wh + 10);

      // Stained glass background
      const jc = jewelColors[i];
      g.fillStyle(jc[0], 0.5);
      g.fillRect(wx, wy, ww, wh);

      // Glass panels with jewel tones
      const panelH = wh / 3;
      g.fillStyle(jc[1], 0.4);
      g.fillRect(wx + 4, wy + 4, ww / 2 - 6, panelH - 4);
      g.fillStyle(jc[2], 0.5);
      g.fillRect(wx + ww / 2 + 2, wy + 4, ww / 2 - 6, panelH - 4);
      g.fillStyle(jc[0], 0.6);
      g.fillRect(wx + 4, wy + panelH + 2, ww - 8, panelH - 4);
      g.fillStyle(jc[1], 0.3);
      g.fillRect(wx + 4, wy + panelH * 2 + 2, ww / 2 - 6, panelH - 6);
      g.fillStyle(jc[2], 0.4);
      g.fillRect(wx + ww / 2 + 2, wy + panelH * 2 + 2, ww / 2 - 6, panelH - 6);

      // Light glow from windows
      g.fillStyle(jc[1], 0.06);
      g.fillCircle(windowPositions[i], wy + wh / 2, 100);

      // Lead lines (cross frame)
      g.fillStyle(0x5c4a10, 1);
      g.fillRect(wx + ww / 2 - 2, wy, 4, wh);
      g.fillRect(wx, wy + panelH - 2, ww, 4);
      g.fillRect(wx, wy + panelH * 2 - 2, ww, 4);

      // Decorative circle at top
      g.lineStyle(3, 0x8b6914, 1);
      g.strokeCircle(windowPositions[i], wy + 30, 18);
      g.fillStyle(jc[1], 0.5);
      g.fillCircle(windowPositions[i], wy + 30, 16);
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

    // Falling candy animation - varied shapes and colors
    const candyColors = [0xff6347, 0xffd700, 0x00bfff, 0x32cd32, 0xff69b4, 0xff8c00, 0x9370db];
    for (let i = 0; i < 35; i++) {
      const color = candyColors[Math.floor(Math.random() * candyColors.length)];
      const candyType = Math.random();
      let candy: Phaser.GameObjects.Shape;

      if (candyType < 0.33) {
        // Circle candy
        candy = this.add.circle(
          Math.random() * this.w,
          -50 - Math.random() * 500,
          4 + Math.random() * 6,
          color
        );
      } else if (candyType < 0.66) {
        // Square/rectangle candy
        candy = this.add.rectangle(
          Math.random() * this.w,
          -50 - Math.random() * 500,
          6 + Math.random() * 8,
          6 + Math.random() * 8,
          color
        );
      } else {
        // Star-like candy (small triangle)
        candy = this.add.star(
          Math.random() * this.w,
          -50 - Math.random() * 500,
          5,
          3,
          6 + Math.random() * 4,
          color
        );
      }

      // Wrapper shine effect
      candy.setAlpha(0.8 + Math.random() * 0.2);

      this.tweens.add({
        targets: candy,
        y: this.h + 50,
        x: candy.x + (Math.random() - 0.5) * 200,
        angle: Math.random() * 360,
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

    // Launch trail
    const trail = this.add.circle(fx, this.h, 3, 0xffd700);
    this.tweens.add({
      targets: trail,
      y: fy,
      duration: 400,
      onComplete: () => {
        trail.destroy();

        // Initial flash
        const flash = this.add.circle(fx, fy, 15, 0xffffff, 0.7);
        this.tweens.add({
          targets: flash,
          alpha: 0,
          scale: 2,
          duration: 150,
          onComplete: () => flash.destroy(),
        });

        // Burst particles
        for (let i = 0; i < 24; i++) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          const size = 2 + Math.random() * 4;
          const particle = this.add.circle(fx, fy, size, color);
          const angle = (i / 24) * Math.PI * 2;
          const dist = 40 + Math.random() * 100;

          this.tweens.add({
            targets: particle,
            x: fx + Math.cos(angle) * dist,
            y: fy + Math.sin(angle) * dist + 20,
            alpha: 0,
            scale: 0.1,
            duration: 600 + Math.random() * 600,
            onComplete: () => particle.destroy(),
          });
        }

        // Sparkle ring
        for (let i = 0; i < 12; i++) {
          const sparkle = this.add.circle(fx, fy, 1, 0xffffff, 0.9);
          const angle = (i / 12) * Math.PI * 2;
          const dist = 30 + Math.random() * 50;
          this.tweens.add({
            targets: sparkle,
            x: fx + Math.cos(angle) * dist,
            y: fy + Math.sin(angle) * dist,
            alpha: 0,
            duration: 300 + Math.random() * 300,
            delay: 100,
            onComplete: () => sparkle.destroy(),
          });
        }
      },
    });
  }
}
