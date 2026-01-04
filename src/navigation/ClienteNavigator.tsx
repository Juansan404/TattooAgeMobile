import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListaArtistasScreen from '../screens/cliente/ListaArtistasScreen';
import PortfolioArtistaScreen from '../screens/cliente/PortfolioArtistaScreen';
import MisCitasScreen from '../screens/cliente/MisCitasScreen';
import { Artista } from '../types/Artista';

export type ClienteStackParamList = {
  ListaArtistas: undefined;
  PortfolioArtista: { artista: Artista };
  MisCitas: undefined;
};

const Stack = createNativeStackNavigator<ClienteStackParamList>();

/**
 * Navegador para las pantallas del modo Cliente
 */
const ClienteNavigator: React.FC = () => {
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
        name="ListaArtistas"
        component={ListaArtistasScreen}
        options={{ title: 'Artistas Disponibles' }}
      />
      <Stack.Screen
        name="PortfolioArtista"
        component={PortfolioArtistaScreen}
        options={{ title: 'Portfolio' }}
      />
      <Stack.Screen
        name="MisCitas"
        component={MisCitasScreen}
        options={{ title: 'Mis Citas' }}
      />
    </Stack.Navigator>
  );
};

export default ClienteNavigator;
