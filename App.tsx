import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { solicitarPermisosNotificaciones } from './src/services/notificacionesService';

/**
 * Componente principal de la aplicación TattooAge
 */
export default function App() {
  useEffect(() => {
    // Solicitar permisos de notificaciones al iniciar la app
    const inicializarNotificaciones = async () => {
      try {
        await solicitarPermisosNotificaciones();
      } catch (error) {
        console.error('Error al solicitar permisos de notificaciones:', error);
      }
    };

    inicializarNotificaciones();
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
