import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../store/gameStore';
import { phaserBridge } from '../../utils/phaserBridge';
import { FONTS, CSS_COLORS } from '../../config/constants';

interface DialogueData {
  speaker: string;
  text: string;
  portrait?: string;
  onComplete?: () => void;
}

export function DialogueOverlay() {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<DialogueData | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fullTextRef = useRef('');
  const timerRef = useRef<number | null>(null);
  const { t } = useTranslation();
  const { language } = useGameStore();
  const isRtl = language === 'he';

  const typeText = useCallback((text: string) => {
    fullTextRef.current = text;
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    const tick = () => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
        timerRef.current = window.setTimeout(tick, 30);
      } else {
        setIsTyping(false);
      }
    };
    tick();
  }, []);

  const skipTyping = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setDisplayedText(fullTextRef.current);
    setIsTyping(false);
  }, []);

  const dismiss = useCallback(() => {
    if (isTyping) {
      skipTyping();
      return;
    }
    setVisible(false);
    setData(null);
    phaserBridge.emit('dialogue-dismissed');
  }, [isTyping, skipTyping]);

  useEffect(() => {
    const show = (d: DialogueData) => {
      setData(d);
      setVisible(true);
      typeText(d.text);
    };
    const hide = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setVisible(false);
      setData(null);
    };

    phaserBridge.on('show-dialogue', show);
    phaserBridge.on('hide-dialogue', hide);
    return () => {
      phaserBridge.off('show-dialogue', show);
      phaserBridge.off('hide-dialogue', hide);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [typeText]);

  // Keyboard dismiss
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        dismiss();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, dismiss]);

  if (!visible || !data) return null;

  const font = isRtl ? FONTS.he : FONTS.en;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      onClick={dismiss}
      style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        maxWidth: 900,
        pointerEvents: 'auto',
        zIndex: 50,
        cursor: 'pointer',
        animation: 'slide-in-bottom 0.25s ease-out',
      }}
    >
      <div style={{
        background: CSS_COLORS.bgDark,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 20,
        padding: '20px 28px',
        border: `2px solid rgba(255, 215, 0, 0.35)`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 16px rgba(255,215,0,0.15)',
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start',
      }}>
        {/* Character Portrait */}
        {data.portrait && (
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 12,
            border: `2px solid ${CSS_COLORS.accent}`,
            overflow: 'hidden',
            flexShrink: 0,
            background: 'rgba(0,0,0,0.3)',
          }}>
            <img
              src={`assets/images/characters/portraits/${data.portrait}.png`}
              alt={data.speaker}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}

        <div style={{ flex: 1 }}>
          {/* Speaker name */}
          <div style={{
            fontSize: 17,
            color: CSS_COLORS.accent,
            fontWeight: 700,
            marginBottom: 6,
            fontFamily: font,
            textShadow: '0 0 8px rgba(255,215,0,0.3)',
            letterSpacing: '0.02em',
          }}>
            {data.speaker}
          </div>

          {/* Dialogue text */}
          <div style={{
            fontSize: 21,
            color: CSS_COLORS.textLight,
            lineHeight: 1.7,
            fontFamily: font,
            fontWeight: 400,
            minHeight: 52,
          }}>
            {displayedText}
            {isTyping && (
              <span style={{
                opacity: 0.6,
                animation: 'typewriter-cursor 0.8s ease-in-out infinite',
                marginInlineStart: 2,
              }}>▌</span>
            )}
          </div>

          {/* Continue hint */}
          {!isTyping && (
            <div style={{
              fontSize: 13,
              color: CSS_COLORS.textMuted,
              textAlign: isRtl ? 'left' : 'right',
              marginTop: 6,
              fontFamily: font,
              opacity: 0.7,
            }}>
              {t('dialogue.next')} ▶
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
