import { BaseScene } from '../BaseScene';

export class HotelRoomScene extends BaseScene {
  constructor() {
    super('HotelRoom');
  }

  create() {
    super.create();

    // Check if bg_hotel_corridor texture exists
    if (this.textures.exists('bg_hotel_corridor')) {
      this.add.image(this.w / 2, this.h / 2, 'bg_hotel_corridor').setDisplaySize(this.w, this.h);
    } else {
      // Draw the corridor manually with warm walls, doors, wall sconces
      this.drawInteriorRoom(0x6a1a1a, 0x800000, { floorHeight: 100, baseboard: true, ceiling: true });

      const dg = this.add.graphics();

      // Warm wall panels
      dg.fillStyle(0x8b0000, 0.15);
      dg.fillRect(100, 60, this.w - 200, this.h - 220);

      // Wainscoting (lower wall panels)
      dg.fillStyle(0x4a0a0a, 0.3);
      dg.fillRect(100, this.h - 260, this.w - 200, 150);
      // Wainscoting trim
      dg.fillStyle(0x8b6914, 0.5);
      dg.fillRect(100, this.h - 260, this.w - 200, 4);

      // Carpet pattern on floor
      dg.fillStyle(0x600000, 1);
      dg.fillRect(0, this.h - 100, this.w, 100);
      // Carpet runner
      dg.fillStyle(0x900000, 0.6);
      dg.fillRect(this.w / 2 - 250, this.h - 100, 500, 100);
      // Carpet border pattern
      dg.fillStyle(0xffd700, 0.2);
      dg.fillRect(this.w / 2 - 250, this.h - 100, 500, 3);
      dg.fillRect(this.w / 2 - 250, this.h - 3, 500, 3);

      // --- Doors along corridor with room numbers ---
      const doorPositions = [250, 630, 1010, 1390];
      const roomNumbers = [201, 202, 203, 204];
      for (let i = 0; i < doorPositions.length; i++) {
        const dx = doorPositions[i];
        // Door frame
        dg.fillStyle(0x6b3a2a, 1);
        dg.fillRect(dx - 8, 180, 116, 230);
        // Door
        dg.fillStyle(0x8b4513, 1);
        dg.fillRect(dx, 190, 100, 210);
        // Door panels (raised)
        dg.fillStyle(0x9b5523, 0.6);
        dg.fillRoundedRect(dx + 10, 200, 80, 80, 4);
        dg.fillRoundedRect(dx + 10, 300, 80, 80, 4);
        // Door handle
        dg.fillStyle(0xffd700, 1);
        dg.fillCircle(dx + 82, 310, 6);
        // Peephole
        dg.fillStyle(0x333333, 1);
        dg.fillCircle(dx + 50, 240, 4);
        dg.fillStyle(0x111111, 1);
        dg.fillCircle(dx + 50, 240, 2);

        // Room number plate
        dg.fillStyle(0xffd700, 0.8);
        dg.fillRoundedRect(dx + 28, 168, 44, 22, 4);
        this.add.text(dx + 50, 179, `${roomNumbers[i]}`, {
          fontSize: '14px', color: '#333', fontFamily: 'Arial', fontStyle: 'bold',
        }).setOrigin(0.5);
      }

      // --- Wall sconces between doors ---
      const sconcePositions = [440, 820, 1200];
      for (const sx of sconcePositions) {
        // Sconce bracket
        dg.fillStyle(0xc0a000, 1);
        dg.fillRoundedRect(sx - 8, 200, 16, 30, 3);
        // Sconce shade
        dg.fillStyle(0xfff8dc, 0.8);
        dg.fillRoundedRect(sx - 18, 180, 36, 24, { tl: 8, tr: 8, bl: 2, br: 2 });
        // Warm light glow
        dg.fillStyle(0xfff9c4, 0.12);
        dg.fillCircle(sx, 200, 50);
        dg.fillStyle(0xfff9c4, 0.06);
        dg.fillCircle(sx, 200, 90);
      }

      // Wall art between sconces
      dg.fillStyle(0x8b6914, 1);
      dg.fillRect(this.w / 2 - 55, 100, 110, 70);
      dg.fillStyle(0xc9a030, 0.6);
      dg.fillRect(this.w / 2 - 48, 106, 96, 58);
    }

    // Special door (guru's room) at the end - drawn on top regardless
    const dg2 = this.add.graphics();
    // Gold door frame
    dg2.fillStyle(0xc0a000, 1);
    dg2.fillRect(this.w / 2 - 70, 190, 140, 230);
    // Gold door
    dg2.fillStyle(0xdaa520, 1);
    dg2.fillRect(this.w / 2 - 60, 200, 120, 210);
    // Door panels
    dg2.fillStyle(0xc09020, 0.5);
    dg2.fillRoundedRect(this.w / 2 - 50, 210, 100, 80, 4);
    dg2.fillRoundedRect(this.w / 2 - 50, 310, 100, 80, 4);
    // Door handle
    dg2.fillStyle(0xffd700, 1);
    dg2.fillCircle(this.w / 2 + 42, 310, 8);
    // Star decoration
    dg2.fillStyle(0xffd700, 0.8);
    dg2.fillCircle(this.w / 2, 250, 12);
    dg2.fillStyle(0xffffff, 0.3);
    dg2.fillCircle(this.w / 2 - 3, 247, 4);

    const guruDoorLabel = this.lang === 'he' ? 'חדר VIP' : 'VIP Room';
    this.add.text(this.w / 2, 170, guruDoorLabel, {
      fontSize: '24px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    const guruDoor = this.add.zone(this.w / 2, 310, 120, 220)
      .setInteractive({ useHandCursor: true });

    guruDoor.on('pointerdown', () => {
      this.goToScene('Guru');
    });

    // Arrow
    const arrow = this.add.text(this.w / 2, 140, '▼', {
      fontSize: '28px', color: '#ffd700',
    }).setOrigin(0.5);
    this.tweens.add({
      targets: arrow, y: 150, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    // Title
    this.add.text(this.w / 2, 40, this.lang === 'he' ? 'המסדרון' : 'The Corridor', {
      fontSize: '32px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Back
    this.createButton(100, this.h - 40,
      this.lang === 'he' ? 'חזרה ללובי' : 'Back to Lobby',
      () => this.goToScene('Hotel'),
      200, 40);

    this.fadeIn();
  }
}
