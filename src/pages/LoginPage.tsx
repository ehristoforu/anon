import { LoginForm } from '../features/auth/LoginForm';

type Props = {
  onLogin: (username: string, seedPhrase: string) => void;
  onOpenSettings: () => void;
};

export const LoginPage = ({ onLogin, onOpenSettings }: Props): JSX.Element => (
  <main className="bg-black text-zinc-100">
    <LoginForm onLogin={onLogin} onOpenSettings={onOpenSettings} />
  </main>
);
