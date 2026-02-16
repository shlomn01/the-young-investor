import { BaseScene } from '../BaseScene';
import { COLORS } from '../../../config/constants';

export class LivingRoomScene extends BaseScene {
  private variant = 1;

  constructor() {
    super('LivingRoom');
  }

  init(data: { variant?: number }) {
    this.variant = data?.variant ?? 1;
  }

  create() {
    super.create();

    // Interior room with antique white walls and wood floor
    this.drawInteriorRoom(0xfaebd7, 0x8b6b4a, { woodFloor: true, baseboard: true, ceiling: true });

    const dg = this.add.graphics();

    // --- Window on the right wall ---
    this.drawWindow(dg, 900, 80, 250, 180);

    // --- Picture frames on wall ---
    this.drawPictureFrame(dg, 150, 100, 80, 60, 0x7ec8e3); // family photo - blue sky scene
    this.drawPictureFrame(dg, 280, 110, 60, 50, 0xd4a574); // sepia photo
    this.drawPictureFrame(dg, 1300, 90, 70, 55, 0x90c695); // landscape - green

    // --- Sofa with cushions and armrests ---
    // Shadow
    dg.fillStyle(0x000000, 0.1);
    dg.fillRoundedRect(208, this.h - 342, 400, 150, 16);
    // Sofa base/seat
    dg.fillStyle(0x4169e1, 1);
    dg.fillRoundedRect(200, this.h - 350, 400, 150, 16);
    // Back rest
    dg.fillStyle(0x3a5fc8, 1);
    dg.fillRoundedRect(200, this.h - 400, 400, 60, { tl: 14, tr: 14, bl: 0, br: 0 });
    // Left armrest
    dg.fillStyle(0x3358b5, 1);
    dg.fillRoundedRect(185, this.h - 400, 40, 200, { tl: 12, tr: 0, bl: 12, br: 0 });
    // Right armrest
    dg.fillStyle(0x3358b5, 1);
    dg.fillRoundedRect(575, this.h - 400, 40, 200, { tl: 0, tr: 12, bl: 0, br: 12 });
    // Seat cushions (3 cushions)
    dg.fillStyle(0x4a78e0, 1);
    dg.fillRoundedRect(230, this.h - 310, 110, 80, 10);
    dg.fillRoundedRect(348, this.h - 310, 110, 80, 10);
    dg.fillRoundedRect(466, this.h - 310, 110, 80, 10);
    // Cushion divider lines
    dg.fillStyle(0x3a5fc8, 0.5);
    dg.fillRect(340, this.h - 310, 3, 80);
    dg.fillRect(458, this.h - 310, 3, 80);
    // Throw pillows on sofa
    dg.fillStyle(0xff6347, 1);
    dg.fillRoundedRect(240, this.h - 380, 50, 50, 12);
    dg.fillStyle(0xffd700, 1);
    dg.fillRoundedRect(510, this.h - 375, 45, 45, 12);

    // --- Coffee table with legs ---
    // Table shadow
    dg.fillStyle(0x000000, 0.08);
    dg.fillRoundedRect(708, this.h - 268, 220, 18, 4);
    // Table top
    dg.fillStyle(0xcd853f, 1);
    dg.fillRoundedRect(700, this.h - 275, 220, 18, 4);
    // Table top highlight
    dg.fillStyle(0xdaa06d, 1);
    dg.fillRoundedRect(705, this.h - 275, 210, 6, 3);
    // Legs (4 legs)
    dg.fillStyle(0xb8860b, 1);
    dg.fillRect(710, this.h - 257, 10, 80);
    dg.fillRect(900, this.h - 257, 10, 80);
    dg.fillRect(710, this.h - 257, 10, 80);
    dg.fillRect(900, this.h - 257, 10, 80);
    // Cross support bar
    dg.fillStyle(0xb8860b, 0.6);
    dg.fillRect(720, this.h - 210, 180, 5);

    // --- TV / Entertainment Center ---
    // TV stand
    dg.fillStyle(0x5c4033, 1);
    dg.fillRoundedRect(1350, this.h - 310, 250, 130, 6);
    // Shelves in stand
    dg.fillStyle(0x4a3328, 1);
    dg.fillRect(1355, this.h - 245, 240, 3);
    // TV screen (mounted on wall above stand)
    dg.fillStyle(0x1a1a1a, 1);
    dg.fillRoundedRect(1370, this.h - 520, 210, 150, 6);
    // Screen content (blueish glow)
    dg.fillStyle(0x2a4a6a, 1);
    dg.fillRect(1378, this.h - 512, 194, 134);
    // Screen reflection
    dg.fillStyle(0xffffff, 0.08);
    dg.fillRect(1378, this.h - 512, 194, 50);
    // TV stand leg
    dg.fillStyle(0x333333, 1);
    dg.fillRect(1465, this.h - 370, 20, 60);
    dg.fillRect(1450, this.h - 370, 50, 6);

    // Room label
    const label = this.lang === 'he' ? 'סלון' : 'Living Room';
    this.add.text(this.w / 2, 40, label, {
      fontSize: '32px',
      color: '#333333',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Family NPC
    const npcName = this.lang === 'he' ? 'אבא' : 'Dad';
    const npc = this.drawCharacterPlaceholder(500, this.h - 420, 0x2f4f4f, npcName);
    npc.setInteractive(new Phaser.Geom.Rectangle(-30, -60, 60, 120), Phaser.Geom.Rectangle.Contains);

    npc.on('pointerdown', async () => {
      const dialogues = this.getDialogueByVariant();
      for (const line of dialogues) {
        await this.showDialogue(npcName, line);
      }
    });

    // Player
    const player = this.drawCharacterPlaceholder(300, this.h - 200, COLORS.PRIMARY);
    this.physics.add.existing(player);

    // Back button
    this.createButton(
      100, this.h - 40,
      this.lang === 'he' ? 'חזרה לרחוב' : 'Back to Street',
      () => this.goToScene('Street', { streetIndex: 0 }),
      200, 40
    );

    this.fadeIn();
  }

  private getDialogueByVariant(): string[] {
    if (this.lang === 'he') {
      switch (this.variant) {
        case 1: return [
          'שלום! מה שלומך היום?',
          'למדת משהו חדש בבית הספר?',
          'תמיד חשוב ללמוד על כסף והשקעות.',
        ];
        case 2: return [
          'שמעתי שפתחת חשבון בבנק! כל הכבוד!',
          'עכשיו אתה יכול להתחיל לחסוך ולהשקיע.',
        ];
        case 3: return [
          'ראיתי שקנית מניות! מרגש!',
          'תזכור - השקעה היא לטווח ארוך.',
        ];
        default: return ['שלום!'];
      }
    } else {
      switch (this.variant) {
        case 1: return [
          'Hello! How are you today?',
          'Did you learn something new at school?',
          'It\'s always important to learn about money and investments.',
        ];
        case 2: return [
          'I heard you opened a bank account! Well done!',
          'Now you can start saving and investing.',
        ];
        case 3: return [
          'I see you bought stocks! Exciting!',
          'Remember - investing is for the long term.',
        ];
        default: return ['Hello!'];
      }
    }
  }
}
