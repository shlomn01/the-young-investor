import { BaseScene } from './BaseScene';
import { COLORS, BG_KEYS, PHASER_FONTS } from '../../config/constants';
import { phaserBridge } from '../../utils/phaserBridge';

export class BootScene extends BaseScene {
  constructor() {
    super('Boot');
  }

  preload() {
    // --- Loading bar UI ---
    const barWidth = 600;
    const barHeight = 40;
    const barX = this.w / 2 - barWidth / 2;
    const barY = this.h / 2 + 60;

    const bgBar = this.add.rectangle(this.w / 2, barY + barHeight / 2, barWidth, barHeight, 0x444444);
    bgBar.setOrigin(0.5);

    const barBorder = this.add.graphics();
    barBorder.lineStyle(2, 0xffd700, 0.8);
    barBorder.strokeRoundedRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4, 6);

    const progressBar = this.add.graphics();
    const progressText = this.add.text(this.w / 2, barY + barHeight + 30, '0%', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: this.fontFamily,
    }).setOrigin(0.5);

    const loadingLabel = this.add.text(this.w / 2, barY - 30, '...טוען נכסים', {
      fontSize: '20px',
      color: '#aaaaaa',
      fontFamily: this.fontFamily,
      rtl: this.isRtl,
    }).setOrigin(0.5);

    // Loading tips
    const tips = this.lang === 'he' ? [
      'מניה היא חלק בבעלות על חברה',
      'פיזור השקעות מקטין סיכון',
      'השקעה לטווח ארוך משתלמת יותר',
      'קנה בזול, מכור ביוקר!',
      'תמיד תקרא את החדשות לפני שאתה משקיע',
      'ריבית דריבית - הכוח החזק ביותר בכלכלה',
      'אל תשקיע כסף שאתה צריך בקרוב',
    ] : [
      'A stock is a piece of ownership in a company',
      'Diversifying investments reduces risk',
      'Long-term investing pays off more',
      'Buy low, sell high!',
      'Always read the news before investing',
      'Compound interest - the most powerful force in finance',
      'Never invest money you need soon',
    ];
    const tipText = this.add.text(this.w / 2, barY + barHeight + 70, '', {
      fontSize: '18px',
      color: '#ffd700',
      fontFamily: this.fontFamily,
      rtl: this.isRtl,
    }).setOrigin(0.5).setAlpha(0);

    let tipIndex = 0;
    const showTip = () => {
      tipText.setText(tips[tipIndex % tips.length]);
      tipIndex++;
      this.tweens.add({
        targets: tipText,
        alpha: { from: 0, to: 0.8 },
        duration: 500,
        yoyo: true,
        hold: 2500,
      });
    };
    showTip();
    const tipTimer = this.time.addEvent({ delay: 3500, callback: showTip, loop: true });

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(COLORS.PRIMARY, 1);
      progressBar.fillRoundedRect(barX, barY, barWidth * value, barHeight, 4);
      progressBar.fillStyle(0xffffff, 0.15);
      progressBar.fillRect(barX, barY, barWidth * value, barHeight / 3);
      progressText.setText(`${Math.floor(value * 100)}%`);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressText.destroy();
      bgBar.destroy();
      barBorder.destroy();
      loadingLabel.destroy();
      tipText.destroy();
      tipTimer.destroy();
    });

    // Title text shown while loading
    this.add.text(this.w / 2, this.h / 2 - 80, 'המשקיע הצעיר', {
      fontSize: '72px',
      color: '#ffd700',
      fontFamily: PHASER_FONTS.he,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
      rtl: true,
    }).setOrigin(0.5);

    this.add.text(this.w / 2, this.h / 2, 'The Young Investor', {
      fontSize: '36px',
      color: '#87ceeb',
      fontFamily: PHASER_FONTS.en,
    }).setOrigin(0.5);

    // === Load ALL image assets ===

    // --- Backgrounds (existing) ---
    this.load.image('bg_title', 'assets/images/backgrounds/title_screen_new.png');
    this.load.image('bg_hotel_lobby', 'assets/images/backgrounds/hotel_lobby.png');
    this.load.image('bg_hotel_corridor', 'assets/images/backgrounds/hotel_corridor.png');
    this.load.image('bg_guru', 'assets/images/backgrounds/guru_room.png');
    this.load.image('bg_computer_shop', 'assets/images/backgrounds/computer_shop.png');
    this.load.image('bg_cityscape', 'assets/images/backgrounds/cityscape.jpg');
    this.load.image('bg_living_room', 'assets/images/backgrounds/living_room_bg.jpg');
    this.load.image('bg_summer', 'assets/images/backgrounds/summer_bg.png');
    this.load.image('bg_living_room_interior', 'assets/images/backgrounds/living_room_interior.png');

    // Street backgrounds
    this.load.image('bg_street_residential', 'assets/images/backgrounds/street_residential.png');
    this.load.image('bg_street_commercial', 'assets/images/backgrounds/street_commercial.png');
    this.load.image('bg_street_urban', 'assets/images/backgrounds/street_urban.png');

    // --- New backgrounds (Phase 6A - will be generated) ---
    // These use silent fail if files don't exist yet
    this.load.image(BG_KEYS.BANK, 'assets/images/backgrounds/bank_interior.png');
    this.load.image(BG_KEYS.SCHOOL, 'assets/images/backgrounds/school_interior.png');
    this.load.image(BG_KEYS.LIBRARY, 'assets/images/backgrounds/library_interior.png');
    this.load.image(BG_KEYS.BAR_MITZVAH, 'assets/images/backgrounds/bar_mitzvah_interior.png');
    this.load.image(BG_KEYS.GURU_ROOM, 'assets/images/backgrounds/guru_room_new.png');
    this.load.image(BG_KEYS.BEDROOM, 'assets/images/backgrounds/bedroom.png');
    this.load.image(BG_KEYS.STREET_EVENING, 'assets/images/backgrounds/street_evening.png');
    this.load.image(BG_KEYS.PERCENTS_GAME, 'assets/images/backgrounds/percents_game_bg.png');
    this.load.image(BG_KEYS.QUIZ_STAGE, 'assets/images/backgrounds/quiz_stage_bg.png');

    // Building sprites
    this.load.image('bld_home', 'assets/images/buildings/building_home.png');
    this.load.image('bld_school', 'assets/images/buildings/building_school.png');
    this.load.image('bld_bank', 'assets/images/buildings/building_bank.png');
    this.load.image('bld_library', 'assets/images/buildings/building_library.png');
    this.load.image('bld_stock_exchange', 'assets/images/buildings/building_stock_exchange.png');
    this.load.image('bld_hotel', 'assets/images/buildings/building_hotel.png');
    this.load.image('bld_synagogue', 'assets/images/buildings/building_synagogue.png');
    this.load.image('bld_computer_shop', 'assets/images/buildings/building_computer_shop.png');

    // Original character images (fallback)
    this.load.image('char_cartoon', 'assets/images/characters/cartoon_character.png');
    this.load.image('char_large', 'assets/images/characters/character_large.png');
    this.load.image('char_misc', 'assets/images/characters/character_misc.png');

    // Objects
    this.load.image('obj_meteor', 'assets/images/objects/meteor.png');
    this.load.image('obj_platform', 'assets/images/objects/platform.png');
    this.load.image('obj_synagogue', 'assets/images/objects/synagogue.png');

    // --- Stock company logo icons (Phase 6A Tier 4) ---
    this.load.image('icon_solar', 'assets/images/icons/icon_solar.png');
    this.load.image('icon_koogle', 'assets/images/icons/icon_koogle.png');
    this.load.image('icon_sesla', 'assets/images/icons/icon_sesla.png');
    this.load.image('icon_lemon', 'assets/images/icons/icon_lemon.png');
    this.load.image('icon_shekel', 'assets/images/icons/icon_shekel.png');

    // --- Character Portraits (96x96 face close-ups) ---
    const portraitChars = [
      'player', 'dad', 'mom', 'teacher', 'banker',
      'librarian', 'shopkeeper', 'guru', 'receptionist',
      'grandpa', 'grandma',
    ];
    for (const name of portraitChars) {
      this.load.image(`portrait_${name}`, `assets/images/characters/portraits/portrait_${name}.png`);
    }

    // --- LPC Character Spritesheets ---
    // 64x64 per frame
    // Walk: 512x256, 8 columns × 4 rows
    // Idle: 192x256, 3 columns × 4 rows
    // Row order: up(0), left(1), down(2), right(3)
    const characters = [
      'player', 'npc_dad', 'npc_mom', 'npc_teacher', 'npc_banker',
      'npc_librarian', 'npc_shopkeeper', 'npc_guru', 'npc_receptionist',
      'npc_grandpa', 'npc_grandma',
    ];

    for (const char of characters) {
      this.load.spritesheet(`${char}_walk`, `assets/images/characters/${char}_walk.png`, {
        frameWidth: 64, frameHeight: 64,
      });
      this.load.spritesheet(`${char}_idle`, `assets/images/characters/${char}_idle.png`, {
        frameWidth: 64, frameHeight: 64,
      });
    }

    // Kenney UI elements
    this.load.image('ui_btn_rect', 'assets/images/ui/kenney/button_rectangle_depth_gloss.png');
    this.load.image('ui_btn_round', 'assets/images/ui/kenney/button_round_depth_gloss.png');
    this.load.image('ui_panel', 'assets/images/ui/kenney/slide_horizontal_color.png');

    // --- Audio (Phase 6E - will be generated) ---
    // Music tracks
    this.loadAudioSafe('music_title', 'assets/audio/music/title.mp3');
    this.loadAudioSafe('music_street', 'assets/audio/music/street.mp3');
    this.loadAudioSafe('music_home', 'assets/audio/music/home.mp3');
    this.loadAudioSafe('music_school', 'assets/audio/music/school.mp3');
    this.loadAudioSafe('music_bank', 'assets/audio/music/bank.mp3');
    this.loadAudioSafe('music_hotel', 'assets/audio/music/hotel.mp3');
    this.loadAudioSafe('music_minigame', 'assets/audio/music/minigame.mp3');
    this.loadAudioSafe('music_barmitzvah', 'assets/audio/music/barmitzvah.mp3');
    this.loadAudioSafe('music_credits', 'assets/audio/music/credits.mp3');
    this.loadAudioSafe('music_waiting', 'assets/audio/music/waiting.mp3');

    // SFX
    const sfxFiles = [
      'click', 'panel_open', 'panel_close', 'notify',
      'coin', 'register', 'buy', 'sell',
      'door', 'footstep', 'elevator',
      'laser', 'explosion', 'correct', 'wrong',
      'cheer', 'fireworks', 'dialogue',
    ];
    for (const sfx of sfxFiles) {
      this.loadAudioSafe(`sfx_${sfx}`, `assets/audio/sfx/${sfx}.mp3`);
    }
  }

  /** Load audio without crashing if the file doesn't exist yet */
  private loadAudioSafe(key: string, path: string) {
    this.load.audio(key, path);
    // Phaser will emit a 'loaderror' for missing files but continue loading
  }

  create() {
    super.create();

    // Suppress load errors for missing optional assets
    // (portraits, new backgrounds, audio that hasn't been generated yet)

    // --- Main menu screen ---
    // Try title background image, fall back to gradient
    if (this.textures.exists('bg_title') && this.textures.get('bg_title').key !== '__MISSING') {
      this.add.image(this.w / 2, this.h / 2, 'bg_title').setDisplaySize(this.w, this.h);
      // Dark overlay for readability
      this.add.rectangle(this.w / 2, this.h / 2, this.w, this.h, 0x000000, 0.4);
    } else {
      this.drawGradientBg(0x1a1a2e, 0x16213e);
    }

    // Title
    this.add.text(this.w / 2, 200, 'המשקיע הצעיר', {
      fontSize: '80px',
      color: '#ffd700',
      fontFamily: PHASER_FONTS.he,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
      rtl: true,
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(this.w / 2, 290, 'The Young Investor', {
      fontSize: '40px',
      color: '#87ceeb',
      fontFamily: PHASER_FONTS.en,
    }).setOrigin(0.5);

    // Description
    this.add.text(this.w / 2, 360, 'משחק ללימוד השקעות | An Investment Learning Game', {
      fontSize: '22px',
      color: '#aaaaaa',
      fontFamily: this.fontFamily,
      rtl: this.isRtl,
    }).setOrigin(0.5);

    // Animated floating coin symbols
    this.drawCoins();

    // Tell React to show the main menu overlay
    phaserBridge.emit('show-main-menu');

    // Listen for game start from React
    phaserBridge.once('start-game', () => {
      phaserBridge.emit('hide-main-menu');
      this.goToScene('Street', { streetIndex: 0 });
    });

    phaserBridge.once('continue-game', () => {
      phaserBridge.emit('hide-main-menu');
      const savedScene = this.store.currentScene;
      if (savedScene && savedScene !== 'Boot') {
        this.goToScene(savedScene);
      } else {
        this.goToScene('Street', { streetIndex: 0 });
      }
    });

    this.fadeIn(500);
  }

  private drawCoins() {
    const coinPositions = [
      { x: 200, y: 500 },
      { x: 400, y: 650 },
      { x: 1520, y: 500 },
      { x: 1720, y: 650 },
      { x: 300, y: 800 },
      { x: 1620, y: 800 },
    ];

    for (const pos of coinPositions) {
      const container = this.add.container(pos.x, pos.y);

      const coinGfx = this.add.graphics();
      coinGfx.fillStyle(0xffd700, 0.3);
      coinGfx.fillCircle(0, 0, 25);
      coinGfx.lineStyle(2, 0xffd700, 0.5);
      coinGfx.strokeCircle(0, 0, 25);
      container.add(coinGfx);

      const coinText = this.add.text(0, 0, '₪', {
        fontSize: '24px',
        color: '#ffd700',
        fontFamily: PHASER_FONTS.he,
      }).setOrigin(0.5).setAlpha(0.5);
      container.add(coinText);

      this.tweens.add({
        targets: container,
        y: pos.y - 10,
        duration: 2000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }
}
