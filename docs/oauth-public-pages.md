# OAuth public pages

The frontend serves `/privacy` and `/terms` without session restoration or backend requests. Both are linked from the app footer. `vercel.json` rewrites these paths to the SPA entry point so direct visits and refreshes work on Vercel.

Before publishing, set `VITE_APP_OPERATOR` to the public operator name and `VITE_SUPPORT_EMAIL` to a monitored support address, then rebuild. These values are public. When omitted, the pages direct users to the person or organization that provided access rather than displaying invented contact details.

Review the text against actual production practices before submitting it to Google, especially provider processing, retention, deletion handling, and Google data use. The text reflects the inspected implementation; it does not establish that deployment or operational practices satisfy Google's requirements. Do not promise automatic account deletion or data export: the current settings controls only affect browser preferences.

After deploying and checking the public URLs, use:

- Home: `https://umbra-assistant-ui.vercel.app/`
- Privacy: `https://umbra-assistant-ui.vercel.app/privacy`
- Terms: `https://umbra-assistant-ui.vercel.app/terms`

Production API requests use `/api/v1` on the frontend origin. `vercel.json` forwards `/api/*` and `/health` to `https://umbra-assistant.onrender.com`, before the SPA fallback. API responses must not be cached. Production builds intentionally ignore `VITE_API_BASE_URL` so an old localhost or cross-site URL cannot bypass the cookie-compatible proxy; the variable remains available for local development.

Redeploy the frontend after changing this configuration. On Render, include `https://umbra-assistant-ui.vercel.app` in `FRONTEND_ORIGINS` and set `SESSION_COOKIE_SECURE=true`. Preview domains need their own explicit allowed origins if sign-in is required there. Keep the Google OAuth authorized JavaScript origins in sync with the frontend domains used for sign-in.

References:

- https://support.google.com/cloud/answer/13464321
- https://developers.google.com/terms/api-services-user-data-policy
