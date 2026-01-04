import { Cita } from '../types/Cita';
import { programarNotificacion, cancelarNotificacion } from './notificacionesService';

// IP configurada automáticamente: 192.168.1.131
const API_URL = 'http://192.168.1.131:3000/citas';

/**
 * Obtiene todas las citas
 */
export const obtenerCitas = async (): Promise<Cita[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener citas');
    }
    const citas = await response.json();
    return citas;
  } catch (error) {
    console.error('Error en obtenerCitas:', error);
    throw error;
  }
};

/**
 * Obtiene las citas de un cliente específico
 */
export const obtenerCitasCliente = async (clienteId: number): Promise<Cita[]> => {
  try {
    const response = await fetch(`${API_URL}?clienteId=${clienteId}`);
    if (!response.ok) {
      throw new Error('Error al obtener citas del cliente');
    }
    const citas = await response.json();
    return citas;
  } catch (error) {
    console.error('Error en obtenerCitasCliente:', error);
    throw error;
  }
};

/**
 * Obtiene las citas de un artista específico
 */
export const obtenerCitasArtista = async (artistaId: number): Promise<Cita[]> => {
  try {
    const response = await fetch(`${API_URL}?artistaId=${artistaId}`);
    if (!response.ok) {
      throw new Error('Error al obtener citas del artista');
    }
    const citas = await response.json();
    return citas;
  } catch (error) {
    console.error('Error en obtenerCitasArtista:', error);
    throw error;
  }
};

/**
 * Crea una nueva cita con notificación programada
 */
export const crearCita = async (cita: Omit<Cita, 'id' | 'createdAt'>): Promise<Cita> => {
  try {
    const nuevaCita = {
      ...cita,
      createdAt: new Date().toISOString(),
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaCita),
    });

    if (!response.ok) {
      throw new Error('Error al crear cita');
    }

    const citaCreada = await response.json();

    // Programar notificación 24h antes de la cita
    try {
      const notificationId = await programarNotificacion(citaCreada);

      // Actualizar la cita con el ID de la notificación
      if (notificationId) {
        await actualizarCita(citaCreada.id, {
          ...citaCreada,
          notificationId,
        });
        citaCreada.notificationId = notificationId;
      }
    } catch (notifError) {
      console.warn('No se pudo programar la notificación:', notifError);
    }

    return citaCreada;
  } catch (error) {
    console.error('Error en crearCita:', error);
    throw error;
  }
};

/**
 * Actualiza una cita existente
 */
export const actualizarCita = async (id: number, cita: Partial<Cita>): Promise<Cita> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cita),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar cita');
    }

    const citaActualizada = await response.json();
    return citaActualizada;
  } catch (error) {
    console.error('Error en actualizarCita:', error);
    throw error;
  }
};

/**
 * Elimina una cita y cancela su notificación
 */
export const eliminarCita = async (id: number): Promise<void> => {
  try {
    // Obtener la cita para cancelar su notificación
    const response = await fetch(`${API_URL}/${id}`);
    if (response.ok) {
      const cita = await response.json();
      if (cita.notificationId) {
        await cancelarNotificacion(cita.notificationId);
      }
    }

    const deleteResponse = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!deleteResponse.ok) {
      throw new Error('Error al eliminar cita');
    }
  } catch (error) {
    console.error('Error en eliminarCita:', error);
    throw error;
  }
};

/**
 * Confirma una cita (cambia estado a confirmada)
 */
export const confirmarCita = async (id: number): Promise<Cita> => {
  return await actualizarCita(id, { estado: 'confirmada' });
};

/**
 * Cancela una cita (cambia estado a cancelada)
 */
export const cancelarCita = async (id: number): Promise<Cita> => {
  return await actualizarCita(id, { estado: 'cancelada' });
};
