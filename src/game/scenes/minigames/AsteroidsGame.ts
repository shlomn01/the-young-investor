import { BaseScene } from '../BaseScene';

interface Asteroid {
  sprite: Phaser.GameObjects.Container;
  body: Phaser.Physics.Arcade.Body;
  size: 'big' | 'medium' | 'small';
  stockName?: string;
}

export class AsteroidsGame extends BaseScene {
  private ship!: Phaser.GameObjects.Container;
  private shipBody!: Phaser.Physics.Arcade.Body;
  private bullets!: Phaser.GameObjects.Group;
  private asteroids: Asteroid[] = [];
  private score = 0;
  private lives = 3;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private lastFire = 0;
  private gameOver = false;

  constructor() {
    super('AsteroidsGame');
  }

  create() {
    super.create();
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.asteroids = [];

    // Space background
    const g = this.add.graphics();
    g.fillStyle(0x000011, 1);
    g.fillRect(0, 0, this.w, this.h);

    // Stars
    for (let i = 0; i < 100; i++) {
      const sx = Math.random() * this.w;
      const sy = Math.random() * this.h;
      const brightness = 0.3 + Math.random() * 0.7;
      g.fillStyle(0xffffff, brightness);
      g.fillCircle(sx, sy, Math.random() * 2);
    }

    // Title
    this.add.text(this.w / 2, 20, this.lang === 'he' ? 'אסטרואידים!' : 'Asteroids!', {
      fontSize: '32px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Score & Lives
    this.scoreText = this.add.text(50, 20, `${this.lang === 'he' ? 'ניקוד:' : 'Score:'} 0`, {
      fontSize: '24px', color: '#50c878', fontFamily: 'Arial',
    });

    this.livesText = this.add.text(this.w - 50, 20, `❤️ ${this.lives}`, {
      fontSize: '24px', color: '#e74c3c', fontFamily: 'Arial',
    }).setOrigin(1, 0);

    // Ship
    this.ship = this.add.container(this.w / 2, this.h - 100);
    const shipG = this.add.graphics();
    shipG.fillStyle(0x4a90d9, 1);
    shipG.fillTriangle(0, -20, -15, 15, 15, 15);
    shipG.fillStyle(0x87ceeb, 1);
    shipG.fillTriangle(0, -15, -10, 10, 10, 10);
    this.ship.add(shipG);
    this.physics.add.existing(this.ship);
    this.shipBody = this.ship.body as Phaser.Physics.Arcade.Body;
    this.shipBody.setCollideWorldBounds(true);
    this.shipBody.setSize(30, 35);

    // Bullets group
    this.bullets = this.add.group();

    // Spawn initial asteroids
    for (let i = 0; i < 5; i++) {
      this.spawnAsteroid('big');
    }

    // Spawn timer
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        if (!this.gameOver && this.asteroids.length < 12) {
          this.spawnAsteroid('big');
        }
      },
      loop: true,
    });

    this.fadeIn();
  }

  update(time: number) {
    if (this.gameOver) return;
    if (!this.cursors || !this.shipBody) return;

    // Ship movement
    let vx = 0;
    let vy = 0;
    if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -400;
    if (this.cursors.right.isDown || this.wasd.D.isDown) vx = 400;
    if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -400;
    if (this.cursors.down.isDown || this.wasd.S.isDown) vy = 400;
    this.shipBody.setVelocity(vx, vy);

    // Fire
    if (this.wasd.SPACE.isDown && time > this.lastFire + 200) {
      this.fire();
      this.lastFire = time;
    }

    // Check bullet-asteroid collisions
    for (const bullet of this.bullets.getChildren() as Phaser.GameObjects.Arc[]) {
      if (!bullet.active) continue;


      for (let i = this.asteroids.length - 1; i >= 0; i--) {
        const asteroid = this.asteroids[i];
        const dist = Phaser.Math.Distance.Between(bullet.x, bullet.y, asteroid.sprite.x, asteroid.sprite.y);
        const hitDist = asteroid.size === 'big' ? 50 : asteroid.size === 'medium' ? 30 : 15;

        if (dist < hitDist) {
          // Hit!
          this.score += asteroid.size === 'big' ? 10 : asteroid.size === 'medium' ? 20 : 30;
          this.scoreText.setText(`${this.lang === 'he' ? 'ניקוד:' : 'Score:'} ${this.score}`);

          // Explosion effect
          this.showExplosion(asteroid.sprite.x, asteroid.sprite.y);

          // Split asteroid
          if (asteroid.size === 'big') {
            this.spawnAsteroid('medium', asteroid.sprite.x, asteroid.sprite.y);
            this.spawnAsteroid('medium', asteroid.sprite.x, asteroid.sprite.y);
          } else if (asteroid.size === 'medium') {
            this.spawnAsteroid('small', asteroid.sprite.x, asteroid.sprite.y);
            this.spawnAsteroid('small', asteroid.sprite.x, asteroid.sprite.y);
          }

          asteroid.sprite.destroy();
          this.asteroids.splice(i, 1);
          bullet.destroy();
          break;
        }
      }

      // Remove off-screen bullets
      if (bullet.active && (bullet.y < -10 || bullet.y > this.h + 10 || bullet.x < -10 || bullet.x > this.w + 10)) {
        bullet.destroy();
      }
    }

    // Check ship-asteroid collisions
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i];
      const dist = Phaser.Math.Distance.Between(this.ship.x, this.ship.y, asteroid.sprite.x, asteroid.sprite.y);
      const hitDist = asteroid.size === 'big' ? 40 : asteroid.size === 'medium' ? 25 : 12;

      if (dist < hitDist + 15) {
        this.lives--;
        this.livesText.setText(`❤️ ${this.lives}`);
        this.showExplosion(asteroid.sprite.x, asteroid.sprite.y);
        asteroid.sprite.destroy();
        this.asteroids.splice(i, 1);

        // Flash ship
        this.tweens.add({
          targets: this.ship,
          alpha: 0.2,
          duration: 100,
          yoyo: true,
          repeat: 5,
        });

        if (this.lives <= 0) {
          this.endGame();
          return;
        }
      }
    }

    // Wrap asteroids
    for (const asteroid of this.asteroids) {
      const s = asteroid.sprite;
      if (s.x < -50) s.x = this.w + 50;
      if (s.x > this.w + 50) s.x = -50;
      if (s.y < -50) s.y = this.h + 50;
      if (s.y > this.h + 50) s.y = -50;
    }
  }

  private fire() {
    const bullet = this.add.circle(this.ship.x, this.ship.y - 25, 4, 0xffff00);
    this.physics.add.existing(bullet);
    (bullet.body as Phaser.Physics.Arcade.Body).setVelocityY(-600);
    this.bullets.add(bullet);
  }

  private spawnAsteroid(size: 'big' | 'medium' | 'small', x?: number, y?: number) {
    const stockNames = ['Solar', 'Koogle', 'Sesla', 'Lemon'];
    const stockName = stockNames[Math.floor(Math.random() * stockNames.length)];

    const ax = x ?? Math.random() * this.w;
    const ay = y ?? Math.random() * 200 - 100;

    const container = this.add.container(ax, ay);
    const radius = size === 'big' ? 40 : size === 'medium' ? 25 : 12;
    const color = size === 'big' ? 0x808080 : size === 'medium' ? 0xa0a0a0 : 0xc0c0c0;

    const g = this.add.graphics();
    g.fillStyle(color, 1);
    g.lineStyle(2, 0x666666);
    // Irregular shape
    g.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const r = radius * (0.7 + Math.random() * 0.3);
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) g.moveTo(px, py);
      else g.lineTo(px, py);
    }
    g.closePath();
    g.fillPath();
    g.strokePath();
    container.add(g);

    // Stock name label on bigger asteroids
    if (size !== 'small') {
      const label = this.add.text(0, 0, stockName, {
        fontSize: size === 'big' ? '14px' : '10px',
        color: '#ffffff',
        fontFamily: 'Arial',
      }).setOrigin(0.5);
      container.add(label);
    }

    this.physics.add.existing(container);
    const body = container.body as Phaser.Physics.Arcade.Body;
    const speed = size === 'big' ? 80 : size === 'medium' ? 120 : 160;
    body.setVelocity(
      (Math.random() - 0.5) * speed * 2,
      speed * (0.5 + Math.random() * 0.5)
    );

    this.asteroids.push({ sprite: container, body, size, stockName });
  }

  private showExplosion(x: number, y: number) {
    for (let i = 0; i < 12; i++) {
      const color = [0xffd700, 0xff6600, 0xff0000, 0xffaa00][Math.floor(Math.random() * 4)];
      const particle = this.add.circle(x, y, 3 + Math.random() * 5, color);
      this.tweens.add({
        targets: particle,
        x: x + (Math.random() - 0.5) * 150,
        y: y + (Math.random() - 0.5) * 150,
        alpha: 0,
        scale: 0,
        duration: 400 + Math.random() * 300,
        onComplete: () => particle.destroy(),
      });
    }
  }

  private endGame() {
    this.gameOver = true;
    this.store.completeMiniGame('asteroids');

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(0, 0, this.w, this.h);

    this.add.text(this.w / 2, this.h / 2 - 100,
      this.lang === 'he' ? 'המשחק נגמר!' : 'Game Over!', {
      fontSize: '56px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(this.w / 2, this.h / 2,
      `${this.lang === 'he' ? 'ניקוד:' : 'Score:'} ${this.score}`, {
      fontSize: '40px', color: '#ffffff', fontFamily: 'Arial',
    }).setOrigin(0.5);

    this.createButton(this.w / 2, this.h / 2 + 120,
      this.lang === 'he' ? 'המשך' : 'Continue',
      () => this.goToScene('Instructions', { gameId: 'tradingSim' }),
      200, 50);
  }
}
