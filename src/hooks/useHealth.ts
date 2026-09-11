import { useCallback } from "react";
import { backendBaseUrl } from "../constansts/requests";
import { useApiRequest } from "./useApiRequest";

export type ServerHealth = {
  status: string;
  app: string;
  env: string | null;
  using_mock_vectorstore: boolean;
  using_mock_embeddings: boolean;
};

/** Call checkHealth() to query the server's root /health endpoint. */
export function useHealth() {
	const { execute, ...state } = useApiRequest<ServerHealth>();
	const checkHealth = useCallback(() => {
		const url = new URL(backendBaseUrl, window.location.origin);
		url.pathname = "/health";
		url.search = "";
		url.hash = "";
		return execute({ method: "GET", url: url.toString() });
	}, [execute]);

  	return { ...state, checkHealth };
}
