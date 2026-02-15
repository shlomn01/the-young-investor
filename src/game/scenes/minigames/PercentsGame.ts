import { BaseScene } from '../BaseScene';
import { COLORS } from '../../../config/constants';

interface QuizQuestion {
  question: string;
  correctAnswer: string;
  wrongAnswer: string;
}

const QUESTIONS: { he: QuizQuestion[]; en: QuizQuestion[] } = {
  he: [
    { question: 'מניה ב-100₪ עלתה 10%. כמה היא שווה עכשיו?', correctAnswer: '110₪', wrongAnswer: '90₪' },
    { question: 'מניה ב-200₪ ירדה 50%. כמה היא שווה?', correctAnswer: '100₪', wrongAnswer: '150₪' },
    { question: 'מניה ב-100₪ עלתה 50% ואז ירדה 50%. כמה היא שווה?', correctAnswer: '75₪', wrongAnswer: '100₪' },
    { question: 'כמה אחוז צריך לעלות כדי לחזור מירידה של 50%?', correctAnswer: '100%', wrongAnswer: '50%' },
    { question: 'מניה ב-80₪ עלתה 25%. כמה היא שווה?', correctAnswer: '100₪', wrongAnswer: '105₪' },
    { question: 'אם השקעת 1000₪ והרווחת 10% בשנה, כמה יהיה לך אחרי שנתיים?', correctAnswer: '1,210₪', wrongAnswer: '1,200₪' },
  ],
  en: [
    { question: 'A stock at ₪100 went up 10%. What is it worth now?', correctAnswer: '₪110', wrongAnswer: '₪90' },
    { question: 'A stock at ₪200 dropped 50%. What is it worth?', correctAnswer: '₪100', wrongAnswer: '₪150' },
    { question: 'A stock at ₪100 went up 50% then down 50%. What is it worth?', correctAnswer: '₪75', wrongAnswer: '₪100' },
    { question: 'What percent rise is needed to recover from a 50% drop?', correctAnswer: '100%', wrongAnswer: '50%' },
    { question: 'A stock at ₪80 went up 25%. What is it worth?', correctAnswer: '₪100', wrongAnswer: '₪105' },
    { question: 'If you invest ₪1000 and earn 10% per year, how much after 2 years?', correctAnswer: '₪1,210', wrongAnswer: '₪1,200' },
  ],
};

export class PercentsGame extends BaseScene {
  private currentQuestion = 0;
  private score = 0;
  private questions: QuizQuestion[] = [];
  private questionText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;


  constructor() {
    super('PercentsGame');
  }

  create() {
    super.create();
    this.currentQuestion = 0;
    this.score = 0;
    this.questions = this.lang === 'he' ? QUESTIONS.he : QUESTIONS.en;

    // Platformer-style background
    this.drawGradientBg(0x1a1a3e, 0x0a0a2e);

    // Ground platform
    const g = this.add.graphics();
    g.fillStyle(0x4a4a4a, 1);
    g.fillRect(0, this.h - 100, this.w, 100);

    // Platform for player
    g.fillStyle(0x666666, 1);
    g.fillRoundedRect(this.w / 2 - 150, this.h - 250, 300, 20, 4);

    // Title
    this.add.text(this.w / 2, 30, this.lang === 'he' ? 'משחק האחוזים!' : 'The Percentage Game!', {
      fontSize: '36px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Score
    this.scoreText = this.add.text(this.w - 50, 30, `${this.score}/${this.questions.length}`, {
      fontSize: '28px', color: '#50c878', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(1, 0);

    // Question text
    this.questionText = this.add.text(this.w / 2, 120, '', {
      fontSize: '28px', color: '#ffffff', fontFamily: 'Arial',
      wordWrap: { width: 1400 },
      align: 'center',
    }).setOrigin(0.5);

    // Player on platform
    this.drawCharacterPlaceholder(this.w / 2, this.h - 300, COLORS.PRIMARY);

    this.showQuestion();
    this.fadeIn();
  }

  private showQuestion() {
    if (this.currentQuestion >= this.questions.length) {
      this.endGame();
      return;
    }

    const q = this.questions[this.currentQuestion];
    this.questionText.setText(q.question);

    // Randomize left/right position
    const correctOnLeft = Math.random() > 0.5;

    // Answer orbs
    const leftAnswer = correctOnLeft ? q.correctAnswer : q.wrongAnswer;
    const rightAnswer = correctOnLeft ? q.wrongAnswer : q.correctAnswer;

    // Left orb (green if correct, red if wrong)
    this.createAnswerOrb(this.w / 2 - 300, this.h - 350, leftAnswer, correctOnLeft);
    this.createAnswerOrb(this.w / 2 + 300, this.h - 350, rightAnswer, !correctOnLeft);
  }

  private createAnswerOrb(x: number, y: number, text: string, isCorrect: boolean): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const circle = this.add.circle(0, 0, 50, isCorrect ? 0x50c878 : 0xe74c3c, 0.8);
    circle.setInteractive({ useHandCursor: true });
    container.add(circle);

    const label = this.add.text(0, 0, text, {
      fontSize: '20px', color: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);
    container.add(label);

    // Bounce animation
    this.tweens.add({
      targets: container,
      y: y - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    circle.on('pointerdown', () => {
      if (isCorrect) {
        this.score++;
        this.showFeedback(x, y, true);
      } else {
        this.showFeedback(x, y, false);
      }

      // Clean up and move to next question
      this.time.delayedCall(800, () => {
        this.currentQuestion++;
        this.scoreText.setText(`${this.score}/${this.questions.length}`);
        // Restart scene for next question
        if (this.currentQuestion < this.questions.length) {
          this.scene.restart();
        } else {
          this.endGame();
        }
      });
    });

    return container;
  }

  private showFeedback(x: number, y: number, correct: boolean) {
    const text = correct
      ? (this.lang === 'he' ? 'נכון! ✓' : 'Correct! ✓')
      : (this.lang === 'he' ? 'לא נכון ✗' : 'Wrong! ✗');

    const feedback = this.add.text(x, y - 70, text, {
      fontSize: '32px',
      color: correct ? '#50c878' : '#e74c3c',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: feedback,
      y: y - 120,
      alpha: 0,
      duration: 800,
    });

    // Particle-like effect
    for (let i = 0; i < 8; i++) {
      const particle = this.add.circle(x, y, 5, correct ? 0x50c878 : 0xe74c3c);
      this.tweens.add({
        targets: particle,
        x: x + (Math.random() - 0.5) * 200,
        y: y + (Math.random() - 0.5) * 200,
        alpha: 0,
        scale: 0,
        duration: 600,
      });
    }
  }

  private endGame() {
    this.store.completeMiniGame('percents');

    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.8);
    g.fillRect(0, 0, this.w, this.h);

    const resultTitle = this.lang === 'he' ? 'תוצאות' : 'Results';
    this.add.text(this.w / 2, this.h / 2 - 100, resultTitle, {
      fontSize: '48px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(this.w / 2, this.h / 2, `${this.score} / ${this.questions.length}`, {
      fontSize: '64px', color: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    const rating = this.score >= 5 ? '⭐⭐⭐' : this.score >= 3 ? '⭐⭐' : '⭐';
    this.add.text(this.w / 2, this.h / 2 + 60, rating, {
      fontSize: '48px',
    }).setOrigin(0.5);

    this.createButton(
      this.w / 2, this.h / 2 + 160,
      this.lang === 'he' ? 'המשך' : 'Continue',
      () => this.goToScene('Street', { streetIndex: 6 }),
      200, 50
    );
  }
}
