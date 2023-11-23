import { RNKeycloak } from '@react-keycloak/native';

// Setup Keycloak instance as needed
// Pass initialization options as required
const keycloak = new RNKeycloak({
  url: 'http://192.168.0.8:8887/',
  realm: 'test_realm',
  clientId: 'test_client',
});

export default keycloak;