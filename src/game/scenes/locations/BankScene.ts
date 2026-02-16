import { BaseScene } from '../BaseScene';
import { COLORS } from '../../../config/constants';
import { formatCurrency } from '../../../utils/formatUtils';

export class BankScene extends BaseScene {

  constructor() {
    super('Bank');
  }

  init(_data: { variant?: number }) {
  }

  create() {
    super.create();

    // Interior room with warm beige walls and stone-colored floor
    this.drawInteriorRoom(0xf0ead6, 0xb8a88a, { floorHeight: 150, baseboard: true, ceiling: true });

    const dg = this.add.graphics();

    // --- Marble-effect floor (alternating lighter/darker tiles) ---
    const tileSize = 60;
    const floorY = this.h - 150;
    for (let ty = floorY; ty < this.h; ty += tileSize) {
      for (let tx = 0; tx < this.w; tx += tileSize) {
        const isLight = ((tx / tileSize) + (ty - floorY) / tileSize) % 2 === 0;
        dg.fillStyle(isLight ? 0xd4cfc0 : 0xc0b8a8, 1);
        dg.fillRect(tx, ty, tileSize, tileSize);
        // Marble vein effect
        dg.fillStyle(0xffffff, 0.06);
        dg.fillRect(tx + 5, ty + 10, tileSize - 20, 1);
        dg.fillRect(tx + 15, ty + 30, tileSize - 25, 1);
      }
    }
    // Tile grout lines
    dg.fillStyle(0x999999, 0.2);
    for (let ty = floorY; ty <= this.h; ty += tileSize) {
      dg.fillRect(0, ty, this.w, 1);
    }
    for (let tx = 0; tx <= this.w; tx += tileSize) {
      dg.fillRect(tx, floorY, 1, 150);
    }

    // --- Vault door in the background (round with handle) ---
    // Vault frame
    dg.fillStyle(0x555555, 1);
    dg.fillCircle(200, 320, 120);
    // Vault door
    dg.fillStyle(0x808080, 1);
    dg.fillCircle(200, 320, 108);
    // Vault inner ring
    dg.lineStyle(4, 0x666666, 1);
    dg.strokeCircle(200, 320, 90);
    // Vault handle (wheel)
    dg.lineStyle(8, 0x444444, 1);
    dg.strokeCircle(200, 320, 40);
    // Handle spokes
    dg.lineStyle(6, 0x444444, 1);
    dg.beginPath();
    dg.moveTo(160, 320); dg.lineTo(240, 320);
    dg.moveTo(200, 280); dg.lineTo(200, 360);
    dg.moveTo(172, 292); dg.lineTo(228, 348);
    dg.moveTo(228, 292); dg.lineTo(172, 348);
    dg.strokePath();
    // Center bolt
    dg.fillStyle(0x333333, 1);
    dg.fillCircle(200, 320, 10);
    // Vault highlight
    dg.fillStyle(0xffffff, 0.08);
    dg.fillCircle(180, 290, 50);
    // Vault label
    this.add.text(200, 460, this.lang === 'he' ? 'כספת' : 'VAULT', {
      fontSize: '16px', color: '#666', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // --- Bank counter with glass partition ---
    // Counter base
    dg.fillStyle(0x5c3d2e, 1);
    dg.fillRect(550, this.h - 350, 850, 200);
    // Counter top surface
    dg.fillStyle(0x8b6914, 1);
    dg.fillRect(545, this.h - 355, 860, 12);
    // Counter top highlight
    dg.fillStyle(0xa07a20, 0.4);
    dg.fillRect(550, this.h - 355, 850, 4);
    // Counter front detail panels
    dg.fillStyle(0x4a2e1e, 0.5);
    dg.fillRect(570, this.h - 330, 180, 160);
    dg.fillRect(780, this.h - 330, 180, 160);
    dg.fillRect(990, this.h - 330, 180, 160);
    // Glass partition
    dg.fillStyle(0xaaddee, 0.25);
    dg.fillRect(560, this.h - 600, 830, 250);
    // Glass frame (bottom rail)
    dg.fillStyle(0x888888, 1);
    dg.fillRect(555, this.h - 355, 840, 6);
    // Glass frame (top rail)
    dg.fillStyle(0x888888, 1);
    dg.fillRect(555, this.h - 605, 840, 6);
    // Glass dividers
    dg.fillStyle(0x888888, 0.8);
    dg.fillRect(760, this.h - 600, 4, 250);
    dg.fillRect(970, this.h - 600, 4, 250);
    // Glass reflection
    dg.fillStyle(0xffffff, 0.08);
    dg.fillRect(580, this.h - 580, 150, 200);
    // Transaction window openings at bottom of glass
    dg.fillStyle(0x333333, 0.3);
    dg.fillRoundedRect(630, this.h - 400, 120, 40, 8);
    dg.fillRoundedRect(840, this.h - 400, 120, 40, 8);
    dg.fillRoundedRect(1050, this.h - 400, 120, 40, 8);

    // --- Potted plants ---
    // Plant 1 (left)
    dg.fillStyle(0x8b4513, 1);
    dg.fillRoundedRect(440, this.h - 230, 50, 50, 6);
    dg.fillStyle(0x6b3410, 1);
    dg.fillRect(442, this.h - 225, 46, 5);
    dg.fillStyle(0x2d8a4e, 1);
    dg.fillCircle(465, this.h - 250, 28);
    dg.fillCircle(450, this.h - 260, 22);
    dg.fillCircle(480, this.h - 260, 22);
    dg.fillStyle(0x3cba5f, 0.7);
    dg.fillCircle(465, this.h - 270, 16);

    // Plant 2 (right)
    dg.fillStyle(0x8b4513, 1);
    dg.fillRoundedRect(1430, this.h - 230, 50, 50, 6);
    dg.fillStyle(0x6b3410, 1);
    dg.fillRect(1432, this.h - 225, 46, 5);
    dg.fillStyle(0x2d8a4e, 1);
    dg.fillCircle(1455, this.h - 250, 28);
    dg.fillCircle(1440, this.h - 260, 22);
    dg.fillCircle(1470, this.h - 260, 22);
    dg.fillStyle(0x3cba5f, 0.7);
    dg.fillCircle(1455, this.h - 270, 16);

    // Title
    const title = this.lang === 'he' ? 'הבנק' : 'The Bank';
    this.add.text(this.w / 2, 60, title, {
      fontSize: '40px',
      color: '#333',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Bank teller NPC
    const tellerName = this.lang === 'he' ? 'פקיד הבנק' : 'Bank Teller';
    const teller = this.drawCharacterPlaceholder(960, this.h - 420, 0x2f4f4f, tellerName);
    teller.setInteractive(new Phaser.Geom.Rectangle(-30, -60, 60, 120), Phaser.Geom.Rectangle.Contains);

    teller.on('pointerdown', async () => {
      if (!this.store.bankAccountOpened) {
        await this.showDialogue(tellerName, this.lang === 'he'
          ? 'ברוך הבא לבנק! בוא נפתח לך חשבון.'
          : 'Welcome to the bank! Let\'s open an account for you.');
        await this.showDialogue(tellerName, this.lang === 'he'
          ? 'מעולה! החשבון שלך נפתח. הפקדנו 1,000 ₪ כמתנת פתיחה!'
          : 'Great! Your account is now open. We deposited ₪1,000 as a welcome gift!');
        this.store.openBankAccount();
        this.store.addCash(1000);
      } else {
        const balance = this.store.cash;
        await this.showDialogue(tellerName, this.lang === 'he'
          ? `היתרה שלך: ${formatCurrency(balance, 'he')}`
          : `Your balance: ${formatCurrency(balance, 'en')}`);
      }
    });

    // Player
    this.drawCharacterPlaceholder(400, this.h - 150, COLORS.PRIMARY);

    // Back button
    this.createButton(
      100, this.h - 40,
      this.lang === 'he' ? 'חזרה לרחוב' : 'Back to Street',
      () => this.goToScene('Street', { streetIndex: 2 }),
      200, 40
    );

    this.fadeIn();
  }
}
