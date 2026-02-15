import Phaser from 'phaser';
import { PLAYER_SPEED, PLAYER_SPEED_PLATFORMER, COLORS } from '../../config/constants';

export type PlayerMode = 'topdown' | 'platformer';

export class Player {
  private container: Phaser.GameObjects.Container;
  private body: Phaser.Physics.Arcade.Body;
  private mode: PlayerMode;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: Record<string, Phaser.Input.Keyboard.Key>;
  private facing: 'left' | 'right' = 'right';

  constructor(scene: Phaser.Scene, x: number, y: number, mode: PlayerMode = 'topdown', name?: string) {
    this.mode = mode;

    // Create visual representation
    this.container = scene.add.container(x, y);

    // Body rectangle
    const body = scene.add.rectangle(0, 0, 40, 60, COLORS.PRIMARY);
    this.container.add(body);

    // Head circle
    const head = scene.add.circle(0, -40, 15, COLORS.PRIMARY);
    this.container.add(head);

    // Eyes
    const leftEye = scene.add.circle(-5, -43, 3, 0xffffff);
    const rightEye = scene.add.circle(5, -43, 3, 0xffffff);
    const leftPupil = scene.add.circle(-5, -43, 1.5, 0x000000);
    const rightPupil = scene.add.circle(5, -43, 1.5, 0x000000);
    this.container.add([leftEye, rightEye, leftPupil, rightPupil]);

    // Name label
    if (name) {
      const nameText = scene.add.text(0, -65, name, {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'Arial',
      }).setOrigin(0.5);
      this.container.add(nameText);
    }

    // Physics
    scene.physics.add.existing(this.container);
    this.body = this.container.body as Phaser.Physics.Arcade.Body;
    this.body.setCollideWorldBounds(true);
    this.body.setSize(40, 60);
    this.body.setOffset(-20, -30);

    if (mode === 'platformer') {
      this.body.setGravityY(600);
      this.body.setBounce(0.1);
    }

    // Input
    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      SPACE: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };
  }

  update() {
    const speed = this.mode === 'platformer' ? PLAYER_SPEED_PLATFORMER : PLAYER_SPEED;

    // Horizontal movement
    let vx = 0;
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      vx = -speed;
      this.facing = 'left';
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      vx = speed;
      this.facing = 'right';
    }
    this.body.setVelocityX(vx);

    if (this.mode === 'topdown') {
      // Vertical movement (top-down)
      let vy = 0;
      if (this.cursors.up.isDown || this.wasd.W.isDown) {
        vy = -speed;
      } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
        vy = speed;
      }
      this.body.setVelocityY(vy);
    } else {
      // Jump (platformer)
      if ((this.cursors.up.isDown || this.wasd.W.isDown || this.wasd.SPACE.isDown) && this.body.touching.down) {
        this.body.setVelocityY(-450);
      }
    }

    // Face direction
    this.container.setScale(this.facing === 'left' ? -1 : 1, 1);
  }

  getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  getBody(): Phaser.Physics.Arcade.Body {
    return this.body;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.container.x, y: this.container.y };
  }

  setPosition(x: number, y: number) {
    this.container.setPosition(x, y);
  }

  isInteracting(): boolean {
    return this.wasd.SPACE.isDown || this.cursors.up.isDown;
  }

  destroy() {
    this.container.destroy();
  }
}
