import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Cita } from '../types/Cita';

/**
 * Configuración de cómo se muestran las notificaciones
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Solicita permisos para enviar notificaciones
 */
export const solicitarPermisosNotificaciones = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('No se obtuvieron permisos de notificaciones');
      return false;
    }

    // Configurar canal de notificaciones para Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('citas', {
        name: 'Recordatorios de Citas',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#e74c3c',
      });
    }

    return true;
  } catch (error) {
    console.error('Error al solicitar permisos de notificaciones:', error);
    return false;
  }
};

/**
 * Programa una notificación 24 horas antes de una cita
 */
export const programarNotificacion = async (cita: Cita): Promise<string | null> => {
  try {
    const tienePermiso = await solicitarPermisosNotificaciones();

    if (!tienePermiso) {
      console.warn('No se tienen permisos para programar notificaciones');
      return null;
    }

    // Parsear la fecha y hora de la cita
    const [year, month, day] = cita.fecha.split('-').map(Number);
    const [hours, minutes] = cita.hora.split(':').map(Number);

    const fechaCita = new Date(year, month - 1, day, hours, minutes);

    // Calcular 24 horas antes
    const fechaNotificacion = new Date(fechaCita.getTime() - 24 * 60 * 60 * 1000);

    // Verificar que la notificación sea en el futuro
    if (fechaNotificacion < new Date()) {
      console.warn('La fecha de notificación es en el pasado');
      return null;
    }

    // Programar la notificación
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎨 Recordatorio de Cita - TattooAge',
        body: `Mañana tienes cita con ${cita.artistaNombre} a las ${cita.hora}. Diseño: ${cita.disenoDescripcion}`,
        data: { citaId: cita.id },
        sound: true,
      },
      trigger: {
        date: fechaNotificacion,
        channelId: 'citas',
      },
    });

    console.log('Notificación programada con ID:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Error al programar notificación:', error);
    return null;
  }
};

/**
 * Cancela una notificación programada
 */
export const cancelarNotificacion = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('Notificación cancelada:', notificationId);
  } catch (error) {
    console.error('Error al cancelar notificación:', error);
  }
};

/**
 * Cancela todas las notificaciones programadas
 */
export const cancelarTodasLasNotificaciones = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Todas las notificaciones han sido canceladas');
  } catch (error) {
    console.error('Error al cancelar todas las notificaciones:', error);
  }
};

/**
 * Obtiene todas las notificaciones programadas
 */
export const obtenerNotificacionesProgramadas = async (): Promise<Notifications.NotificationRequest[]> => {
  try {
    const notificaciones = await Notifications.getAllScheduledNotificationsAsync();
    return notificaciones;
  } catch (error) {
    console.error('Error al obtener notificaciones programadas:', error);
    return [];
  }
};
