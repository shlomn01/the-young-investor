import { useState, useEffect } from 'react';
import { phaserBridge } from '../../utils/phaserBridge';

// Stub - will be fully implemented in Phase 2
export function TradePanel() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => setVisible(true);
    const hide = () => setVisible(false);
    phaserBridge.on('show-trade-panel', show);
    phaserBridge.on('hide-trade-panel', hide);
    return () => {
      phaserBridge.off('show-trade-panel', show);
      phaserBridge.off('hide-trade-panel', hide);
    };
  }, []);

  if (!visible) return null;
  return null; // Placeholder until Phase 2
}
