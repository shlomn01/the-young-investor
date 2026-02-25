import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../store/gameStore';
import { phaserBridge } from '../../utils/phaserBridge';
import { formatCurrency, formatPercent } from '../../utils/formatUtils';
import {
  FONTS, CSS_COLORS, STOCK_CSS_COLORS, STOCK_DISPLAY_NAMES,
} from '../../config/constants';
import type { StockName } from '../../config/constants';

interface TradePanelData {
  round: number;
}

export function TradePanel() {
  const [visible, setVisible] = useState(false);
  const [roundData, setRoundData] = useState<TradePanelData | null>(null);
  const [selectedStock, setSelectedStock] = useState<StockName | null>(null);
  const [tradeAmount, setTradeAmount] = useState(1);

  const { t } = useTranslation();
  const { cash, portfolio, stockPrices, language, buyStock, sellStock, calculateAssets } = useGameStore();
  const isRtl = language === 'he';
  const font = isRtl ? FONTS.he : FONTS.en;

  useEffect(() => {
    const show = (data: TradePanelData) => {
      setRoundData(data);
      setVisible(true);
      setSelectedStock(null);
      setTradeAmount(1);
    };
    const hide = () => setVisible(false);
    phaserBridge.on('show-trade-panel', show);
    phaserBridge.on('hide-trade-panel', hide);
    return () => {
      phaserBridge.off('show-trade-panel', show);
      phaserBridge.off('hide-trade-panel', hide);
    };
  }, []);

  const handleBuy = useCallback(() => {
    if (!selectedStock) return;
    const price = stockPrices[selectedStock];
    const cost = price * tradeAmount;
    if (cost > cash) return;
    buyStock(selectedStock, tradeAmount, price);
    calculateAssets();
    phaserBridge.emit('trade-executed', {
      stock: selectedStock,
      action: 'buy',
      shares: tradeAmount,
    });
  }, [selectedStock, tradeAmount, stockPrices, cash, buyStock, calculateAssets]);

  const handleSell = useCallback(() => {
    if (!selectedStock) return;
    const holding = portfolio[selectedStock];
    if (tradeAmount > holding.shares) return;
    const price = stockPrices[selectedStock];
    sellStock(selectedStock, tradeAmount, price);
    calculateAssets();
    phaserBridge.emit('trade-executed', {
      stock: selectedStock,
      action: 'sell',
      shares: tradeAmount,
    });
  }, [selectedStock, tradeAmount, portfolio, stockPrices, sellStock, calculateAssets]);

  const handleDone = () => {
    setVisible(false);
    phaserBridge.emit('hide-trade-panel');
    phaserBridge.emit('scene-action', 'trade-complete');
  };

  if (!visible || !roundData) return null;

  const stocks = Object.keys(stockPrices) as StockName[];

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        zIndex: 40,
        background: 'rgba(0,0,0,0.5)',
        animation: 'fade-in 0.3s ease-out',
      }}
    >
      <div className="gold-panel" style={{
        width: '90%',
        maxWidth: 1000,
        maxHeight: '85vh',
        padding: 28,
        fontFamily: font,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        overflow: 'auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{
            color: CSS_COLORS.accent,
            fontSize: 28,
            fontWeight: 900,
            margin: 0,
            fontFamily: font,
          }}>
            {t('trade.title')}
          </h2>
          <div style={{
            color: CSS_COLORS.textLight,
            fontFamily: FONTS.mono,
            fontSize: 18,
          }}>
            {t('hud.cash')}: <span style={{ color: CSS_COLORS.accent, fontWeight: 700 }}>
              {formatCurrency(cash, language)}
            </span>
          </div>
        </div>

        {/* Stock Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
        }}>
          {stocks.map((stock) => {
            const price = stockPrices[stock];
            const holding = portfolio[stock];
            const isSelected = selectedStock === stock;
            const stockColor = STOCK_CSS_COLORS[stock];
            const displayName = STOCK_DISPLAY_NAMES[language][stock];
            const pnl = holding.shares > 0
              ? ((price - holding.avgPrice) / holding.avgPrice) * 100
              : 0;

            return (
              <div
                key={stock}
                onClick={() => setSelectedStock(stock)}
                style={{
                  background: isSelected
                    ? 'rgba(255,255,255,0.12)'
                    : 'rgba(255,255,255,0.04)',
                  borderRadius: 12,
                  padding: 16,
                  cursor: 'pointer',
                  border: isSelected
                    ? `2px solid ${stockColor}`
                    : '2px solid transparent',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? `0 0 12px ${stockColor}40` : 'none',
                }}
              >
                {/* Stock name + color dot */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                }}>
                  <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: stockColor,
                    boxShadow: `0 0 6px ${stockColor}`,
                  }} />
                  <span style={{
                    color: CSS_COLORS.textLight,
                    fontWeight: 700,
                    fontSize: 16,
                    fontFamily: font,
                  }}>
                    {displayName}
                  </span>
                </div>

                {/* Price */}
                <div style={{
                  fontFamily: FONTS.mono,
                  fontSize: 24,
                  fontWeight: 700,
                  color: CSS_COLORS.textLight,
                  marginBottom: 4,
                }}>
                  {formatCurrency(price, language)}
                </div>

                {/* Holdings */}
                {holding.shares > 0 && (
                  <div style={{
                    fontSize: 13,
                    color: CSS_COLORS.textMuted,
                    fontFamily: FONTS.mono,
                  }}>
                    {holding.shares} {t('trade.shares')} ·{' '}
                    <span style={{
                      color: pnl >= 0 ? CSS_COLORS.secondary : CSS_COLORS.danger,
                    }}>
                      {formatPercent(pnl)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Trade Controls */}
        {selectedStock && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 12,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            animation: 'slide-in-bottom 0.2s ease-out',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
            }}>
              <span style={{ color: CSS_COLORS.textMuted, fontFamily: font }}>
                {t('trade.amount')}:
              </span>
              {[1, 5, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setTradeAmount(n)}
                  style={{
                    background: tradeAmount === n
                      ? CSS_COLORS.primary
                      : 'rgba(255,255,255,0.08)',
                    color: CSS_COLORS.textLight,
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 18px',
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: FONTS.mono,
                    transition: 'background 0.15s',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>

            <div style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
            }}>
              <button
                onClick={handleBuy}
                disabled={stockPrices[selectedStock] * tradeAmount > cash}
                style={{
                  background: stockPrices[selectedStock] * tradeAmount > cash
                    ? '#333'
                    : `linear-gradient(135deg, ${CSS_COLORS.secondary}, #3daa64)`,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '12px 36px',
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: stockPrices[selectedStock] * tradeAmount > cash
                    ? 'not-allowed'
                    : 'pointer',
                  fontFamily: font,
                  opacity: stockPrices[selectedStock] * tradeAmount > cash ? 0.5 : 1,
                  boxShadow: '0 4px 12px rgba(80,200,120,0.3)',
                }}
              >
                {t('trade.buy')} ({formatCurrency(stockPrices[selectedStock] * tradeAmount, language)})
              </button>

              <button
                onClick={handleSell}
                disabled={!portfolio[selectedStock] || portfolio[selectedStock].shares < tradeAmount}
                style={{
                  background: (!portfolio[selectedStock] || portfolio[selectedStock].shares < tradeAmount)
                    ? '#333'
                    : `linear-gradient(135deg, ${CSS_COLORS.danger}, #c0392b)`,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '12px 36px',
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: (!portfolio[selectedStock] || portfolio[selectedStock].shares < tradeAmount)
                    ? 'not-allowed'
                    : 'pointer',
                  fontFamily: font,
                  opacity: (!portfolio[selectedStock] || portfolio[selectedStock].shares < tradeAmount) ? 0.5 : 1,
                  boxShadow: '0 4px 12px rgba(231,76,60,0.3)',
                }}
              >
                {t('trade.sell')}
              </button>
            </div>
          </div>
        )}

        {/* Portfolio Summary */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 12,
          padding: 16,
        }}>
          <div style={{
            fontSize: 14,
            color: CSS_COLORS.textMuted,
            marginBottom: 8,
            fontFamily: font,
            fontWeight: 700,
          }}>
            {t('trade.portfolio')}
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
          }}>
            {stocks.map((stock) => {
              const holding = portfolio[stock];
              if (holding.shares === 0) return null;
              const value = holding.shares * stockPrices[stock];
              return (
                <div key={stock} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: STOCK_CSS_COLORS[stock],
                  }} />
                  <span style={{
                    color: CSS_COLORS.textLight,
                    fontFamily: FONTS.mono,
                    fontSize: 14,
                  }}>
                    {STOCK_DISPLAY_NAMES[language][stock]}: {holding.shares} x {formatCurrency(stockPrices[stock], language)} = {formatCurrency(value, language)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Done button */}
        <button
          onClick={handleDone}
          className="menu-btn"
          style={{ alignSelf: 'center', fontFamily: font, fontSize: 20, padding: '12px 40px' }}
        >
          {t('trade.done')}
        </button>
      </div>
    </div>
  );
}
