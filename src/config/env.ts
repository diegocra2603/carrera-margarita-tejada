// Configuración de variables de entorno
export const config = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://app-delivery-api-dev-eastus2.azurewebsites.net',
  
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // App Configuration
  appName: 'Carrera Margarita Tejada',
  appVersion: '1.0.0'
};

// Función helper para construir URLs de la API
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = config.apiBaseUrl.replace(/\/$/, ''); // Remover trailing slash
  const cleanEndpoint = endpoint.replace(/^\//, ''); // Remover leading slash
  return `${baseUrl}/${cleanEndpoint}`;
};
