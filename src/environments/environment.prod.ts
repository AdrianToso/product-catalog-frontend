export const environment = {
  production: true,
  apiUrl: 'http://yourproductionapi.com/api/',
  appName: 'Product Catalog',
  version: '1.0.0',
  // Variables adicionales para seguridad y monitoreo
  tokenWhitelistedDomains: ['yourproductionapi.com'],
  tokenBlacklistedRoutes: ['/api/auth'],
  enableDebug: false,
};
