import { useState } from 'react';
import { ChatPage } from '../pages/ChatPage';
import { LoginPage } from '../pages/LoginPage';
import { SettingsModal } from '../features/settings/SettingsModal';

type Session = {
  username: string;
  seedPhrase: string;
};

export const App = (): JSX.Element => {
  const [session, setSession] = useState<Session | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      {session ? (
        <ChatPage username={session.username} seedPhrase={session.seedPhrase} onLogout={() => setSession(null)} />
      ) : (
        <LoginPage
          onLogin={(username, seedPhrase) => setSession({ username, seedPhrase })}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}
      {showSettings ? <SettingsModal onClose={() => setShowSettings(false)} /> : null}
    </>
  );
};
