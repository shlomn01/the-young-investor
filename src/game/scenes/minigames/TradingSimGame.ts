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
  private orderGraphics: Phaser.GameObjects.Graphics[] = [];
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

    // Dark blue-green gradient background
    this.drawGradientBg(0x0a1e2e, 0x081018);

    const g = this.add.graphics();

    // Subtle grid pattern in background
    g.lineStyle(1, 0xffffff, 0.02);
    for (let x = 0; x < this.w; x += 60) {
      g.moveTo(x, 0);
      g.lineTo(x, this.h);
    }
    for (let y = 0; y < this.h; y += 60) {
      g.moveTo(0, y);
      g.lineTo(this.w, y);
    }
    g.strokePath();

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

    // Live price display with panel
    const pricePanel = this.add.graphics();
    pricePanel.fillStyle(0x0a2a3e, 0.8);
    pricePanel.fillRoundedRect(this.w / 2 - 120, 100, 240, 60, 12);
    pricePanel.lineStyle(2, 0x50c878, 0.5);
    pricePanel.strokeRoundedRect(this.w / 2 - 120, 100, 240, 60, 12);

    this.priceText = this.add.text(this.w / 2, 130, `₪${this.currentPrice}`, {
      fontSize: '48px', color: '#50c878', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Chart area
    this.chartGraphics = this.add.graphics();
    this.drawChart();

    // Order buttons
    const buyPrices = [95, 90, 85];
    const sellPrices = [105, 110, 115];

    // Buy section panel
    const buyPanel = this.add.graphics();
    buyPanel.fillStyle(0x0a2a1e, 0.4);
    buyPanel.fillRoundedRect(150, 530, 700, 120, 12);
    buyPanel.lineStyle(1, 0x50c878, 0.3);
    buyPanel.strokeRoundedRect(150, 530, 700, 120, 12);

    this.add.text(300, 545, this.lang === 'he' ? 'פקודות קנייה (Limit Buy)' : 'Buy Orders (Limit Buy)', {
      fontSize: '22px', color: '#50c878', fontFamily: 'Arial', fontStyle: 'bold',
    });

    for (let i = 0; i < buyPrices.length; i++) {
      this.createButton(300 + i * 220, 610,
        `${this.lang === 'he' ? 'קנה ב-' : 'Buy @'}₪${buyPrices[i]}`,
        () => this.placeOrder('buy', buyPrices[i]),
        200, 40);
    }

    // Sell section panel
    const sellPanel = this.add.graphics();
    sellPanel.fillStyle(0x2a0a1e, 0.4);
    sellPanel.fillRoundedRect(150, 660, 700, 120, 12);
    sellPanel.lineStyle(1, 0xe74c3c, 0.3);
    sellPanel.strokeRoundedRect(150, 660, 700, 120, 12);

    this.add.text(300, 680, this.lang === 'he' ? 'פקודות מכירה (Limit Sell)' : 'Sell Orders (Limit Sell)', {
      fontSize: '22px', color: '#e74c3c', fontFamily: 'Arial', fontStyle: 'bold',
    });

    for (let i = 0; i < sellPrices.length; i++) {
      this.createButton(300 + i * 220, 740,
        `${this.lang === 'he' ? 'מכור ב-' : 'Sell @'}₪${sellPrices[i]}`,
        () => this.placeOrder('sell', sellPrices[i]),
        200, 40);
    }

    // Orders list area with panel
    const ordersPanel = this.add.graphics();
    ordersPanel.fillStyle(0x0a1a2e, 0.6);
    ordersPanel.fillRoundedRect(1080, 530, 400, 250, 12);
    ordersPanel.lineStyle(1, 0x4a6a9e, 0.4);
    ordersPanel.strokeRoundedRect(1080, 530, 400, 250, 12);

    this.add.text(1200, 545, this.lang === 'he' ? 'הפקודות שלי:' : 'My Orders:', {
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

    // Timer display with panel
    const timerPanel = this.add.graphics();
    timerPanel.fillStyle(0x000000, 0.4);
    timerPanel.fillRoundedRect(this.w - 130, 12, 110, 36, 8);
    let timeLeft = 30;
    const timerText = this.add.text(this.w - 50, 30, `⏱ ${timeLeft}`, {
      fontSize: '24px', color: '#ffd700', fontFamily: 'Arial',
    }).setOrigin(1, 0);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        timeLeft--;
        timerText.setText(`⏱ ${Math.max(0, timeLeft)}`);
        if (timeLeft <= 5) timerText.setColor('#e74c3c');
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

    // Chart background with subtle gradient effect
    this.chartGraphics.fillStyle(0x06101e, 0.9);
    this.chartGraphics.fillRoundedRect(cx, cy, cw, ch, 12);
    // Border
    this.chartGraphics.lineStyle(2, 0x1a3a5e, 0.8);
    this.chartGraphics.strokeRoundedRect(cx, cy, cw, ch, 12);

    if (this.priceHistory.length < 2) return;

    const min = Math.min(...this.priceHistory) - 5;
    const max = Math.max(...this.priceHistory) + 5;
    const range = max - min;

    // Grid lines with labels
    this.chartGraphics.lineStyle(1, 0x1a2a3e, 0.6);
    for (let i = 0; i <= 5; i++) {
      const y = cy + 20 + ((ch - 40) / 5) * i;
      this.chartGraphics.moveTo(cx + 20, y);
      this.chartGraphics.lineTo(cx + cw - 20, y);
      this.chartGraphics.strokePath();
    }
    // Vertical grid
    for (let i = 0; i <= 6; i++) {
      const x = cx + 20 + ((cw - 40) / 6) * i;
      this.chartGraphics.moveTo(x, cy + 20);
      this.chartGraphics.lineTo(x, cy + ch - 20);
      this.chartGraphics.strokePath();
    }

    // Compute points
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < this.priceHistory.length; i++) {
      const x = cx + 20 + (i / 29) * (cw - 40);
      const y = cy + ch - 20 - ((this.priceHistory[i] - min) / range) * (ch - 40);
      points.push({ x, y });
    }

    // Area fill under the line
    const isUp = this.priceHistory[this.priceHistory.length - 1] >= this.priceHistory[0];
    const fillColor = isUp ? 0x50c878 : 0xe74c3c;
    this.chartGraphics.fillStyle(fillColor, 0.1);
    this.chartGraphics.beginPath();
    this.chartGraphics.moveTo(points[0].x, cy + ch - 20);
    for (const p of points) {
      this.chartGraphics.lineTo(p.x, p.y);
    }
    this.chartGraphics.lineTo(points[points.length - 1].x, cy + ch - 20);
    this.chartGraphics.closePath();
    this.chartGraphics.fillPath();

    // Price line
    this.chartGraphics.lineStyle(3, isUp ? 0x50c878 : 0xe74c3c, 1);
    this.chartGraphics.beginPath();
    for (let i = 0; i < points.length; i++) {
      if (i === 0) this.chartGraphics.moveTo(points[i].x, points[i].y);
      else this.chartGraphics.lineTo(points[i].x, points[i].y);
    }
    this.chartGraphics.strokePath();

    // Dots on the price line
    for (const p of points) {
      this.chartGraphics.fillStyle(isUp ? 0x50c878 : 0xe74c3c, 1);
      this.chartGraphics.fillCircle(p.x, p.y, 3);
    }

    // Current price dot (larger, with glow)
    if (points.length > 0) {
      const last = points[points.length - 1];
      this.chartGraphics.fillStyle(isUp ? 0x50c878 : 0xe74c3c, 0.3);
      this.chartGraphics.fillCircle(last.x, last.y, 10);
      this.chartGraphics.fillStyle(isUp ? 0x50c878 : 0xe74c3c, 1);
      this.chartGraphics.fillCircle(last.x, last.y, 5);
      this.chartGraphics.fillStyle(0xffffff, 0.8);
      this.chartGraphics.fillCircle(last.x, last.y, 2);
    }
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
    for (const g of this.orderGraphics) g.destroy();
    this.orderTexts = [];
    this.orderGraphics = [];

    let y = 580;
    for (const order of this.orders.slice(-6)) {
      const statusIcon = order.status === 'executed' ? '✓' : '⏳';
      const color = order.status === 'executed' ? '#50c878' : '#aaa';
      const typeLabel = order.type === 'buy'
        ? (this.lang === 'he' ? 'קנייה' : 'Buy')
        : (this.lang === 'he' ? 'מכירה' : 'Sell');

      // Mini row background
      const rowG = this.add.graphics();
      const rowColor = order.status === 'executed'
        ? (order.type === 'buy' ? 0x1a3a2e : 0x3a1a2e)
        : 0x1a2a3e;
      rowG.fillStyle(rowColor, 0.3);
      rowG.fillRoundedRect(1095, y - 4, 370, 26, 4);
      this.orderGraphics.push(rowG);

      const t = this.add.text(1110, y, `${statusIcon} ${typeLabel} @ ₪${order.price}`, {
        fontSize: '18px', color, fontFamily: 'Arial',
      });
      this.orderTexts.push(t);
      y += 32;
    }
  }

  private endGame() {
    this.priceTimer.destroy();
    this.store.completeMiniGame('tradingSim');

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.85);
    overlay.fillRect(0, 0, this.w, this.h);
    overlay.setDepth(90);

    const executed = this.orders.filter(o => o.status === 'executed').length;

    // Results panel
    const panelW = 550;
    const panelH = 300;
    const panelX = this.w / 2 - panelW / 2;
    const panelY = this.h / 2 - panelH / 2 - 20;
    overlay.fillStyle(0x0a1a2e, 0.95);
    overlay.fillRoundedRect(panelX, panelY, panelW, panelH, 20);
    overlay.lineStyle(3, 0xffd700, 0.6);
    overlay.strokeRoundedRect(panelX, panelY, panelW, panelH, 20);

    this.add.text(this.w / 2, panelY + 50,
      this.lang === 'he' ? 'סימולציה הסתיימה!' : 'Simulation Complete!', {
      fontSize: '44px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(100);

    this.add.text(this.w / 2, panelY + 130,
      `${this.lang === 'he' ? 'פקודות שבוצעו:' : 'Orders executed:'} ${executed}/${this.orders.length}`, {
      fontSize: '28px', color: '#ffffff', fontFamily: 'Arial',
    }).setOrigin(0.5).setDepth(100);

    // Progress bar
    const barW = panelW - 80;
    const barX = panelX + 40;
    const barY = panelY + 180;
    overlay.fillStyle(0x1a3a5e, 1);
    overlay.fillRoundedRect(barX, barY, barW, 20, 10);
    if (this.orders.length > 0) {
      const fillW = (executed / this.orders.length) * barW;
      overlay.fillStyle(0x50c878, 1);
      overlay.fillRoundedRect(barX, barY, Math.max(fillW, 10), 20, 10);
    }

    const msg = executed === this.orders.length && this.orders.length > 0
      ? (this.lang === 'he' ? 'כל הפקודות בוצעו!' : 'All orders executed!')
      : (this.lang === 'he' ? 'תרגול מצוין!' : 'Great practice!');
    this.add.text(this.w / 2, panelY + 230, msg, {
      fontSize: '22px', color: '#87ceeb', fontFamily: 'Arial',
    }).setOrigin(0.5).setDepth(100);

    this.createButton(this.w / 2, panelY + panelH + 30,
      this.lang === 'he' ? 'המשך' : 'Continue',
      () => this.goToScene('Credits'),
      200, 50);
  }
}
