import { useState } from 'react';
import { Input } from '../../shared/ui/Input';
import { Button } from '../../shared/ui/Button';

type Props = {
  onLogin: (username: string, seedPhrase: string) => void;
  onOpenSettings: () => void;
};

export const LoginForm = ({ onLogin, onOpenSettings }: Props): JSX.Element => {
  const [username, setUsername] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-4 px-5">
      <h1 className="text-3xl font-semibold">РНОС</h1>
      <p className="text-sm text-zinc-400">Российский Народный Обменник Сообщениями</p>
      <Input placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
      <Input
        placeholder="Seed phrase"
        value={seedPhrase}
        onChange={(event) => setSeedPhrase(event.target.value)}
      />
      <Button onClick={() => onLogin(username.trim(), seedPhrase.trim())} disabled={!username || !seedPhrase}>
        Enter chat
      </Button>
      <Button onClick={onOpenSettings} className="bg-transparent">
        Generate secure phrase
      </Button>
    </div>
  );
};
