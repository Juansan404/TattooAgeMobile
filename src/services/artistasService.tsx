import { Artista } from '../types/Artista';
import { API_ENDPOINTS } from '../config/apiConfig';

const API_URL = API_ENDPOINTS.artistas;

/**
 * Obtiene todos los artistas disponibles
 */
export const obtenerArtistas = async (): Promise<Artista[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener artistas');
    }
    const artistas = await response.json();
    return artistas;
  } catch (error) {
    console.error('Error en obtenerArtistas:', error);
    throw error;
  }
};

/**
 * Obtiene un artista por su ID
 */
export const obtenerArtistaPorId = async (id: number): Promise<Artista> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener artista');
    }
    const artista = await response.json();
    return artista;
  } catch (error) {
    console.error('Error en obtenerArtistaPorId:', error);
    throw error;
  }
};
