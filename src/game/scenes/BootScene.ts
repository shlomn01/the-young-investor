import { BaseScene } from './BaseScene';
import { COLORS } from '../../config/constants';
import { phaserBridge } from '../../utils/phaserBridge';

export class BootScene extends BaseScene {
  constructor() {
    super('Boot');
  }

  preload() {
    // --- Loading bar UI ---
    const barWidth = 600;
    const barHeight = 40;
    const barX = this.w / 2 - barWidth / 2;
    const barY = this.h / 2 + 60;

    const bgBar = this.add.rectangle(this.w / 2, barY + barHeight / 2, barWidth, barHeight, 0x444444);
    bgBar.setOrigin(0.5);

    // Rounded border around the bar
    const barBorder = this.add.graphics();
    barBorder.lineStyle(2, 0xffd700, 0.8);
    barBorder.strokeRoundedRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4, 6);

    const progressBar = this.add.graphics();
    const progressText = this.add.text(this.w / 2, barY + barHeight + 30, '0%', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    const loadingLabel = this.add.text(this.w / 2, barY - 30, '...טוען נכסים', {
      fontSize: '20px',
      color: '#aaaaaa',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(COLORS.PRIMARY, 1);
      progressBar.fillRoundedRect(barX, barY, barWidth * value, barHeight, 4);
      // Add a shine highlight on the bar
      progressBar.fillStyle(0xffffff, 0.15);
      progressBar.fillRect(barX, barY, barWidth * value, barHeight / 3);
      progressText.setText(`${Math.floor(value * 100)}%`);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressText.destroy();
      bgBar.destroy();
      barBorder.destroy();
      loadingLabel.destroy();
    });

    // Title text shown while loading
    this.add.text(this.w / 2, this.h / 2 - 80, 'המשקיע הצעיר', {
      fontSize: '72px',
      color: '#ffd700',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.add.text(this.w / 2, this.h / 2, 'The Young Investor', {
      fontSize: '36px',
      color: '#87ceeb',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // --- Load ALL image assets ---

    // Backgrounds
    this.load.image('bg_title', 'assets/images/backgrounds/title_screen.png');
    this.load.image('bg_hotel_lobby', 'assets/images/backgrounds/hotel_lobby.png');
    this.load.image('bg_hotel_corridor', 'assets/images/backgrounds/hotel_corridor.png');
    this.load.image('bg_guru', 'assets/images/backgrounds/guru_room.png');
    this.load.image('bg_computer_shop', 'assets/images/backgrounds/computer_shop.png');
    this.load.image('bg_cityscape', 'assets/images/backgrounds/cityscape.jpg');
    this.load.image('bg_living_room', 'assets/images/backgrounds/living_room_bg.jpg');
    this.load.image('bg_summer', 'assets/images/backgrounds/summer_bg.png');

    // Characters
    this.load.image('char_cartoon', 'assets/images/characters/cartoon_character.png');
    this.load.image('char_large', 'assets/images/characters/character_large.png');
    this.load.image('char_misc', 'assets/images/characters/character_misc.png');

    // Objects
    this.load.image('obj_meteor', 'assets/images/objects/meteor.png');
    this.load.image('obj_platform', 'assets/images/objects/platform.png');
    this.load.image('obj_synagogue', 'assets/images/objects/synagogue.png');
  }

  create() {
    super.create();

    // --- Main menu screen ---
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

    // Subtitle
    this.add.text(this.w / 2, 290, 'The Young Investor', {
      fontSize: '40px',
      color: '#87ceeb',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Description
    this.add.text(this.w / 2, 360, 'משחק ללימוד השקעות | An Investment Learning Game', {
      fontSize: '22px',
      color: '#aaaaaa',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Animated floating coin symbols
    this.drawCoins();

    // Tell React to show the main menu overlay
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
    const coinPositions = [
      { x: 200, y: 500 },
      { x: 400, y: 650 },
      { x: 1520, y: 500 },
      { x: 1720, y: 650 },
      { x: 300, y: 800 },
      { x: 1620, y: 800 },
    ];

    for (const pos of coinPositions) {
      // Create a container so the circle background and text move together
      const container = this.add.container(pos.x, pos.y);

      // Coin circle background
      const coinGfx = this.add.graphics();
      coinGfx.fillStyle(0xffd700, 0.3);
      coinGfx.fillCircle(0, 0, 25);
      coinGfx.lineStyle(2, 0xffd700, 0.5);
      coinGfx.strokeCircle(0, 0, 25);
      container.add(coinGfx);

      // ₪ symbol text
      const coinText = this.add.text(0, 0, '₪', {
        fontSize: '24px',
        color: '#ffd700',
        fontFamily: 'Arial',
      }).setOrigin(0.5).setAlpha(0.5);
      container.add(coinText);

      // Animate the entire container so both circle and text float together
      this.tweens.add({
        targets: container,
        y: pos.y - 10,
        duration: 2000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }
}
