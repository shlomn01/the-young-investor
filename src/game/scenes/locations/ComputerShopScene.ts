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

    // Shop interior
    const g = this.add.graphics();
    g.fillStyle(0xf0f0f0, 1);
    g.fillRect(0, 0, this.w, this.h);
    g.fillStyle(0xd3d3d3, 1);
    g.fillRect(0, this.h - 80, this.w, 80);

    // Title
    const title = this.lang === 'he' ? 'חנות מחשבים' : 'Computer Shop';
    this.add.text(this.w / 2, 40, title, {
      fontSize: '36px', color: '#333', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Display computers
    for (let i = 0; i < COMPUTERS.length; i++) {
      const comp = COMPUTERS[i];
      const cx = 300 + i * 500;
      const cy = 400;

      // Computer display
      g.fillStyle(comp.color, 1);
      g.fillRoundedRect(cx - 80, cy - 120, 160, 120, 8);
      g.fillStyle(0x333333, 1);
      g.fillRoundedRect(cx - 70, cy - 110, 140, 100, 4);
      g.fillStyle(comp.color, 0.3);
      g.fillRect(cx - 60, cy - 100, 120, 80);
      // Stand
      g.fillStyle(0x666666, 1);
      g.fillRect(cx - 20, cy, 40, 30);
      g.fillRect(cx - 40, cy + 30, 80, 10);

      // Label
      const name = this.lang === 'he' ? comp.nameHe : comp.nameEn;
      this.add.text(cx, cy + 60, name, {
        fontSize: '22px', color: '#333', fontFamily: 'Arial', fontStyle: 'bold',
      }).setOrigin(0.5);

      this.add.text(cx, cy + 90, formatCurrency(comp.price, this.lang), {
        fontSize: '20px', color: '#4a90d9', fontFamily: 'Arial',
      }).setOrigin(0.5);

      // Description
      const desc = this.lang === 'he' ? comp.descHe : comp.descEn;
      this.add.text(cx, cy + 115, desc, {
        fontSize: '14px', color: '#666', fontFamily: 'Arial',
        wordWrap: { width: 200 }, align: 'center',
      }).setOrigin(0.5);

      // Buy button
      this.createButton(cx, cy + 160,
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
