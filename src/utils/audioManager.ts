import Phaser from 'phaser';
import { MUSIC_KEYS, SFX_KEYS } from '../config/constants';

type MusicKey = (typeof MUSIC_KEYS)[keyof typeof MUSIC_KEYS];
type SfxKey = (typeof SFX_KEYS)[keyof typeof SFX_KEYS];

class AudioManager {
  private scene: Phaser.Scene | null = null;
  private currentMusic: Phaser.Sound.BaseSound | null = null;
  private currentMusicKey: string | null = null;
  private musicVolume = 0.4;
  private sfxVolume = 0.7;
  private muted = false;

  /** Call once per scene change to give the manager access to the active scene */
  setScene(scene: Phaser.Scene) {
    this.scene = scene;
  }

  // --- Music ---

  playMusic(key: MusicKey, loop = true) {
    if (!this.scene || !this.scene.sound) return;
    // Don't restart same track
    if (this.currentMusicKey === key && this.currentMusic?.isPlaying) return;

    // Check if the audio file is loaded
    if (!this.scene.cache.audio.exists(key)) return;

    this.stopMusic();
    this.currentMusic = this.scene.sound.add(key, {
      loop,
      volume: this.muted ? 0 : this.musicVolume,
    });
    this.currentMusic.play();
    this.currentMusicKey = key;
  }

  stopMusic(fadeMs = 500) {
    if (!this.currentMusic || !this.scene) return;
    if (fadeMs > 0 && this.currentMusic.isPlaying) {
      this.scene.tweens.add({
        targets: this.currentMusic,
        volume: 0,
        duration: fadeMs,
        onComplete: () => {
          this.currentMusic?.stop();
          this.currentMusic?.destroy();
          this.currentMusic = null;
          this.currentMusicKey = null;
        },
      });
    } else {
      this.currentMusic.stop();
      this.currentMusic.destroy();
      this.currentMusic = null;
      this.currentMusicKey = null;
    }
  }

  crossfadeTo(key: MusicKey, durationMs = 1000) {
    if (!this.scene || !this.scene.sound) return;
    if (this.currentMusicKey === key) return;
    if (!this.scene.cache.audio.exists(key)) return;

    const newMusic = this.scene.sound.add(key, {
      loop: true,
      volume: 0,
    });
    newMusic.play();

    // Fade in new
    this.scene.tweens.add({
      targets: newMusic,
      volume: this.muted ? 0 : this.musicVolume,
      duration: durationMs,
    });

    // Fade out old
    if (this.currentMusic?.isPlaying) {
      const oldMusic = this.currentMusic;
      this.scene.tweens.add({
        targets: oldMusic,
        volume: 0,
        duration: durationMs,
        onComplete: () => {
          oldMusic.stop();
          oldMusic.destroy();
        },
      });
    }

    this.currentMusic = newMusic;
    this.currentMusicKey = key;
  }

  // --- SFX ---

  playSfx(key: SfxKey, volume?: number) {
    if (!this.scene || !this.scene.sound || this.muted) return;
    if (!this.scene.cache.audio.exists(key)) return;
    this.scene.sound.play(key, { volume: volume ?? this.sfxVolume });
  }

  // --- Volume Control ---

  setMusicVolume(vol: number) {
    this.musicVolume = Phaser.Math.Clamp(vol, 0, 1);
    if (this.currentMusic && !this.muted) {
      (this.currentMusic as Phaser.Sound.WebAudioSound).setVolume(this.musicVolume);
    }
  }

  setSfxVolume(vol: number) {
    this.sfxVolume = Phaser.Math.Clamp(vol, 0, 1);
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.currentMusic) {
      (this.currentMusic as Phaser.Sound.WebAudioSound).setVolume(
        this.muted ? 0 : this.musicVolume
      );
    }
    return this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  getMusicVolume(): number {
    return this.musicVolume;
  }

  getSfxVolume(): number {
    return this.sfxVolume;
  }
}

/** Singleton audio manager instance */
export const audioManager = new AudioManager();
