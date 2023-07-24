import { KeycloakService } from "keycloak-angular";

export function initializeKeycloak(keycloak: KeycloakService) {
  debugger;
  return () => {
    return keycloak.init({
      config: {
        // url: "https://auth.dev.simadvisory.com/auth",
        // realm: "SPRICED_DEV",
        // clientId: "SPRICED_DEV_CLIENT",
        url: process.env["NX_KEY_CLOAK_URL"],
        realm: process.env["NX_KEY_CLOAK_REALM"] as string,
        clientId: process.env["NX_KEY_CLOAK_CLIENT_ID"] as string,
      },
      initOptions: {
        onLoad: "login-required", // redirects to the login page
        checkLoginIframe: true,
        checkLoginIframeInterval: 1000,
      },
      loadUserProfileAtStartUp: true,
      enableBearerInterceptor: true,
      bearerPrefix: "Bearer",
      bearerExcludedUrls: ["/assets", "/clients/public"],
    });
  };
}
