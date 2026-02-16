import { BaseScene } from '../BaseScene';

interface LessonPage {
  title: string;
  content: string;
}

const LESSONS: Record<number, { he: LessonPage[]; en: LessonPage[] }> = {
  1: {
    he: [
      { title: 'מה זה מניה?', content: 'מניה היא חלק קטן מחברה. כשאתה קונה מניה, אתה נהיה שותף קטן בחברה!' },
      { title: 'חברות ציבוריות', content: 'חברה ציבורית היא חברה שכל אחד יכול לקנות ממנה מניות בבורסה.' },
      { title: 'למה מחיר מניה משתנה?', content: 'כשהרבה אנשים רוצים לקנות מניה - המחיר עולה. כשהרבה אנשים רוצים למכור - המחיר יורד.' },
      { title: 'הבורסה', content: 'הבורסה היא שוק שבו קונים ומוכרים מניות. זה כמו שוק, אבל במקום ירקות - מוכרים חלקים בחברות!' },
    ],
    en: [
      { title: 'What is a Stock?', content: 'A stock is a small piece of a company. When you buy a stock, you become a small partner in that company!' },
      { title: 'Public Companies', content: 'A public company is one where anyone can buy its shares on the stock exchange.' },
      { title: 'Why do Stock Prices Change?', content: 'When many people want to buy a stock - the price goes up. When many people want to sell - the price goes down.' },
      { title: 'The Stock Exchange', content: 'The stock exchange is a market where stocks are bought and sold. It\'s like a market, but instead of vegetables - they sell parts of companies!' },
    ],
  },
  2: {
    he: [
      { title: 'אחוזים ומניות', content: 'אם מניה עולה ב-50% ואז יורדת ב-50%, היא לא חוזרת למחיר המקורי! בוא נראה למה...' },
      { title: 'דוגמה', content: 'מניה ב-100₪ עולה 50% = 150₪. עכשיו 150₪ יורדת 50% = 75₪! הפסדת 25₪!' },
      { title: 'הכלל החשוב', content: 'ירידה דורשת עלייה גדולה יותר כדי לחזור. ירידה של 50% דורשת עלייה של 100% כדי לחזור למקום!' },
      { title: 'מה למדנו?', content: 'לכן חשוב לא להיבהל ולמכור כשהשוק יורד. סבלנות היא המפתח להשקעה מוצלחת.' },
    ],
    en: [
      { title: 'Percentages & Stocks', content: 'If a stock goes up 50% then drops 50%, it doesn\'t return to its original price! Let\'s see why...' },
      { title: 'Example', content: 'A stock at ₪100 goes up 50% = ₪150. Now ₪150 drops 50% = ₪75! You lost ₪25!' },
      { title: 'The Important Rule', content: 'A drop requires a bigger rise to recover. A 50% drop needs a 100% rise to get back!' },
      { title: 'What We Learned', content: 'That\'s why it\'s important not to panic sell when the market drops. Patience is the key to successful investing.' },
    ],
  },
  3: {
    he: [
      { title: 'וורן באפט', content: 'וורן באפט הוא אחד המשקיעים הגדולים בהיסטוריה. הוא התחיל להשקיע כבר בגיל 11!' },
      { title: 'ריבית דריבית', content: 'ריבית דריבית היא כמו כדור שלג - הכסף שלך מרוויח כסף, והרווח מרוויח עוד רווח!' },
      { title: 'דוגמה', content: 'אם יש לך 1,000₪ ומרוויח 10% בשנה: אחרי שנה 1,100₪, אחרי שנתיים 1,210₪, אחרי 10 שנים 2,594₪!' },
      { title: 'עצת באפט', content: '"אל תשים את כל הביצים בסל אחד" - תפזר את ההשקעות שלך בין כמה חברות שונות.' },
    ],
    en: [
      { title: 'Warren Buffett', content: 'Warren Buffett is one of the greatest investors in history. He started investing at age 11!' },
      { title: 'Compound Interest', content: 'Compound interest is like a snowball - your money earns money, and the earnings earn more earnings!' },
      { title: 'Example', content: 'If you have ₪1,000 and earn 10% per year: after 1 year ₪1,100, after 2 years ₪1,210, after 10 years ₪2,594!' },
      { title: 'Buffett\'s Advice', content: '"Don\'t put all your eggs in one basket" - spread your investments across several different companies.' },
    ],
  },
};

export class SchoolScene extends BaseScene {
  private lessonId = 1;
  private currentPage = 0;
  private pages: LessonPage[] = [];
  private titleText!: Phaser.GameObjects.Text;
  private contentText!: Phaser.GameObjects.Text;
  private pageIndicator!: Phaser.GameObjects.Text;

  constructor() {
    super('School');
  }

  init(data: { lessonId?: number }) {
    this.lessonId = data?.lessonId ?? 1;
  }

  create() {
    super.create();
    this.currentPage = 0;

    const lesson = LESSONS[this.lessonId] || LESSONS[1];
    this.pages = this.lang === 'he' ? lesson.he : lesson.en;

    // Interior room with warm white walls and classroom floor
    this.drawInteriorRoom(0xfff8e7, 0xc9b896, { floorHeight: 150, ceiling: true });

    const dg = this.add.graphics();

    // --- Detailed chalkboard with wood frame ---
    const bbX = 350;
    const bbY = 80;
    const bbW = this.w - 700;
    const bbH = 450;
    // Outer wood frame
    dg.fillStyle(0x6b3a2a, 1);
    dg.fillRoundedRect(bbX - 16, bbY - 16, bbW + 32, bbH + 32, 8);
    // Inner frame bevel
    dg.fillStyle(0x8b5a3a, 1);
    dg.fillRoundedRect(bbX - 8, bbY - 8, bbW + 16, bbH + 16, 4);
    // Chalkboard surface
    dg.fillStyle(0x2f4f2f, 1);
    dg.fillRect(bbX, bbY, bbW, bbH);
    // Subtle chalk dust marks for realism
    dg.fillStyle(0xffffff, 0.03);
    dg.fillRect(bbX + 20, bbY + 50, 200, 2);
    dg.fillRect(bbX + 100, bbY + 120, 150, 1);
    dg.fillRect(bbX + 50, bbY + 200, 250, 1);
    // Chalk tray at bottom
    dg.fillStyle(0x7a4432, 1);
    dg.fillRect(bbX, bbY + bbH, bbW, 16);
    dg.fillStyle(0x6b3a2a, 1);
    dg.fillRect(bbX, bbY + bbH + 12, bbW, 8);
    // Chalk pieces on tray
    dg.fillStyle(0xffffff, 0.9);
    dg.fillRoundedRect(bbX + 40, bbY + bbH + 2, 30, 8, 3);
    dg.fillStyle(0xffff00, 0.8);
    dg.fillRoundedRect(bbX + 90, bbY + bbH + 3, 25, 7, 3);
    dg.fillStyle(0xff6666, 0.8);
    dg.fillRoundedRect(bbX + 140, bbY + bbH + 2, 28, 8, 3);

    // --- Teacher's desk (in front, left side) ---
    // Desk top
    dg.fillStyle(0xb8860b, 1);
    dg.fillRoundedRect(80, this.h - 350, 250, 22, 4);
    // Desk front panel
    dg.fillStyle(0xa07608, 1);
    dg.fillRect(85, this.h - 328, 240, 120);
    // Desk side panel
    dg.fillStyle(0x8b6508, 1);
    dg.fillRect(80, this.h - 328, 8, 150);
    dg.fillRect(322, this.h - 328, 8, 150);
    // Drawer
    dg.fillStyle(0x9a7010, 1);
    dg.fillRoundedRect(120, this.h - 310, 160, 45, 4);
    dg.fillStyle(0xffd700, 1);
    dg.fillCircle(200, this.h - 288, 3);
    // Apple on desk
    dg.fillStyle(0xe74c3c, 1);
    dg.fillCircle(140, this.h - 370, 14);
    dg.fillStyle(0x27ae60, 1);
    dg.fillRect(138, this.h - 388, 4, 8);
    // Stack of papers
    dg.fillStyle(0xffffff, 0.9);
    dg.fillRect(240, this.h - 372, 60, 4);
    dg.fillRect(242, this.h - 376, 58, 4);
    dg.fillRect(244, this.h - 380, 56, 4);

    // --- Student desks in rows ---
    const deskColor = 0xcd853f;
    const deskLegColor = 0xaaa080;
    // Row 1 (3 desks)
    for (let i = 0; i < 3; i++) {
      const dx = 500 + i * 350;
      const dy = this.h - 200;
      // Desk top
      dg.fillStyle(deskColor, 1);
      dg.fillRoundedRect(dx, dy, 140, 14, 3);
      // Legs
      dg.fillStyle(deskLegColor, 1);
      dg.fillRect(dx + 5, dy + 14, 6, 40);
      dg.fillRect(dx + 129, dy + 14, 6, 40);
      // Chair behind desk
      dg.fillStyle(0x4a90d9, 0.7);
      dg.fillRoundedRect(dx + 30, dy - 40, 80, 10, 3);
      dg.fillStyle(0x4a90d9, 0.5);
      dg.fillRect(dx + 35, dy - 70, 70, 30);
    }
    // Row 2 (3 desks, slightly higher / further back)
    for (let i = 0; i < 3; i++) {
      const dx = 500 + i * 350;
      const dy = this.h - 300;
      dg.fillStyle(deskColor, 0.85);
      dg.fillRoundedRect(dx, dy, 120, 12, 3);
      dg.fillStyle(deskLegColor, 0.7);
      dg.fillRect(dx + 5, dy + 12, 5, 30);
      dg.fillRect(dx + 110, dy + 12, 5, 30);
    }

    // Teacher
    const teacherName = this.lang === 'he' ? 'המורה' : 'Teacher';
    this.drawCharacterPlaceholder(200, this.h - 200, 0x800000, teacherName);

    // Lesson content on blackboard
    this.titleText = this.add.text(this.w / 2, 150, '', {
      fontSize: '36px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.contentText = this.add.text(this.w / 2, 330, '', {
      fontSize: '24px',
      color: '#e0e0e0',
      fontFamily: 'Arial',
      wordWrap: { width: this.w - 700 },
      align: 'center',
      lineSpacing: 8,
    }).setOrigin(0.5);

    this.pageIndicator = this.add.text(this.w / 2, 550, '', {
      fontSize: '18px',
      color: '#888',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    this.showPage(0);

    // Navigation buttons
    this.createButton(
      this.w / 2 - 150, this.h - 150,
      this.lang === 'he' ? '◀ הקודם' : '◀ Previous',
      () => this.prevPage(),
      160, 40
    );

    this.createButton(
      this.w / 2 + 150, this.h - 150,
      this.lang === 'he' ? 'הבא ▶' : 'Next ▶',
      () => this.nextPage(),
      160, 40
    );

    // Back button
    this.createButton(
      100, this.h - 40,
      this.lang === 'he' ? 'חזרה לרחוב' : 'Back to Street',
      () => {
        this.store.completeLesson(this.lessonId);
        const streetMap: Record<number, number> = { 1: 1, 2: 5, 3: 7 };
        this.goToScene('Street', { streetIndex: streetMap[this.lessonId] || 1 });
      },
      200, 40
    );

    this.fadeIn();
  }

  private showPage(index: number) {
    if (index < 0 || index >= this.pages.length) return;
    this.currentPage = index;
    const page = this.pages[index];
    this.titleText.setText(page.title);
    this.contentText.setText(page.content);
    this.pageIndicator.setText(`${index + 1} / ${this.pages.length}`);
  }

  private nextPage() {
    if (this.currentPage < this.pages.length - 1) {
      this.showPage(this.currentPage + 1);
    }
  }

  private prevPage() {
    if (this.currentPage > 0) {
      this.showPage(this.currentPage - 1);
    }
  }
}
