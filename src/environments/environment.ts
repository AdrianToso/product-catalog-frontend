export const environment = {
  production: false,
  apiUrl: 'https://localhost:7175/api/',
  appName: 'Product Catalog',
  version: '1.0.0',
  // Variables adicionales para seguridad y monitoreo
  tokenWhitelistedDomains: ['localhost:7175'],
  tokenBlacklistedRoutes: ['/api/auth'],
  enableDebug: true
};