import { BaseScene } from '../BaseScene';
import { COLORS, PLAYER_SPEED } from '../../../config/constants';

interface StreetConfig {
  streetIndex: number;
  bgTopColor: number;
  bgBottomColor: number;
  buildings: Array<{
    x: number;
    label: string;
    labelHe: string;
    color: number;
    targetScene: string;
    targetData?: Record<string, unknown>;
  }>;
  exitLeft?: { scene: string; data?: Record<string, unknown> };
  exitRight?: { scene: string; data?: Record<string, unknown> };
}

const STREET_CONFIGS: StreetConfig[] = [
  // Street 0 - Starting street: Home
  {
    streetIndex: 0,
    bgTopColor: 0x87ceeb,
    bgBottomColor: 0x228b22,
    buildings: [
      { x: 960, label: 'Home', labelHe: 'בית', color: 0xcd853f, targetScene: 'LivingRoom', targetData: { variant: 1 } },
    ],
    exitRight: { scene: 'Street', data: { streetIndex: 1 } },
  },
  // Street 1 - School street
  {
    streetIndex: 1,
    bgTopColor: 0x87ceeb,
    bgBottomColor: 0x3cb371,
    buildings: [
      { x: 960, label: 'School', labelHe: 'בית ספר', color: 0x8b0000, targetScene: 'School', targetData: { lessonId: 1 } },
    ],
    exitLeft: { scene: 'Street', data: { streetIndex: 0 } },
    exitRight: { scene: 'Street', data: { streetIndex: 2 } },
  },
  // Street 2 - Bank street
  {
    streetIndex: 2,
    bgTopColor: 0x87ceeb,
    bgBottomColor: 0x2e8b57,
    buildings: [
      { x: 960, label: 'Bank', labelHe: 'בנק', color: 0x4682b4, targetScene: 'Bank', targetData: { variant: 1 } },
    ],
    exitLeft: { scene: 'Street', data: { streetIndex: 1 } },
    exitRight: { scene: 'Street', data: { streetIndex: 3 } },
  },
  // Street 3 - Library street
  {
    streetIndex: 3,
    bgTopColor: 0x87ceeb,
    bgBottomColor: 0x228b22,
    buildings: [
      { x: 960, label: 'Library', labelHe: 'ספרייה', color: 0x8b4513, targetScene: 'Library', targetData: { variant: 1 } },
    ],
    exitLeft: { scene: 'Street', data: { streetIndex: 2 } },
    exitRight: { scene: 'Street', data: { streetIndex: 4 } },
  },
  // Street 4 - Trade street 1
  {
    streetIndex: 4,
    bgTopColor: 0x87ceeb,
    bgBottomColor: 0x3cb371,
    buildings: [
      { x: 960, label: 'Stock Exchange', labelHe: 'בורסה', color: 0x2f4f4f, targetScene: 'Trade', targetData: { round: 1 } },
    ],
    exitLeft: { scene: 'Street', data: { streetIndex: 3 } },
    exitRight: { scene: 'Street', data: { streetIndex: 5 } },
  },
  // Street 5 - School 2 + Percents game
  {
    streetIndex: 5,
    bgTopColor: 0x87ceeb,
    bgBottomColor: 0x228b22,
    buildings: [
      { x: 960, label: 'School', labelHe: 'בית ספר', color: 0x8b0000, targetScene: 'School', targetData: { lessonId: 2 } },
    ],
    exitLeft: { scene: 'Street', data: { streetIndex: 4 } },
    exitRight: { scene: 'Street', data: { streetIndex: 6 } },
  },
  // Street 6 - Library 2 + Trade 2
  {
    streetIndex: 6,
    bgTopColor: 0x87ceeb,
    bgBottomColor: 0x2e8b57,
    buildings: [
      { x: 700, label: 'Library', labelHe: 'ספרייה', color: 0x8b4513, targetScene: 'Library', targetData: { variant: 2 } },
      { x: 1200, label: 'Stock Exchange', labelHe: 'בורסה', color: 0x2f4f4f, targetScene: 'Trade', targetData: { round: 2 } },
    ],
    exitLeft: { scene: 'Street', data: { streetIndex: 5 } },
    exitRight: { scene: 'Street', data: { streetIndex: 7 } },
  },
  // Street 7 - Hotel
  {
    streetIndex: 7,
    bgTopColor: 0x87ceeb,
    bgBottomColor: 0x3cb371,
    buildings: [
      { x: 960, label: 'Hotel', labelHe: 'מלון', color: 0x800080, targetScene: 'Hotel' },
    ],
    exitLeft: { scene: 'Street', data: { streetIndex: 6 } },
    exitRight: { scene: 'Street', data: { streetIndex: 8 } },
  },
  // Street 8 - Bar Mitzvah + Computer Shop + Trade 3
  {
    streetIndex: 8,
    bgTopColor: 0x87ceeb,
    bgBottomColor: 0x228b22,
    buildings: [
      { x: 500, label: 'Synagogue', labelHe: 'בית כנסת', color: 0xdaa520, targetScene: 'BarMitzvah' },
      { x: 960, label: 'Computer Shop', labelHe: 'חנות מחשבים', color: 0x696969, targetScene: 'ComputerShop' },
      { x: 1420, label: 'Stock Exchange', labelHe: 'בורסה', color: 0x2f4f4f, targetScene: 'Trade', targetData: { round: 3 } },
    ],
    exitLeft: { scene: 'Street', data: { streetIndex: 7 } },
  },
];

export class StreetScene extends BaseScene {
  private player!: Phaser.GameObjects.Container;
  private playerBody!: Phaser.Physics.Arcade.Body;
  private streetIndex = 0;
  private config!: StreetConfig;
  private entranceZones: Array<{ zone: Phaser.GameObjects.Zone; targetScene: string; targetData?: Record<string, unknown> }> = [];
  private nearEntrance = false;
  private currentEntrance: { targetScene: string; targetData?: Record<string, unknown> } | null = null;
  private promptText!: Phaser.GameObjects.Text;

  constructor() {
    super('Street');
  }

  init(data: { streetIndex?: number }) {
    this.streetIndex = data?.streetIndex ?? 0;
    this.config = STREET_CONFIGS[this.streetIndex] || STREET_CONFIGS[0];
  }

  create() {
    super.create();
    this.entranceZones = [];
    this.nearEntrance = false;
    this.currentEntrance = null;

    // --- Sky background with sun and clouds ---
    this.drawSkyBackground('day');

    // --- Ground layers ---
    const groundY = this.h - 200;
    this.drawGround(groundY);

    // --- Environmental details (trees, bushes, lamp posts) ---
    this.drawEnvironment(groundY);

    // --- Street label with styled background panel ---
    this.drawStreetLabel();

    // --- Buildings ---
    for (const building of this.config.buildings) {
      const bWidth = 200;
      const bHeight = 250;
      const bx = building.x - bWidth / 2;
      const by = groundY - bHeight;
      const label = this.lang === 'he' ? building.labelHe : building.label;

      this.drawBuilding(bx, by, bWidth, bHeight, building.color, label);

      // Arrow indicator above building
      const arrow = this.add.text(building.x, by - 30, '\u25BC', {
        fontSize: '32px',
        color: '#ffd700',
      }).setOrigin(0.5);
      this.tweens.add({
        targets: arrow,
        y: by - 20,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      // Entrance zone
      const zone = this.add.zone(building.x, this.h - 230, 80, 80);
      this.physics.add.existing(zone, true);
      this.entranceZones.push({
        zone,
        targetScene: building.targetScene,
        targetData: building.targetData,
      });
    }

    // Exit arrows
    if (this.config.exitLeft) {
      const leftArrow = this.add.text(40, this.h / 2, '\u25C0', {
        fontSize: '48px',
        color: '#ffffff',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      leftArrow.on('pointerdown', () => {
        this.goToScene(this.config.exitLeft!.scene, this.config.exitLeft!.data);
      });

      // Left exit zone
      const leftZone = this.add.zone(0, this.h - 300, 40, 400);
      this.physics.add.existing(leftZone, true);
      this.entranceZones.push({
        zone: leftZone,
        targetScene: this.config.exitLeft.scene,
        targetData: this.config.exitLeft.data,
      });
    }
    if (this.config.exitRight) {
      const rightArrow = this.add.text(this.w - 40, this.h / 2, '\u25B6', {
        fontSize: '48px',
        color: '#ffffff',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      rightArrow.on('pointerdown', () => {
        this.goToScene(this.config.exitRight!.scene, this.config.exitRight!.data);
      });

      const rightZone = this.add.zone(this.w, this.h - 300, 40, 400);
      this.physics.add.existing(rightZone, true);
      this.entranceZones.push({
        zone: rightZone,
        targetScene: this.config.exitRight.scene,
        targetData: this.config.exitRight.data,
      });
    }

    // Player
    this.player = this.drawCharacterPlaceholder(this.w / 2, this.h - 260, COLORS.PRIMARY, this.store.playerName || undefined);
    this.physics.add.existing(this.player);
    this.playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    this.playerBody.setCollideWorldBounds(true);

    // Interaction prompt
    this.promptText = this.add.text(this.w / 2, this.h - 340, '', {
      fontSize: '20px',
      color: '#ffd700',
      fontFamily: 'Arial',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setVisible(false);

    // Overlap detection with entrance zones
    for (const entrance of this.entranceZones) {
      this.physics.add.overlap(this.player, entrance.zone, () => {
        this.nearEntrance = true;
        this.currentEntrance = entrance;
      });
    }

    this.fadeIn();
  }

  private drawGround(groundY: number) {
    const g = this.add.graphics();

    // --- Green grass area ---
    g.fillStyle(0x4caf50, 1);
    g.fillRect(0, groundY, this.w, 200);

    // Subtle grass texture - lighter grass stripes
    g.fillStyle(0x66bb6a, 0.3);
    for (let x = 0; x < this.w; x += 40) {
      const h = 4 + Math.sin(x * 0.05) * 2;
      g.fillRect(x, groundY, 20, h);
    }

    // Small grass tufts along the top edge
    g.fillStyle(0x388e3c, 0.6);
    for (let x = 10; x < this.w; x += 30 + Math.sin(x) * 10) {
      g.fillTriangle(
        x - 4, groundY,
        x, groundY - 6 - Math.sin(x * 0.1) * 3,
        x + 4, groundY,
      );
    }

    // --- Sidewalk with brick pattern ---
    const sidewalkY = groundY + 10;
    const sidewalkH = 40;

    // Sidewalk base
    g.fillStyle(0xbdbdbd, 1);
    g.fillRect(0, sidewalkY, this.w, sidewalkH);

    // Sidewalk top edge (curb)
    g.fillStyle(0xd0d0d0, 1);
    g.fillRect(0, sidewalkY, this.w, 6);

    // Brick pattern on sidewalk
    const brickW = 30;
    const brickH = 14;
    const brickGap = 2;
    for (let row = 0; row < Math.ceil(sidewalkH / (brickH + brickGap)); row++) {
      const by = sidewalkY + 6 + row * (brickH + brickGap);
      const offset = row % 2 === 0 ? 0 : brickW / 2;
      for (let bx = -brickW + offset; bx < this.w; bx += brickW + brickGap) {
        // Alternate brick shading for texture
        const shade = (row + Math.floor(bx / brickW)) % 3 === 0 ? 0xa0a0a0 : 0xb0b0b0;
        g.fillStyle(shade, 0.3);
        g.fillRect(bx, by, brickW, brickH);
      }
    }

    // Sidewalk bottom edge
    g.fillStyle(0x999999, 1);
    g.fillRect(0, sidewalkY + sidewalkH - 3, this.w, 3);

    // --- Dark asphalt road ---
    const roadY = sidewalkY + sidewalkH;
    const roadH = this.h - roadY;

    // Road base
    g.fillStyle(0x3a3a3a, 1);
    g.fillRect(0, roadY, this.w, roadH);

    // Subtle asphalt texture
    g.fillStyle(0x444444, 0.3);
    for (let i = 0; i < 200; i++) {
      const rx = Math.random() * this.w;
      const ry = roadY + Math.random() * roadH;
      g.fillRect(rx, ry, 2 + Math.random() * 3, 1);
    }

    // Yellow edge line (top of road, along curb)
    g.fillStyle(0xffc107, 1);
    g.fillRect(0, roadY, this.w, 4);

    // Yellow edge line (bottom of road)
    g.fillStyle(0xffc107, 1);
    g.fillRect(0, this.h - 4, this.w, 4);

    // White dashed center lane markings
    const centerY = roadY + roadH / 2 - 2;
    g.fillStyle(0xffffff, 0.9);
    for (let x = 20; x < this.w; x += 80) {
      g.fillRect(x, centerY, 40, 4);
    }
  }

  private drawEnvironment(groundY: number) {
    const g = this.add.graphics();

    // Determine occupied x-ranges by buildings (with some padding)
    const buildingZones = this.config.buildings.map(b => ({
      left: b.x - 130,
      right: b.x + 130,
    }));

    const isOccupied = (x: number, padding = 0): boolean => {
      return buildingZones.some(z => x >= z.left - padding && x <= z.right + padding);
    };

    // --- Trees ---
    // Place trees in gaps between buildings and near edges
    const treePositions: Array<{ x: number; scale: number }> = [];

    // Try placing trees at regular intervals, skipping building zones
    const treeSpacing = 240;
    for (let tx = 120; tx < this.w - 100; tx += treeSpacing) {
      if (!isOccupied(tx, 40)) {
        const scale = 0.8 + Math.sin(tx * 0.01) * 0.3;
        treePositions.push({ x: tx, scale });
      }
    }

    // Draw trees on the grass, above the sidewalk
    for (const tree of treePositions) {
      this.drawTree(g, tree.x, groundY + 8, tree.scale);
    }

    // --- Bushes along the sidewalk ---
    const bushSpacing = 150;
    for (let bx = 80; bx < this.w - 60; bx += bushSpacing + Math.sin(bx * 0.03) * 30) {
      if (!isOccupied(bx, 20)) {
        const scale = 0.6 + Math.sin(bx * 0.02) * 0.2;
        this.drawBush(g, bx, groundY + 14, scale);
      }
    }

    // --- Lamp posts ---
    // Place lamp posts at wider intervals, avoiding buildings
    const lampSpacing = 350;
    for (let lx = 200; lx < this.w - 100; lx += lampSpacing) {
      if (!isOccupied(lx, 60)) {
        this.drawLampPost(g, lx, groundY + 10);
      }
    }
  }

  private drawStreetLabel() {
    const streetLabel = this.lang === 'he'
      ? `\u05E8\u05D7\u05D5\u05D1 ${this.streetIndex}`
      : `Street ${this.streetIndex}`;

    // Background panel
    const panelWidth = streetLabel.length * 16 + 60;
    const panelX = this.w / 2 - panelWidth / 2;
    const panelY = 18;
    const panelH = 44;

    const labelBg = this.add.graphics();
    // Dark semi-transparent panel
    labelBg.fillStyle(0x1a1a2e, 0.8);
    labelBg.fillRoundedRect(panelX, panelY, panelWidth, panelH, 12);
    // Gold border
    labelBg.lineStyle(2, 0xffd700, 0.9);
    labelBg.strokeRoundedRect(panelX, panelY, panelWidth, panelH, 12);
    // Inner highlight line at top
    labelBg.lineStyle(1, 0xffffff, 0.15);
    labelBg.strokeRoundedRect(panelX + 2, panelY + 2, panelWidth - 4, panelH - 4, 10);

    this.add.text(this.w / 2, panelY + panelH / 2, streetLabel, {
      fontSize: '26px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);
  }

  update() {
    if (!this.cursors || !this.playerBody) return;

    // Movement
    let vx = 0;
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      vx = -PLAYER_SPEED;
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      vx = PLAYER_SPEED;
    }
    this.playerBody.setVelocityX(vx);

    // Check proximity to entrances
    this.nearEntrance = false;
    this.currentEntrance = null;
    for (const entrance of this.entranceZones) {
      const px = this.player.x;
      const zx = entrance.zone.x;
      if (Math.abs(px - zx) < 60) {
        this.nearEntrance = true;
        this.currentEntrance = entrance;
        break;
      }
    }

    // Show/hide prompt
    if (this.nearEntrance && this.currentEntrance) {
      const promptLabel = this.lang === 'he' ? '\u05DC\u05D7\u05E5 \u2191 \u05DC\u05D4\u05D9\u05DB\u05E0\u05E1' : 'Press \u2191 to enter';
      this.promptText.setText(promptLabel);
      this.promptText.setPosition(this.player.x, this.player.y - 80);
      this.promptText.setVisible(true);
    } else {
      this.promptText.setVisible(false);
    }

    // Enter building
    if (this.nearEntrance && this.currentEntrance) {
      if (this.cursors.up.isDown || this.wasd.W.isDown || this.wasd.SPACE.isDown) {
        const { targetScene, targetData } = this.currentEntrance;
        this.goToScene(targetScene, targetData);
      }
    }
  }
}
