# РНОС — Российский Народный Обменник Сообщениями

Минималистичный serverless SPA-мессенджер с end-to-end шифрованием на клиенте и устойчивым хранением в GitHub Gist.

## Stack
- React 18 + Vite + TypeScript
- Tailwind CSS
- Web Crypto API, fallback на CryptoJS
- GitHub Gist API как единственное хранилище
- Vercel deployment
- GitHub Actions CI

## Demo screenshots
- `docs/screenshots/login.png`
- `docs/screenshots/chat.png`

## Architecture
Feature-based структура:

```text
src/
  app/
  pages/
  widgets/
  features/
  entities/
  shared/
```

Принципы:
- SOLID
- DRY
- KISS
- Separation of concerns

## Security model
- Нет backend и server-side crypto.
- Авторизация по `username + seed phrase`.
- Derive ключа: PBKDF2-SHA256, 250000 итераций.
- Шифрование: AES-256-GCM.
- У каждого сообщения уникальный `iv` и `salt`.
- В Gist хранится только зашифрованный JSON.
- Decrypt происходит только в браузере пользователя.

## Threat model
- Защищает содержимое сообщений от компрометации хранилища.
- Не защищает от XSS в браузере пользователя или утечки seed phrase.
- При компрометации GitHub token злоумышленник может удалить/перезаписать gist.

## Features
- Login screen без регистрации
- Генератор безопасной seed phrase (12–16 слов)
- Realtime polling с adaptive interval
- Markdown, ссылки, inline code, списки, цитаты
- Изображения через markdown `![](url)`
- Emoji picker
- Автоскролл вниз
- Ошибки сети, rate limit, invalid key

## Quick start
```bash
npm ci
cp .env.example .env
npm run dev
```

## Deploy за 2 минуты
1. Push в GitHub.
2. Импортируйте repo в Vercel.
3. Укажите `VITE_GITHUB_TOKEN` и `VITE_GIST_ID`.
4. Deploy.

## CI/CD
Workflow `.github/workflows/ci.yml` запускает:
- lint
- typecheck
- test
- build

## Roadmap
- Multiple rooms
- Offline cache
- P2P transport
- IPFS storage backend
- E2EE group messaging

## FAQ
**Почему GitHub Gist?**
Потому что это простой serverless persistence слой с публичным API.

**Можно ли читать чат без seed phrase?**
Нет, только ciphertext.

**Что если seed phrase неверный?**
Приложение покажет ошибку расшифровки.
