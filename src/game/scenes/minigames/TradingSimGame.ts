import { BaseScene } from '../BaseScene';

interface Order {
  type: 'buy' | 'sell';
  stock: string;
  price: number;
  amount: number;
  status: 'pending' | 'executed' | 'cancelled';
}

export class TradingSimGame extends BaseScene {
  private orders: Order[] = [];
  private currentPrice = 100;
  private priceHistory: number[] = [];
  private priceTimer!: Phaser.Time.TimerEvent;
  private orderTexts: Phaser.GameObjects.Text[] = [];
  private priceText!: Phaser.GameObjects.Text;
  private chartGraphics!: Phaser.GameObjects.Graphics;

  constructor() {
    super('TradingSimGame');
  }

  create() {
    super.create();
    this.orders = [];
    this.currentPrice = 100;
    this.priceHistory = [100];

    this.drawGradientBg(0x0a1a2e, 0x0a0a1e);

    // Title
    this.add.text(this.w / 2, 30, this.lang === 'he' ? 'סימולציית מסחר' : 'Trading Simulation', {
      fontSize: '36px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Instructions
    this.add.text(this.w / 2, 70, this.lang === 'he'
      ? 'הגדר פקודות קנייה/מכירה במחיר שתבחר. המחיר משתנה בזמן אמת!'
      : 'Set buy/sell orders at your chosen price. The price changes in real-time!', {
      fontSize: '20px', color: '#aaa', fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Live price display
    this.priceText = this.add.text(this.w / 2, 130, `₪${this.currentPrice}`, {
      fontSize: '48px', color: '#50c878', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Chart area
    this.chartGraphics = this.add.graphics();
    this.drawChart();

    // Order buttons
    const buyPrices = [95, 90, 85];
    const sellPrices = [105, 110, 115];

    this.add.text(300, 550, this.lang === 'he' ? 'פקודות קנייה (Limit Buy)' : 'Buy Orders (Limit Buy)', {
      fontSize: '22px', color: '#50c878', fontFamily: 'Arial', fontStyle: 'bold',
    });

    for (let i = 0; i < buyPrices.length; i++) {
      this.createButton(300 + i * 220, 610,
        `${this.lang === 'he' ? 'קנה ב-' : 'Buy @'}₪${buyPrices[i]}`,
        () => this.placeOrder('buy', buyPrices[i]),
        200, 40);
    }

    this.add.text(300, 680, this.lang === 'he' ? 'פקודות מכירה (Limit Sell)' : 'Sell Orders (Limit Sell)', {
      fontSize: '22px', color: '#e74c3c', fontFamily: 'Arial', fontStyle: 'bold',
    });

    for (let i = 0; i < sellPrices.length; i++) {
      this.createButton(300 + i * 220, 740,
        `${this.lang === 'he' ? 'מכור ב-' : 'Sell @'}₪${sellPrices[i]}`,
        () => this.placeOrder('sell', sellPrices[i]),
        200, 40);
    }

    // Orders list area
    this.add.text(1200, 550, this.lang === 'he' ? 'הפקודות שלי:' : 'My Orders:', {
      fontSize: '22px', color: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
    });

    // Price ticker
    this.priceTimer = this.time.addEvent({
      delay: 1000,
      callback: () => this.updatePrice(),
      loop: true,
    });

    // End game after 30 seconds
    this.time.delayedCall(30000, () => this.endGame());

    // Timer display
    let timeLeft = 30;
    const timerText = this.add.text(this.w - 50, 30, `⏱ ${timeLeft}`, {
      fontSize: '24px', color: '#ffd700', fontFamily: 'Arial',
    }).setOrigin(1, 0);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        timeLeft--;
        timerText.setText(`⏱ ${Math.max(0, timeLeft)}`);
      },
      repeat: 29,
    });

    // Back button
    this.createButton(100, this.h - 40,
      this.lang === 'he' ? 'סיים' : 'Finish',
      () => this.endGame(),
      160, 40);

    this.fadeIn();
  }

  private updatePrice() {
    const change = (Math.random() - 0.5) * 6;
    this.currentPrice = Math.max(70, Math.min(130, this.currentPrice + change));
    this.currentPrice = Math.round(this.currentPrice * 100) / 100;
    this.priceHistory.push(this.currentPrice);
    if (this.priceHistory.length > 30) this.priceHistory.shift();

    const isUp = this.currentPrice >= (this.priceHistory[this.priceHistory.length - 2] || 100);
    this.priceText.setText(`₪${this.currentPrice.toFixed(0)}`);
    this.priceText.setColor(isUp ? '#50c878' : '#e74c3c');

    this.drawChart();
    this.checkOrders();
  }

  private drawChart() {
    this.chartGraphics.clear();
    const cx = 200, cy = 180, cw = this.w - 400, ch = 320;

    this.chartGraphics.fillStyle(0x0a0a2e, 1);
    this.chartGraphics.fillRoundedRect(cx, cy, cw, ch, 8);

    if (this.priceHistory.length < 2) return;

    const min = Math.min(...this.priceHistory) - 5;
    const max = Math.max(...this.priceHistory) + 5;
    const range = max - min;

    this.chartGraphics.lineStyle(2, 0x4a90d9, 1);
    this.chartGraphics.beginPath();

    for (let i = 0; i < this.priceHistory.length; i++) {
      const x = cx + 20 + (i / 29) * (cw - 40);
      const y = cy + ch - 20 - ((this.priceHistory[i] - min) / range) * (ch - 40);
      if (i === 0) this.chartGraphics.moveTo(x, y);
      else this.chartGraphics.lineTo(x, y);
    }
    this.chartGraphics.strokePath();
  }

  private placeOrder(type: 'buy' | 'sell', price: number) {
    const order: Order = { type, stock: 'Solar', price, amount: 1, status: 'pending' };
    this.orders.push(order);
    this.updateOrderDisplay();
  }

  private checkOrders() {
    for (const order of this.orders) {
      if (order.status !== 'pending') continue;
      if (order.type === 'buy' && this.currentPrice <= order.price) {
        order.status = 'executed';
        this.showOrderExecution(order);
      } else if (order.type === 'sell' && this.currentPrice >= order.price) {
        order.status = 'executed';
        this.showOrderExecution(order);
      }
    }
    this.updateOrderDisplay();
  }

  private showOrderExecution(order: Order) {
    const text = order.type === 'buy'
      ? (this.lang === 'he' ? `קנייה בוצעה ב-₪${order.price}!` : `Buy executed at ₪${order.price}!`)
      : (this.lang === 'he' ? `מכירה בוצעה ב-₪${order.price}!` : `Sell executed at ₪${order.price}!`);

    const notification = this.add.text(this.w / 2, this.h / 2, text, {
      fontSize: '32px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
      backgroundColor: 'rgba(0,0,0,0.8)', padding: { x: 16, y: 8 },
    }).setOrigin(0.5).setDepth(100);

    this.tweens.add({
      targets: notification, y: this.h / 2 - 50, alpha: 0, duration: 1500,
      onComplete: () => notification.destroy(),
    });
  }

  private updateOrderDisplay() {
    for (const t of this.orderTexts) t.destroy();
    this.orderTexts = [];

    let y = 580;
    for (const order of this.orders.slice(-6)) {
      const statusIcon = order.status === 'executed' ? '✓' : '⏳';
      const color = order.status === 'executed' ? '#50c878' : '#aaa';
      const typeLabel = order.type === 'buy'
        ? (this.lang === 'he' ? 'קנייה' : 'Buy')
        : (this.lang === 'he' ? 'מכירה' : 'Sell');

      const t = this.add.text(1200, y, `${statusIcon} ${typeLabel} @ ₪${order.price}`, {
        fontSize: '18px', color, fontFamily: 'Arial',
      });
      this.orderTexts.push(t);
      y += 28;
    }
  }

  private endGame() {
    this.priceTimer.destroy();
    this.store.completeMiniGame('tradingSim');

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(0, 0, this.w, this.h);
    overlay.setDepth(90);

    const executed = this.orders.filter(o => o.status === 'executed').length;

    this.add.text(this.w / 2, this.h / 2 - 80,
      this.lang === 'he' ? 'סימולציה הסתיימה!' : 'Simulation Complete!', {
      fontSize: '48px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(100);

    this.add.text(this.w / 2, this.h / 2,
      `${this.lang === 'he' ? 'פקודות שבוצעו:' : 'Orders executed:'} ${executed}/${this.orders.length}`, {
      fontSize: '28px', color: '#ffffff', fontFamily: 'Arial',
    }).setOrigin(0.5).setDepth(100);

    this.createButton(this.w / 2, this.h / 2 + 100,
      this.lang === 'he' ? 'המשך' : 'Continue',
      () => this.goToScene('Credits'),
      200, 50);
  }
}
