import { useState, type ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { googleClientId } from "../constansts/googleAuth";
import { GoogleAuthStatusContext } from "../context/GoogleAuthStatusContext";

export default function GoogleAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
	const [scriptError, setScriptError] = useState(false);
	if (!googleClientId) return children;
	return (
		<GoogleAuthStatusContext.Provider value={scriptError}>
			<GoogleOAuthProvider
				clientId={googleClientId}
				onScriptLoadError={() => setScriptError(true)}
				onScriptLoadSuccess={() => setScriptError(false)}
			>
				{children}
			</GoogleOAuthProvider>
		</GoogleAuthStatusContext.Provider>
	);
}
