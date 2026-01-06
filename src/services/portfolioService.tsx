import { TrabajoPortfolio } from '../types/TrabajoPortfolio';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { API_ENDPOINTS } from '../config/apiConfig';

const API_URL = API_ENDPOINTS.portfolio;

/**
 * Solicita permisos para acceder a la cámara
 */
export const solicitarPermisosCamara = async (): Promise<boolean> => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error al solicitar permisos de cámara:', error);
    return false;
  }
};

/**
 * Abre la cámara para tomar una foto
 */
export const tomarFoto = async (): Promise<string | null> => {
  try {
    const tienePermiso = await solicitarPermisosCamara();

    if (!tienePermiso) {
      throw new Error('No se tienen permisos de cámara');
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error('Error al tomar foto:', error);
    throw error;
  }
};

/**
 * Abre la galería para seleccionar una foto
 */
export const seleccionarFoto = async (): Promise<string | null> => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      throw new Error('No se tienen permisos de galería');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error('Error al seleccionar foto:', error);
    throw error;
  }
};

/**
 * Convierte una imagen a Base64
 */
const convertirImagenABase64 = async (uri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Error al convertir imagen a Base64:', error);
    throw error;
  }
};

/**
 * Obtiene todos los trabajos del portfolio
 */
export const obtenerTrabajos = async (): Promise<TrabajoPortfolio[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener trabajos');
    }
    const trabajos = await response.json();
    return trabajos;
  } catch (error) {
    console.error('Error en obtenerTrabajos:', error);
    throw error;
  }
};

/**
 * Obtiene los trabajos de un artista específico
 */
export const obtenerTrabajosArtista = async (artistaId: number): Promise<TrabajoPortfolio[]> => {
  try {
    const response = await fetch(`${API_URL}?artistaId=${artistaId}`);
    if (!response.ok) {
      throw new Error('Error al obtener trabajos del artista');
    }
    const trabajos = await response.json();
    return trabajos;
  } catch (error) {
    console.error('Error en obtenerTrabajosArtista:', error);
    throw error;
  }
};

/**
 * Obtiene un trabajo por su ID
 */
export const obtenerTrabajoPorId = async (id: number): Promise<TrabajoPortfolio> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener trabajo');
    }
    const trabajo = await response.json();
    return trabajo;
  } catch (error) {
    console.error('Error en obtenerTrabajoPorId:', error);
    throw error;
  }
};

/**
 * Crea un nuevo trabajo en el portfolio
 */
export const crearTrabajo = async (
  trabajo: Omit<TrabajoPortfolio, 'id' | 'createdAt' | 'fotoUrl'>,
  fotoUri?: string | null
): Promise<TrabajoPortfolio> => {
  try {
    let fotoUrl = null;

    // Convertir la foto a Base64 si existe
    if (fotoUri) {
      fotoUrl = await convertirImagenABase64(fotoUri);
    }

    const nuevoTrabajo = {
      ...trabajo,
      fotoUrl,
      createdAt: new Date().toISOString(),
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoTrabajo),
    });

    if (!response.ok) {
      throw new Error('Error al crear trabajo');
    }

    const trabajoCreado = await response.json();
    return trabajoCreado;
  } catch (error) {
    console.error('Error en crearTrabajo:', error);
    throw error;
  }
};

/**
 * Actualiza un trabajo existente
 */
export const actualizarTrabajo = async (
  id: number,
  trabajo: Partial<Omit<TrabajoPortfolio, 'id' | 'createdAt' | 'fotoUrl'>>,
  fotoUri?: string | null
): Promise<TrabajoPortfolio> => {
  try {
    let datosActualizados: any = { ...trabajo };

    // Si se proporciona una nueva foto, convertirla a Base64
    if (fotoUri) {
      datosActualizados.fotoUrl = await convertirImagenABase64(fotoUri);
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosActualizados),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar trabajo');
    }

    const trabajoActualizado = await response.json();
    return trabajoActualizado;
  } catch (error) {
    console.error('Error en actualizarTrabajo:', error);
    throw error;
  }
};

/**
 * Elimina un trabajo del portfolio
 */
export const eliminarTrabajo = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar trabajo');
    }
  } catch (error) {
    console.error('Error en eliminarTrabajo:', error);
    throw error;
  }
};
