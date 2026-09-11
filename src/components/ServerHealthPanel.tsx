import { useHealth } from "../hooks/useHealth";
import { useAutoLoad } from "../hooks/useAutoLoad";
import { ApiState } from "./ApiState";

export default function ServerHealthPanel() {
  const { data, isLoading, error, checkHealth } = useHealth();
  useAutoLoad(checkHealth);
  return (
    <section className="admin-panel">
      <div className="admin-panel__heading">
        <h2>System health</h2>
        <button
          className="button button--outline"
          disabled={isLoading}
          onClick={() => void checkHealth()}
        >
          Refresh health
        </button>
      </div>
      <ApiState
        loading={isLoading || (!data && !error)}
        error={error}
        onRetry={checkHealth}
      />
      {data && (
        <dl className="api-facts">
          <div>
            <dt>Application</dt>
            <dd>{data.app}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{data.status}</dd>
          </div>
          <div>
            <dt>Environment</dt>
            <dd>{data.env ?? "Not specified"}</dd>
          </div>
          <div>
            <dt>Vector store mode</dt>
            <dd>
              {data.using_mock_vectorstore ? "Mock" : "Configured provider"}
            </dd>
          </div>
          <div>
            <dt>Embedding mode</dt>
            <dd>
              {data.using_mock_embeddings ? "Mock" : "Configured provider"}
            </dd>
          </div>
        </dl>
      )}
      <p className="page-intro__copy">
        Provider modes report configuration, not provider availability.
      </p>
    </section>
  );
}
