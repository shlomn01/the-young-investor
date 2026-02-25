import { BaseScene } from '../BaseScene';
import { PLAYER_SPEED, BG_KEYS, PORTRAIT_KEYS } from '../../../config/constants';

export class LivingRoomScene extends BaseScene {
  private variant = 1;
  private player!: Phaser.GameObjects.Container;
  private playerBody!: Phaser.Physics.Arcade.Body;
  private npcX = 0;
  private nearNpc = false;
  private dialogueActive = false;
  private dialogueDone = false;
  private promptText!: Phaser.GameObjects.Text;
  private charScale = 5;

  constructor() {
    super('LivingRoom');
  }

  init(data: { variant?: number }) {
    this.variant = data?.variant ?? 1;
    this.dialogueActive = false;
    this.dialogueDone = false;
  }

  create() {
    super.create();

    const floorY = this.h - 120;

    // Interior background: use image if available, fallback to programmatic
    if (!this.tryShowBackground(BG_KEYS.LIVING_ROOM)) {
      this.drawInteriorRoom(0xfaebd7, 0x8b6b4a, { woodFloor: true, baseboard: true, ceiling: true });

      const dg = this.add.graphics();
      this.drawWindow(dg, 900, 80, 250, 180);
      this.drawPictureFrame(dg, 150, 100, 80, 60, 0x7ec8e3);
      this.drawPictureFrame(dg, 280, 110, 60, 50, 0xd4a574);
      this.drawPictureFrame(dg, 1300, 90, 70, 55, 0x90c695);

      // Sofa
      dg.fillStyle(0x4169e1, 1);
      dg.fillRoundedRect(200, this.h - 350, 400, 150, 16);
      dg.fillStyle(0x3a5fc8, 1);
      dg.fillRoundedRect(200, this.h - 400, 400, 60, { tl: 14, tr: 14, bl: 0, br: 0 });

      // Coffee table
      dg.fillStyle(0xcd853f, 1);
      dg.fillRoundedRect(700, this.h - 275, 220, 18, 4);
      dg.fillStyle(0xb8860b, 1);
      dg.fillRect(710, this.h - 257, 10, 80);
      dg.fillRect(900, this.h - 257, 10, 80);

      // TV
      dg.fillStyle(0x5c4033, 1);
      dg.fillRoundedRect(1350, this.h - 310, 250, 130, 6);
      dg.fillStyle(0x1a1a1a, 1);
      dg.fillRoundedRect(1370, this.h - 520, 210, 150, 6);
      dg.fillStyle(0x2a4a6a, 1);
      dg.fillRect(1378, this.h - 512, 194, 134);
    }

    // Room label
    const label = this.lang === 'he' ? 'סלון' : 'Living Room';
    this.add.text(this.w / 2, 40, label, {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: this.fontFamily,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
      rtl: this.isRtl,
    }).setOrigin(0.5);

    // Dad NPC - natural size on the floor
    const npcName = this.lang === 'he' ? 'אבא' : 'Dad';
    this.npcX = this.w / 2 + 200;
    this.createNPC('npc_dad', this.npcX, floorY, npcName, 'down', this.charScale);

    // Player - same size, starts at left side
    this.player = this.createCharacterSprite('player', 200, floorY, this.charScale, this.store.playerName || undefined);
    this.physics.add.existing(this.player);
    this.playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    this.playerBody.setCollideWorldBounds(true);

    // Interaction prompt
    this.promptText = this.add.text(this.w / 2, floorY - this.charScale * 70, '', {
      fontSize: '22px',
      color: '#ffd700',
      fontFamily: this.fontFamily,
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: { x: 12, y: 6 },
      rtl: this.isRtl,
    }).setOrigin(0.5).setVisible(false);

    // Back button
    this.createButton(
      100, this.h - 40,
      this.lang === 'he' ? 'חזרה לרחוב' : 'Back to Street',
      () => this.goToScene('Street', { streetIndex: 0 }),
      200, 40
    );

    this.fadeIn();
  }

  update() {
    if (!this.cursors || !this.playerBody || this.dialogueActive) return;

    // Movement with animation
    let vx = 0;
    const sprite = this.player.getData('sprite') as Phaser.GameObjects.Sprite | undefined;
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      vx = -PLAYER_SPEED;
      if (sprite && sprite.anims.currentAnim?.key !== 'player_walk_left') {
        sprite.play('player_walk_left');
      }
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      vx = PLAYER_SPEED;
      if (sprite && sprite.anims.currentAnim?.key !== 'player_walk_right') {
        sprite.play('player_walk_right');
      }
    } else {
      if (sprite && sprite.anims.currentAnim && !sprite.anims.currentAnim.key.includes('idle')) {
        const dir = sprite.anims.currentAnim.key.includes('left') ? 'left' :
                    sprite.anims.currentAnim.key.includes('right') ? 'right' : 'down';
        sprite.play(`player_idle_${dir}`);
      }
    }
    this.playerBody.setVelocityX(vx);

    // Check proximity to Dad
    this.nearNpc = Math.abs(this.player.x - this.npcX) < 120;

    // Show/hide prompt
    if (this.nearNpc && !this.dialogueDone) {
      const promptLabel = this.lang === 'he' ? 'לחץ ↑ לדבר' : 'Press ↑ to talk';
      this.promptText.setText(promptLabel);
      this.promptText.setPosition(this.player.x, this.player.y - this.charScale * 70);
      this.promptText.setVisible(true);
    } else {
      this.promptText.setVisible(false);
    }

    // Trigger dialogue on up key
    if (this.nearNpc && !this.dialogueDone && !this.dialogueActive) {
      if (this.cursors.up.isDown || this.wasd.W.isDown || this.wasd.SPACE.isDown) {
        this.startDialogue();
      }
    }
  }

  private async startDialogue() {
    this.dialogueActive = true;
    this.playerBody.setVelocityX(0);

    const npcName = this.lang === 'he' ? 'אבא' : 'Dad';
    const dialogues = this.getDialogueByVariant();
    for (const line of dialogues) {
      await this.showDialogue(npcName, line, PORTRAIT_KEYS.npc_dad);
    }

    this.dialogueActive = false;
    this.dialogueDone = true;
  }

  private getDialogueByVariant(): string[] {
    if (this.lang === 'he') {
      switch (this.variant) {
        case 1: return [
          'שלום! מה שלומך היום?',
          'למדת משהו חדש בבית הספר?',
          'תמיד חשוב ללמוד על כסף והשקעות.',
        ];
        case 2: return [
          'שמעתי שפתחת חשבון בבנק! כל הכבוד!',
          'עכשיו אתה יכול להתחיל לחסוך ולהשקיע.',
        ];
        case 3: return [
          'ראיתי שקנית מניות! מרגש!',
          'תזכור - השקעה היא לטווח ארוך.',
        ];
        default: return ['שלום!'];
      }
    } else {
      switch (this.variant) {
        case 1: return [
          'Hello! How are you today?',
          'Did you learn something new at school?',
          'It\'s always important to learn about money and investments.',
        ];
        case 2: return [
          'I heard you opened a bank account! Well done!',
          'Now you can start saving and investing.',
        ];
        case 3: return [
          'I see you bought stocks! Exciting!',
          'Remember - investing is for the long term.',
        ];
        default: return ['Hello!'];
      }
    }
  }
}
