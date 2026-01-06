import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SeleccionArtistaScreen from '../screens/artista/SeleccionArtistaScreen';
import MiPortfolioScreen from '../screens/artista/MiPortfolioScreen';
import DetalleTrabajoScreen from '../screens/artista/DetalleTrabajoScreen';
import MiAgendaScreen from '../screens/artista/MiAgendaScreen';
import { TrabajoPortfolio } from '../types/TrabajoPortfolio';

export type ArtistaStackParamList = {
  SeleccionArtista: undefined;
  MiPortfolio: { artistaId: number; artistaNombre: string };
  DetalleTrabajo: { trabajo: TrabajoPortfolio };
  MiAgenda: { artistaId: number; artistaNombre: string };
};

const Stack = createNativeStackNavigator<ArtistaStackParamList>();

/**
 * Navegador para las pantallas del modo Artista
 */
const ArtistaNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#e74c3c',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="SeleccionArtista"
        component={SeleccionArtistaScreen}
        options={{ title: 'Perfil de Artista' }}
      />
      <Stack.Screen
        name="MiPortfolio"
        component={MiPortfolioScreen}
        options={{ title: 'Mi Portfolio' }}
      />
      <Stack.Screen
        name="DetalleTrabajo"
        component={DetalleTrabajoScreen}
        options={{ title: 'Detalle del Trabajo' }}
      />
      <Stack.Screen
        name="MiAgenda"
        component={MiAgendaScreen}
        options={{ title: 'Mi Agenda' }}
      />
    </Stack.Navigator>
  );
};

export default ArtistaNavigator;
