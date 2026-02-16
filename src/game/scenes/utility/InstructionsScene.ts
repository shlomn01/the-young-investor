import { BaseScene } from '../BaseScene';
import { COLORS } from '../../../config/constants';

interface InstructionNPC {
  nameHe: string;
  nameEn: string;
  color: number;
  textHe: string;
  textEn: string;
  x: number;
  platformY: number;
}

const INSTRUCTION_NPCS: Record<string, InstructionNPC[]> = {
  tradingSim: [
    {
      nameHe: 'סוחר 1', nameEn: 'Trader 1', color: 0xe74c3c,
      textHe: 'פקודת Limit Buy היא הוראה לקנות מניה רק כשהמחיר יורד למחיר שקבעת.',
      textEn: 'A Limit Buy order instructs to buy a stock only when the price drops to your set price.',
      x: 300, platformY: 700,
    },
    {
      nameHe: 'סוחר 2', nameEn: 'Trader 2', color: 0x3498db,
      textHe: 'פקודת Limit Sell היא הוראה למכור מניה רק כשהמחיר עולה למחיר שקבעת.',
      textEn: 'A Limit Sell order instructs to sell a stock only when the price rises to your set price.',
      x: 700, platformY: 550,
    },
    {
      nameHe: 'סוחר 3', nameEn: 'Trader 3', color: 0x2ecc71,
      textHe: 'Bid הוא המחיר שקונה מוכן לשלם. Ask הוא המחיר שמוכר מוכן לקבל.',
      textEn: 'Bid is the price a buyer is willing to pay. Ask is the price a seller is willing to accept.',
      x: 1100, platformY: 400,
    },
    {
      nameHe: 'סוחר 4', nameEn: 'Trader 4', color: 0xf39c12,
      textHe: 'ההפרש בין Bid ל-Ask נקרא Spread. ככל שהוא קטן יותר - השוק יותר נזיל.',
      textEn: 'The difference between Bid and Ask is called the Spread. Smaller spread means more liquid market.',
      x: 1500, platformY: 300,
    },
    {
      nameHe: 'סוחר 5', nameEn: 'Trader 5', color: 0x9b59b6,
      textHe: 'Stop Loss היא פקודה שמוכרת אוטומטית כשהמחיר יורד מדי - כדי להגן עליך מהפסדים גדולים.',
      textEn: 'Stop Loss automatically sells when the price drops too much - to protect you from big losses.',
      x: 1100, platformY: 650,
    },
    {
      nameHe: 'סוחר 6', nameEn: 'Trader 6', color: 0x1abc9c,
      textHe: 'עכשיו אתה מוכן לנסות! בסימולציה תוכל לתרגל פקודות קנייה ומכירה בזמן אמת.',
      textEn: 'Now you\'re ready to try! In the simulation you can practice buy and sell orders in real-time.',
      x: 700, platformY: 800,
    },
  ],
};

export class InstructionsScene extends BaseScene {
  private gameId = 'tradingSim';
  private playerSprite!: Phaser.GameObjects.Container;
  private playerPhysicsBody!: Phaser.Physics.Arcade.Body;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private npcs: Array<{ sprite: Phaser.GameObjects.Container; data: InstructionNPC }> = [];

  constructor() {
    super('Instructions');
  }

  init(data: { gameId?: string }) {
    this.gameId = data?.gameId ?? 'tradingSim';
  }

  create() {
    super.create();
    this.npcs = [];

    const npcData = INSTRUCTION_NPCS[this.gameId] || INSTRUCTION_NPCS.tradingSim;

    // Sky background for outdoor feel
    this.drawSkyBackground('day');

    const g = this.add.graphics();

    // Decorative background trees
    this.drawTree(g, 50, this.h - 60, 1.2);
    this.drawTree(g, 1800, this.h - 60, 1.0);
    this.drawTree(g, 1650, this.h - 60, 0.7);
    this.drawBush(g, 150, this.h - 60, 1.0);
    this.drawBush(g, 1750, this.h - 60, 0.8);

    // Title
    this.add.text(this.w / 2, 30, this.lang === 'he' ? 'הוראות - דבר עם כל הדמויות!' : 'Instructions - Talk to all characters!', {
      fontSize: '28px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Create platforms
    this.platforms = this.physics.add.staticGroup();

    for (const npc of npcData) {
      const platW = 220;
      const platH = 24;
      const px = npc.x - platW / 2;
      const py = npc.platformY;

      // Stone edge base
      g.fillStyle(0x6b6b7a, 1);
      g.fillRoundedRect(px - 4, py + 2, platW + 8, platH, 6);
      // Stone top
      g.fillStyle(0x8a8a9a, 1);
      g.fillRoundedRect(px, py, platW, platH - 4, 4);
      // Stone texture lines
      g.fillStyle(0x555566, 0.3);
      for (let sx = px + 15; sx < px + platW - 10; sx += 25) {
        g.fillRect(sx, py + 4, 1, platH - 10);
      }
      // Grass on top
      g.fillStyle(0x3d8b37, 1);
      g.fillRect(px, py - 5, platW, 8);
      g.fillStyle(0x4caf50, 1);
      for (let gx = px; gx < px + platW; gx += 6) {
        const bladeH = 3 + Math.random() * 6;
        g.fillRect(gx, py - 5 - bladeH, 2, bladeH);
      }

      // Small bushes on some platforms
      if (Math.random() > 0.5) {
        this.drawBush(g, npc.x + platW / 2 - 20, py - 5, 0.4);
      }

      const platform = this.add.zone(npc.x, py + 10, platW, 20);
      this.physics.add.existing(platform, true);
      this.platforms.add(platform);

      // NPC on platform
      const name = this.lang === 'he' ? npc.nameHe : npc.nameEn;
      const npcSprite = this.drawCharacterPlaceholder(npc.x, npc.platformY - 40, npc.color, name);
      npcSprite.setInteractive(new Phaser.Geom.Rectangle(-30, -60, 60, 120), Phaser.Geom.Rectangle.Contains);

      npcSprite.on('pointerdown', () => {
        const text = this.lang === 'he' ? npc.textHe : npc.textEn;
        this.showDialogue(name, text);
      });

      this.npcs.push({ sprite: npcSprite, data: npc });
    }

    // Ground with grass detail
    // Dirt/stone base
    g.fillStyle(0x5a5a4a, 1);
    g.fillRect(0, this.h - 60, this.w, 60);
    // Stone texture
    g.fillStyle(0x4a4a3a, 0.3);
    for (let row = 0; row < 3; row++) {
      const ry = this.h - 60 + row * 20;
      g.fillRect(0, ry, this.w, 1);
      const offset = row % 2 === 0 ? 0 : 50;
      for (let col = offset; col < this.w; col += 100) {
        g.fillRect(col, ry, 1, 20);
      }
    }
    // Grass layer on top of ground
    g.fillStyle(0x3d8b37, 1);
    g.fillRect(0, this.h - 68, this.w, 12);
    // Individual grass blades
    g.fillStyle(0x4caf50, 1);
    for (let gx = 0; gx < this.w; gx += 7) {
      const bladeH = 4 + Math.random() * 8;
      g.fillRect(gx, this.h - 68 - bladeH, 2, bladeH);
    }
    // Some darker grass
    g.fillStyle(0x2d7a27, 0.6);
    for (let gx = 3; gx < this.w; gx += 14) {
      const bladeH = 3 + Math.random() * 5;
      g.fillRect(gx, this.h - 68 - bladeH, 2, bladeH);
    }

    const ground = this.add.zone(this.w / 2, this.h - 30, this.w, 60);
    this.physics.add.existing(ground, true);
    this.platforms.add(ground);

    // Player with gravity
    this.playerSprite = this.drawCharacterPlaceholder(200, this.h - 120, COLORS.PRIMARY);
    this.physics.add.existing(this.playerSprite);
    this.playerPhysicsBody = this.playerSprite.body as Phaser.Physics.Arcade.Body;
    this.playerPhysicsBody.setGravityY(600);
    this.playerPhysicsBody.setCollideWorldBounds(true);
    this.playerPhysicsBody.setBounce(0.1);

    this.physics.add.collider(this.playerSprite, this.platforms);

    // Continue button
    this.createButton(this.w - 150, this.h - 30,
      this.lang === 'he' ? 'המשך למשחק' : 'Start Game',
      () => this.goToScene('TradingSimGame'),
      200, 40);

    this.fadeIn();
  }

  update() {
    if (!this.cursors || !this.playerPhysicsBody) return;

    // Platformer movement
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      this.playerPhysicsBody.setVelocityX(-300);
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      this.playerPhysicsBody.setVelocityX(300);
    } else {
      this.playerPhysicsBody.setVelocityX(0);
    }

    // Jump
    if ((this.cursors.up.isDown || this.wasd.W.isDown || this.wasd.SPACE.isDown) && this.playerPhysicsBody.touching.down) {
      this.playerPhysicsBody.setVelocityY(-450);
    }
  }
}
