import { useMemo, useState } from 'react';
import { generateSecurePhrase } from '../../shared/crypto/securePhrase';
import { Button } from '../../shared/ui/Button';
import { Modal } from '../../shared/ui/Modal';

type Props = {
  onClose: () => void;
};

export const SettingsModal = ({ onClose }: Props): JSX.Element => {
  const [phrase, setPhrase] = useState(useMemo(() => generateSecurePhrase(), []));

  return (
    <Modal>
      <div className="anim-fade-up flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Безопасная seed-фраза</h2>
        <p className="rounded-2xl border border-zinc-800 bg-black p-4 text-sm leading-7 text-zinc-200">{phrase}</p>
        <p className="text-xs text-zinc-500">Сохраните фразу офлайн. Любой, кто знает её, может читать комнату.</p>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => setPhrase(generateSecurePhrase())}>Обновить</Button>
          <Button onClick={onClose} className="bg-transparent">
            Закрыть
          </Button>
        </div>
      </div>
    </Modal>
  );
};
