import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App.tsx";
import { InventoryProvider } from "./InventoryContext.tsx";

const domain = "dev-kxjsdk1c4tha3kpg.us.auth0.com";
const clientId = "UN4Uy3MAWO6DaK8T08jihjNfR5NII1SP";

if (!domain || !clientId) {
  throw new Error("Missing Auth0 environment variables");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain!}
      clientId={clientId!}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <InventoryProvider>
        <App />
      </InventoryProvider>
    </Auth0Provider>
  </React.StrictMode>
);
