import { Platform } from 'react-native';

//json-server --watch api/db.json --port 3000


/**
 * CONFIGURACIÓN IMPORTANTE:
 *
 * Cambia este valor según donde ejecutes la app:
 * - true: Si usas EMULADOR de Android en PC
 * - false: Si usas DISPOSITIVO FÍSICO (móvil real)
 */
const USE_EMULATOR = true;


const LOCAL_IP = '192.168.1.131';

/**
 * Obtiene la URL base de la API según el entorno
 */
const getBaseURL = (): string => {
  if (USE_EMULATOR && Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:3000';
  } else {
    // Dispositivo físico (móvil real)
    return `http://${LOCAL_IP}:3000`;
  }
};

export const API_BASE_URL = getBaseURL();

// URLs de los endpoints
export const API_ENDPOINTS = {
  artistas: `${API_BASE_URL}/artistas`,
  citas: `${API_BASE_URL}/citas`,
  portfolio: `${API_BASE_URL}/portfolio`,
  usuarios: `${API_BASE_URL}/usuarios`,
};

