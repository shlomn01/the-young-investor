import Phaser from 'phaser';

// Audio manager for background music and sound effects
// Audio files will be loaded from public/assets/audio/
export class AudioManager {
  private scene: Phaser.Scene;
  private currentMusic: Phaser.Sound.BaseSound | null = null;
  private musicVolume = 0.5;
  private sfxVolume = 0.7;
  private muted = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  playMusic(key: string, loop = true) {
    if (this.currentMusic) {
      this.currentMusic.stop();
    }

    if (this.scene.sound.get(key)) {
      this.currentMusic = this.scene.sound.add(key, {
        loop,
        volume: this.muted ? 0 : this.musicVolume,
      });
      this.currentMusic.play();
    }
  }

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  playSfx(key: string) {
    if (this.scene.sound.get(key)) {
      this.scene.sound.play(key, {
        volume: this.muted ? 0 : this.sfxVolume,
      });
    }
  }

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    // Note: Phaser's sound manager handles volume updates
  }

  setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.currentMusic) {
      // Type-safe volume setting
      (this.currentMusic as Phaser.Sound.WebAudioSound).setVolume(this.muted ? 0 : this.musicVolume);
    }
    return this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }
}
