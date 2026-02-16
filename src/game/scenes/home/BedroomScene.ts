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

    // Interior room with lavender walls and wood floor
    this.drawInteriorRoom(0xe6e0f0, 0x8b6b4a, { woodFloor: true, baseboard: true });

    const dg = this.add.graphics();

    // --- Window on right side ---
    this.drawWindow(dg, 1300, 80, 200, 160);

    // --- Rug on the floor ---
    dg.fillStyle(0x8b2252, 0.6);
    dg.fillRoundedRect(350, this.h - 160, 300, 100, 12);
    // Rug pattern - inner border
    dg.fillStyle(0xc06080, 0.4);
    dg.fillRoundedRect(365, this.h - 148, 270, 76, 8);
    // Rug center pattern
    dg.fillStyle(0xdaa0c0, 0.3);
    dg.fillRoundedRect(400, this.h - 135, 200, 50, 6);

    // --- Bed with headboard, pillow, blanket ---
    // Headboard
    dg.fillStyle(0x6b3a2a, 1);
    dg.fillRoundedRect(80, this.h - 420, 30, 200, { tl: 8, tr: 0, bl: 4, br: 0 });
    dg.fillStyle(0x7a4432, 1);
    dg.fillRoundedRect(80, this.h - 430, 340, 30, { tl: 10, tr: 10, bl: 0, br: 0 });
    // Bed frame
    dg.fillStyle(0x6b3a2a, 1);
    dg.fillRoundedRect(80, this.h - 220, 360, 20, 4);
    // Mattress
    dg.fillStyle(0xf0f0f0, 1);
    dg.fillRoundedRect(90, this.h - 380, 340, 160, 8);
    // Blanket
    dg.fillStyle(0x4169e1, 1);
    dg.fillRoundedRect(90, this.h - 330, 340, 120, { tl: 0, tr: 0, bl: 10, br: 10 });
    // Blanket fold line
    dg.fillStyle(0x3a5ab5, 0.5);
    dg.fillRect(90, this.h - 330, 340, 4);
    // Blanket subtle pattern
    dg.fillStyle(0x5080d0, 0.3);
    dg.fillRect(130, this.h - 310, 260, 3);
    dg.fillRect(130, this.h - 270, 260, 3);
    // Pillow
    dg.fillStyle(0xffffff, 1);
    dg.fillRoundedRect(110, this.h - 390, 120, 55, 14);
    // Pillow shadow
    dg.fillStyle(0xe8e8e8, 1);
    dg.fillRoundedRect(115, this.h - 370, 110, 30, 8);

    // --- Desk with legs ---
    // Desk top
    dg.fillStyle(0xcd853f, 1);
    dg.fillRoundedRect(700, this.h - 380, 320, 22, 4);
    // Desk highlight
    dg.fillStyle(0xdaa06d, 0.4);
    dg.fillRect(705, this.h - 380, 310, 6);
    // Left leg
    dg.fillStyle(0xb8860b, 1);
    dg.fillRect(715, this.h - 358, 18, 180);
    // Right leg
    dg.fillStyle(0xb8860b, 1);
    dg.fillRect(988, this.h - 358, 18, 180);
    // Drawer
    dg.fillStyle(0xba7b3a, 1);
    dg.fillRoundedRect(730, this.h - 355, 120, 50, 4);
    dg.fillStyle(0xffd700, 1);
    dg.fillCircle(790, this.h - 330, 3); // drawer handle

    // --- Computer monitor on desk (with screen glow) ---
    // Screen glow behind monitor
    dg.fillStyle(0x4a90d9, 0.12);
    dg.fillCircle(860, this.h - 470, 100);
    // Monitor frame
    dg.fillStyle(0x2a2a2a, 1);
    dg.fillRoundedRect(790, this.h - 530, 200, 150, 8);
    // Screen
    dg.fillStyle(0x1a3a5a, 1);
    dg.fillRoundedRect(800, this.h - 520, 180, 125, 4);
    // Screen content glow
    dg.fillStyle(0x4a90d9, 0.6);
    dg.fillRect(808, this.h - 512, 164, 110);
    // Screen reflection highlight
    dg.fillStyle(0xffffff, 0.1);
    dg.fillRect(808, this.h - 512, 164, 40);
    // Monitor stand neck
    dg.fillStyle(0x333333, 1);
    dg.fillRect(880, this.h - 380, 20, 30);
    // Monitor stand base
    dg.fillStyle(0x333333, 1);
    dg.fillRoundedRect(860, this.h - 382, 60, 8, 3);
    // Keyboard
    dg.fillStyle(0x444444, 1);
    dg.fillRoundedRect(820, this.h - 400, 120, 18, 3);
    dg.fillStyle(0x555555, 0.5);
    for (let i = 0; i < 10; i++) {
      dg.fillRect(826 + i * 11, this.h - 396, 8, 4);
    }
    for (let i = 0; i < 10; i++) {
      dg.fillRect(826 + i * 11, this.h - 390, 8, 4);
    }

    // --- Bookshelf with colored book spines ---
    // Shelf frame
    dg.fillStyle(0x6b3a2a, 1);
    dg.fillRect(1100, this.h - 500, 200, 320);
    // Inner back
    dg.fillStyle(0x5a2e1e, 1);
    dg.fillRect(1108, this.h - 492, 184, 304);
    // Shelf dividers
    dg.fillStyle(0x7a4432, 1);
    dg.fillRect(1105, this.h - 350, 190, 8);
    dg.fillRect(1105, this.h - 250, 190, 8);
    // Books on shelves
    const bookColors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6, 0x1abc9c, 0xe67e22];
    // Top shelf books
    for (let b = 0; b < 6; b++) {
      const bh = 55 + Math.random() * 20;
      dg.fillStyle(bookColors[b % bookColors.length], 1);
      dg.fillRect(1115 + b * 28, this.h - 345 - bh, 22, bh);
      // Spine line
      dg.fillStyle(0x000000, 0.15);
      dg.fillRect(1115 + b * 28 + 10, this.h - 345 - bh + 5, 2, bh - 10);
    }
    // Middle shelf books
    for (let b = 0; b < 6; b++) {
      const bh = 50 + Math.random() * 25;
      dg.fillStyle(bookColors[(b + 3) % bookColors.length], 1);
      dg.fillRect(1115 + b * 28, this.h - 245 - bh, 22, bh);
      dg.fillStyle(0x000000, 0.15);
      dg.fillRect(1115 + b * 28 + 10, this.h - 245 - bh + 5, 2, bh - 10);
    }
    // Bottom shelf books
    for (let b = 0; b < 5; b++) {
      const bh = 45 + Math.random() * 15;
      dg.fillStyle(bookColors[(b + 5) % bookColors.length], 1);
      dg.fillRect(1115 + b * 28, this.h - 180 - bh, 22, bh);
    }

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
