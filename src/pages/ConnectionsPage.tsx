import { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Link2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ApiAccess, ApiState } from "../components/ApiState";
import { SourceGlyph } from "../components/SourceBadge";
import { SyncCorona } from "../components/SyncCorona";
import ConnectCalendar from "../components/connectCalendar";
import {
  useConnections,
  useDisconnectConnection,
} from "../hooks/useConnections";
import { useAutoLoad } from "../hooks/useAutoLoad";
import { formatTimestamp, sourceLabel, sourceStyle } from "../utils/serverData";

export default function ConnectionsPage() {
  return (
    <div className="page">
      <div className="page-intro page-intro--row">
        <div>
          <p className="eyebrow">Your connected world</p>
          <h1>Sources</h1>
          <p className="page-intro__copy">
            Bring your conversations and schedule into one private memory.
          </p>
        </div>
      </div>
      <ApiAccess>
        <Connections />
      </ApiAccess>
      <section className="privacy-panel">
        <div className="privacy-panel__icon">
          <ShieldCheck size={22} />
        </div>
        <div>
          <span className="eyebrow">Your workspace</span>
          <h2>Your sources, in one place.</h2>
          <p>Manage the accounts connected to your Umbra workspace.</p>
        </div>
        <Link to="/settings" className="text-link">
          Account settings <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  );
}

function Connections() {
  const { connections, fetchConnections, isLoading, error } = useConnections();
  const {
    disconnect,
    isLoading: disconnecting,
    error: disconnectError,
  } = useDisconnectConnection();
  const [confirming, setConfirming] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  useAutoLoad(fetchConnections);
  const connectedCount =
    connections?.filter((item) => item.status === "connected").length ?? 0;
  async function confirmDisconnect(provider: string) {
    setNotice("");
    const result = await disconnect(provider);
    if (result) {
      setConfirming(null);
      setNotice(sourceLabel(provider) + " disconnected.");
      await fetchConnections();
    }
  }
  return (
    <>
      <section className="sync-overview">
        <SyncCorona
          percent={
            connections?.length
              ? Math.round((connectedCount / connections.length) * 100)
              : undefined
          }
          size="small"
        />
        <div>
          <strong>
            {connections
              ? connectedCount +
                " of " +
                connections.length +
                " sources connected"
              : "Your source connections"}
          </strong>
          <span>Manage access to your connected accounts.</span>
        </div>
        <button
          className="button button--outline"
          disabled={isLoading || disconnecting}
          onClick={() => void fetchConnections()}
        >
          <RefreshCw className={isLoading ? "spin" : ""} size={15} /> Refresh
          status
        </button>
      </section>
      <ApiState
        loading={isLoading || (!connections && !error)}
        error={error}
        empty={
          connections && !connections.length
            ? "No sources registered."
            : undefined
        }
        onRetry={fetchConnections}
      />
      {disconnectError && (
        <p className="settings-inline-status" role="alert">
          {disconnectError}
        </p>
      )}
      <div className="connections-grid">
        {connections?.map((item) => {
          const connected = item.status === "connected";
          return (
            <article className="connection-card" key={item.provider}>
              <div className="connection-card__top">
                <span
                  className={
                    "connection-logo connection-logo--" +
                    sourceStyle(item.provider)
                  }
                >
                  <SourceGlyph source={item.provider} size={21} />
                </span>
                <span
                  className={
                    "connection-state" +
                    (connected ? " connection-state--connected" : "")
                  }
                >
                  {connected ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Circle size={14} />
                  )}
                  {connected
                    ? "Connected"
                    : item.status === "disconnected"
                      ? "Not connected"
                      : item.status}
                </span>
              </div>
              <h3>{sourceLabel(item.provider)}</h3>
              <span className="connection-card__account">
                {connected
                  ? "Linked to your Umbra account"
                  : "Connect to your workspace"}
              </span>
              <p>
                {item.provider === "gcal"
                  ? "Read-only access to events from Google Calendar."
                  : "Saved content from " + sourceLabel(item.provider) + "."}
              </p>
              <div className="connection-card__stats">
                <div>
                  <span>Connected since</span>
                  <strong>
                    {item.connected_at
                      ? formatTimestamp(item.connected_at)
                      : "—"}
                  </strong>
                </div>
                <div>
                  <span>Access</span>
                  <strong>{connected ? "Connected" : "—"}</strong>
                </div>
              </div>
              {item.provider === "gcal" && item.status === "disconnected" ? (
                <ConnectCalendar
                  disabled={disconnecting}
                  onConnected={(message) => {
                    setNotice(message);
                    void fetchConnections();
                  }}
                />
              ) : item.status !== "disconnected" ? (
                <>
                  <button
                    className="button button--outline connection-card__button"
                    disabled={disconnecting}
                    onClick={() =>
                      confirming === item.provider
                        ? void confirmDisconnect(item.provider)
                        : setConfirming(item.provider)
                    }
                  >
                    <Link2 size={15} />
                    {confirming === item.provider
                      ? "Confirm disconnect"
                      : "Disconnect"}
                  </button>
                  {confirming === item.provider && (
                    <button
                      className="text-link connection-cancel"
                      onClick={() => setConfirming(null)}
                      disabled={disconnecting}
                    >
                      Cancel
                    </button>
                  )}
                </>
              ) : (
                <button
                  className="button button--outline connection-card__button"
                  disabled
                >
                  Connection not available yet
                </button>
              )}
            </article>
          );
        })}
      </div>
      {notice && (
        <div className="toast" role="status">
          <Check size={15} />
          {notice}
        </div>
      )}
    </>
  );
}
