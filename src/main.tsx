import React from "react";
import ReactDOM from "react-dom/client";
import { OidcProvider } from "./oidc";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Importe o 


import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/theme";
import App from "./App";

import { StyledEngineProvider } from '@mui/material/styles';




// Crie o cliente para o React Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}> {/* Envolva a árvore de componentes com o QueryClientProvider */}
      <OidcProvider>
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
      </ThemeProvider>
      </OidcProvider>
    </QueryClientProvider>
  </React.StrictMode>
);



