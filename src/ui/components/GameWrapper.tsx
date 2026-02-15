import { PhaserGame } from '../../game/PhaserGame';
import { HUD } from './HUD';
import { LanguageToggle } from './LanguageToggle';
import { MainMenu } from './MainMenu';
import { DialogueOverlay } from './DialogueOverlay';
import { TradePanel } from './TradePanel';
import { PortfolioPanel } from './PortfolioPanel';
import { NewspaperModal } from './NewspaperModal';

export function GameWrapper() {
  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#000',
    }}>
      {/* Phaser canvas */}
      <PhaserGame />

      {/* React overlay layer */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}>
        <HUD />
        <LanguageToggle />
        <MainMenu />
        <DialogueOverlay />
        <TradePanel />
        <PortfolioPanel />
        <NewspaperModal />
      </div>
    </div>
  );
}
