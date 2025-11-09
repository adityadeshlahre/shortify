# Shortify

A Spotify API wrapper built with Hono, providing simplified endpoints for common Spotify operations in a monorepo setup.

## Features

- OAuth2 authentication with Spotify
- Get followed artists
- Retrieve currently playing track
- Pause playback
- Fetch user's top tracks
- Automatic token refresh

## Tech Stack

- **Runtime:** Bun
- **Framework:** Hono
- **Language:** TypeScript
- **Monorepo:** Turbo
- **Linting:** Oxlint
- **Deployment:** Docker on Render

## Project Structure

```
shortify/
├── apps/
│   └── server/          # Hono server application
│       ├── src/
│       │   ├── middleware/
│       │   ├── routers/
│       │   ├── routes/
│       │   │   ├── artist/
│       │   │   ├── auth/
│       │   │   ├── current/
│       │   │   └── top/
│       │   ├── utils/
│       │   └── index.ts
│       ├── Dockerfile
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   └── types/           # Shared TypeScript types
│       ├── artist/
│       ├── current/
│       ├── top/
│       └── package.json
├── .github/workflows/   # CI/CD pipeline
├── package.json
├── turbo.json
└── README.md
```

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd shortify
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Set up environment variables in `apps/server/.env`:
   ```
   CORS_ORIGIN=*
   CLIENT_ID=your_spotify_client_id
   CLIENT_SECRET=your_spotify_client_secret
   REDIRECT_URI=http://localhost:3000/api/auth/callback
   ```

## Development

- Start the server in development mode:

  ```bash
  bun run dev:server
  ```

- Build the project:

  ```bash
  bun run build
  ```

- Run linting:

  ```bash
  bun run check
  ```

- Check types:
  ```bash
  bun run check-types
  ```

## API Endpoints

All endpoints except authentication require user authorization. Start with `/api/auth/login` to get the authorization URL.

### Authentication

- `GET /api/auth/login` - Get Spotify authorization URL
- `GET /api/auth/callback` - OAuth callback handler
- `GET /api/auth/status` - Check authentication status

### Protected Endpoints

- `GET /api/artist/` - Get followed artists
- `GET /api/current/` - Get currently playing track
- `POST /api/current/stop` - Pause current track
- `GET /api/top/tracks` - Get user's top 10 tracks

### Base URL

```
https://shortify-6z8q.onrender.com/api
```

### Example Usage

1. Get auth URL:

   ```bash
   curl -X GET "https://shortify-6z8q.onrender.com/api/auth/login"
   ```

2. After authorization, use protected endpoints:
   ```bash
   curl -X GET "https://shortify-6z8q.onrender.com/api/current"
   ```

## Deployment

The application is containerized with Docker and deployed on Render. CI/CD is handled via GitHub Actions, which builds and pushes the Docker image to Docker Hub, then triggers a Render deployment.
