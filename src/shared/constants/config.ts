export const ENV = {
  gistId: import.meta.env.VITE_GIST_ID as string,
  token: import.meta.env.VITE_GITHUB_TOKEN as string
};

export const GIST_FILENAME = 'rnos-chat.json';
export const POLLING_MIN_MS = 1800;
export const POLLING_MAX_MS = 10000;
