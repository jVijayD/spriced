import { KeycloakService } from 'keycloak-angular';
// import { environment } from 'apps/spriced-container-ui/src/environments/environment';
export function initializeKeycloak(keycloak: KeycloakService) {
  
  return () =>
    keycloak.init({
      config: {
        // url: environment.KeycloakUrl,
        // realm: environment.Realm,
        // clientId: environment.ClientId,
        url: 'https://auth.dev.simadvisory.com/auth',
        realm: 'SPRICED_DEV',
        clientId: 'SPRICED_DEV_CLIENT',
      },
      initOptions: {
        onLoad: 'login-required', // redirects to the login page
        checkLoginIframe: true,
        checkLoginIframeInterval: 1000,
      },
      loadUserProfileAtStartUp: true,
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
      bearerExcludedUrls: ['/assets', '/clients/public'],
    });
}
