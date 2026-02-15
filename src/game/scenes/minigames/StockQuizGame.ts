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

    this.drawGradientBg(0x1a2a3e, 0x0a1a2e);

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
    this.drawGradientBg(0x1a2a3e, 0x0a1a2e);

    this.add.text(this.w / 2, 30, this.lang === 'he' ? 'חידון מניות!' : 'Stock Quiz!', {
      fontSize: '36px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(this.w - 50, 30, `${this.score}/${this.questions.length}`, {
      fontSize: '28px', color: '#50c878', fontFamily: 'Arial',
    }).setOrigin(1, 0);

    this.add.text(50, 30, `${this.currentQ + 1}/${this.questions.length}`, {
      fontSize: '24px', color: '#888', fontFamily: 'Arial',
    });

    const q = this.questions[this.currentQ];

    // Question
    this.add.text(this.w / 2, 200, q.question, {
      fontSize: '36px', color: '#ffffff', fontFamily: 'Arial',
      wordWrap: { width: 1400 }, align: 'center',
    }).setOrigin(0.5);

    // Player
    this.drawCharacterPlaceholder(this.w / 2, this.h - 200, COLORS.PRIMARY);

    // Answer buttons
    const correctOnLeft = Math.random() > 0.5;
    const leftText = correctOnLeft ? q.correctAnswer : q.wrongAnswer;
    const rightText = correctOnLeft ? q.wrongAnswer : q.correctAnswer;

    const makeOrb = (x: number, y: number, text: string, isCorrect: boolean) => {
      const g = this.add.graphics();
      g.fillStyle(0x333366, 1);
      g.fillRoundedRect(x - 250, y - 40, 500, 80, 12);

      this.add.text(x, y, text, {
        fontSize: '24px', color: '#ffffff', fontFamily: 'Arial',
        wordWrap: { width: 450 }, align: 'center',
      }).setOrigin(0.5);

      const zone = this.add.zone(x, y, 500, 80).setInteractive({ useHandCursor: true });
      zone.on('pointerdown', () => {
        if (isCorrect) this.score++;
        this.currentQ++;
        this.showQ();
      });
    };

    makeOrb(this.w / 2 - 350, 450, leftText, correctOnLeft);
    makeOrb(this.w / 2 + 350, 450, rightText, !correctOnLeft);
  }

  private endGame() {
    this.store.completeMiniGame('stockquiz');
    this.children.removeAll();
    this.drawGradientBg(0x1a2a3e, 0x0a1a2e);

    this.add.text(this.w / 2, this.h / 2 - 100, this.lang === 'he' ? 'תוצאות' : 'Results', {
      fontSize: '48px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(this.w / 2, this.h / 2, `${this.score} / ${this.questions.length}`, {
      fontSize: '64px', color: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    const rating = this.score >= 5 ? '⭐⭐⭐' : this.score >= 3 ? '⭐⭐' : '⭐';
    this.add.text(this.w / 2, this.h / 2 + 60, rating, { fontSize: '48px' }).setOrigin(0.5);

    this.createButton(this.w / 2, this.h / 2 + 160,
      this.lang === 'he' ? 'המשך' : 'Continue',
      () => this.goToScene('Street', { streetIndex: 8 }),
      200, 50);
  }
}
