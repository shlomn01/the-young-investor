import { useState, useEffect } from 'react';
import { phaserBridge } from '../../utils/phaserBridge';

// Stub - will be fully implemented in Phase 2
export function PortfolioPanel() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => setVisible(true);
    const hide = () => setVisible(false);
    phaserBridge.on('show-portfolio', show);
    phaserBridge.on('hide-portfolio', hide);
    return () => {
      phaserBridge.off('show-portfolio', show);
      phaserBridge.off('hide-portfolio', hide);
    };
  }, []);

  if (!visible) return null;
  return null; // Placeholder until Phase 2
}
