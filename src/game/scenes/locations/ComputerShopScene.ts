import { BaseScene } from '../BaseScene';
import { COLORS } from '../../../config/constants';
import { formatCurrency } from '../../../utils/formatUtils';

const COMPUTERS = [
  { nameHe: 'מחשב בסיסי', nameEn: 'Basic Computer', price: 4000, descHe: 'ניתן לשחק בו את רוב המשחקים', descEn: 'Can play most games', color: 0x808080 },
  { nameHe: 'מחשב משודרג', nameEn: 'Pro Computer', price: 7500, descHe: 'ניתן לשחק בו את כל המשחקים', descEn: 'Can play all games', color: 0x4a90d9 },
  { nameHe: 'מחשב גיימינג', nameEn: 'Gaming Computer', price: 10000, descHe: 'ניתן לשחק בו כל משחק שייצא בעשור הקרוב', descEn: 'Can play any game released in the next decade', color: 0xe74c3c },
];

export class ComputerShopScene extends BaseScene {
  constructor() {
    super('ComputerShop');
  }

  create() {
    super.create();

    // Check if bg_computer_shop texture exists
    if (this.textures.exists('bg_computer_shop')) {
      this.add.image(this.w / 2, this.h / 2, 'bg_computer_shop').setDisplaySize(this.w, this.h);
    } else {
      // Draw a tech shop interior
      this.drawInteriorRoom(0xe8e8f0, 0xc0c0c8, { floorHeight: 120, baseboard: true, ceiling: true });

      const dg = this.add.graphics();

      // Sleek tile floor
      const tileSize = 80;
      const floorY = this.h - 120;
      for (let ty = floorY; ty < this.h; ty += tileSize) {
        for (let tx = 0; tx < this.w; tx += tileSize) {
          const isLight = ((tx / tileSize) + (ty - floorY) / tileSize) % 2 === 0;
          dg.fillStyle(isLight ? 0xd0d0d8 : 0xb8b8c4, 1);
          dg.fillRect(tx, ty, tileSize, tileSize);
        }
      }

      // LED strip lighting on ceiling
      dg.fillStyle(0x4a90d9, 0.3);
      dg.fillRect(0, 12, this.w, 3);
      dg.fillStyle(0x4a90d9, 0.1);
      dg.fillRect(0, 15, this.w, 10);

      // Display shelves on back wall (long shelf units)
      // Left shelf unit
      dg.fillStyle(0x333333, 1);
      dg.fillRoundedRect(60, 150, 400, 300, 4);
      dg.fillStyle(0x444444, 1);
      dg.fillRect(65, 260, 390, 4);
      dg.fillRect(65, 370, 390, 4);
      // Items on shelves (peripherals)
      // Headphones
      dg.fillStyle(0x2c3e50, 1);
      dg.fillRoundedRect(100, 170, 60, 70, 8);
      dg.fillStyle(0x34495e, 1);
      dg.fillRoundedRect(110, 190, 40, 40, 12);
      // Mouse box
      dg.fillStyle(0x2ecc71, 0.7);
      dg.fillRoundedRect(200, 180, 50, 60, 4);
      // Keyboard box
      dg.fillStyle(0xe74c3c, 0.6);
      dg.fillRoundedRect(280, 175, 80, 65, 4);
      // More items on lower shelves
      dg.fillStyle(0xf39c12, 0.6);
      dg.fillRoundedRect(100, 280, 70, 70, 4);
      dg.fillStyle(0x9b59b6, 0.6);
      dg.fillRoundedRect(200, 285, 60, 65, 4);
      dg.fillStyle(0x3498db, 0.6);
      dg.fillRoundedRect(300, 275, 80, 75, 4);

      // Right shelf unit
      dg.fillStyle(0x333333, 1);
      dg.fillRoundedRect(this.w - 460, 150, 400, 300, 4);
      dg.fillStyle(0x444444, 1);
      dg.fillRect(this.w - 455, 260, 390, 4);
      dg.fillRect(this.w - 455, 370, 390, 4);
      // Items
      dg.fillStyle(0x1abc9c, 0.6);
      dg.fillRoundedRect(this.w - 430, 170, 70, 70, 4);
      dg.fillStyle(0xe67e22, 0.6);
      dg.fillRoundedRect(this.w - 340, 180, 60, 60, 4);
      dg.fillStyle(0x2c3e50, 0.7);
      dg.fillRoundedRect(this.w - 250, 175, 80, 65, 4);

      // Counter at front
      dg.fillStyle(0x2c2c2c, 1);
      dg.fillRoundedRect(this.w - 350, this.h - 280, 300, 160, 6);
      dg.fillStyle(0x3a3a3a, 1);
      dg.fillRect(this.w - 345, this.h - 285, 290, 10);
      // Cash register
      dg.fillStyle(0x1a1a1a, 1);
      dg.fillRoundedRect(this.w - 280, this.h - 320, 100, 40, 4);
      dg.fillStyle(0x4a90d9, 0.6);
      dg.fillRect(this.w - 270, this.h - 312, 80, 24);

      // "SALE" sign
      dg.fillStyle(0xe74c3c, 1);
      dg.fillRoundedRect(this.w / 2 - 60, 80, 120, 40, 8);
      this.add.text(this.w / 2, 100, this.lang === 'he' ? 'מבצע!' : 'SALE!', {
        fontSize: '24px', color: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
      }).setOrigin(0.5);
    }

    // Title
    const title = this.lang === 'he' ? 'חנות מחשבים' : 'Computer Shop';
    this.add.text(this.w / 2, 40, title, {
      fontSize: '36px', color: '#333', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Display computers
    const dg2 = this.add.graphics();
    for (let i = 0; i < COMPUTERS.length; i++) {
      const comp = COMPUTERS[i];
      const cx = 300 + i * 500;
      const cy = 400;

      // Display pedestal
      dg2.fillStyle(0x333333, 1);
      dg2.fillRoundedRect(cx - 90, cy + 40, 180, 12, 4);

      // Computer monitor frame
      dg2.fillStyle(0x222222, 1);
      dg2.fillRoundedRect(cx - 85, cy - 130, 170, 130, 8);
      // Screen bezel
      dg2.fillStyle(0x111111, 1);
      dg2.fillRoundedRect(cx - 78, cy - 122, 156, 110, 4);
      // Screen
      dg2.fillStyle(comp.color, 0.4);
      dg2.fillRect(cx - 72, cy - 116, 144, 98);
      // Screen glow
      dg2.fillStyle(comp.color, 0.15);
      dg2.fillCircle(cx, cy - 67, 80);
      // Screen icon/content
      dg2.fillStyle(0xffffff, 0.3);
      dg2.fillRoundedRect(cx - 30, cy - 100, 60, 40, 4);
      dg2.fillStyle(0xffffff, 0.15);
      dg2.fillRect(cx - 20, cy - 55, 40, 3);
      dg2.fillRect(cx - 15, cy - 48, 30, 3);
      // Monitor stand
      dg2.fillStyle(0x444444, 1);
      dg2.fillRect(cx - 15, cy, 30, 25);
      dg2.fillRoundedRect(cx - 35, cy + 22, 70, 8, 3);
      // Keyboard
      dg2.fillStyle(0x555555, 1);
      dg2.fillRoundedRect(cx - 50, cy + 35, 100, 14, 3);
      // Key indicators
      dg2.fillStyle(comp.color, 0.4);
      dg2.fillRect(cx - 42, cy + 38, 6, 3);
      dg2.fillRect(cx + 36, cy + 38, 6, 3);

      // Label
      const name = this.lang === 'he' ? comp.nameHe : comp.nameEn;
      this.add.text(cx, cy + 70, name, {
        fontSize: '22px', color: '#333', fontFamily: 'Arial', fontStyle: 'bold',
      }).setOrigin(0.5);

      this.add.text(cx, cy + 100, formatCurrency(comp.price, this.lang), {
        fontSize: '20px', color: '#4a90d9', fontFamily: 'Arial',
      }).setOrigin(0.5);

      // Description
      const desc = this.lang === 'he' ? comp.descHe : comp.descEn;
      this.add.text(cx, cy + 125, desc, {
        fontSize: '14px', color: '#666', fontFamily: 'Arial',
        wordWrap: { width: 200 }, align: 'center',
      }).setOrigin(0.5);

      // Buy button
      this.createButton(cx, cy + 170,
        this.lang === 'he' ? 'קנה' : 'Buy',
        () => {
          if (this.store.cash >= comp.price) {
            this.store.setCash(this.store.cash - comp.price);
            this.store.setHasComputer(true, comp.price);
            this.showDialogue(
              this.lang === 'he' ? 'מוכר' : 'Seller',
              this.lang === 'he' ? `מזל טוב! קנית ${comp.nameHe}!` : `Congratulations! You bought the ${comp.nameEn}!`
            );
          } else {
            this.showDialogue(
              this.lang === 'he' ? 'מוכר' : 'Seller',
              this.lang === 'he' ? 'אין לך מספיק כסף!' : 'You don\'t have enough money!'
            );
          }
        },
        120, 40
      );
    }

    // Shopkeeper
    const shopkeepName = this.lang === 'he' ? 'המוכר' : 'Shopkeeper';
    this.drawCharacterPlaceholder(1600, this.h - 150, 0x2f4f4f, shopkeepName);

    // Player
    this.drawCharacterPlaceholder(200, this.h - 150, COLORS.PRIMARY);

    // Back
    this.createButton(100, this.h - 40,
      this.lang === 'he' ? 'חזרה לרחוב' : 'Back to Street',
      () => this.goToScene('Street', { streetIndex: 8 }),
      200, 40);

    this.fadeIn();
  }
}
