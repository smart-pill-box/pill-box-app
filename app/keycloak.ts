import { RNKeycloak } from '@react-keycloak/native';
import { KC_CLIEND_ID, KC_HOST, KC_REALM } from './src/constants';

// Setup Keycloak instance as needed
// Pass initialization options as required
const keycloak = new RNKeycloak({
  url: KC_HOST,
  realm: KC_REALM,
  clientId: KC_CLIEND_ID,
});

export default keycloak;