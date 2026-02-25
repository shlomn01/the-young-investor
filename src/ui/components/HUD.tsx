import { useGameStore } from '../../store/gameStore';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../utils/formatUtils';
import { FONTS, CSS_COLORS } from '../../config/constants';

export function HUD() {
  const { cash, assets, turn, destination, language, currentScene } = useGameStore();
  const { t } = useTranslation();

  // Don't show HUD on boot/menu screens
  if (currentScene === 'Boot') return null;

  const isRtl = language === 'he';
  const total = cash + assets;
  const progress = Math.min((total / destination) * 100, 100);
  const font = isRtl ? FONTS.he : FONTS.en;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        position: 'absolute',
        top: 12,
        [isRtl ? 'right' : 'left']: 12,
        display: 'flex',
        gap: 10,
        alignItems: 'stretch',
        pointerEvents: 'auto',
        zIndex: 10,
        animation: 'fade-in 0.3s ease-out',
      }}
    >
      {/* Cash */}
      <div style={hudBoxStyle}>
        <span style={{ ...hudLabelStyle, fontFamily: font }}>{t('hud.cash')}</span>
        <span style={hudValueStyle}>
          <span style={{ color: CSS_COLORS.accent, fontSize: 13, marginInlineEnd: 3 }}>₪</span>
          {formatCurrency(cash, language).replace('₪', '')}
        </span>
      </div>

      {/* Assets */}
      <div style={hudBoxStyle}>
        <span style={{ ...hudLabelStyle, fontFamily: font }}>{t('hud.assets')}</span>
        <span style={hudValueStyle}>
          <span style={{ color: CSS_COLORS.accent, fontSize: 13, marginInlineEnd: 3 }}>₪</span>
          {formatCurrency(assets, language).replace('₪', '')}
        </span>
      </div>

      {/* Turn */}
      <div style={hudBoxStyle}>
        <span style={{ ...hudLabelStyle, fontFamily: font }}>{t('hud.turn')}</span>
        <span style={{ ...hudValueStyle, color: CSS_COLORS.primary }}>{turn}</span>
      </div>

      {/* Progress bar */}
      <div style={{ ...hudBoxStyle, minWidth: 160 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
        }}>
          <span style={{ ...hudLabelStyle, fontFamily: font }}>{t('hud.destination')}</span>
          <span style={{
            ...hudLabelStyle,
            fontFamily: FONTS.mono,
            color: CSS_COLORS.accent,
            fontSize: 11,
          }}>
            {formatCurrency(destination, language)}
          </span>
        </div>
        <div style={{
          width: '100%',
          height: 6,
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 3,
          marginTop: 5,
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: progress >= 100
              ? `linear-gradient(90deg, ${CSS_COLORS.secondary}, #7defa0)`
              : `linear-gradient(90deg, ${CSS_COLORS.accent}, #ffed8a)`,
            borderRadius: 3,
            transition: 'width 0.6s ease',
            boxShadow: progress >= 100
              ? '0 0 8px rgba(80,200,120,0.5)'
              : '0 0 8px rgba(255,215,0,0.4)',
          }} />
        </div>
        <span style={{
          fontFamily: FONTS.mono,
          fontSize: 11,
          color: CSS_COLORS.textMuted,
          marginTop: 2,
          alignSelf: isRtl ? 'flex-start' : 'flex-end',
        }}>
          {progress.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

const hudBoxStyle: React.CSSProperties = {
  background: 'rgba(26, 26, 46, 0.85)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: 10,
  padding: '8px 14px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 85,
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
};

const hudLabelStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#8899AA',
  fontWeight: 400,
  letterSpacing: '0.03em',
  textTransform: 'uppercase' as const,
};

const hudValueStyle: React.CSSProperties = {
  fontSize: 18,
  color: '#fff',
  fontWeight: 700,
  fontFamily: "'IBM Plex Mono', monospace",
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '0.02em',
  marginTop: 2,
};
