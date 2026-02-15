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

    // Guru's room - luxury
    const g = this.add.graphics();
    g.fillStyle(0x2c1810, 1);
    g.fillRect(0, 0, this.w, this.h);
    g.fillStyle(0x4a2810, 1);
    g.fillRect(0, this.h - 120, this.w, 120);

    // Bookshelf background
    g.fillStyle(0x3d1f0d, 1);
    g.fillRect(0, 0, this.w, 400);

    // Books on shelves
    const bookColors = [0xe74c3c, 0x2980b9, 0x27ae60, 0xf39c12, 0x8e44ad];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 20; col++) {
        g.fillStyle(bookColors[(row + col) % bookColors.length], 0.7);
        g.fillRect(50 + col * 95, 30 + row * 120, 80, 100);
      }
    }

    // Desk
    g.fillStyle(0x8b4513, 1);
    g.fillRect(600, this.h - 350, 700, 30);

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
