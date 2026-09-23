import { useState } from "react";
import LoadingIndicator from "./LoadingIndicator";
import { useUmbra } from "../hooks/useUmbra";
import { getApiErrorMessage } from "../constansts/requests";
import { Link } from "react-router-dom";

export default function AccountSettings() {
  const { auth, logout, sessionLoading, sessionError, retrySession } =
    useUmbra();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function signOut() {
    setPending(true);
    setError(null);
    try {
      await logout();
    } catch (cause) {
      setError(getApiErrorMessage(cause));
      setPending(false);
    }
  }
  if (sessionLoading)
    return (
      <section className="settings-section">
        <LoadingIndicator label="Connecting to your account…" />
      </section>
    );
  if (sessionError)
    return (
      <section className="settings-section" role="alert">
        <p>{sessionError}</p>
        <button
          className="button button--outline"
          onClick={() => void retrySession()}
        >
          Try again
        </button>
      </section>
    );
  if (!auth)
    return (
      <section className="settings-section">
        <p className="eyebrow">Your account</p>
        <h2>Connect your Umbra account</h2>
        <p className="page-intro__copy">Sign in to access your workspace.</p>
        <Link
          className="button button--gold"
          to="/signin"
          state={{ from: "/settings" }}
        >
          Sign in with Google
        </Link>
      </section>
    );
  return (
    <section className="settings-section">
      <p className="eyebrow">Your account</p>
      <h2>{auth.user.name}</h2>
      <p>{auth.user.email}</p>
      <p className="page-intro__copy">
        Your workspace is connected automatically when you sign in.
      </p>
      <button
        className="button button--outline"
        disabled={pending}
        aria-busy={pending}
        onClick={() => void signOut()}
      >
        {pending ? <LoadingIndicator label="Signing out…" /> : "Sign out"}
      </button>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
