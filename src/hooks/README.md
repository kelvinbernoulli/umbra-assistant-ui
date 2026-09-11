# Server hooks and authentication

Use **Sign in** in the top bar to open /signin. The bell opens /notifications; notification preferences remain under Settings. First sign-in provisions the
Google user, personal workspace, owner membership, and a hashed API key in the
Umbra database. Subsequent sign-ins find the account by Google's stable subject
ID, never by an unverified browser user ID or by matching email addresses.

The server verifies the Google ID token's signature, audience, issuer, expiry,
verified email and a one-use login nonce. It issues an opaque HttpOnly, SameSite=Lax
session cookie; only its hash is stored in the database. API keys and Google ID
tokens are not stored in browser storage or returned by the session endpoint.
The generated raw API key is discarded: browser requests use the session directly.
Existing API keys remain supported for external clients.

## Local setup

- Backend: matching VITE_GOOGLE_CLIENT_ID; Google Calendar additionally needs
  GOOGLE_CLIENT_SECRET and a valid, stable Fernet CREDENTIAL_ENCRYPTION_KEY.
- Run backend database migrations with python -m alembic upgrade head.
- For local HTTP development set SESSION_COOKIE_SECURE=false in the backend .env.
  Keep SESSION_COOKIE_SECURE=true for HTTPS deployments (the default).
- Frontend: VITE_GOOGLE_CLIENT_ID is the public Google OAuth client ID.
  VITE_API_BASE_URL=/api/v1 uses the Vite proxy to http://127.0.0.1:8000.
- Register http://localhost:5173 in the Google client's authorized JavaScript
  origins, and open the app at that origin. Restart Vite after changing .env.
- FRONTEND_ORIGINS in the backend is a JSON list of allowed browser origins.

Production must reverse-proxy /api and /health to the backend from the frontend's
origin. Vite's development/preview proxy does not configure a static hosting
provider. Cross-site API URLs are not supported by the SameSite=Lax cookie setup.

## Session lifecycle

useSession restores GET /auth/session in the background. The original app shell and dashboard remain visible before sign-in; protected data loads only after authentication.
POST /auth/challenge creates a five-minute, one-use Google login nonce.
POST /auth/google verifies the credential and establishes the session.
POST /auth/logout revokes the database session and clears cookies.
Session lifetime uses ACCESS_TOKEN_EXPIRE_MINUTES (24 hours by default).
Protected requests returning 401 clear private data while keeping navigation visible. Logout
and account changes also clear other open tabs using BroadcastChannel.
Settings displays the account and Sign out; no manual credentials are required.

Mutations send X-Requested-With and the server checks the browser Origin.
Workspace identity comes from the session and membership is rechecked on requests.
Browser-supplied workspace headers cannot override the session's workspace.
Existing API-key clients use X-API-Key and X-Workspace-ID as before.

## Hooks

Hooks execute on demand and expose data, error, isLoading and reset. A new request
cancels the previous request for that hook; unmounting cancels pending work.
Requests return data on success and undefined on failure/cancellation.

| Hook | Method | Endpoint relative to /api/v1 |
| --- | --- | --- |
| useBrief() | fetchBrief() | GET /brief/today |
| useSearch() | search(request) | POST /search |
| useTimeline() | fetchTimeline(limit) | GET /timeline |
| useConnections() | fetchConnections() | GET /connections |
| useDisconnectConnection() | disconnect(provider) | POST /connections/{provider}/disconnect |
| useCommands() | submitCommand(text) | POST /commands |
| useTypeRegistry(kind) | fetchTypes() | GET /types/{kind} |
| useAddRegistryType(kind) | addType(name) | POST /types/{kind} |
| useWorkspace(workspaceId) | provisionWebhookToken() | POST /workspaces/{workspaceId}/webhook-token |
| useHealth() | checkHealth() | GET /health outside the API prefix |

The webhook-token hook provisions or rotates an integration token; it is separate
from browser login. Account registration creates the workspace without rotating
webhook credentials. Search and timeline limits are 1–100.

## Calendar authorization

After sign-in, open Connections and select Connect Google Calendar. This asks for
calendar.readonly independently from account sign-in. The server exchanges the
code at /auth/google/save and encrypts the refresh token under the session's user.
Disconnect removes that user's stored credential. Google permissions can also be
revoked through the user's Google account.

Calendar authorization alone does not import events. Calendar displays ingested
timeline records of type event/reminder; timestamps are ingestion times. Brief,
command execution, analytics and other unavailable backend features report errors
or unavailable states, rather than invented data.

Google's verification reference:
https://developers.google.com/identity/gsi/web/guides/verify-google-id-token

## Verification

npm run build; npm run lint; npm run test:e2e.
Browser tests use isolated API fixtures and a simulated Google SDK, never real
Google credentials. Backend tests cover verification failures, nonce replay,
account provisioning, workspace isolation, expiry, logout, encryption and migration.
Real Google consent still requires a configured Google client and user interaction.
