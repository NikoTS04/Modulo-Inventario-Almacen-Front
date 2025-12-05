/**
 * Configuración del entorno
 * 
 * Para cambiar entre desarrollo y producción, modifica las variables aquí
 * o usa variables de entorno VITE_*
 */

export const config = {
  // URL base del API
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'modulo-inventario-almacen-back-production.up.railway.app/api/v1',
  
  // Usar datos mock cuando el backend no está disponible
  // Cambiar a false antes de desplegar a producción
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'false' || import.meta.env.DEV,
  
  // Modo de desarrollo
  isDevelopment: import.meta.env.DEV,
  
  // Modo de producción
  isProduction: import.meta.env.PROD,
};

/**
 * Helper para verificar si se deben usar datos mock
 */
export const shouldUseMockData = (): boolean => {
  return config.useMockData;
};

/**
 * Log de configuración actual (solo en desarrollo)
 */
if (config.isDevelopment) {
  console.log('🔧 Configuración del entorno:', {
    apiBaseUrl: config.apiBaseUrl,
    useMockData: config.useMockData,
    mode: config.isDevelopment ? 'development' : 'production'
  });
}

