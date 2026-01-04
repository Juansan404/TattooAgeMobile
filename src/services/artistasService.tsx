import { Artista } from '../types/Artista';

// IP configurada automáticamente: 192.168.1.131
//json-server --watch api/db.json --host 192.168.1.131 --port 3000
const API_URL = 'http://192.168.1.131:3000/artistas';

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
