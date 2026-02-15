import EventEmitter from 'eventemitter3';

// Event types for type safety
export interface BridgeEvents {
  // Phaser -> React
  'scene-changed': (sceneKey: string) => void;
  'show-dialogue': (data: { speaker: string; text: string; onComplete?: () => void }) => void;
  'hide-dialogue': () => void;
  'show-trade-panel': (data: { round: number }) => void;
  'hide-trade-panel': () => void;
  'show-portfolio': () => void;
  'hide-portfolio': () => void;
  'show-newspaper': (data: { articleId: string }) => void;
  'hide-newspaper': () => void;
  'portfolio-updated': () => void;
  'show-name-input': () => void;
  'show-main-menu': () => void;
  'hide-main-menu': () => void;

  // React -> Phaser
  'trade-executed': (data: { stock: string; action: 'buy' | 'sell'; shares: number }) => void;
  'dialogue-dismissed': () => void;
  'dialogue-choice': (choiceIndex: number) => void;
  'language-changed': (lang: 'he' | 'en') => void;
  'name-submitted': (name: string) => void;
  'start-game': () => void;
  'continue-game': () => void;
  'scene-action': (action: string) => void;
}

export const phaserBridge = new EventEmitter<BridgeEvents>();
