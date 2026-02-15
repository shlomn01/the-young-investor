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

    // Bank interior
    const g = this.add.graphics();
    g.fillStyle(0xf0f0f0, 1);
    g.fillRect(0, 0, this.w, this.h);
    g.fillStyle(0xd4af37, 0.3);
    g.fillRect(0, 0, this.w, 120);
    g.fillStyle(0xb0b0b0, 1);
    g.fillRect(0, this.h - 100, this.w, 100); // Floor

    // Bank counter
    g.fillStyle(0x8b4513, 1);
    g.fillRect(500, this.h - 350, 900, 30);
    g.fillRect(500, this.h - 350, 30, 250);
    g.fillRect(1370, this.h - 350, 30, 250);

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
