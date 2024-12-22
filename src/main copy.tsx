import React from "react";
import ReactDOM from "react-dom/client";
import { OidcProvider } from "./oidc";
import { RouterProvider } from "react-router-dom";
import { router } from "@router/router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Importe o 

// Crie o cliente para o React Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}> {/* Envolva a árvore de componentes com o QueryClientProvider */}
      <OidcProvider>
        <RouterProvider router={router} />
      </OidcProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
