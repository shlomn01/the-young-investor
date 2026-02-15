import { useState, useEffect } from 'react';
import { phaserBridge } from '../../utils/phaserBridge';

// Stub - will be fully implemented in Phase 3
export function NewspaperModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => setVisible(true);
    const hide = () => setVisible(false);
    phaserBridge.on('show-newspaper', show);
    phaserBridge.on('hide-newspaper', hide);
    return () => {
      phaserBridge.off('show-newspaper', show);
      phaserBridge.off('hide-newspaper', hide);
    };
  }, []);

  if (!visible) return null;
  return null; // Placeholder until Phase 3
}
