import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../store/gameStore';
import { phaserBridge } from '../../utils/phaserBridge';
import { FONTS, CSS_COLORS } from '../../config/constants';

export function MainMenu() {
  const [visible, setVisible] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [name, setName] = useState('');
  const { t } = useTranslation();
  const { language, setPlayerName, setLanguage, playerName } = useGameStore();
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
  const font = isRtl ? FONTS.he : FONTS.en;

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

  const toggleLanguage = () => {
    const newLang = language === 'he' ? 'en' : 'he';
    setLanguage(newLang);
    phaserBridge.emit('language-changed', newLang);
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
        animation: 'slide-in-bottom 0.4s ease-out',
      }}
    >
      {showNameInput ? (
        <div style={{
          background: CSS_COLORS.bgDark,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 16,
          padding: '28px 36px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          border: `1px solid ${CSS_COLORS.glassBorder}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <label style={{
            color: CSS_COLORS.textLight,
            fontSize: 22,
            fontFamily: font,
            fontWeight: 700,
          }}>
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
              padding: '12px 18px',
              borderRadius: 10,
              border: `2px solid ${CSS_COLORS.primary}`,
              backgroundColor: 'rgba(26,26,46,0.8)',
              color: CSS_COLORS.textLight,
              textAlign: 'center',
              width: 260,
              fontFamily: font,
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = CSS_COLORS.accent;
              e.target.style.boxShadow = '0 0 12px rgba(255,215,0,0.3)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = CSS_COLORS.primary;
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={handleStartWithName}
            className="menu-btn"
            style={{ fontFamily: font }}
          >
            {t('game.start')}
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={handleNewGame}
            className="menu-btn"
            style={{ fontFamily: font }}
          >
            {t('menu.newGame')}
          </button>
          {hasSave && (
            <button
              onClick={handleContinue}
              className="menu-btn secondary"
              style={{ fontFamily: font }}
            >
              {t('menu.continueGame')}
            </button>
          )}

          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${CSS_COLORS.glassBorder}`,
              borderRadius: 8,
              padding: '8px 20px',
              color: CSS_COLORS.textMuted,
              fontSize: 15,
              cursor: 'pointer',
              fontFamily: font,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)';
              (e.currentTarget as HTMLButtonElement).style.color = CSS_COLORS.textLight;
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
              (e.currentTarget as HTMLButtonElement).style.color = CSS_COLORS.textMuted;
            }}
          >
            <span>{language === 'he' ? '🇮🇱' : '🇬🇧'}</span>
            <span>{language === 'he' ? 'English' : 'עברית'}</span>
          </button>
        </>
      )}
    </div>
  );
}
