import { useGameStore } from '../../store/gameStore';
import { phaserBridge } from '../../utils/phaserBridge';
import i18n from '../../i18n';

export function LanguageToggle() {
  const { language, setLanguage } = useGameStore();

  const toggle = () => {
    const newLang = language === 'he' ? 'en' : 'he';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    phaserBridge.emit('language-changed', newLang);
  };

  return (
    <button
      onClick={toggle}
      style={{
        position: 'absolute',
        top: 10,
        right: language === 'he' ? undefined : 10,
        left: language === 'he' ? 10 : undefined,
        pointerEvents: 'auto',
        zIndex: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 8,
        padding: '8px 16px',
        cursor: 'pointer',
        fontSize: 16,
        fontFamily: 'Arial, sans-serif',
        backdropFilter: 'blur(4px)',
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(74,144,217,0.7)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)'; }}
    >
      {language === 'he' ? 'EN 🇬🇧' : 'עב 🇮🇱'}
    </button>
  );
}
