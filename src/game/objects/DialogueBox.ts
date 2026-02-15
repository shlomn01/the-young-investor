import Phaser from 'phaser';

export interface DialogueBoxConfig {
  x: number;
  y: number;
  width?: number;
  text: string;
  speakerName?: string;
}

// In-game speech bubble rendered via Phaser Graphics
export class DialogueBox {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private textObj: Phaser.GameObjects.Text;
  private isTyping = false;
  private fullText = '';
  private timer: Phaser.Time.TimerEvent | null = null;

  constructor(scene: Phaser.Scene, config: DialogueBoxConfig) {
    this.scene = scene;
    const width = config.width ?? 300;

    this.container = scene.add.container(config.x, config.y);

    // Bubble background
    const g = scene.add.graphics();
    g.fillStyle(0xffffff, 0.95);
    g.fillRoundedRect(-width / 2, -60, width, 70, 12);
    // Pointer triangle
    g.fillTriangle(
      -10, 10,
      10, 10,
      0, 25
    );
    g.lineStyle(2, 0x333333, 0.5);
    g.strokeRoundedRect(-width / 2, -60, width, 70, 12);
    this.container.add(g);

    // Speaker name
    if (config.speakerName) {
      const nameText = scene.add.text(-width / 2 + 10, -55, config.speakerName, {
        fontSize: '14px',
        color: '#4a90d9',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      });
      this.container.add(nameText);
    }

    // Text
    this.textObj = scene.add.text(0, -25, '', {
      fontSize: '16px',
      color: '#333333',
      fontFamily: 'Arial',
      wordWrap: { width: width - 20 },
      align: 'center',
    }).setOrigin(0.5);
    this.container.add(this.textObj);

    this.fullText = config.text;
    this.typeText(config.text);
  }

  private typeText(text: string) {
    this.isTyping = true;
    let index = 0;

    this.timer = this.scene.time.addEvent({
      delay: 30,
      callback: () => {
        index++;
        this.textObj.setText(text.substring(0, index));
        if (index >= text.length) {
          this.isTyping = false;
          this.timer?.destroy();
        }
      },
      repeat: text.length - 1,
    });
  }

  skipTyping() {
    if (this.timer) {
      this.timer.destroy();
      this.timer = null;
    }
    this.textObj.setText(this.fullText);
    this.isTyping = false;
  }

  getIsTyping(): boolean {
    return this.isTyping;
  }

  setVisible(visible: boolean) {
    this.container.setVisible(visible);
  }

  destroy() {
    if (this.timer) this.timer.destroy();
    this.container.destroy();
  }
}
