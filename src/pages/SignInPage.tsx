import { Navigate, useLocation } from "react-router-dom";
import SignIn from "../components/SignIn";
import LoadingIndicator from "../components/LoadingIndicator";
import { useUmbra } from "../hooks/useUmbra";

export default function SignInPage() {
  const { auth, signIn, sessionLoading, sessionError, retrySession } =
    useUmbra();
  const location = useLocation();
  const from: unknown = location.state?.from;
  const returnTo =
    typeof from === "string" &&
    from.startsWith("/") &&
    !from.startsWith("//") &&
    !from.includes("\\") &&
    from.split(/[?#]/)[0] !== "/signin"
      ? from
      : "/";
  if (auth) return <Navigate to={returnTo} replace />;
  return (
    <div className="page page--signin">
      <div className="page-intro">
        <p className="eyebrow">Your workspace</p>
        <h1>Sign in to Umbra</h1>
        <p className="page-intro__copy">
          Your conversations, calendar, and saved memories, together.
        </p>
      </div>
      {sessionLoading ? (
        <div className="empty-state">
          <LoadingIndicator label="Checking your session…" />
        </div>
      ) : sessionError ? (
        <div className="empty-state" role="alert">
          <p>{sessionError}</p>
          <button
            className="button button--outline"
            onClick={() => void retrySession()}
          >
            Try again
          </button>
        </div>
      ) : (
        <SignIn signIn={signIn} />
      )}
    </div>
  );
}
