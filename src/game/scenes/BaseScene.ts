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

    const sceneKey = this.scene.key;
    useGameStore.getState().setCurrentScene(sceneKey);
    phaserBridge.emit('scene-changed', sceneKey);
  }

  goToScene(key: string, data?: Record<string, unknown>) {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(key, data);
    });
  }

  // --- SKY & OUTDOOR BACKGROUNDS ---

  drawSkyBackground(timeOfDay: 'day' | 'sunset' | 'night' = 'day') {
    const g = this.add.graphics();
    const skyColors = {
      day: { top: 0x4a90d9, bottom: 0x87ceeb },
      sunset: { top: 0x2c1654, bottom: 0xff6b35 },
      night: { top: 0x0a0a2e, bottom: 0x1a1a4e },
    };
    const colors = skyColors[timeOfDay];
    const steps = 64;
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const r = Phaser.Math.Linear((colors.top >> 16) & 0xff, (colors.bottom >> 16) & 0xff, t);
      const gr = Phaser.Math.Linear((colors.top >> 8) & 0xff, (colors.bottom >> 8) & 0xff, t);
      const b = Phaser.Math.Linear(colors.top & 0xff, colors.bottom & 0xff, t);
      g.fillStyle((Math.floor(r) << 16) | (Math.floor(gr) << 8) | Math.floor(b), 1);
      g.fillRect(0, (i * this.h) / steps, this.w, this.h / steps + 1);
    }

    // Sun or moon
    if (timeOfDay === 'day') {
      g.fillStyle(0xfff44f, 0.9);
      g.fillCircle(1600, 120, 50);
      g.fillStyle(0xfff44f, 0.2);
      g.fillCircle(1600, 120, 70);
    }

    // Clouds
    if (timeOfDay !== 'night') {
      this.drawCloud(g, 200, 100, 1.2);
      this.drawCloud(g, 700, 150, 0.8);
      this.drawCloud(g, 1200, 80, 1.0);
      this.drawCloud(g, 1700, 180, 0.6);
    }

    return g;
  }

  private drawCloud(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number) {
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(x, y, 30 * scale);
    g.fillCircle(x + 25 * scale, y - 10 * scale, 25 * scale);
    g.fillCircle(x + 50 * scale, y, 30 * scale);
    g.fillCircle(x + 25 * scale, y + 5 * scale, 22 * scale);
    g.fillCircle(x - 10 * scale, y + 5 * scale, 20 * scale);
  }

  // Legacy gradient bg - now enhanced
  drawGradientBg(topColor: number = COLORS.BG_LIGHT, bottomColor: number = COLORS.BG_DARK) {
    const g = this.add.graphics();
    const steps = 64;
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const r = Phaser.Math.Linear((topColor >> 16) & 0xff, (bottomColor >> 16) & 0xff, t);
      const gr = Phaser.Math.Linear((topColor >> 8) & 0xff, (bottomColor >> 8) & 0xff, t);
      const b = Phaser.Math.Linear(topColor & 0xff, bottomColor & 0xff, t);
      g.fillStyle((Math.floor(r) << 16) | (Math.floor(gr) << 8) | Math.floor(b), 1);
      g.fillRect(0, (i * this.h) / steps, this.w, this.h / steps + 1);
    }
    return g;
  }

  // --- INTERIOR BACKGROUNDS ---

  drawInteriorRoom(wallColor: number, floorColor: number, options?: {
    floorHeight?: number;
    baseboard?: boolean;
    ceiling?: boolean;
    woodFloor?: boolean;
  }) {
    const g = this.add.graphics();
    const floorH = options?.floorHeight ?? 180;

    // Wall with subtle gradient
    const wallSteps = 20;
    for (let i = 0; i < wallSteps; i++) {
      const t = i / wallSteps;
      const darken = 1 - t * 0.08;
      const r = Math.floor(((wallColor >> 16) & 0xff) * darken);
      const gr = Math.floor(((wallColor >> 8) & 0xff) * darken);
      const b = Math.floor((wallColor & 0xff) * darken);
      g.fillStyle((r << 16) | (gr << 8) | b, 1);
      g.fillRect(0, (i * (this.h - floorH)) / wallSteps, this.w, (this.h - floorH) / wallSteps + 1);
    }

    // Floor
    if (options?.woodFloor) {
      // Wood plank floor
      const plankColors = [floorColor, floorColor - 0x111111, floorColor + 0x080808];
      for (let y = this.h - floorH; y < this.h; y += 20) {
        const idx = Math.floor((y - (this.h - floorH)) / 20) % plankColors.length;
        g.fillStyle(plankColors[idx], 1);
        g.fillRect(0, y, this.w, 20);
        g.fillStyle(0x000000, 0.05);
        g.fillRect(0, y, this.w, 1);
      }
    } else {
      g.fillStyle(floorColor, 1);
      g.fillRect(0, this.h - floorH, this.w, floorH);
    }

    // Baseboard
    if (options?.baseboard !== false) {
      g.fillStyle(0x5c3d2e, 1);
      g.fillRect(0, this.h - floorH - 4, this.w, 12);
    }

    // Ceiling trim
    if (options?.ceiling) {
      g.fillStyle(0xf5f5f5, 1);
      g.fillRect(0, 0, this.w, 8);
      g.fillStyle(0xdddddd, 1);
      g.fillRect(0, 8, this.w, 4);
    }

    return g;
  }

  drawWindow(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number) {
    // Outer frame
    g.fillStyle(0x8b7355, 1);
    g.fillRect(x - 6, y - 6, w + 12, h + 12);
    // Glass
    g.fillStyle(0xa8d8ea, 0.7);
    g.fillRect(x, y, w, h);
    // Cross frame
    g.fillStyle(0x8b7355, 1);
    g.fillRect(x + w / 2 - 3, y, 6, h);
    g.fillRect(x, y + h / 2 - 3, w, 6);
    // Sky reflection
    g.fillStyle(0xffffff, 0.15);
    g.fillRect(x + 4, y + 4, w / 2 - 8, h / 2 - 8);
    // Curtains
    g.fillStyle(0xc9302c, 0.4);
    g.fillRect(x, y, 20, h);
    g.fillRect(x + w - 20, y, 20, h);
  }

  drawPictureFrame(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, imageColor: number) {
    g.fillStyle(0x8b6914, 1);
    g.fillRect(x - 4, y - 4, w + 8, h + 8);
    g.fillStyle(imageColor, 1);
    g.fillRect(x, y, w, h);
    g.fillStyle(0xffffff, 0.1);
    g.fillRect(x + 2, y + 2, w / 3, h / 3);
  }

  // --- BUILDINGS ---

  drawBuilding(x: number, y: number, width: number, height: number, color: number, label?: string) {
    const g = this.add.graphics();

    // Shadow
    g.fillStyle(0x000000, 0.15);
    g.fillRect(x + 8, y + 8, width, height);

    // Main building body
    g.fillStyle(color, 1);
    g.fillRect(x, y, width, height);

    // Brick texture - subtle horizontal lines
    g.fillStyle(0x000000, 0.04);
    for (let row = 0; row < height; row += 16) {
      g.fillRect(x, y + row, width, 1);
      const offset = (row / 16) % 2 === 0 ? 0 : width / 6;
      for (let col = offset; col < width; col += width / 3) {
        g.fillRect(x + col, y + row, 1, 16);
      }
    }

    // Roof overhang
    g.fillStyle(0x654321, 1);
    g.fillRect(x - 8, y - 12, width + 16, 14);
    g.fillStyle(0x543210, 1);
    g.fillRect(x - 4, y - 16, width + 8, 6);

    // Door with frame
    const doorW = 44;
    const doorH = 65;
    const doorX = x + width / 2 - doorW / 2;
    const doorY = y + height - doorH;
    g.fillStyle(0x5c3d2e, 1);
    g.fillRect(doorX - 4, doorY - 4, doorW + 8, doorH + 4);
    g.fillStyle(0x8b6914, 1);
    g.fillRect(doorX, doorY, doorW, doorH);
    // Door panels
    g.fillStyle(0x7a5c10, 1);
    g.fillRect(doorX + 4, doorY + 4, doorW / 2 - 6, doorH / 2 - 6);
    g.fillRect(doorX + doorW / 2 + 2, doorY + 4, doorW / 2 - 6, doorH / 2 - 6);
    g.fillRect(doorX + 4, doorY + doorH / 2 + 2, doorW / 2 - 6, doorH / 2 - 6);
    g.fillRect(doorX + doorW / 2 + 2, doorY + doorH / 2 + 2, doorW / 2 - 6, doorH / 2 - 6);
    // Door handle
    g.fillStyle(0xffd700, 1);
    g.fillCircle(doorX + doorW - 10, doorY + doorH / 2, 3);

    // Windows with frames and shutters
    const winW = 36;
    const winH = 42;
    const cols = Math.max(2, Math.floor(width / 70));
    const rows = Math.max(1, Math.floor(height / 100));
    const padX = (width - cols * winW) / (cols + 1);
    const padY = 24;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const wx = x + padX + col * (winW + padX);
        const wy = y + padY + row * (winH + padY);
        if (wy + winH > doorY - 10 && wx + winW > doorX - 10 && wx < doorX + doorW + 10) continue;
        // Window frame
        g.fillStyle(0xf5f5f0, 1);
        g.fillRect(wx - 3, wy - 3, winW + 6, winH + 6);
        // Glass
        g.fillStyle(0x87ceeb, 0.85);
        g.fillRect(wx, wy, winW, winH);
        // Muntins
        g.fillStyle(0xf5f5f0, 1);
        g.fillRect(wx + winW / 2 - 1, wy, 2, winH);
        g.fillRect(wx, wy + winH / 2 - 1, winW, 2);
        // Reflection
        g.fillStyle(0xffffff, 0.2);
        g.fillRect(wx + 2, wy + 2, winW / 2 - 4, winH / 2 - 4);
        // Sill
        g.fillStyle(0xd0d0d0, 1);
        g.fillRect(wx - 4, wy + winH + 2, winW + 8, 4);
      }
    }

    // Label sign
    if (label) {
      const signW = Math.min(width - 20, label.length * 14 + 30);
      const signX = x + width / 2 - signW / 2;
      // Sign background
      g.fillStyle(0x2c2c2c, 0.85);
      g.fillRoundedRect(signX, y - 40, signW, 28, 6);
      g.lineStyle(2, 0xffd700, 1);
      g.strokeRoundedRect(signX, y - 40, signW, 28, 6);

      this.add.text(x + width / 2, y - 26, label, {
        fontSize: '18px',
        color: '#ffd700',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      }).setOrigin(0.5);
    }

    return g;
  }

  // --- TREES & NATURE ---

  drawTree(g: Phaser.GameObjects.Graphics, x: number, y: number, scale = 1) {
    // Trunk
    g.fillStyle(0x6b4226, 1);
    g.fillRect(x - 8 * scale, y - 40 * scale, 16 * scale, 50 * scale);
    // Foliage layers
    g.fillStyle(0x2d8a4e, 1);
    g.fillCircle(x, y - 60 * scale, 28 * scale);
    g.fillStyle(0x34a853, 1);
    g.fillCircle(x - 15 * scale, y - 50 * scale, 22 * scale);
    g.fillCircle(x + 15 * scale, y - 50 * scale, 22 * scale);
    g.fillStyle(0x3cba5f, 1);
    g.fillCircle(x, y - 70 * scale, 18 * scale);
  }

  drawBush(g: Phaser.GameObjects.Graphics, x: number, y: number, scale = 1) {
    g.fillStyle(0x2d8a4e, 0.9);
    g.fillCircle(x, y, 18 * scale);
    g.fillCircle(x - 14 * scale, y + 4 * scale, 14 * scale);
    g.fillCircle(x + 14 * scale, y + 4 * scale, 14 * scale);
    g.fillStyle(0x3cba5f, 0.7);
    g.fillCircle(x, y - 6 * scale, 10 * scale);
  }

  drawLampPost(g: Phaser.GameObjects.Graphics, x: number, y: number) {
    // Pole
    g.fillStyle(0x333333, 1);
    g.fillRect(x - 3, y - 100, 6, 100);
    // Arm
    g.fillStyle(0x333333, 1);
    g.fillRect(x - 15, y - 102, 30, 5);
    // Lamp
    g.fillStyle(0xfff9c4, 0.9);
    g.fillCircle(x, y - 108, 10);
    // Glow
    g.fillStyle(0xfff9c4, 0.1);
    g.fillCircle(x, y - 108, 30);
  }

  // --- CHARACTERS ---

  drawCharacterPlaceholder(x: number, y: number, color: number, name?: string): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const g = this.add.graphics();
    container.add(g);

    // Determine character colors
    const skinColor = 0xf5c6a0;
    const shirtColor = color;
    const pantsColor = 0x3b5998;
    const hairColor = this.getHairColor(color);
    const shoeColor = 0x333333;

    // Shadow
    g.fillStyle(0x000000, 0.15);
    g.fillEllipse(0, 32, 44, 12);

    // Legs
    g.fillStyle(pantsColor, 1);
    g.fillRect(-12, 10, 10, 22);
    g.fillRect(2, 10, 10, 22);
    // Shoes
    g.fillStyle(shoeColor, 1);
    g.fillRoundedRect(-14, 30, 14, 6, 2);
    g.fillRoundedRect(0, 30, 14, 6, 2);

    // Body/shirt
    g.fillStyle(shirtColor, 1);
    g.fillRoundedRect(-18, -22, 36, 34, 6);
    // Shirt detail - collar
    g.fillStyle(Phaser.Display.Color.IntegerToColor(shirtColor).brighten(20).color, 1);
    g.fillRect(-8, -22, 16, 6);

    // Arms
    g.fillStyle(skinColor, 1);
    g.fillRoundedRect(-24, -18, 8, 24, 3);
    g.fillRoundedRect(16, -18, 8, 24, 3);

    // Hands
    g.fillStyle(skinColor, 1);
    g.fillCircle(-20, 8, 5);
    g.fillCircle(20, 8, 5);

    // Neck
    g.fillStyle(skinColor, 1);
    g.fillRect(-4, -28, 8, 8);

    // Head
    g.fillStyle(skinColor, 1);
    g.fillCircle(0, -40, 18);

    // Hair
    g.fillStyle(hairColor, 1);
    g.fillCircle(0, -50, 16);
    g.fillRect(-16, -54, 32, 12);
    g.fillStyle(hairColor, 1);
    g.fillRect(-18, -48, 4, 10);
    g.fillRect(14, -48, 4, 10);

    // Face
    // Eyes
    g.fillStyle(0xffffff, 1);
    g.fillCircle(-7, -42, 4);
    g.fillCircle(7, -42, 4);
    g.fillStyle(0x2c2c2c, 1);
    g.fillCircle(-6, -42, 2.5);
    g.fillCircle(8, -42, 2.5);
    // Eye shine
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(-5, -43, 1);
    g.fillCircle(9, -43, 1);
    // Eyebrows
    g.fillStyle(hairColor, 0.7);
    g.fillRect(-10, -48, 8, 2);
    g.fillRect(4, -48, 8, 2);
    // Smile
    g.lineStyle(2, 0xc08060, 1);
    g.beginPath();
    g.arc(0, -36, 6, 0.2, Math.PI - 0.2, false);
    g.strokePath();
    // Nose
    g.fillStyle(0xe0a880, 1);
    g.fillCircle(0, -38, 2);

    if (name) {
      const nameBg = this.add.graphics();
      const textObj = this.add.text(0, -72, name, {
        fontSize: '15px',
        color: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      const bounds = textObj.getBounds();
      nameBg.fillStyle(0x000000, 0.5);
      nameBg.fillRoundedRect(bounds.x - 6 - x, bounds.y - 3 - y, bounds.width + 12, bounds.height + 6, 8);
      container.add(nameBg);
      container.add(textObj);
    }

    return container;
  }

  private getHairColor(characterColor: number): number {
    // Different hair colors based on character role color
    if (characterColor === COLORS.PRIMARY) return 0x3d2b1f; // Player - dark brown
    if (characterColor === 0x2f4f4f) return 0x1a1a1a; // Dark NPCs - black
    if (characterColor === 0xffd700) return 0xc0c0c0; // Guru - silver/gray
    if (characterColor === 0x8b0000) return 0x8b4513; // Teacher - auburn
    if (characterColor === 0x800080) return 0x4a0080; // Purple NPC - dark purple
    return 0x5c3317; // Default brown
  }

  // --- BUTTONS ---

  createButton(
    x: number,
    y: number,
    text: string,
    onClick: () => void,
    width = 200,
    height = 50
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // Shadow
    const shadow = this.add.rectangle(3, 3, width, height, 0x000000, 0.2);
    shadow.setStrokeStyle(0);
    container.add(shadow);

    // Button background with rounded appearance
    const bg = this.add.rectangle(0, 0, width, height, COLORS.PRIMARY, 1)
      .setInteractive({ useHandCursor: true });
    container.add(bg);

    // Top highlight
    const highlight = this.add.rectangle(0, -height / 4, width - 4, height / 2 - 2, 0xffffff, 0.1);
    container.add(highlight);

    // Border
    const border = this.add.rectangle(0, 0, width, height);
    border.setStrokeStyle(2, 0xffffff, 0.3);
    border.setFillStyle(0x000000, 0);
    container.add(border);

    const label = this.add.text(0, 0, text, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    container.add(label);

    bg.on('pointerover', () => {
      bg.setFillStyle(COLORS.SECONDARY);
      container.setScale(1.05);
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(COLORS.PRIMARY);
      container.setScale(1.0);
    });
    bg.on('pointerdown', onClick);

    return container;
  }

  // --- DIALOGUE ---

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

  fadeIn(duration = 300) {
    this.cameras.main.fadeIn(duration, 0, 0, 0);
  }
}
