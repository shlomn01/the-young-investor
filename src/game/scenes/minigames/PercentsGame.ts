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

    // Rich gradient background (dark blue to purple)
    this.drawGradientBg(0x0d0b3e, 0x2a0845);

    const g = this.add.graphics();

    // Starfield particles in the background
    for (let i = 0; i < 60; i++) {
      const sx = Math.random() * this.w;
      const sy = Math.random() * this.h * 0.6;
      const brightness = 0.2 + Math.random() * 0.6;
      g.fillStyle(0xffffff, brightness);
      g.fillCircle(sx, sy, 0.5 + Math.random() * 1.5);
    }

    // Ground platform with grass texture on top
    // Stone body
    g.fillStyle(0x4a4a5a, 1);
    g.fillRect(0, this.h - 100, this.w, 100);
    // Stone texture lines
    g.fillStyle(0x3a3a4a, 1);
    for (let row = 0; row < 5; row++) {
      const ry = this.h - 100 + row * 20;
      g.fillRect(0, ry, this.w, 1);
      const offset = row % 2 === 0 ? 0 : 60;
      for (let col = offset; col < this.w; col += 120) {
        g.fillRect(col, ry, 1, 20);
      }
    }
    // Grass on top of ground
    g.fillStyle(0x3d8b37, 1);
    g.fillRect(0, this.h - 108, this.w, 12);
    g.fillStyle(0x4caf50, 1);
    for (let gx = 0; gx < this.w; gx += 8) {
      const bladeH = 4 + Math.random() * 8;
      g.fillRect(gx, this.h - 108 - bladeH, 3, bladeH);
    }

    // Elevated platform with stone texture and grass
    const platX = this.w / 2 - 160;
    const platY = this.h - 250;
    const platW = 320;
    const platH = 24;
    // Stone base
    g.fillStyle(0x6b6b7a, 1);
    g.fillRoundedRect(platX, platY, platW, platH, 4);
    // Stone highlight
    g.fillStyle(0x8a8a9a, 0.5);
    g.fillRect(platX + 4, platY + 2, platW - 8, 4);
    // Stone texture
    g.fillStyle(0x555566, 0.4);
    for (let sx = platX + 10; sx < platX + platW - 10; sx += 30) {
      g.fillRect(sx, platY + 6, 1, platH - 8);
    }
    // Grass on platform
    g.fillStyle(0x3d8b37, 1);
    g.fillRect(platX, platY - 5, platW, 7);
    g.fillStyle(0x4caf50, 1);
    for (let gx = platX; gx < platX + platW; gx += 6) {
      const bladeH = 3 + Math.random() * 6;
      g.fillRect(gx, platY - 5 - bladeH, 2, bladeH);
    }

    // Title with glow effect
    const titleGlow = this.add.text(this.w / 2, 30, this.lang === 'he' ? 'משחק האחוזים!' : 'The Percentage Game!', {
      fontSize: '36px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0.3).setScale(1.05);
    this.add.text(this.w / 2, 30, this.lang === 'he' ? 'משחק האחוזים!' : 'The Percentage Game!', {
      fontSize: '36px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);
    // Pulse the glow
    this.tweens.add({
      targets: titleGlow,
      alpha: 0.1,
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });

    // Better score display with panel
    const scorePanel = this.add.graphics();
    scorePanel.fillStyle(0x000000, 0.4);
    scorePanel.fillRoundedRect(this.w - 180, 12, 160, 44, 10);
    scorePanel.lineStyle(2, 0x50c878, 0.6);
    scorePanel.strokeRoundedRect(this.w - 180, 12, 160, 44, 10);

    this.add.text(this.w - 165, 22, this.lang === 'he' ? 'ניקוד:' : 'Score:', {
      fontSize: '16px', color: '#aaaaaa', fontFamily: 'Arial',
    });
    this.scoreText = this.add.text(this.w - 40, 34, `${this.score}/${this.questions.length}`, {
      fontSize: '28px', color: '#50c878', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(1, 0.5);

    // Progress dots
    for (let i = 0; i < this.questions.length; i++) {
      const dotColor = i < this.score ? 0x50c878 : (i === this.currentQuestion ? 0xffd700 : 0x444466);
      const dotX = this.w / 2 - (this.questions.length * 20) / 2 + i * 20 + 10;
      g.fillStyle(dotColor, 1);
      g.fillCircle(dotX, 75, 5);
    }

    // Question text with panel background
    const qPanel = this.add.graphics();
    qPanel.fillStyle(0x000000, 0.35);
    qPanel.fillRoundedRect(this.w / 2 - 500, 90, 1000, 60, 12);

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
    const orbColor = isCorrect ? 0x50c878 : 0xe74c3c;

    // Outer glow ring
    const outerGlow = this.add.circle(0, 0, 65, orbColor, 0.15);
    container.add(outerGlow);

    // Inner glow ring
    const innerGlow = this.add.circle(0, 0, 58, orbColor, 0.25);
    container.add(innerGlow);

    // Main orb
    const circle = this.add.circle(0, 0, 50, orbColor, 0.85);
    circle.setInteractive({ useHandCursor: true });
    container.add(circle);

    // Highlight on orb (specular)
    const highlight = this.add.circle(-12, -15, 14, 0xffffff, 0.25);
    container.add(highlight);

    const label = this.add.text(0, 0, text, {
      fontSize: '20px', color: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);
    container.add(label);

    // Pulse the glow rings
    this.tweens.add({
      targets: [outerGlow, innerGlow],
      alpha: 0.05,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

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
    g.fillStyle(0x000000, 0.85);
    g.fillRect(0, 0, this.w, this.h);

    // Results panel
    const panelW = 500;
    const panelH = 320;
    const panelX = this.w / 2 - panelW / 2;
    const panelY = this.h / 2 - panelH / 2 - 20;
    g.fillStyle(0x16133e, 0.95);
    g.fillRoundedRect(panelX, panelY, panelW, panelH, 20);
    g.lineStyle(3, 0xffd700, 0.7);
    g.strokeRoundedRect(panelX, panelY, panelW, panelH, 20);

    const resultTitle = this.lang === 'he' ? 'תוצאות' : 'Results';
    this.add.text(this.w / 2, panelY + 40, resultTitle, {
      fontSize: '48px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(this.w / 2, panelY + 120, `${this.score} / ${this.questions.length}`, {
      fontSize: '64px', color: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    const rating = this.score >= 5 ? '⭐⭐⭐' : this.score >= 3 ? '⭐⭐' : '⭐';
    this.add.text(this.w / 2, panelY + 190, rating, {
      fontSize: '48px',
    }).setOrigin(0.5);

    // Progress bar in results
    const barW = panelW - 80;
    const barX = panelX + 40;
    const barY = panelY + 240;
    g.fillStyle(0x333355, 1);
    g.fillRoundedRect(barX, barY, barW, 16, 8);
    const fillW = (this.score / this.questions.length) * barW;
    const barColor = this.score >= 5 ? 0x50c878 : this.score >= 3 ? 0xffd700 : 0xe74c3c;
    g.fillStyle(barColor, 1);
    g.fillRoundedRect(barX, barY, fillW, 16, 8);

    this.createButton(
      this.w / 2, panelY + panelH + 40,
      this.lang === 'he' ? 'המשך' : 'Continue',
      () => this.goToScene('Street', { streetIndex: 6 }),
      200, 50
    );
  }
}
