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

    // Living room background
    this.drawGradientBg(0xf5deb3, 0xdeb887);

    // Floor
    const g = this.add.graphics();
    g.fillStyle(0x8b4513, 1);
    g.fillRect(0, this.h - 150, this.w, 150);

    // Walls
    g.fillStyle(0xfaebd7, 1);
    g.fillRect(0, 0, this.w, this.h - 150);

    // Window
    g.fillStyle(0x87ceeb, 0.6);
    g.fillRect(800, 100, 300, 200);
    g.lineStyle(4, 0x8b4513);
    g.strokeRect(800, 100, 300, 200);
    g.moveTo(950, 100);
    g.lineTo(950, 300);
    g.moveTo(800, 200);
    g.lineTo(1100, 200);
    g.stroke();

    // Sofa
    g.fillStyle(0x4169e1, 1);
    g.fillRoundedRect(200, this.h - 350, 400, 150, 16);
    g.fillStyle(0x3155b0, 1);
    g.fillRoundedRect(200, this.h - 380, 400, 40, 8);

    // Table
    g.fillStyle(0xcd853f, 1);
    g.fillRect(700, this.h - 280, 200, 130);
    g.fillStyle(0xb8860b, 1);
    g.fillRect(780, this.h - 150, 20, 40);
    g.fillRect(880, this.h - 150, 20, 40);

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
