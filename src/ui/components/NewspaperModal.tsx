import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../store/gameStore';
import { phaserBridge } from '../../utils/phaserBridge';
import { FONTS, STOCK_CSS_COLORS, STOCK_DISPLAY_NAMES } from '../../config/constants';
import { STOCK_ROUNDS } from '../../game/data/stockData';
import type { StockName } from '../../config/constants';

interface NewspaperData {
  articleId: string;
}

export function NewspaperModal() {
  const [visible, setVisible] = useState(false);
  const [articleData, setArticleData] = useState<NewspaperData | null>(null);

  const { t } = useTranslation();
  const { language, turn } = useGameStore();
  const isRtl = language === 'he';
  const font = isRtl ? FONTS.he : FONTS.en;

  useEffect(() => {
    const show = (data: NewspaperData) => {
      setArticleData(data);
      setVisible(true);
    };
    const hide = () => setVisible(false);
    phaserBridge.on('show-newspaper', show);
    phaserBridge.on('hide-newspaper', hide);
    return () => {
      phaserBridge.off('show-newspaper', show);
      phaserBridge.off('hide-newspaper', hide);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    phaserBridge.emit('hide-newspaper');
    phaserBridge.emit('scene-action', 'newspaper-closed');
  };

  if (!visible || !articleData) return null;

  // Determine which round's news to show
  const roundNum = parseInt(articleData.articleId) || turn || 1;
  const roundData = STOCK_ROUNDS[roundNum];

  const date = new Date();
  const dateStr = isRtl
    ? `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    : `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      onClick={handleClose}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        zIndex: 45,
        background: 'rgba(0,0,0,0.6)',
        animation: 'fade-in 0.3s ease-out',
        cursor: 'pointer',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="newspaper-layout"
        style={{
          width: '85%',
          maxWidth: 720,
          maxHeight: '80vh',
          padding: '32px 36px',
          overflow: 'auto',
          animation: 'slide-in-bottom 0.3s ease-out',
          cursor: 'default',
        }}
      >
        {/* Newspaper Header */}
        <div style={{
          textAlign: 'center',
          borderBottom: '3px solid #2C2C2C',
          paddingBottom: 12,
          marginBottom: 20,
        }}>
          <div style={{
            fontSize: 14,
            color: '#666',
            marginBottom: 4,
          }}>
            {dateStr} · {isRtl ? 'מהדורה מיוחדת' : 'Special Edition'}
          </div>
          <h1 style={{
            fontSize: 36,
            fontWeight: 900,
            margin: 0,
            fontFamily: isRtl ? `'Heebo', serif` : `'Georgia', 'Times New Roman', serif`,
            letterSpacing: isRtl ? 0 : '0.05em',
            textTransform: isRtl ? undefined : 'uppercase',
            lineHeight: 1.2,
          }}>
            {isRtl ? 'עיתון ההשקעות' : 'The Investment Times'}
          </h1>
          <div style={{
            width: 60,
            height: 2,
            background: '#8B7355',
            margin: '8px auto 0',
          }} />
        </div>

        {/* News Articles */}
        {roundData && Object.entries(roundData.news).map(([stock, news]) => {
          const stockName = stock as StockName;
          const displayName = STOCK_DISPLAY_NAMES[language][stockName];
          const stockColor = STOCK_CSS_COLORS[stockName];

          return (
            <article key={stock} style={{
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: '1px solid #ccc',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 6,
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: stockColor,
                }} />
                <h2 style={{
                  fontSize: 20,
                  fontWeight: 700,
                  margin: 0,
                  fontFamily: font,
                  color: '#1a1a1a',
                }}>
                  {displayName}
                </h2>
              </div>
              <p style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: '#333',
                fontFamily: font,
                margin: 0,
              }}>
                {news[language]}
              </p>
            </article>
          );
        })}

        {/* Close hint */}
        <div style={{
          textAlign: 'center',
          color: '#888',
          fontSize: 14,
          fontFamily: font,
          marginTop: 12,
        }}>
          {isRtl ? 'לחץ לסגירה' : 'Click to close'}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            display: 'block',
            margin: '16px auto 0',
            background: '#2C2C2C',
            color: '#F5F0E1',
            border: 'none',
            borderRadius: 8,
            padding: '10px 32px',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: font,
          }}
        >
          {t('dialogue.next')}
        </button>
      </div>
    </div>
  );
}
