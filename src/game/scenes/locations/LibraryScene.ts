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

    // Interior room with parchment-colored walls and wood floor
    this.drawInteriorRoom(0xf5ead0, 0x8b6b4a, { woodFloor: true, baseboard: true, ceiling: true });

    const dg = this.add.graphics();

    // --- Arched window with natural light (left side) ---
    const awX = 80;
    const awY = 100;
    const awW = 160;
    const awH = 280;
    // Window arch frame
    dg.fillStyle(0x8b7355, 1);
    dg.fillRect(awX - 8, awY + awH / 3, awW + 16, awH * 2 / 3 + 12);
    dg.fillRoundedRect(awX - 8, awY - 8, awW + 16, awH / 2 + 16, { tl: awW / 2 + 8, tr: awW / 2 + 8, bl: 0, br: 0 });
    // Window glass
    dg.fillStyle(0xc8e8ff, 0.7);
    dg.fillRect(awX, awY + awH / 3, awW, awH * 2 / 3);
    dg.fillRoundedRect(awX, awY, awW, awH / 2, { tl: awW / 2, tr: awW / 2, bl: 0, br: 0 });
    // Cross bars
    dg.fillStyle(0x8b7355, 1);
    dg.fillRect(awX + awW / 2 - 3, awY, 6, awH);
    dg.fillRect(awX, awY + awH / 2 - 3, awW, 6);
    // Natural light rays from window
    dg.fillStyle(0xfff9c4, 0.06);
    dg.fillTriangle(awX + awW, awY, awX + awW + 300, this.h - 180, awX + awW, this.h - 180);
    dg.fillStyle(0xfff9c4, 0.04);
    dg.fillTriangle(awX + awW / 2, awY, awX + awW + 200, this.h - 180, awX, this.h - 180);
    // Window reflection
    dg.fillStyle(0xffffff, 0.12);
    dg.fillRect(awX + 5, awY + awH / 3 + 5, awW / 2 - 10, awH / 3 - 10);

    // --- Tall bookshelves with individual colored book spines ---
    const bookColors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6, 0x1abc9c, 0xe67e22, 0x2c3e50, 0xc0392b, 0x16a085];

    // Bookshelf 1 (center-left)
    this.drawBookshelf(dg, 320, 80, 280, 520, bookColors);
    // Bookshelf 2 (center)
    this.drawBookshelf(dg, 650, 80, 280, 520, bookColors);
    // Bookshelf 3 (center-right)
    this.drawBookshelf(dg, 980, 80, 280, 520, bookColors);
    // Bookshelf 4 (far right)
    this.drawBookshelf(dg, 1310, 80, 280, 520, bookColors);

    // --- Reading table with green lamp ---
    // Table top
    dg.fillStyle(0x6b3a2a, 1);
    dg.fillRoundedRect(650, this.h - 280, 550, 22, 6);
    // Table top shine
    dg.fillStyle(0x7a4432, 0.5);
    dg.fillRect(660, this.h - 280, 530, 6);
    // Table legs
    dg.fillStyle(0x5a2e1e, 1);
    dg.fillRect(680, this.h - 258, 16, 80);
    dg.fillRect(1170, this.h - 258, 16, 80);
    // Cross bar between legs
    dg.fillStyle(0x5a2e1e, 0.6);
    dg.fillRect(696, this.h - 220, 474, 6);

    // Green banker's lamp on table
    // Lamp base
    dg.fillStyle(0xc0a000, 1);
    dg.fillRoundedRect(890, this.h - 298, 50, 8, 3);
    // Lamp stem
    dg.fillStyle(0xc0a000, 1);
    dg.fillRect(912, this.h - 340, 6, 42);
    // Lamp shade (green)
    dg.fillStyle(0x2e8b57, 1);
    dg.fillRoundedRect(880, this.h - 360, 70, 22, { tl: 4, tr: 4, bl: 10, br: 10 });
    // Lamp glow
    dg.fillStyle(0xfff9c4, 0.15);
    dg.fillCircle(915, this.h - 310, 60);
    dg.fillStyle(0xfff9c4, 0.06);
    dg.fillCircle(915, this.h - 310, 100);

    // Books on reading table
    dg.fillStyle(0x8b0000, 1);
    dg.fillRect(720, this.h - 300, 60, 14);
    dg.fillRect(718, this.h - 304, 64, 4);
    dg.fillStyle(0x2c3e50, 1);
    dg.fillRect(800, this.h - 298, 50, 10);
    // Open book
    dg.fillStyle(0xfffff0, 1);
    dg.fillRect(1020, this.h - 300, 100, 14);
    dg.fillStyle(0x333333, 0.3);
    dg.fillRect(1069, this.h - 300, 2, 14);
    // Text lines on open book
    dg.fillStyle(0x333333, 0.2);
    for (let i = 0; i < 3; i++) {
      dg.fillRect(1025, this.h - 296 + i * 4, 40, 1);
      dg.fillRect(1076, this.h - 296 + i * 4, 40, 1);
    }

    // Title
    const title = this.lang === 'he' ? 'הספרייה' : 'The Library';
    this.add.text(this.w / 2, 40, title, {
      fontSize: '36px',
      color: '#333',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Newspaper on table
    const newspaperLabel = this.lang === 'he' ? 'לחץ לקרוא עיתון' : 'Click to read newspaper';
    const newspaper = this.add.text(925, this.h - 320, newspaperLabel, {
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
    const librarian = this.drawCharacterPlaceholder(500, this.h - 200, 0x800080, librarianName);
    librarian.setInteractive(new Phaser.Geom.Rectangle(-30, -60, 60, 120), Phaser.Geom.Rectangle.Contains);

    librarian.on('pointerdown', async () => {
      const text = this.variant === 1
        ? (this.lang === 'he' ? 'שלום! בוא תקרא את העיתון. יש חדשות מעניינות על חברת סולאר!' : 'Hello! Come read the newspaper. There\'s interesting news about Solar!')
        : (this.lang === 'he' ? 'יש חדשות חדשות! קוגל וססלה פרסמו דוחות מעניינים.' : 'There\'s new news! Koogle and Sesla published interesting reports.');
      await this.showDialogue(librarianName, text);
    });

    // Player
    this.drawCharacterPlaceholder(400, this.h - 200, COLORS.PRIMARY);

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

  private drawBookshelf(dg: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, bookColors: number[]) {
    // Shelf frame
    dg.fillStyle(0x6b3a2a, 1);
    dg.fillRect(x, y, w, h);
    // Inner back panel
    dg.fillStyle(0x5a2e1e, 1);
    dg.fillRect(x + 8, y + 8, w - 16, h - 8);
    // Side panels
    dg.fillStyle(0x7a4432, 1);
    dg.fillRect(x, y, 8, h);
    dg.fillRect(x + w - 8, y, 8, h);
    // Top panel
    dg.fillStyle(0x7a4432, 1);
    dg.fillRect(x, y, w, 8);

    // Shelves (5 rows)
    const shelfCount = 5;
    const shelfSpacing = h / shelfCount;
    for (let s = 1; s < shelfCount; s++) {
      const sy = y + s * shelfSpacing;
      dg.fillStyle(0x7a4432, 1);
      dg.fillRect(x + 4, sy, w - 8, 8);
    }

    // Books on each shelf
    for (let s = 0; s < shelfCount; s++) {
      const shelfTop = y + s * shelfSpacing + 12;
      const shelfBottom = y + (s + 1) * shelfSpacing - 2;
      const maxBookH = shelfBottom - shelfTop;
      let bx = x + 14;
      const shelfEnd = x + w - 14;
      let bookIdx = 0;
      while (bx < shelfEnd - 10) {
        const bw = 14 + Math.floor(Math.random() * 12);
        const bh = maxBookH - Math.floor(Math.random() * 15);
        if (bx + bw > shelfEnd) break;
        const color = bookColors[(s * 7 + bookIdx) % bookColors.length];
        dg.fillStyle(color, 0.9);
        dg.fillRect(bx, shelfBottom - bh, bw, bh);
        // Spine highlight
        dg.fillStyle(0xffffff, 0.1);
        dg.fillRect(bx + 1, shelfBottom - bh + 2, 2, bh - 4);
        // Spine detail line
        dg.fillStyle(0x000000, 0.1);
        dg.fillRect(bx + bw / 2 - 1, shelfBottom - bh + 8, 2, bh - 16);
        bx += bw + 2;
        bookIdx++;
      }
    }
  }
}
