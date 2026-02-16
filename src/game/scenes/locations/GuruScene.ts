import { BaseScene } from '../BaseScene';
import { COLORS } from '../../../config/constants';
import { GURU_DIALOGUE } from '../../data/guruDialogue';

export class GuruScene extends BaseScene {
  private dialogueIndex = 0;

  constructor() {
    super('Guru');
  }

  create() {
    super.create();
    this.dialogueIndex = 0;

    // Check if bg_guru texture exists
    if (this.textures.exists('bg_guru')) {
      this.add.image(this.w / 2, this.h / 2, 'bg_guru').setDisplaySize(this.w, this.h);
    } else {
      // Draw a luxury study with bookshelves, desk, warm golden lighting
      this.drawInteriorRoom(0x3a2010, 0x4a2810, { floorHeight: 140, baseboard: true, ceiling: true });

      const dg = this.add.graphics();

      // --- Warm golden ambient lighting overlay ---
      dg.fillStyle(0xffd700, 0.04);
      dg.fillRect(0, 0, this.w, this.h);

      // --- Bookshelf background (wall of books behind desk) ---
      // Left bookshelf
      dg.fillStyle(0x3d1f0d, 1);
      dg.fillRect(50, 60, 350, 500);
      // Shelf dividers
      for (let s = 0; s < 4; s++) {
        dg.fillStyle(0x5a3018, 1);
        dg.fillRect(50, 60 + s * 125, 350, 8);
      }
      // Books on left shelves
      const bookColors = [0xe74c3c, 0x2980b9, 0x27ae60, 0xf39c12, 0x8e44ad, 0xc0392b, 0x16a085];
      for (let row = 0; row < 4; row++) {
        let bx = 60;
        for (let col = 0; col < 7; col++) {
          const bw = 30 + Math.floor(Math.random() * 15);
          const bh = 95 + Math.floor(Math.random() * 20);
          dg.fillStyle(bookColors[(row + col) % bookColors.length], 0.8);
          dg.fillRect(bx, 68 + row * 125 + (115 - bh), bw, bh);
          // Spine highlight
          dg.fillStyle(0xffffff, 0.08);
          dg.fillRect(bx + 1, 68 + row * 125 + (115 - bh) + 2, 2, bh - 4);
          bx += bw + 4;
          if (bx > 380) break;
        }
      }

      // Right bookshelf
      dg.fillStyle(0x3d1f0d, 1);
      dg.fillRect(this.w - 400, 60, 350, 500);
      for (let s = 0; s < 4; s++) {
        dg.fillStyle(0x5a3018, 1);
        dg.fillRect(this.w - 400, 60 + s * 125, 350, 8);
      }
      for (let row = 0; row < 4; row++) {
        let bx = this.w - 390;
        for (let col = 0; col < 7; col++) {
          const bw = 30 + Math.floor(Math.random() * 15);
          const bh = 95 + Math.floor(Math.random() * 20);
          dg.fillStyle(bookColors[(row + col + 3) % bookColors.length], 0.8);
          dg.fillRect(bx, 68 + row * 125 + (115 - bh), bw, bh);
          dg.fillStyle(0xffffff, 0.08);
          dg.fillRect(bx + 1, 68 + row * 125 + (115 - bh) + 2, 2, bh - 4);
          bx += bw + 4;
          if (bx > this.w - 70) break;
        }
      }

      // --- Large desk in center ---
      // Desk top
      dg.fillStyle(0x6b3a1a, 1);
      dg.fillRoundedRect(550, this.h - 370, 800, 28, 6);
      // Desk top polish/shine
      dg.fillStyle(0x8b5a2a, 0.4);
      dg.fillRect(560, this.h - 370, 780, 8);
      // Desk front panel
      dg.fillStyle(0x5a2e14, 1);
      dg.fillRect(560, this.h - 342, 780, 130);
      // Desk legs
      dg.fillStyle(0x4a2010, 1);
      dg.fillRect(580, this.h - 212, 20, 72);
      dg.fillRect(1310, this.h - 212, 20, 72);
      // Desk drawers
      dg.fillStyle(0x6a3a1a, 0.6);
      dg.fillRoundedRect(600, this.h - 330, 200, 50, 4);
      dg.fillRoundedRect(1100, this.h - 330, 200, 50, 4);
      // Drawer handles
      dg.fillStyle(0xffd700, 1);
      dg.fillCircle(700, this.h - 305, 4);
      dg.fillCircle(1200, this.h - 305, 4);

      // Items on desk
      // Desk lamp (golden)
      dg.fillStyle(0xc0a000, 1);
      dg.fillRoundedRect(620, this.h - 390, 40, 8, 3);
      dg.fillRect(638, this.h - 425, 4, 35);
      dg.fillStyle(0x2e6b30, 1);
      dg.fillRoundedRect(615, this.h - 440, 50, 18, { tl: 3, tr: 3, bl: 8, br: 8 });
      // Lamp glow
      dg.fillStyle(0xfff9c4, 0.1);
      dg.fillCircle(640, this.h - 400, 60);

      // Globe on desk
      dg.fillStyle(0x3498db, 0.6);
      dg.fillCircle(1250, this.h - 410, 25);
      dg.fillStyle(0x2ecc71, 0.4);
      dg.fillCircle(1245, this.h - 415, 12);
      dg.fillCircle(1260, this.h - 405, 8);
      // Globe stand
      dg.fillStyle(0x8b6914, 1);
      dg.fillRect(1245, this.h - 385, 10, 15);
      dg.fillRoundedRect(1235, this.h - 375, 30, 6, 3);

      // Papers on desk
      dg.fillStyle(0xfffff0, 0.8);
      dg.fillRect(850, this.h - 395, 80, 20);
      dg.fillRect(855, this.h - 400, 75, 5);
      // Pen
      dg.fillStyle(0x1a1a1a, 1);
      dg.fillRect(950, this.h - 390, 60, 4);
      dg.fillStyle(0xffd700, 1);
      dg.fillRect(946, this.h - 391, 8, 6);

      // --- Framed pictures on wall (between shelves and desk area) ---
      // Picture 1 (market chart)
      dg.fillStyle(0x8b6914, 1);
      dg.fillRect(445, 150, 84, 64);
      dg.fillStyle(0x1a2a3a, 1);
      dg.fillRect(449, 154, 76, 56);
      // Chart line inside
      dg.lineStyle(2, 0x2ecc71, 0.8);
      dg.beginPath();
      dg.moveTo(455, 200);
      dg.lineTo(470, 185);
      dg.lineTo(485, 195);
      dg.lineTo(500, 170);
      dg.lineTo(515, 175);
      dg.strokePath();

      // Picture 2
      dg.fillStyle(0x8b6914, 1);
      dg.fillRect(this.w - 530, 150, 84, 64);
      dg.fillStyle(0x2c1810, 1);
      dg.fillRect(this.w - 526, 154, 76, 56);
      dg.fillStyle(0xd4a574, 0.5);
      dg.fillRect(this.w - 520, 160, 64, 44);

      // --- Persian rug under desk ---
      dg.fillStyle(0x8b2252, 0.3);
      dg.fillRoundedRect(500, this.h - 135, 900, 80, 10);
      dg.fillStyle(0xc06060, 0.2);
      dg.fillRoundedRect(520, this.h - 125, 860, 60, 6);
      dg.fillStyle(0xffd700, 0.1);
      dg.fillRoundedRect(540, this.h - 118, 820, 46, 4);
    }

    // Title
    const title = this.lang === 'he' ? 'פגישה עם המשקיע הגדול' : 'Meeting the Great Investor';
    this.add.text(this.w / 2, 20, title, {
      fontSize: '32px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Guru character
    const guruName = this.lang === 'he' ? 'וורן' : 'Warren';
    this.drawCharacterPlaceholder(1200, this.h - 400, 0xffd700, guruName);

    // Player
    this.drawCharacterPlaceholder(700, this.h - 200, COLORS.PRIMARY, this.store.playerName || undefined);

    // Start dialogue
    this.showNextDialogue();

    this.fadeIn();
  }

  private async showNextDialogue() {
    if (this.dialogueIndex >= GURU_DIALOGUE.length) {
      this.store.completeGuruMeeting();
      this.goToScene('Street', { streetIndex: 7 });
      return;
    }

    const line = GURU_DIALOGUE[this.dialogueIndex];
    const text = line.text[this.lang];

    let speakerName: string;
    if (line.speaker === 'player') {
      speakerName = this.store.playerName || (this.lang === 'he' ? 'שחקן' : 'Player');
    } else {
      speakerName = this.lang === 'he' ? 'וורן' : 'Warren';
    }

    await this.showDialogue(speakerName, text);
    this.dialogueIndex++;
    this.showNextDialogue();
  }
}
