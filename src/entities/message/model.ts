export type MessageRecord = {
  id: string;
  sender: string;
  cipherText: string;
  iv: string;
  salt: string;
  createdAt: number;
};

export type DecryptedMessage = {
  id: string;
  sender: string;
  text: string;
  createdAt: number;
};

export type ChatDocument = {
  version: 1;
  messages: MessageRecord[];
};
