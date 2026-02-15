import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../store/gameStore';
import { phaserBridge } from '../../utils/phaserBridge';

export function MainMenu() {
  const [visible, setVisible] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [name, setName] = useState('');
  const { t } = useTranslation();
  const { language, setPlayerName, playerName } = useGameStore();
  const isRtl = language === 'he';

  useEffect(() => {
    const show = () => setVisible(true);
    const hide = () => setVisible(false);
    phaserBridge.on('show-main-menu', show);
    phaserBridge.on('hide-main-menu', hide);
    return () => {
      phaserBridge.off('show-main-menu', show);
      phaserBridge.off('hide-main-menu', hide);
    };
  }, []);

  if (!visible) return null;

  const hasSave = playerName !== '';

  const handleNewGame = () => {
    setShowNameInput(true);
  };

  const handleStartWithName = () => {
    if (name.trim()) {
      setPlayerName(name.trim());
      setShowNameInput(false);
      phaserBridge.emit('start-game');
    }
  };

  const handleContinue = () => {
    phaserBridge.emit('continue-game');
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        position: 'absolute',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        pointerEvents: 'auto',
        zIndex: 30,
      }}
    >
      {showNameInput ? (
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.85)',
          borderRadius: 12,
          padding: '24px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          border: '1px solid rgba(255,255,255,0.2)',
        }}>
          <label style={{ color: '#fff', fontSize: 20, fontFamily: 'Arial' }}>
            {t('menu.enterName')}
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStartWithName()}
            placeholder={t('menu.namePlaceholder')}
            dir={isRtl ? 'rtl' : 'ltr'}
            autoFocus
            style={{
              fontSize: 22,
              padding: '10px 16px',
              borderRadius: 8,
              border: '2px solid #4a90d9',
              backgroundColor: '#1a1a2e',
              color: '#fff',
              textAlign: 'center',
              width: 250,
              fontFamily: 'Arial',
              outline: 'none',
            }}
          />
          <button onClick={handleStartWithName} style={menuButtonStyle}>
            {t('game.start')}
          </button>
        </div>
      ) : (
        <>
          <button onClick={handleNewGame} style={menuButtonStyle}>
            {t('menu.newGame')}
          </button>
          {hasSave && (
            <button onClick={handleContinue} style={{ ...menuButtonStyle, backgroundColor: '#50c878' }}>
              {t('menu.continueGame')}
            </button>
          )}
        </>
      )}
    </div>
  );
}

const menuButtonStyle: React.CSSProperties = {
  backgroundColor: '#4a90d9',
  color: '#fff',
  border: 'none',
  borderRadius: 12,
  padding: '14px 48px',
  fontSize: 24,
  fontWeight: 'bold',
  cursor: 'pointer',
  fontFamily: 'Arial, sans-serif',
  transition: 'transform 0.1s, background-color 0.2s',
  minWidth: 220,
};
