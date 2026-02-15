import Phaser from 'phaser';

export interface NPCConfig {
  name: string;
  color: number;
  x: number;
  y: number;
  dialogue: string[];
  interactive?: boolean;
}

export class NPC {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private name: string;
  private dialogue: string[];
  private dialogueIndex = 0;
  private interactionRadius = 80;

  constructor(scene: Phaser.Scene, config: NPCConfig) {
    this.scene = scene;
    this.name = config.name;
    this.dialogue = config.dialogue;

    // Create visual
    this.container = scene.add.container(config.x, config.y);

    // Body
    const body = scene.add.rectangle(0, 0, 40, 60, config.color);
    this.container.add(body);

    // Head
    const head = scene.add.circle(0, -40, 15, config.color);
    this.container.add(head);

    // Eyes
    const leftEye = scene.add.circle(-5, -43, 3, 0xffffff);
    const rightEye = scene.add.circle(5, -43, 3, 0xffffff);
    const leftPupil = scene.add.circle(-5, -43, 1.5, 0x000000);
    const rightPupil = scene.add.circle(5, -43, 1.5, 0x000000);
    this.container.add([leftEye, rightEye, leftPupil, rightPupil]);

    // Name label
    const nameText = scene.add.text(0, -65, config.name, {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(0.5);
    this.container.add(nameText);

    // Make interactive
    if (config.interactive !== false) {
      this.container.setInteractive(
        new Phaser.Geom.Rectangle(-30, -60, 60, 120),
        Phaser.Geom.Rectangle.Contains
      );
    }

    // Physics (static)
    scene.physics.add.existing(this.container, true);
  }

  getName(): string {
    return this.name;
  }

  getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  getNextDialogue(): string | null {
    if (this.dialogueIndex >= this.dialogue.length) {
      this.dialogueIndex = 0; // Loop dialogue
      return null;
    }
    const text = this.dialogue[this.dialogueIndex];
    this.dialogueIndex++;
    return text;
  }

  resetDialogue() {
    this.dialogueIndex = 0;
  }

  isNearPlayer(playerX: number, playerY: number): boolean {
    const dist = Phaser.Math.Distance.Between(
      this.container.x, this.container.y,
      playerX, playerY
    );
    return dist < this.interactionRadius;
  }

  // Idle animation
  startIdleAnimation() {
    this.scene.tweens.add({
      targets: this.container,
      y: this.container.y - 5,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  destroy() {
    this.container.destroy();
  }
}
