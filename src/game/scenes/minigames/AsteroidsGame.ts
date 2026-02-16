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
  private twinkleStars: Phaser.GameObjects.Arc[] = [];

  constructor() {
    super('AsteroidsGame');
  }

  create() {
    super.create();
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.asteroids = [];
    this.twinkleStars = [];

    // Space background with nebula effect
    const g = this.add.graphics();
    g.fillStyle(0x000008, 1);
    g.fillRect(0, 0, this.w, this.h);

    // Nebula - overlapping transparent colored circles
    const nebulaColors = [
      { color: 0x3a0066, alpha: 0.08 },
      { color: 0x001a66, alpha: 0.06 },
      { color: 0x660033, alpha: 0.07 },
      { color: 0x003344, alpha: 0.05 },
      { color: 0x220044, alpha: 0.06 },
    ];
    for (let i = 0; i < 25; i++) {
      const nc = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      const nx = Math.random() * this.w;
      const ny = Math.random() * this.h;
      const nr = 80 + Math.random() * 200;
      g.fillStyle(nc.color, nc.alpha);
      g.fillCircle(nx, ny, nr);
    }

    // Stars with varying brightness and sizes
    for (let i = 0; i < 150; i++) {
      const sx = Math.random() * this.w;
      const sy = Math.random() * this.h;
      const brightness = 0.15 + Math.random() * 0.85;
      const size = Math.random() * 2.5;
      // Some stars are slightly colored
      const starColors = [0xffffff, 0xffffff, 0xffffff, 0xaaccff, 0xffddaa, 0xffaaaa];
      const starColor = starColors[Math.floor(Math.random() * starColors.length)];
      g.fillStyle(starColor, brightness);
      g.fillCircle(sx, sy, size);
    }

    // Twinkling stars (animated)
    for (let i = 0; i < 20; i++) {
      const star = this.add.circle(
        Math.random() * this.w,
        Math.random() * this.h,
        1 + Math.random() * 2,
        0xffffff,
        0.8
      );
      this.twinkleStars.push(star);
      this.tweens.add({
        targets: star,
        alpha: 0.1,
        duration: 500 + Math.random() * 1500,
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 2000,
      });
    }

    // Title
    this.add.text(this.w / 2, 20, this.lang === 'he' ? 'אסטרואידים!' : 'Asteroids!', {
      fontSize: '32px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Score & Lives with panels
    const scorePanel = this.add.graphics();
    scorePanel.fillStyle(0x000000, 0.4);
    scorePanel.fillRoundedRect(30, 12, 200, 36, 8);
    this.scoreText = this.add.text(50, 20, `${this.lang === 'he' ? 'ניקוד:' : 'Score:'} 0`, {
      fontSize: '24px', color: '#50c878', fontFamily: 'Arial',
    });

    const livesPanel = this.add.graphics();
    livesPanel.fillStyle(0x000000, 0.4);
    livesPanel.fillRoundedRect(this.w - 130, 12, 110, 36, 8);
    this.livesText = this.add.text(this.w - 50, 20, `❤️ ${this.lives}`, {
      fontSize: '24px', color: '#e74c3c', fontFamily: 'Arial',
    }).setOrigin(1, 0);

    // Ship - more detailed design
    this.ship = this.add.container(this.w / 2, this.h - 100);
    const shipG = this.add.graphics();

    // Engine exhaust glow
    shipG.fillStyle(0xff6600, 0.3);
    shipG.fillCircle(0, 20, 10);
    shipG.fillStyle(0xff4400, 0.5);
    shipG.fillCircle(0, 18, 6);

    // Main hull - outer
    shipG.fillStyle(0x3a6fba, 1);
    shipG.beginPath();
    shipG.moveTo(0, -24);
    shipG.lineTo(-18, 16);
    shipG.lineTo(-12, 18);
    shipG.lineTo(0, 12);
    shipG.lineTo(12, 18);
    shipG.lineTo(18, 16);
    shipG.closePath();
    shipG.fillPath();

    // Wing accents
    shipG.fillStyle(0x2a4f8a, 1);
    shipG.beginPath();
    shipG.moveTo(-18, 16);
    shipG.lineTo(-22, 12);
    shipG.lineTo(-14, 8);
    shipG.closePath();
    shipG.fillPath();
    shipG.beginPath();
    shipG.moveTo(18, 16);
    shipG.lineTo(22, 12);
    shipG.lineTo(14, 8);
    shipG.closePath();
    shipG.fillPath();

    // Inner hull - lighter
    shipG.fillStyle(0x5a9fea, 1);
    shipG.beginPath();
    shipG.moveTo(0, -18);
    shipG.lineTo(-10, 12);
    shipG.lineTo(0, 8);
    shipG.lineTo(10, 12);
    shipG.closePath();
    shipG.fillPath();

    // Cockpit
    shipG.fillStyle(0x88ddff, 0.9);
    shipG.fillCircle(0, -6, 6);
    shipG.fillStyle(0xaaeeff, 0.6);
    shipG.fillCircle(-2, -8, 3);

    // Hull edge highlight
    shipG.lineStyle(1, 0x88bbee, 0.5);
    shipG.beginPath();
    shipG.moveTo(0, -24);
    shipG.lineTo(-18, 16);
    shipG.moveTo(0, -24);
    shipG.lineTo(18, 16);
    shipG.strokePath();

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
    // Better bullet - elongated with glow
    const bulletContainer = this.add.container(this.ship.x, this.ship.y - 25);
    const bg = this.add.graphics();
    // Glow
    bg.fillStyle(0xffff00, 0.2);
    bg.fillCircle(0, 0, 8);
    // Core
    bg.fillStyle(0xffff44, 1);
    bg.fillEllipse(0, 0, 5, 10);
    bg.fillStyle(0xffffff, 0.8);
    bg.fillEllipse(0, -1, 3, 6);
    bulletContainer.add(bg);

    // We still use a circle for physics detection
    const bullet = this.add.circle(this.ship.x, this.ship.y - 25, 4, 0xffff00, 0);
    this.physics.add.existing(bullet);
    (bullet.body as Phaser.Physics.Arcade.Body).setVelocityY(-600);
    this.bullets.add(bullet);

    // Sync container to bullet
    this.tweens.add({
      targets: bulletContainer,
      y: -50,
      duration: 1500,
      onUpdate: () => {
        if (bullet.active) {
          bulletContainer.x = bullet.x;
          bulletContainer.y = bullet.y;
        }
      },
      onComplete: () => bulletContainer.destroy(),
    });
  }

  private spawnAsteroid(size: 'big' | 'medium' | 'small', x?: number, y?: number) {
    const stockNames = ['Solar', 'Koogle', 'Sesla', 'Lemon'];
    const stockName = stockNames[Math.floor(Math.random() * stockNames.length)];

    const ax = x ?? Math.random() * this.w;
    const ay = y ?? Math.random() * 200 - 100;

    const container = this.add.container(ax, ay);
    const radius = size === 'big' ? 40 : size === 'medium' ? 25 : 12;

    const g = this.add.graphics();

    // Brownish-gray colors varying by size
    const baseColors = {
      big: { main: 0x7a6b5a, dark: 0x5a4b3a, light: 0x9a8b7a, edge: 0x4a3b2a },
      medium: { main: 0x8a7b6a, dark: 0x6a5b4a, light: 0xaa9b8a, edge: 0x5a4b3a },
      small: { main: 0x9a8b7a, dark: 0x7a6b5a, light: 0xbaa99a, edge: 0x6a5b4a },
    };
    const colors = baseColors[size];

    // More irregular shape with 12 vertices
    const vertices: { x: number; y: number }[] = [];
    const numVerts = size === 'big' ? 12 : size === 'medium' ? 10 : 8;
    for (let i = 0; i < numVerts; i++) {
      const angle = (i / numVerts) * Math.PI * 2;
      const r = radius * (0.6 + Math.random() * 0.4);
      vertices.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
      });
    }

    // Shadow / dark base
    g.fillStyle(colors.dark, 1);
    g.beginPath();
    for (let i = 0; i < vertices.length; i++) {
      const v = vertices[i];
      if (i === 0) g.moveTo(v.x + 2, v.y + 2);
      else g.lineTo(v.x + 2, v.y + 2);
    }
    g.closePath();
    g.fillPath();

    // Main body
    g.fillStyle(colors.main, 1);
    g.beginPath();
    for (let i = 0; i < vertices.length; i++) {
      const v = vertices[i];
      if (i === 0) g.moveTo(v.x, v.y);
      else g.lineTo(v.x, v.y);
    }
    g.closePath();
    g.fillPath();

    // Highlight on upper-left
    g.fillStyle(colors.light, 0.4);
    g.beginPath();
    for (let i = 0; i < Math.floor(vertices.length / 3); i++) {
      const v = vertices[i];
      const scale = 0.7;
      if (i === 0) g.moveTo(v.x * scale - 3, v.y * scale - 3);
      else g.lineTo(v.x * scale - 3, v.y * scale - 3);
    }
    g.closePath();
    g.fillPath();

    // Craters
    if (size !== 'small') {
      const numCraters = size === 'big' ? 3 : 2;
      for (let c = 0; c < numCraters; c++) {
        const cx = (Math.random() - 0.5) * radius * 0.8;
        const cy = (Math.random() - 0.5) * radius * 0.8;
        const cr = radius * (0.08 + Math.random() * 0.12);
        g.fillStyle(colors.dark, 0.6);
        g.fillCircle(cx, cy, cr);
        g.fillStyle(colors.light, 0.2);
        g.fillCircle(cx - 1, cy - 1, cr * 0.6);
      }
    }

    // Edge outline
    g.lineStyle(1.5, colors.edge, 0.7);
    g.beginPath();
    for (let i = 0; i < vertices.length; i++) {
      const v = vertices[i];
      if (i === 0) g.moveTo(v.x, v.y);
      else g.lineTo(v.x, v.y);
    }
    g.closePath();
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
    // Initial flash
    const flash = this.add.circle(x, y, 25, 0xffffff, 0.6);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 2,
      duration: 200,
      onComplete: () => flash.destroy(),
    });

    // Shockwave ring
    const ring = this.add.circle(x, y, 10, 0xffd700, 0);
    ring.setStrokeStyle(2, 0xffd700, 0.8);
    this.tweens.add({
      targets: ring,
      scaleX: 4,
      scaleY: 4,
      alpha: 0,
      duration: 500,
      onComplete: () => ring.destroy(),
    });

    // Particles - varied sizes and colors
    for (let i = 0; i < 18; i++) {
      const colors = [0xffd700, 0xff6600, 0xff0000, 0xffaa00, 0xff4400, 0xffcc00];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 2 + Math.random() * 6;
      const particle = this.add.circle(x, y, size, color);
      const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 40 + Math.random() * 120;

      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0,
        duration: 300 + Math.random() * 500,
        onComplete: () => particle.destroy(),
      });
    }

    // Debris sparks (small fast particles)
    for (let i = 0; i < 8; i++) {
      const spark = this.add.circle(x, y, 1, 0xffffff, 0.9);
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 100;
      this.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        duration: 200 + Math.random() * 200,
        onComplete: () => spark.destroy(),
      });
    }
  }

  private endGame() {
    this.gameOver = true;
    this.store.completeMiniGame('asteroids');

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(0, 0, this.w, this.h);

    // Results panel
    const panelW = 500;
    const panelH = 280;
    const panelX = this.w / 2 - panelW / 2;
    const panelY = this.h / 2 - panelH / 2 - 20;
    overlay.fillStyle(0x0a0a2e, 0.95);
    overlay.fillRoundedRect(panelX, panelY, panelW, panelH, 20);
    overlay.lineStyle(3, 0xffd700, 0.6);
    overlay.strokeRoundedRect(panelX, panelY, panelW, panelH, 20);

    this.add.text(this.w / 2, panelY + 50,
      this.lang === 'he' ? 'המשחק נגמר!' : 'Game Over!', {
      fontSize: '56px', color: '#ffd700', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(this.w / 2, panelY + 140,
      `${this.lang === 'he' ? 'ניקוד:' : 'Score:'} ${this.score}`, {
      fontSize: '40px', color: '#ffffff', fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Score rating
    const ratingText = this.score >= 200 ? '⭐⭐⭐' : this.score >= 100 ? '⭐⭐' : '⭐';
    this.add.text(this.w / 2, panelY + 200, ratingText, {
      fontSize: '36px',
    }).setOrigin(0.5);

    this.createButton(this.w / 2, panelY + panelH + 40,
      this.lang === 'he' ? 'המשך' : 'Continue',
      () => this.goToScene('Instructions', { gameId: 'tradingSim' }),
      200, 50);
  }
}
