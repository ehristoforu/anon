import { useEffect, useState } from 'react';
import { Input } from '../../shared/ui/Input';
import { Button } from '../../shared/ui/Button';

type Props = {
  onLogin: (username: string, seedPhrase: string) => void;
  onOpenSettings: () => void;
};

const since = new Date('2026-01-01T00:00:00Z');

export const LoginForm = ({ onLogin, onOpenSettings }: Props): JSX.Element => {
  const [username, setUsername] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [online, setOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const onUp = (): void => setOnline(true);
    const onDown = (): void => setOnline(false);
    window.addEventListener('online', onUp);
    window.addEventListener('offline', onDown);
    return () => {
      window.removeEventListener('online', onUp);
      window.removeEventListener('offline', onDown);
    };
  }, []);

  const daysOnline = Math.floor((Date.now() - since.getTime()) / (24 * 60 * 60 * 1000));

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-4 px-4 py-8 sm:px-6">
      <div className="anim-fade-up rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-5 backdrop-blur-xl sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">РНОС</h1>
            <p className="text-xs text-zinc-400">Российский Народный Обменник Сообщениями</p>
          </div>
          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-[10px] text-zinc-300">
            serverless
          </span>
        </div>

        <div className="anim-slide-in mb-5 rounded-2xl border border-zinc-800 bg-black/70 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Статус сервиса</p>
            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${online ? 'anim-pulse-glow border border-emerald-600/50 bg-emerald-600/15 text-emerald-300' : 'border border-red-600/50 bg-red-600/10 text-red-300'}`}>
              {online ? 'В сети' : 'Нет сети'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-zinc-300">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-2">
              <p className="font-mono text-sm font-semibold text-zinc-100">AES-256</p>
              <p className="text-zinc-500">Шифрование</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-2">
              <p className="font-mono text-sm font-semibold text-zinc-100">Gist API</p>
              <p className="text-zinc-500">Хранилище</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-2">
              <p className="font-mono text-sm font-semibold text-zinc-100">{daysOnline}д</p>
              <p className="text-zinc-500">Аптайм</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Input placeholder="Ваш никнейм" value={username} onChange={(event) => setUsername(event.target.value)} />
          <Input
            placeholder="Seed-фраза комнаты"
            value={seedPhrase}
            onChange={(event) => setSeedPhrase(event.target.value)}
          />
          <Button
            onClick={() => onLogin(username.trim(), seedPhrase.trim())}
            disabled={!username || !seedPhrase}
            className="w-full"
          >
            Войти в чат
          </Button>
          <Button onClick={onOpenSettings} className="w-full bg-transparent">
            Сгенерировать безопасную фразу
          </Button>
          <p className="pt-1 text-center text-xs text-zinc-500">Никто не увидит ваши сообщения без seed-фразы</p>
        </div>
      </div>
    </section>
  );
};
