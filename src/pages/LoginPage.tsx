import { LoginForm } from '../features/auth/LoginForm';

type Props = {
  onLogin: (username: string, seedPhrase: string) => void;
  onOpenSettings: () => void;
};

export const LoginPage = ({ onLogin, onOpenSettings }: Props): JSX.Element => (
  <main className="relative overflow-hidden bg-black text-zinc-100">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.09),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(255,255,255,0.06),transparent_35%)]" />
    <LoginForm onLogin={onLogin} onOpenSettings={onOpenSettings} />
  </main>
);
