import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';
import { BootScene } from '../game/scenes/BootScene';
import { StreetScene } from '../game/scenes/street/StreetScene';
import { LivingRoomScene } from '../game/scenes/home/LivingRoomScene';
import { BedroomScene } from '../game/scenes/home/BedroomScene';
import { ComputerScene } from '../game/scenes/home/ComputerScene';
import { BankScene } from '../game/scenes/locations/BankScene';
import { SchoolScene } from '../game/scenes/locations/SchoolScene';
import { LibraryScene } from '../game/scenes/locations/LibraryScene';
import { HotelScene } from '../game/scenes/locations/HotelScene';
import { HotelRoomScene } from '../game/scenes/locations/HotelRoomScene';
import { GuruScene } from '../game/scenes/locations/GuruScene';
import { ComputerShopScene } from '../game/scenes/locations/ComputerShopScene';
import { TradeScene } from '../game/scenes/trading/TradeScene';
import { WaitingScene } from '../game/scenes/trading/WaitingScene';
import { PercentsGame } from '../game/scenes/minigames/PercentsGame';
import { StockQuizGame } from '../game/scenes/minigames/StockQuizGame';
import { AsteroidsGame } from '../game/scenes/minigames/AsteroidsGame';
import { TradingSimGame } from '../game/scenes/minigames/TradingSimGame';
import { BarMitzvahScene } from '../game/scenes/story/BarMitzvahScene';
import { CreditsScene } from '../game/scenes/story/CreditsScene';
import { InstructionsScene } from '../game/scenes/utility/InstructionsScene';

export function createGameConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent,
    backgroundColor: '#2c3e50',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [
      BootScene,
      StreetScene,
      LivingRoomScene,
      BedroomScene,
      ComputerScene,
      BankScene,
      SchoolScene,
      LibraryScene,
      HotelScene,
      HotelRoomScene,
      GuruScene,
      ComputerShopScene,
      TradeScene,
      WaitingScene,
      PercentsGame,
      StockQuizGame,
      AsteroidsGame,
      TradingSimGame,
      BarMitzvahScene,
      CreditsScene,
      InstructionsScene,
    ],
    pixelArt: false,
    antialias: true,
  };
}
