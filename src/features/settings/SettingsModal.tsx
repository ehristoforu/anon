import { useMemo } from 'react';
import { generateSecurePhrase } from '../../shared/crypto/securePhrase';
import { Button } from '../../shared/ui/Button';
import { Modal } from '../../shared/ui/Modal';

type Props = {
  onClose: () => void;
};

export const SettingsModal = ({ onClose }: Props): JSX.Element => {
  const phrase = useMemo(() => generateSecurePhrase(), []);

  return (
    <Modal>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Secure seed phrase</h2>
        <p className="rounded-xl border border-zinc-800 bg-black p-3 text-sm leading-6 text-zinc-200">{phrase}</p>
        <p className="text-xs text-zinc-500">Save it offline. Anyone with this phrase can read your room.</p>
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};
