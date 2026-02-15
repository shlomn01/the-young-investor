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

    // Background
    this.drawGradientBg(this.config.bgTopColor, this.config.bgBottomColor);

    // Ground
    const ground = this.add.graphics();
    ground.fillStyle(0x808080, 1);
    ground.fillRect(0, this.h - 200, this.w, 200);
    // Sidewalk
    ground.fillStyle(0xd3d3d3, 1);
    ground.fillRect(0, this.h - 200, this.w, 20);

    // Road markings
    ground.fillStyle(0xffff00, 1);
    for (let x = 0; x < this.w; x += 100) {
      ground.fillRect(x, this.h - 100, 50, 4);
    }

    // Street label
    const streetLabel = this.lang === 'he'
      ? `רחוב ${this.streetIndex}`
      : `Street ${this.streetIndex}`;
    this.add.text(this.w / 2, 40, streetLabel, {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Buildings
    for (const building of this.config.buildings) {
      const bWidth = 200;
      const bHeight = 250;
      const bx = building.x - bWidth / 2;
      const by = this.h - 200 - bHeight;
      const label = this.lang === 'he' ? building.labelHe : building.label;

      this.drawBuilding(bx, by, bWidth, bHeight, building.color, label);

      // Arrow indicator above building
      const arrow = this.add.text(building.x, by - 30, '▼', {
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
      const leftArrow = this.add.text(40, this.h / 2, '◀', {
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
      const rightArrow = this.add.text(this.w - 40, this.h / 2, '▶', {
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
      const promptLabel = this.lang === 'he' ? 'לחץ ↑ להיכנס' : 'Press ↑ to enter';
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
