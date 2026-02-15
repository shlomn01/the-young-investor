import { BaseScene } from '../BaseScene';

export class HotelRoomScene extends BaseScene {
  constructor() {
    super('HotelRoom');
  }

  create() {
    super.create();

    // Hotel corridor
    const g = this.add.graphics();
    g.fillStyle(0x4a0404, 1);
    g.fillRect(0, 0, this.w, this.h);
    g.fillStyle(0x800000, 1);
    g.fillRect(0, this.h - 80, this.w, 80);

    // Corridor walls - perspective
    g.fillStyle(0x8b0000, 0.3);
    g.fillRect(100, 100, this.w - 200, this.h - 250);

    // Doors along corridor
    for (let i = 0; i < 4; i++) {
      const dx = 250 + i * 380;
      g.fillStyle(0x8b4513, 1);
      g.fillRect(dx, 200, 100, 200);
      g.fillStyle(0xffd700, 1);
      g.fillCircle(dx + 80, 300, 6); // Door handle

      // Room number
      this.add.text(dx + 50, 180, `${201 + i}`, {
        fontSize: '18px', color: '#ffd700', fontFamily: 'Arial',
      }).setOrigin(0.5);
    }

    // Special door (guru's room) at the end
    g.fillStyle(0xdaa520, 1);
    g.fillRect(this.w / 2 - 60, 200, 120, 220);
    g.fillStyle(0xffd700, 1);
    g.fillCircle(this.w / 2 + 40, 310, 8);

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
