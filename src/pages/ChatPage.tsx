import { ChatWidget } from '../widgets/ChatWidget';

type Props = {
  username: string;
  seedPhrase: string;
  onLogout: () => void;
};

export const ChatPage = ({ username, seedPhrase, onLogout }: Props): JSX.Element => (
  <main className="bg-black text-zinc-100">
    <ChatWidget username={username} seedPhrase={seedPhrase} onLogout={onLogout} />
  </main>
);
