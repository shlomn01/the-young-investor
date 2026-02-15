import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../store/gameStore';
import { phaserBridge } from '../../utils/phaserBridge';

interface DialogueData {
  speaker: string;
  text: string;
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
      }}
    >
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: 16,
        padding: '20px 28px',
        border: '2px solid rgba(74, 144, 217, 0.5)',
        backdropFilter: 'blur(8px)',
      }}>
        {/* Speaker name */}
        <div style={{
          fontSize: 18,
          color: '#ffd700',
          fontWeight: 'bold',
          marginBottom: 8,
          fontFamily: 'Arial, sans-serif',
        }}>
          {data.speaker}
        </div>

        {/* Dialogue text */}
        <div style={{
          fontSize: 22,
          color: '#fff',
          lineHeight: 1.6,
          fontFamily: 'Arial, sans-serif',
          minHeight: 60,
        }}>
          {displayedText}
          {isTyping && <span style={{ opacity: 0.5 }}>▌</span>}
        </div>

        {/* Continue hint */}
        {!isTyping && (
          <div style={{
            fontSize: 14,
            color: '#888',
            textAlign: 'center',
            marginTop: 8,
            fontFamily: 'Arial, sans-serif',
          }}>
            {t('dialogue.next')} ▶
          </div>
        )}
      </div>
    </div>
  );
}
