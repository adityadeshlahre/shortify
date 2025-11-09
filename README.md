# Shortify

A Spotify API wrapper built with Hono, providing simplified endpoints for common Spotify operations.

## Base URL

```
https://shortify-6z8q.onrender.com/api
```

## API Endpoints

### Get Followed Artists

**Endpoint:** `GET /api/artist/`

Returns a list of artists the user is following.

**Curl Example:**

```bash
curl -X GET "https://shortify-6z8q.onrender.com/api/artist"
```

### Get Currently Playing Song

**Endpoint:** `GET /api/current/`

Returns information about the currently playing track.

**Curl Example:**

```bash
curl -X GET "https://shortify-6z8q.onrender.com/api/current"
```

### Stop Current Song

**Endpoint:** `POST /api/current/stop`

Pauses the currently playing track.

**Curl Example:**

```bash
curl -X POST "https://shortify-6z8q.onrender.com/api/current/stop"
```

### Get Top Tracks

**Endpoint:** `GET /api/top/tracks`

Returns the user's top 10 tracks.

**Curl Example:**

```bash
curl -X GET "https://shortify-6z8q.onrender.com/api/top/tracks"
```
