import Phaser from 'phaser';
import { useGameStore } from '../../store/gameStore';
import { phaserBridge } from '../../utils/phaserBridge';
import i18n from '../../i18n';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../../config/constants';

export abstract class BaseScene extends Phaser.Scene {
  protected cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  protected wasd!: Record<string, Phaser.Input.Keyboard.Key>;

  constructor(key: string) {
    super({ key });
  }

  get store() {
    return useGameStore.getState();
  }

  get lang(): 'he' | 'en' {
    return this.store.language;
  }

  get w() {
    return GAME_WIDTH;
  }

  get h() {
    return GAME_HEIGHT;
  }

  t(key: string, options?: Record<string, unknown>): string {
    return i18n.t(key, options) as string;
  }

  create() {
    // Setup keyboard
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
        W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        SPACE: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        ENTER: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
      };
    }

    // Notify React of scene change
    const sceneKey = this.scene.key;
    useGameStore.getState().setCurrentScene(sceneKey);
    phaserBridge.emit('scene-changed', sceneKey);
  }

  // Transition to another scene with optional data
  goToScene(key: string, data?: Record<string, unknown>) {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(key, data);
    });
  }

  // Draw a gradient background (placeholder)
  drawGradientBg(topColor: number = COLORS.BG_LIGHT, bottomColor: number = COLORS.BG_DARK) {
    const graphics = this.add.graphics();
    const steps = 32;
    const stepHeight = this.h / steps;

    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const r = Phaser.Math.Linear((topColor >> 16) & 0xff, (bottomColor >> 16) & 0xff, t);
      const g = Phaser.Math.Linear((topColor >> 8) & 0xff, (bottomColor >> 8) & 0xff, t);
      const b = Phaser.Math.Linear(topColor & 0xff, bottomColor & 0xff, t);
      const color = (Math.floor(r) << 16) | (Math.floor(g) << 8) | Math.floor(b);
      graphics.fillStyle(color, 1);
      graphics.fillRect(0, i * stepHeight, this.w, stepHeight + 1);
    }

    return graphics;
  }

  // Draw a simple rectangle "building" placeholder
  drawBuilding(x: number, y: number, width: number, height: number, color: number, label?: string) {
    const graphics = this.add.graphics();
    // Building body
    graphics.fillStyle(color, 1);
    graphics.fillRect(x, y, width, height);
    // Door
    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(x + width / 2 - 20, y + height - 60, 40, 60);
    // Windows
    graphics.fillStyle(0x87ceeb, 0.8);
    const windowSize = 30;
    const windowPad = 20;
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        graphics.fillRect(
          x + windowPad + col * (windowSize + windowPad),
          y + windowPad + row * (windowSize + windowPad),
          windowSize,
          windowSize
        );
      }
    }

    if (label) {
      this.add.text(x + width / 2, y - 10, label, {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'Arial',
      }).setOrigin(0.5, 1);
    }

    return graphics;
  }

  // Create a simple colored rectangle as placeholder character
  drawCharacterPlaceholder(x: number, y: number, color: number, name?: string): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // Body
    const body = this.add.rectangle(0, 0, 40, 60, color);
    container.add(body);

    // Head
    const head = this.add.circle(0, -40, 15, color);
    container.add(head);

    // Eyes
    const leftEye = this.add.circle(-5, -43, 3, 0xffffff);
    const rightEye = this.add.circle(5, -43, 3, 0xffffff);
    const leftPupil = this.add.circle(-5, -43, 1.5, 0x000000);
    const rightPupil = this.add.circle(5, -43, 1.5, 0x000000);
    container.add([leftEye, rightEye, leftPupil, rightPupil]);

    if (name) {
      const nameText = this.add.text(0, -65, name, {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'Arial',
      }).setOrigin(0.5);
      container.add(nameText);
    }

    return container;
  }

  // Create an interactive button
  createButton(
    x: number,
    y: number,
    text: string,
    onClick: () => void,
    width = 200,
    height = 50
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, width, height, COLORS.PRIMARY, 1)
      .setInteractive({ useHandCursor: true });
    const label = this.add.text(0, 0, text, {
      fontSize: '22px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    container.add([bg, label]);

    bg.on('pointerover', () => bg.setFillStyle(COLORS.SECONDARY));
    bg.on('pointerout', () => bg.setFillStyle(COLORS.PRIMARY));
    bg.on('pointerdown', onClick);

    return container;
  }

  // Show text with auto-typing via React bridge
  showDialogue(speaker: string, text: string): Promise<void> {
    return new Promise((resolve) => {
      phaserBridge.emit('show-dialogue', {
        speaker,
        text,
        onComplete: resolve,
      });
      phaserBridge.once('dialogue-dismissed', () => {
        resolve();
      });
    });
  }

  hideDialogue() {
    phaserBridge.emit('hide-dialogue');
  }

  // Fade in on scene start
  fadeIn(duration = 300) {
    this.cameras.main.fadeIn(duration, 0, 0, 0);
  }
}
