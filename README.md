# Backend4 Express Middleware Assignment

## Run

1. Install dependencies with `npm install`.
2. Start the app with `npm start`.
3. The server listens on port `3000` by default. Set the `PORT` environment variable to change it.

The global working-hours middleware uses the server's local clock and allows requests from 10:00 through 17:59. Requests outside that window receive HTTP 503.

## Endpoints

- `GET /` — API greeting.
- `POST /api/users` — creates a user; JSON must include non-empty `name` and `email` strings.
- `GET /api/users` — lists users and logs the method, elapsed response time, and `User-Agent` device/client string.
- `GET /api/users/:id` — retrieves a user and logs the same request details.

Example request body:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com"
}
```
