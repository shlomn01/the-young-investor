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

export const sceneRegistry: Record<string, typeof Phaser.Scene> = {
  Boot: BootScene,
  Street: StreetScene,
  LivingRoom: LivingRoomScene,
  Bedroom: BedroomScene,
  Computer: ComputerScene,
  Bank: BankScene,
  School: SchoolScene,
  Library: LibraryScene,
  Hotel: HotelScene,
  HotelRoom: HotelRoomScene,
  Guru: GuruScene,
  ComputerShop: ComputerShopScene,
  Trade: TradeScene,
  Waiting: WaitingScene,
  PercentsGame: PercentsGame,
  StockQuizGame: StockQuizGame,
  AsteroidsGame: AsteroidsGame,
  TradingSimGame: TradingSimGame,
  BarMitzvah: BarMitzvahScene,
  Credits: CreditsScene,
  Instructions: InstructionsScene,
};

export function getAllSceneClasses(): typeof Phaser.Scene[] {
  return Object.values(sceneRegistry);
}
