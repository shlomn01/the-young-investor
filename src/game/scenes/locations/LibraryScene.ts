import { BaseScene } from '../BaseScene';
import { COLORS } from '../../../config/constants';
import { phaserBridge } from '../../../utils/phaserBridge';

export class LibraryScene extends BaseScene {
  private variant = 1;

  constructor() {
    super('Library');
  }

  init(data: { variant?: number }) {
    this.variant = data?.variant ?? 1;
  }

  create() {
    super.create();

    // Library interior
    const g = this.add.graphics();
    g.fillStyle(0xfaf0e6, 1);
    g.fillRect(0, 0, this.w, this.h);
    g.fillStyle(0x8b7355, 1);
    g.fillRect(0, this.h - 100, this.w, 100);

    // Bookshelves
    for (let i = 0; i < 4; i++) {
      const sx = 150 + i * 420;
      g.fillStyle(0x8b4513, 1);
      g.fillRect(sx, 100, 350, 500);
      // Shelves
      for (let shelf = 0; shelf < 4; shelf++) {
        g.fillStyle(0xa0522d, 1);
        g.fillRect(sx, 100 + shelf * 125, 350, 10);
        // Books
        const bookColors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6, 0x1abc9c];
        for (let b = 0; b < 8; b++) {
          const color = bookColors[(i + shelf + b) % bookColors.length];
          g.fillStyle(color, 1);
          g.fillRect(sx + 15 + b * 40, 100 + shelf * 125 + 12, 30, 100);
        }
      }
    }

    // Title
    const title = this.lang === 'he' ? 'הספרייה' : 'The Library';
    this.add.text(this.w / 2, 40, title, {
      fontSize: '36px',
      color: '#333',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Newspaper table
    g.fillStyle(0xcd853f, 1);
    g.fillRect(700, this.h - 250, 500, 20);
    g.fillRect(740, this.h - 230, 20, 130);
    g.fillRect(1160, this.h - 230, 20, 130);

    // Newspaper on table
    const newspaperLabel = this.lang === 'he' ? '📰 לחץ לקרוא עיתון' : '📰 Click to read newspaper';
    const newspaper = this.add.text(950, this.h - 280, newspaperLabel, {
      fontSize: '22px',
      color: '#333',
      fontFamily: 'Arial',
      backgroundColor: '#fffff0',
      padding: { x: 12, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    newspaper.on('pointerdown', () => {
      phaserBridge.emit('show-newspaper', { articleId: `news-${this.variant}` });
    });

    // Librarian
    const librarianName = this.lang === 'he' ? 'הספרנית' : 'Librarian';
    const librarian = this.drawCharacterPlaceholder(300, this.h - 150, 0x800080, librarianName);
    librarian.setInteractive(new Phaser.Geom.Rectangle(-30, -60, 60, 120), Phaser.Geom.Rectangle.Contains);

    librarian.on('pointerdown', async () => {
      const text = this.variant === 1
        ? (this.lang === 'he' ? 'שלום! בוא תקרא את העיתון. יש חדשות מעניינות על חברת סולאר!' : 'Hello! Come read the newspaper. There\'s interesting news about Solar!')
        : (this.lang === 'he' ? 'יש חדשות חדשות! קוגל וססלה פרסמו דוחות מעניינים.' : 'There\'s new news! Koogle and Sesla published interesting reports.');
      await this.showDialogue(librarianName, text);
    });

    // Player
    this.drawCharacterPlaceholder(500, this.h - 150, COLORS.PRIMARY);

    // Back button
    const streetMap: Record<number, number> = { 1: 3, 2: 6 };
    this.createButton(
      100, this.h - 40,
      this.lang === 'he' ? 'חזרה לרחוב' : 'Back to Street',
      () => this.goToScene('Street', { streetIndex: streetMap[this.variant] || 3 }),
      200, 40
    );

    this.fadeIn();
  }
}
