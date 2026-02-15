import { BaseScene } from './BaseScene';
import { COLORS } from '../../config/constants';
import { phaserBridge } from '../../utils/phaserBridge';

export class BootScene extends BaseScene {
  constructor() {
    super('Boot');
  }

  preload() {
    // Loading bar
    const barWidth = 600;
    const barHeight = 40;
    const barX = this.w / 2 - barWidth / 2;
    const barY = this.h / 2 + 60;

    const bgBar = this.add.rectangle(this.w / 2, barY + barHeight / 2, barWidth, barHeight, 0x444444);
    bgBar.setOrigin(0.5);

    const progressBar = this.add.graphics();
    const progressText = this.add.text(this.w / 2, barY + barHeight + 30, '0%', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(COLORS.PRIMARY, 1);
      progressBar.fillRect(barX, barY, barWidth * value, barHeight);
      progressText.setText(`${Math.floor(value * 100)}%`);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressText.destroy();
      bgBar.destroy();
    });

    // Title text while loading
    this.add.text(this.w / 2, this.h / 2 - 80, 'המשקיע הצעיר', {
      fontSize: '72px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(this.w / 2, this.h / 2, 'The Young Investor', {
      fontSize: '36px',
      color: '#cccccc',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Placeholder: load a small dummy asset to make the loader work
    // In later phases, we'll load actual assets here
    // For now, create a programmatic loading simulation
    for (let i = 0; i < 10; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      this.textures.addCanvas(`_dummy_${i}`, canvas);
    }
  }

  create() {
    super.create();

    // Show main menu
    this.drawGradientBg(0x1a1a2e, 0x16213e);

    // Title
    this.add.text(this.w / 2, 200, 'המשקיע הצעיר', {
      fontSize: '80px',
      color: '#ffd700',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(this.w / 2, 290, 'The Young Investor', {
      fontSize: '40px',
      color: '#87ceeb',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(this.w / 2, 360, 'משחק ללימוד השקעות | An Investment Learning Game', {
      fontSize: '22px',
      color: '#aaaaaa',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Decorative coins
    this.drawCoins();

    // Buttons
    phaserBridge.emit('show-main-menu');

    // Listen for game start from React
    phaserBridge.once('start-game', () => {
      phaserBridge.emit('hide-main-menu');
      this.goToScene('Street', { streetIndex: 0 });
    });

    phaserBridge.once('continue-game', () => {
      phaserBridge.emit('hide-main-menu');
      const savedScene = this.store.currentScene;
      if (savedScene && savedScene !== 'Boot') {
        this.goToScene(savedScene);
      } else {
        this.goToScene('Street', { streetIndex: 0 });
      }
    });

    this.fadeIn(500);
  }

  private drawCoins() {
    const graphics = this.add.graphics();
    // Draw decorative coin icons
    const coinPositions = [
      { x: 200, y: 500 }, { x: 400, y: 650 }, { x: 1520, y: 500 },
      { x: 1720, y: 650 }, { x: 300, y: 800 }, { x: 1620, y: 800 },
    ];

    for (const pos of coinPositions) {
      // Coin circle
      graphics.fillStyle(0xffd700, 0.3);
      graphics.fillCircle(pos.x, pos.y, 25);
      graphics.lineStyle(2, 0xffd700, 0.5);
      graphics.strokeCircle(pos.x, pos.y, 25);
      // ₪ symbol
      this.add.text(pos.x, pos.y, '₪', {
        fontSize: '24px',
        color: '#ffd700',
        fontFamily: 'Arial',
      }).setOrigin(0.5).setAlpha(0.5);
    }

    // Animate coins floating
    for (const pos of coinPositions) {
      this.tweens.add({
        targets: { y: pos.y },
        y: pos.y - 10,
        duration: 2000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }
}
