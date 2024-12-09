import { createReactOidc } from "oidc-spa/react";
import { z } from "zod";



const decodedIdTokenSchema = z.object({
    sub: z.string(),
    preferred_username: z.string(),
    name: z.string(),
    email: z.string(),
    // groups: z.array(z.string()), // Alteração aqui: agora é um array de strings
});


// oidcTokens.decodedIdToken.groups[1]......

const issuerUri = import.meta.env.VITE_OIDC_ISSUER;
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
// const publicUrl = import.meta.env.BASE_URL;

export const { OidcProvider, useOidc, getOidc } = 
    createReactOidc({
        issuerUri,
        clientId,
        publicUrl: import.meta.env.BASE_URL,
        decodedIdTokenSchema: decodedIdTokenSchema,
          //doEnableDebugLogs: true
        extraQueryParams: () => ({
            ui_locales: "en" // Gere you would dynamically get the current language at the time of redirecting to the OIDC server
        }),
        // Remove this in your repo
        doEnableDebugLogs: true
});

export const beforeLoadProtectedRoute = async () => {
    const oidc = await getOidc();

    if (oidc.isUserLoggedIn) {
        return null;
    }

    await oidc.login({
        doesCurrentHrefRequiresAuth: true
    });
};


export function getKeycloakAccountUrl(params: { locale: string; accountPage: "home" | "password" }) {
    const { locale, accountPage } = params;

    const accountUrl = new URL(
        `${issuerUri}/account${(() => {
            switch (accountPage) {
                case "home":
                    return "";
                case "password":
                    return "/password";
            }
        })()}`
    );

    const searchParams = new URLSearchParams();

    searchParams.append("kc_locale", locale);
    searchParams.append("referrer", clientId);
    searchParams.append("referrer_uri", window.location.href);

    accountUrl.search = searchParams.toString();

    return accountUrl.toString();
}
