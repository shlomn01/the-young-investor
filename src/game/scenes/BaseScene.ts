import Phaser from 'phaser';
import { useGameStore } from '../../store/gameStore';
import { phaserBridge } from '../../utils/phaserBridge';
import { audioManager } from '../../utils/audioManager';
import i18n from '../../i18n';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, PHASER_FONTS } from '../../config/constants';

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

  get isRtl(): boolean {
    return this.lang === 'he';
  }

  /** Get the appropriate font family for current language */
  get fontFamily(): string {
    return this.lang === 'he' ? PHASER_FONTS.he : PHASER_FONTS.en;
  }

  /** Get monospace font for financial data */
  get monoFont(): string {
    return PHASER_FONTS.mono;
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

    // Register this scene with audio manager
    audioManager.setScene(this);
  }

  // --- SCENE TRANSITIONS ---

  goToScene(key: string, data?: Record<string, unknown>) {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(key, data);
    });
  }

  /** Slide transition - good for street-to-street */
  slideToScene(key: string, direction: 'left' | 'right' = 'left', data?: Record<string, unknown>) {
    const cam = this.cameras.main;
    const targetX = direction === 'left' ? -this.w : this.w;
    this.tweens.add({
      targets: cam,
      scrollX: targetX,
      duration: 400,
      ease: 'Power2',
      onComplete: () => {
        this.scene.start(key, data);
      },
    });
  }

  /** Zoom transition - good for entering buildings */
  zoomToScene(key: string, focusX: number, focusY: number, data?: Record<string, unknown>) {
    const cam = this.cameras.main;
    this.tweens.add({
      targets: cam,
      zoom: 2.5,
      scrollX: focusX - this.w / 2,
      scrollY: focusY - this.h / 2,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        cam.fadeOut(200, 0, 0, 0);
        cam.once('camerafadeoutcomplete', () => {
          cam.zoom = 1;
          cam.scrollX = 0;
          cam.scrollY = 0;
          this.scene.start(key, data);
        });
      },
    });
  }

  // --- BACKGROUND HELPERS ---

  /**
   * Try to display a pre-loaded background image.
   * Returns true if image was displayed, false if fallback needed.
   */
  tryShowBackground(imageKey: string, darkenAlpha = 0): boolean {
    if (this.textures.exists(imageKey) && this.textures.get(imageKey).key !== '__MISSING') {
      this.add.image(this.w / 2, this.h / 2, imageKey).setDisplaySize(this.w, this.h);
      if (darkenAlpha > 0) {
        this.add.rectangle(this.w / 2, this.h / 2, this.w, this.h, 0x000000, darkenAlpha);
      }
      return true;
    }
    return false;
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

    if (timeOfDay === 'day') {
      g.fillStyle(0xfff44f, 0.9);
      g.fillCircle(1600, 120, 50);
      g.fillStyle(0xfff44f, 0.2);
      g.fillCircle(1600, 120, 70);
    }

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

    if (options?.woodFloor) {
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

    if (options?.baseboard !== false) {
      g.fillStyle(0x5c3d2e, 1);
      g.fillRect(0, this.h - floorH - 4, this.w, 12);
    }

    if (options?.ceiling) {
      g.fillStyle(0xf5f5f5, 1);
      g.fillRect(0, 0, this.w, 8);
      g.fillStyle(0xdddddd, 1);
      g.fillRect(0, 8, this.w, 4);
    }

    return g;
  }

  drawWindow(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number) {
    g.fillStyle(0x8b7355, 1);
    g.fillRect(x - 6, y - 6, w + 12, h + 12);
    g.fillStyle(0xa8d8ea, 0.7);
    g.fillRect(x, y, w, h);
    g.fillStyle(0x8b7355, 1);
    g.fillRect(x + w / 2 - 3, y, 6, h);
    g.fillRect(x, y + h / 2 - 3, w, 6);
    g.fillStyle(0xffffff, 0.15);
    g.fillRect(x + 4, y + 4, w / 2 - 8, h / 2 - 8);
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

    g.fillStyle(0x000000, 0.15);
    g.fillRect(x + 8, y + 8, width, height);

    g.fillStyle(color, 1);
    g.fillRect(x, y, width, height);

    g.fillStyle(0x000000, 0.04);
    for (let row = 0; row < height; row += 16) {
      g.fillRect(x, y + row, width, 1);
      const offset = (row / 16) % 2 === 0 ? 0 : width / 6;
      for (let col = offset; col < width; col += width / 3) {
        g.fillRect(x + col, y + row, 1, 16);
      }
    }

    g.fillStyle(0x654321, 1);
    g.fillRect(x - 8, y - 12, width + 16, 14);
    g.fillStyle(0x543210, 1);
    g.fillRect(x - 4, y - 16, width + 8, 6);

    const doorW = 44;
    const doorH = 65;
    const doorX = x + width / 2 - doorW / 2;
    const doorY = y + height - doorH;
    g.fillStyle(0x5c3d2e, 1);
    g.fillRect(doorX - 4, doorY - 4, doorW + 8, doorH + 4);
    g.fillStyle(0x8b6914, 1);
    g.fillRect(doorX, doorY, doorW, doorH);
    g.fillStyle(0x7a5c10, 1);
    g.fillRect(doorX + 4, doorY + 4, doorW / 2 - 6, doorH / 2 - 6);
    g.fillRect(doorX + doorW / 2 + 2, doorY + 4, doorW / 2 - 6, doorH / 2 - 6);
    g.fillRect(doorX + 4, doorY + doorH / 2 + 2, doorW / 2 - 6, doorH / 2 - 6);
    g.fillRect(doorX + doorW / 2 + 2, doorY + doorH / 2 + 2, doorW / 2 - 6, doorH / 2 - 6);
    g.fillStyle(0xffd700, 1);
    g.fillCircle(doorX + doorW - 10, doorY + doorH / 2, 3);

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
        g.fillStyle(0xf5f5f0, 1);
        g.fillRect(wx - 3, wy - 3, winW + 6, winH + 6);
        g.fillStyle(0x87ceeb, 0.85);
        g.fillRect(wx, wy, winW, winH);
        g.fillStyle(0xf5f5f0, 1);
        g.fillRect(wx + winW / 2 - 1, wy, 2, winH);
        g.fillRect(wx, wy + winH / 2 - 1, winW, 2);
        g.fillStyle(0xffffff, 0.2);
        g.fillRect(wx + 2, wy + 2, winW / 2 - 4, winH / 2 - 4);
        g.fillStyle(0xd0d0d0, 1);
        g.fillRect(wx - 4, wy + winH + 2, winW + 8, 4);
      }
    }

    if (label) {
      const signW = Math.min(width - 20, label.length * 14 + 30);
      const signX = x + width / 2 - signW / 2;
      g.fillStyle(0x2c2c2c, 0.85);
      g.fillRoundedRect(signX, y - 40, signW, 28, 6);
      g.lineStyle(2, 0xffd700, 1);
      g.strokeRoundedRect(signX, y - 40, signW, 28, 6);

      this.add.text(x + width / 2, y - 26, label, {
        fontSize: '18px',
        color: '#ffd700',
        fontFamily: this.fontFamily,
        fontStyle: 'bold',
        rtl: this.isRtl,
      }).setOrigin(0.5);
    }

    return g;
  }

  // --- TREES & NATURE ---

  drawTree(g: Phaser.GameObjects.Graphics, x: number, y: number, scale = 1) {
    g.fillStyle(0x6b4226, 1);
    g.fillRect(x - 8 * scale, y - 40 * scale, 16 * scale, 50 * scale);
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
    g.fillStyle(0x333333, 1);
    g.fillRect(x - 3, y - 100, 6, 100);
    g.fillStyle(0x333333, 1);
    g.fillRect(x - 15, y - 102, 30, 5);
    g.fillStyle(0xfff9c4, 0.9);
    g.fillCircle(x, y - 108, 10);
    g.fillStyle(0xfff9c4, 0.1);
    g.fillCircle(x, y - 108, 30);
  }

  // --- CHARACTERS (LPC Sprites) ---

  /**
   * Create an animated character sprite from LPC spritesheets.
   * 128x128 per frame (upgraded from 64x64).
   * Walk: 1024x512 = 8 cols × 4 rows
   * Idle: 384x512 = 3 cols × 4 rows
   * Row order: up(0), left(1), down(2), right(3)
   *
   * @param charKey - character spritesheet key (e.g. 'player', 'npc_dad')
   * @param x - world X position
   * @param y - world Y position
   * @param scale - display scale (default 1 = 128px tall with new sprites)
   * @param name - optional name label above character
   */
  createCharacterSprite(
    charKey: string,
    x: number,
    y: number,
    scale = 1,
    name?: string
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const walkKey = `${charKey}_walk`;
    const idleKey = `${charKey}_idle`;
    const hasSprite = this.textures.exists(walkKey);

    if (!hasSprite) {
      return this.drawCharacterPlaceholder(x, y, COLORS.PRIMARY, name);
    }

    const sprite = this.add.sprite(0, 0, idleKey).setScale(scale);
    sprite.setOrigin(0.5, 0.75);
    container.add(sprite);

    this.registerCharacterAnims(charKey);

    sprite.play(`${charKey}_idle_down`);

    if (name) {
      const nameTag = this.add.text(0, -64 * scale - 10, name, {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: this.fontFamily,
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3,
        rtl: this.isRtl,
      }).setOrigin(0.5);
      container.add(nameTag);
    }

    const shadow = this.add.ellipse(0, 4, 40 * scale, 12 * scale, 0x000000, 0.2);
    container.addAt(shadow, 0);

    container.setData('sprite', sprite);
    container.setData('charKey', charKey);

    return container;
  }

  /**
   * Register walk/idle animations for a character.
   * Supports both 64x64 and 128x128 spritesheets.
   */
  private registerCharacterAnims(charKey: string) {
    const walkKey = `${charKey}_walk`;
    const idleKey = `${charKey}_idle`;

    const directions = ['up', 'left', 'down', 'right'];

    if (this.textures.exists(walkKey) && !this.anims.exists(`${charKey}_walk_down`)) {
      for (let dir = 0; dir < 4; dir++) {
        this.anims.create({
          key: `${charKey}_walk_${directions[dir]}`,
          frames: this.anims.generateFrameNumbers(walkKey, {
            start: dir * 8,
            end: dir * 8 + 7,
          }),
          frameRate: 10,
          repeat: -1,
        });
      }
    }

    if (this.textures.exists(idleKey) && !this.anims.exists(`${charKey}_idle_down`)) {
      for (let dir = 0; dir < 4; dir++) {
        this.anims.create({
          key: `${charKey}_idle_${directions[dir]}`,
          frames: this.anims.generateFrameNumbers(idleKey, {
            start: dir * 3,
            end: dir * 3 + 2,
          }),
          frameRate: 4,
          repeat: -1,
        });
      }
    }
  }

  /**
   * Create a static NPC character with idle animation
   */
  createNPC(
    charKey: string,
    x: number,
    y: number,
    name?: string,
    direction: 'up' | 'left' | 'down' | 'right' = 'down',
    scale = 1
  ): Phaser.GameObjects.Container {
    const container = this.createCharacterSprite(charKey, x, y, scale, name);
    const sprite = container.getData('sprite') as Phaser.GameObjects.Sprite;
    if (sprite && this.anims.exists(`${charKey}_idle_${direction}`)) {
      sprite.play(`${charKey}_idle_${direction}`);
    }
    return container;
  }

  // --- CHARACTERS (Programmatic Fallback) ---

  drawCharacterPlaceholder(x: number, y: number, color: number, name?: string): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const g = this.add.graphics();
    container.add(g);

    const skinColor = 0xf5c6a0;
    const shirtColor = color;
    const pantsColor = 0x3b5998;
    const hairColor = this.getHairColor(color);
    const shoeColor = 0x333333;

    g.fillStyle(0x000000, 0.15);
    g.fillEllipse(0, 32, 44, 12);

    g.fillStyle(pantsColor, 1);
    g.fillRect(-12, 10, 10, 22);
    g.fillRect(2, 10, 10, 22);
    g.fillStyle(shoeColor, 1);
    g.fillRoundedRect(-14, 30, 14, 6, 2);
    g.fillRoundedRect(0, 30, 14, 6, 2);

    g.fillStyle(shirtColor, 1);
    g.fillRoundedRect(-18, -22, 36, 34, 6);
    g.fillStyle(Phaser.Display.Color.IntegerToColor(shirtColor).brighten(20).color, 1);
    g.fillRect(-8, -22, 16, 6);

    g.fillStyle(skinColor, 1);
    g.fillRoundedRect(-24, -18, 8, 24, 3);
    g.fillRoundedRect(16, -18, 8, 24, 3);

    g.fillStyle(skinColor, 1);
    g.fillCircle(-20, 8, 5);
    g.fillCircle(20, 8, 5);

    g.fillStyle(skinColor, 1);
    g.fillRect(-4, -28, 8, 8);

    g.fillStyle(skinColor, 1);
    g.fillCircle(0, -40, 18);

    g.fillStyle(hairColor, 1);
    g.fillCircle(0, -50, 16);
    g.fillRect(-16, -54, 32, 12);
    g.fillStyle(hairColor, 1);
    g.fillRect(-18, -48, 4, 10);
    g.fillRect(14, -48, 4, 10);

    g.fillStyle(0xffffff, 1);
    g.fillCircle(-7, -42, 4);
    g.fillCircle(7, -42, 4);
    g.fillStyle(0x2c2c2c, 1);
    g.fillCircle(-6, -42, 2.5);
    g.fillCircle(8, -42, 2.5);
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(-5, -43, 1);
    g.fillCircle(9, -43, 1);
    g.fillStyle(hairColor, 0.7);
    g.fillRect(-10, -48, 8, 2);
    g.fillRect(4, -48, 8, 2);
    g.lineStyle(2, 0xc08060, 1);
    g.beginPath();
    g.arc(0, -36, 6, 0.2, Math.PI - 0.2, false);
    g.strokePath();
    g.fillStyle(0xe0a880, 1);
    g.fillCircle(0, -38, 2);

    if (name) {
      const nameBg = this.add.graphics();
      const textObj = this.add.text(0, -72, name, {
        fontSize: '15px',
        color: '#ffffff',
        fontFamily: this.fontFamily,
        fontStyle: 'bold',
        rtl: this.isRtl,
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
    if (characterColor === COLORS.PRIMARY) return 0x3d2b1f;
    if (characterColor === 0x2f4f4f) return 0x1a1a1a;
    if (characterColor === 0xffd700) return 0xc0c0c0;
    if (characterColor === 0x8b0000) return 0x8b4513;
    if (characterColor === 0x800080) return 0x4a0080;
    return 0x5c3317;
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

    const shadow = this.add.rectangle(3, 3, width, height, 0x000000, 0.2);
    shadow.setStrokeStyle(0);
    container.add(shadow);

    const bg = this.add.rectangle(0, 0, width, height, COLORS.PRIMARY, 1)
      .setInteractive({ useHandCursor: true });
    container.add(bg);

    const highlight = this.add.rectangle(0, -height / 4, width - 4, height / 2 - 2, 0xffffff, 0.1);
    container.add(highlight);

    const border = this.add.rectangle(0, 0, width, height);
    border.setStrokeStyle(2, 0xffffff, 0.3);
    border.setFillStyle(0x000000, 0);
    container.add(border);

    const label = this.add.text(0, 0, text, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: this.fontFamily,
      fontStyle: 'bold',
      rtl: this.isRtl,
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

  showDialogue(speaker: string, text: string, portrait?: string): Promise<void> {
    return new Promise((resolve) => {
      phaserBridge.emit('show-dialogue', {
        speaker,
        text,
        portrait,
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

  // --- AUDIO HELPERS ---

  playMusic(key: string) {
    audioManager.playMusic(key as any);
  }

  playSfx(key: string) {
    audioManager.playSfx(key as any);
  }

  crossfadeMusic(key: string) {
    audioManager.crossfadeTo(key as any);
  }
}
