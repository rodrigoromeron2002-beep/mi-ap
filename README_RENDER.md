# Deploy Zentra Backend on Render

This deploys only the backend in `server/`.

## 1. Create the service

1. Open Render.
2. Choose **New** > **Blueprint**.
3. Connect this repository.
4. Select the root `render.yaml`.
5. Render will create a web service named `zentra-backend`.

## 2. Add the secret

In the Render service environment variables, set:

```bash
OPENAI_API_KEY=replace-with-your-openai-api-key
```

Do not commit the real key to the repo.

## 3. Confirm settings

Render should read these from `render.yaml`:

```bash
Root Directory: server
Build Command: npm install && npm run build
Start Command: npm run start
Health Check Path: /health
```

## 4. Test the backend

After deploy, open:

```bash
https://YOUR-RENDER-SERVICE.onrender.com/health
```

Expected response includes:

```json
{ "status": "ok" }
```

## 5. Connect the app preview build

Use the Render URL as:

```bash
EXPO_PUBLIC_API_BASE_URL=https://YOUR-RENDER-SERVICE.onrender.com
```

Then run:

```bash
npm run preview:check
npm run build:preview:android
```
