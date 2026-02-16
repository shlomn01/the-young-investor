import { BaseScene } from '../BaseScene';
import { COLORS } from '../../../config/constants';

export class HotelScene extends BaseScene {
  constructor() {
    super('Hotel');
  }

  create() {
    super.create();

    // Check if bg_hotel_lobby texture exists
    if (this.textures.exists('bg_hotel_lobby')) {
      this.add.image(this.w / 2, this.h / 2, 'bg_hotel_lobby').setDisplaySize(this.w, this.h);
    } else {
      // Draw the scene manually
      this.drawInteriorRoom(0xfff8dc, 0x800000, { floorHeight: 120, baseboard: true, ceiling: true });

      const dg = this.add.graphics();

      // Warm gold tint on upper walls
      dg.fillStyle(0xb22222, 0.08);
      dg.fillRect(0, 0, this.w, this.h - 120);

      // --- Red carpet on floor ---
      dg.fillStyle(0x8b0000, 1);
      dg.fillRect(0, this.h - 120, this.w, 120);
      // Carpet pattern - center runner
      dg.fillStyle(0xa00000, 0.5);
      dg.fillRect(this.w / 2 - 200, this.h - 120, 400, 120);
      // Carpet border
      dg.fillStyle(0xffd700, 0.3);
      dg.fillRect(this.w / 2 - 200, this.h - 120, 400, 4);
      dg.fillRect(this.w / 2 - 200, this.h - 4, 400, 4);
      dg.fillRect(this.w / 2 - 200, this.h - 120, 4, 120);
      dg.fillRect(this.w / 2 + 196, this.h - 120, 4, 120);

      // --- Chandelier ---
      // Chain
      dg.fillStyle(0xffd700, 0.6);
      dg.fillRect(this.w / 2 - 2, 0, 4, 50);
      // Main body
      dg.fillStyle(0xffd700, 0.7);
      dg.fillCircle(this.w / 2, 80, 45);
      // Outer glow ring
      dg.fillStyle(0xffd700, 0.15);
      dg.fillCircle(this.w / 2, 80, 80);
      dg.fillStyle(0xfff9c4, 0.08);
      dg.fillCircle(this.w / 2, 80, 120);
      // Crystal drops
      dg.fillStyle(0xffffff, 0.5);
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const cx = this.w / 2 + Math.cos(angle) * 50;
        const cy = 80 + Math.sin(angle) * 50;
        dg.fillCircle(cx, cy, 4);
        // Lines from center to crystal
        dg.lineStyle(1, 0xffd700, 0.4);
        dg.beginPath();
        dg.moveTo(this.w / 2, 80);
        dg.lineTo(cx, cy);
        dg.strokePath();
      }
      // Inner light
      dg.fillStyle(0xfff9c4, 0.6);
      dg.fillCircle(this.w / 2, 80, 18);

      // --- Elevator doors ---
      // Elevator frame
      dg.fillStyle(0x808080, 1);
      dg.fillRect(this.w / 2 - 90, 190, 180, 420);
      // Left door
      dg.fillStyle(0xc0c0c0, 1);
      dg.fillRect(this.w / 2 - 80, 200, 78, 400);
      // Right door
      dg.fillStyle(0xc0c0c0, 1);
      dg.fillRect(this.w / 2 + 2, 200, 78, 400);
      // Door seam
      dg.fillStyle(0x666666, 1);
      dg.fillRect(this.w / 2 - 1, 200, 2, 400);
      // Door reflections
      dg.fillStyle(0xffffff, 0.1);
      dg.fillRect(this.w / 2 - 70, 210, 30, 380);
      dg.fillRect(this.w / 2 + 12, 210, 30, 380);
      // Floor indicator above elevator
      dg.fillStyle(0x1a1a1a, 1);
      dg.fillRoundedRect(this.w / 2 - 30, 170, 60, 24, 4);
      dg.fillStyle(0xff0000, 1);
      dg.fillCircle(this.w / 2 - 8, 182, 4);
      dg.fillStyle(0x00ff00, 0.4);
      dg.fillCircle(this.w / 2 + 8, 182, 4);

      // Elevator call button
      dg.fillStyle(0x333333, 1);
      dg.fillRoundedRect(this.w / 2 + 95, 385, 30, 50, 6);
      dg.fillStyle(0xffd700, 1);
      dg.fillCircle(this.w / 2 + 110, 400, 8);
      // Up arrow on button
      dg.fillStyle(0x000000, 1);
      dg.fillTriangle(this.w / 2 + 110, 394, this.w / 2 + 105, 404, this.w / 2 + 115, 404);

      // --- Reception desk (left side) ---
      dg.fillStyle(0x5c3d2e, 1);
      dg.fillRoundedRect(50, this.h - 280, 350, 160, 8);
      // Desk top
      dg.fillStyle(0x8b6914, 1);
      dg.fillRect(45, this.h - 285, 360, 12);
      // Desk front detail
      dg.fillStyle(0x4a2e1e, 0.4);
      dg.fillRect(70, this.h - 260, 140, 130);
      dg.fillRect(230, this.h - 260, 140, 130);
      // Bell on desk
      dg.fillStyle(0xffd700, 1);
      dg.fillCircle(225, this.h - 300, 10);
      dg.fillStyle(0xc0a000, 1);
      dg.fillRect(215, this.h - 295, 20, 6);

      // Decorative columns
      dg.fillStyle(0xd4c8a0, 0.6);
      dg.fillRect(this.w / 2 - 300, 160, 30, this.h - 280);
      dg.fillRect(this.w / 2 + 270, 160, 30, this.h - 280);
      // Column capitals
      dg.fillStyle(0xd4c8a0, 0.8);
      dg.fillRoundedRect(this.w / 2 - 310, 155, 50, 16, 4);
      dg.fillRoundedRect(this.w / 2 + 260, 155, 50, 16, 4);

      // Potted plants
      dg.fillStyle(0x8b4513, 1);
      dg.fillRoundedRect(this.w - 200, this.h - 230, 50, 50, 6);
      dg.fillStyle(0x2d8a4e, 1);
      dg.fillCircle(this.w - 175, this.h - 250, 30);
      dg.fillCircle(this.w - 190, this.h - 260, 24);
      dg.fillCircle(this.w - 160, this.h - 260, 24);
    }

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
