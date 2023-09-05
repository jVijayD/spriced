import { KeycloakService } from "keycloak-angular";

export function initializeKeycloak(keycloak: KeycloakService) {
  return () => {
    return keycloak.init({
      config: {
        url: process.env["NX_KEY_CLOAK_URL"],
        realm: process.env["NX_KEY_CLOAK_REALM"] as string,
        clientId: process.env["NX_KEY_CLOAK_CLIENT_ID"] as string,
      },
      initOptions: {
        onLoad: "login-required", // redirects to the login page
        checkLoginIframe: false,
        checkLoginIframeInterval: 1000,
      },
      loadUserProfileAtStartUp: true,
      enableBearerInterceptor: true,
      bearerPrefix: "Bearer",
      bearerExcludedUrls: ["/assets", "/clients/public"],
    });
  };
}
