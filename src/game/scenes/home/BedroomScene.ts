import { BaseScene } from '../BaseScene';
import { COLORS } from '../../../config/constants';

export class BedroomScene extends BaseScene {
  private variant = 1;

  constructor() {
    super('Bedroom');
  }

  init(data: { variant?: number }) {
    this.variant = data?.variant ?? 1;
  }

  create() {
    super.create();

    // Bedroom background
    const g = this.add.graphics();
    g.fillStyle(0xe6e6fa, 1); // Lavender walls
    g.fillRect(0, 0, this.w, this.h - 150);
    g.fillStyle(0x8b7355, 1); // Wooden floor
    g.fillRect(0, this.h - 150, this.w, 150);

    // Bed
    g.fillStyle(0x4169e1, 1);
    g.fillRoundedRect(100, this.h - 350, 350, 180, 12);
    g.fillStyle(0xffffff, 1); // Pillow
    g.fillRoundedRect(120, this.h - 340, 100, 60, 8);

    // Desk with computer
    g.fillStyle(0xcd853f, 1);
    g.fillRect(700, this.h - 380, 300, 20);
    g.fillRect(720, this.h - 360, 20, 210);
    g.fillRect(960, this.h - 360, 20, 210);

    // Computer monitor
    g.fillStyle(0x333333, 1);
    g.fillRoundedRect(780, this.h - 520, 200, 140, 8);
    g.fillStyle(0x4a90d9, 0.8);
    g.fillRoundedRect(790, this.h - 510, 180, 120, 4);

    // Label
    const label = this.lang === 'he' ? 'חדר שינה' : 'Bedroom';
    this.add.text(this.w / 2, 40, label, {
      fontSize: '32px',
      color: '#333',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Computer interaction
    const computerZone = this.add.zone(880, this.h - 450, 200, 140)
      .setInteractive({ useHandCursor: true });

    this.add.text(880, this.h - 560, this.lang === 'he' ? 'לחץ לשימוש במחשב' : 'Click to use computer', {
      fontSize: '18px',
      color: '#ffd700',
      fontFamily: 'Arial',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: { x: 8, y: 4 },
    }).setOrigin(0.5);

    computerZone.on('pointerdown', () => {
      this.goToScene('Computer', { variant: this.variant });
    });

    // Player
    this.drawCharacterPlaceholder(500, this.h - 200, COLORS.PRIMARY);

    // Back button
    this.createButton(
      100, this.h - 40,
      this.lang === 'he' ? 'חזרה לסלון' : 'Back to Living Room',
      () => this.goToScene('LivingRoom', { variant: this.variant }),
      220, 40
    );

    this.fadeIn();
  }
}
