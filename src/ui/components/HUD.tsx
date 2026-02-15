import { useGameStore } from '../../store/gameStore';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../utils/formatUtils';

export function HUD() {
  const { cash, assets, turn, destination, language, currentScene } = useGameStore();
  const { t } = useTranslation();

  // Don't show HUD on boot/menu screens
  if (currentScene === 'Boot') return null;

  const isRtl = language === 'he';
  const total = cash + assets;
  const progress = Math.min((total / destination) * 100, 100);

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        position: 'absolute',
        top: 10,
        [isRtl ? 'right' : 'left']: 10,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        pointerEvents: 'auto',
        zIndex: 10,
      }}
    >
      {/* Cash */}
      <div style={hudBoxStyle}>
        <span style={hudLabelStyle}>{t('hud.cash')}</span>
        <span style={hudValueStyle}>{formatCurrency(cash, language)}</span>
      </div>

      {/* Assets */}
      <div style={hudBoxStyle}>
        <span style={hudLabelStyle}>{t('hud.assets')}</span>
        <span style={hudValueStyle}>{formatCurrency(assets, language)}</span>
      </div>

      {/* Turn */}
      <div style={hudBoxStyle}>
        <span style={hudLabelStyle}>{t('hud.turn')}</span>
        <span style={hudValueStyle}>{turn}</span>
      </div>

      {/* Progress bar */}
      <div style={{ ...hudBoxStyle, minWidth: 150 }}>
        <span style={hudLabelStyle}>{t('hud.destination')}: {formatCurrency(destination, language)}</span>
        <div style={{
          width: '100%',
          height: 8,
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 4,
          marginTop: 4,
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: progress >= 100 ? '#50c878' : '#ffd700',
            borderRadius: 4,
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>
    </div>
  );
}

const hudBoxStyle: React.CSSProperties = {
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  borderRadius: 8,
  padding: '8px 14px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 80,
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255,255,255,0.1)',
};

const hudLabelStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#aaa',
  fontFamily: 'Arial, sans-serif',
};

const hudValueStyle: React.CSSProperties = {
  fontSize: 18,
  color: '#fff',
  fontWeight: 'bold',
  fontFamily: 'Arial, sans-serif',
};
