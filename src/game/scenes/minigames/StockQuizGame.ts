import { BaseScene } from '../BaseScene';
import { COLORS } from '../../../config/constants';

interface QuizQuestion {
  question: string;
  correctAnswer: string;
  wrongAnswer: string;
}

const QUESTIONS: { he: QuizQuestion[]; en: QuizQuestion[] } = {
  he: [
    { question: 'מה זה מניה?', correctAnswer: 'חלק קטן מחברה', wrongAnswer: 'הלוואה לחברה' },
    { question: 'מה זה בורסה?', correctAnswer: 'שוק למסחר במניות', wrongAnswer: 'בנק גדול' },
    { question: 'מי זה וורן באפט?', correctAnswer: 'משקיע מפורסם', wrongAnswer: 'בנקאי מפורסם' },
    { question: 'מה זה פיזור סיכונים?', correctAnswer: 'השקעה בכמה חברות', wrongAnswer: 'מכירת כל המניות' },
    { question: 'מה זה ריבית דריבית?', correctAnswer: 'רווח על הרווח', wrongAnswer: 'הלוואה בריבית' },
    { question: 'מתי כדאי למכור מניות?', correctAnswer: 'כשצריך כסף או שהחברה השתנתה', wrongAnswer: 'כשהמחיר יורד קצת' },
  ],
  en: [
    { question: 'What is a stock?', correctAnswer: 'A small piece of a company', wrongAnswer: 'A loan to a company' },
    { question: 'What is a stock exchange?', correctAnswer: 'A market for trading stocks', wrongAnswer: 'A big bank' },
    { question: 'Who is Warren Buffett?', correctAnswer: 'A famous investor', wrongAnswer: 'A famous banker' },
    { question: 'What is diversification?', correctAnswer: 'Investing in multiple companies', wrongAnswer: 'Selling all stocks' },
    { question: 'What is compound interest?', correctAnswer: 'Earning returns on returns', wrongAnswer: 'A type of loan' },
    { question: 'When should you sell stocks?', correctAnswer: 'When you need money or the company changed', wrongAnswer: 'When the price drops a little' },
  ],
};

export class StockQuizGame extends BaseScene {
  private currentQ = 0;
  private score = 0;
  private questions: QuizQuestion[] = [];

  constructor() {
    super('StockQuizGame');
  }

  create() {
    super.create();
    this.currentQ = 0;
    this.score = 0;
    this.questions = this.lang === 'he' ? QUESTIONS.he : QUESTIONS.en;

    this.drawGradientBg(0x0a2a2e, 0x0a1a3e);

    this.add.text(this.w / 2, 30, this.lang === 'he' ? 'חידון מניות!' : 'Stock Quiz!', {
      fontSize: '36px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.showQ();
    this.fadeIn();
  }

  private showQ() {
    if (this.currentQ >= this.questions.length) {
      this.endGame();
      return;
    }

    // Clear previous
    this.children.removeAll();
    this.drawGradientBg(0x0a2a2e, 0x0a1a3e);

    const g = this.add.graphics();

    // Decorative background pattern
    g.fillStyle(0xffffff, 0.02);
    for (let i = 0; i < 20; i++) {
      const px = Math.random() * this.w;
      const py = Math.random() * this.h;
      g.fillCircle(px, py, 20 + Math.random() * 40);
    }

    // Title
    this.add.text(this.w / 2, 30, this.lang === 'he' ? 'חידון מניות!' : 'Stock Quiz!', {
      fontSize: '36px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Score display with panel
    const scorePanel = this.add.graphics();
    scorePanel.fillStyle(0x000000, 0.4);
    scorePanel.fillRoundedRect(this.w - 200, 12, 180, 44, 10);
    scorePanel.lineStyle(2, 0x50c878, 0.6);
    scorePanel.strokeRoundedRect(this.w - 200, 12, 180, 44, 10);

    this.add.text(this.w - 185, 22, this.lang === 'he' ? 'ניקוד:' : 'Score:', {
      fontSize: '16px', color: '#aaaaaa', fontFamily: 'Arial',
    });
    this.add.text(this.w - 40, 34, `${this.score}/${this.questions.length}`, {
      fontSize: '28px', color: '#50c878', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(1, 0.5);

    // Progress bar
    const barW = 300;
    const barX = 50;
    const barY = 34;
    g.fillStyle(0x1a3a4e, 1);
    g.fillRoundedRect(barX, barY - 8, barW, 16, 8);
    const progress = this.currentQ / this.questions.length;
    if (progress > 0) {
      g.fillStyle(0x4a90d9, 1);
      g.fillRoundedRect(barX, barY - 8, barW * progress, 16, 8);
    }
    // Progress dots on bar
    for (let i = 0; i <= this.questions.length; i++) {
      const dotX = barX + (barW / this.questions.length) * i;
      g.fillStyle(i <= this.currentQ ? 0x87ceeb : 0x2a4a5e, 1);
      g.fillCircle(dotX, barY, 4);
    }
    this.add.text(barX + barW / 2, barY - 22, `${this.currentQ + 1}/${this.questions.length}`, {
      fontSize: '14px', color: '#888', fontFamily: 'Arial',
    }).setOrigin(0.5);

    const q = this.questions[this.currentQ];

    // Question panel
    const qPanelW = 1200;
    const qPanelX = this.w / 2 - qPanelW / 2;
    g.fillStyle(0x0a1a2e, 0.7);
    g.fillRoundedRect(qPanelX, 130, qPanelW, 100, 16);
    g.lineStyle(2, 0x4a90d9, 0.4);
    g.strokeRoundedRect(qPanelX, 130, qPanelW, 100, 16);

    this.add.text(this.w / 2, 180, q.question, {
      fontSize: '36px', color: '#ffffff', fontFamily: 'Arial',
      wordWrap: { width: 1100 }, align: 'center',
    }).setOrigin(0.5);

    // Player
    this.drawCharacterPlaceholder(this.w / 2, this.h - 200, COLORS.PRIMARY);

    // Answer buttons with hover effects
    const correctOnLeft = Math.random() > 0.5;
    const leftText = correctOnLeft ? q.correctAnswer : q.wrongAnswer;
    const rightText = correctOnLeft ? q.wrongAnswer : q.correctAnswer;

    const makeButton = (x: number, y: number, text: string, isCorrect: boolean) => {
      const btnW = 500;
      const btnH = 80;
      const container = this.add.container(x, y);

      // Shadow
      const shadow = this.add.graphics();
      shadow.fillStyle(0x000000, 0.3);
      shadow.fillRoundedRect(-btnW / 2 + 4, 4, btnW, btnH, 14);
      container.add(shadow);

      // Button bg
      const btnBg = this.add.graphics();
      btnBg.fillStyle(0x1a2a4e, 1);
      btnBg.fillRoundedRect(-btnW / 2, 0, btnW, btnH, 14);
      // Top highlight
      btnBg.fillStyle(0xffffff, 0.06);
      btnBg.fillRoundedRect(-btnW / 2 + 4, 2, btnW - 8, btnH / 2 - 4, { tl: 12, tr: 12, bl: 0, br: 0 });
      // Border
      btnBg.lineStyle(2, 0x4a6a9e, 0.6);
      btnBg.strokeRoundedRect(-btnW / 2, 0, btnW, btnH, 14);
      container.add(btnBg);

      const label = this.add.text(0, btnH / 2, text, {
        fontSize: '24px', color: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
        wordWrap: { width: 450 }, align: 'center',
      }).setOrigin(0.5);
      container.add(label);

      const zone = this.add.zone(x, y + btnH / 2, btnW, btnH).setInteractive({ useHandCursor: true });

      zone.on('pointerover', () => {
        container.setScale(1.05);
        label.setColor('#ffd700');
      });
      zone.on('pointerout', () => {
        container.setScale(1.0);
        label.setColor('#ffffff');
      });
      zone.on('pointerdown', () => {
        if (isCorrect) this.score++;
        this.currentQ++;
        this.showQ();
      });
    };

    makeButton(this.w / 2 - 350, 420, leftText, correctOnLeft);
    makeButton(this.w / 2 + 350, 420, rightText, !correctOnLeft);
  }

  private endGame() {
    this.store.completeMiniGame('stockquiz');
    this.children.removeAll();
    this.drawGradientBg(0x0a2a2e, 0x0a1a3e);

    const g = this.add.graphics();

    // Results panel
    const panelW = 550;
    const panelH = 380;
    const panelX = this.w / 2 - panelW / 2;
    const panelY = this.h / 2 - panelH / 2 - 20;

    // Panel shadow
    g.fillStyle(0x000000, 0.3);
    g.fillRoundedRect(panelX + 6, panelY + 6, panelW, panelH, 20);
    // Panel
    g.fillStyle(0x0e1e3e, 0.95);
    g.fillRoundedRect(panelX, panelY, panelW, panelH, 20);
    g.lineStyle(3, 0xffd700, 0.6);
    g.strokeRoundedRect(panelX, panelY, panelW, panelH, 20);

    this.add.text(this.w / 2, panelY + 45, this.lang === 'he' ? 'תוצאות' : 'Results', {
      fontSize: '48px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(this.w / 2, panelY + 120, `${this.score} / ${this.questions.length}`, {
      fontSize: '64px', color: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    const rating = this.score >= 5 ? '⭐⭐⭐' : this.score >= 3 ? '⭐⭐' : '⭐';
    this.add.text(this.w / 2, panelY + 190, rating, { fontSize: '48px' }).setOrigin(0.5);

    // Progress bar in results
    const barW = panelW - 80;
    const barX = panelX + 40;
    const barY = panelY + 250;
    g.fillStyle(0x1a3a5e, 1);
    g.fillRoundedRect(barX, barY, barW, 20, 10);
    const fillW = (this.score / this.questions.length) * barW;
    const barColor = this.score >= 5 ? 0x50c878 : this.score >= 3 ? 0xffd700 : 0xe74c3c;
    g.fillStyle(barColor, 1);
    g.fillRoundedRect(barX, barY, Math.max(fillW, 10), 20, 10);
    // Percentage label
    const pct = Math.round((this.score / this.questions.length) * 100);
    this.add.text(barX + barW / 2, barY + 10, `${pct}%`, {
      fontSize: '14px', color: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Message
    const msg = this.score >= 5
      ? (this.lang === 'he' ? 'מצוין!' : 'Excellent!')
      : this.score >= 3
      ? (this.lang === 'he' ? 'טוב מאוד!' : 'Very good!')
      : (this.lang === 'he' ? 'נסה שוב!' : 'Try again!');
    this.add.text(this.w / 2, panelY + 310, msg, {
      fontSize: '26px', color: '#87ceeb', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.createButton(this.w / 2, panelY + panelH + 40,
      this.lang === 'he' ? 'המשך' : 'Continue',
      () => this.goToScene('Street', { streetIndex: 8 }),
      200, 50);
  }
}
