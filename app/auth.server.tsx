import { Log, OidcClient } from 'oidc-client-ts';

Log.setLogger(console);
// Log.setLevel(Log.DEBUG);

export const oidcClient = new OidcClient({
  authority: process.env.OIDC_DISCOVERY_URL!,
  client_id: process.env.OIDC_CLIENT_ID!,
  client_secret: process.env.OIDC_CLIENT_SECRET!,
  redirect_uri: process.env.OIDC_REDIRECT_URL!,
});
