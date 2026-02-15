import { BaseScene } from '../BaseScene';
import { COLORS } from '../../../config/constants';

export class HotelScene extends BaseScene {
  constructor() {
    super('Hotel');
  }

  create() {
    super.create();

    // Hotel lobby
    const g = this.add.graphics();
    g.fillStyle(0xfff8dc, 1);
    g.fillRect(0, 0, this.w, this.h);
    g.fillStyle(0xb22222, 0.15);
    g.fillRect(0, 0, this.w, this.h);
    g.fillStyle(0x800000, 1);
    g.fillRect(0, this.h - 80, this.w, 80); // Carpet

    // Elevator doors
    g.fillStyle(0xc0c0c0, 1);
    g.fillRect(this.w / 2 - 80, 200, 160, 400);
    g.lineStyle(4, 0x808080);
    g.strokeRect(this.w / 2 - 80, 200, 160, 400);
    g.moveTo(this.w / 2, 200);
    g.lineTo(this.w / 2, 600);
    g.stroke();

    // Elevator button
    g.fillStyle(0xffd700, 1);
    g.fillCircle(this.w / 2 + 100, 400, 15);
    g.fillStyle(0x000000, 1);
    g.fillTriangle(this.w / 2 + 100, 390, this.w / 2 + 93, 405, this.w / 2 + 107, 405);

    // Chandelier
    g.fillStyle(0xffd700, 0.5);
    g.fillCircle(this.w / 2, 100, 60);
    g.lineStyle(2, 0xffd700, 0.3);
    g.strokeCircle(this.w / 2, 100, 80);

    // Title
    const title = this.lang === 'he' ? 'לובי המלון' : 'Hotel Lobby';
    this.add.text(this.w / 2, 40, title, {
      fontSize: '36px', color: '#333', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Receptionist
    const receptionistName = this.lang === 'he' ? 'פקיד הקבלה' : 'Receptionist';
    const receptionist = this.drawCharacterPlaceholder(400, this.h - 150, 0x191970, receptionistName);
    receptionist.setInteractive(new Phaser.Geom.Rectangle(-30, -60, 60, 120), Phaser.Geom.Rectangle.Contains);
    receptionist.on('pointerdown', async () => {
      await this.showDialogue(receptionistName, this.lang === 'he'
        ? 'ברוך הבא למלון! המשקיע הגדול מחכה לך בקומה העליונה.'
        : 'Welcome to the hotel! The great investor is waiting for you upstairs.');
    });

    // Elevator zone
    const elevatorZone = this.add.zone(this.w / 2, 400, 160, 400)
      .setInteractive({ useHandCursor: true });

    this.add.text(this.w / 2, 170, this.lang === 'he' ? 'לחץ להעלות במעלית' : 'Click to take elevator', {
      fontSize: '20px', color: '#ffd700', fontFamily: 'Arial',
      backgroundColor: 'rgba(0,0,0,0.7)', padding: { x: 10, y: 5 },
    }).setOrigin(0.5);

    elevatorZone.on('pointerdown', () => {
      this.goToScene('HotelRoom');
    });

    // Player
    this.drawCharacterPlaceholder(300, this.h - 150, COLORS.PRIMARY);

    // Back
    this.createButton(100, this.h - 40,
      this.lang === 'he' ? 'חזרה לרחוב' : 'Back to Street',
      () => this.goToScene('Street', { streetIndex: 7 }),
      200, 40);

    this.fadeIn();
  }
}
