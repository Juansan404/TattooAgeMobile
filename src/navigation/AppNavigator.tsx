import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SeleccionRolScreen from '../screens/SeleccionRolScreen';
import ClienteNavigator from './ClienteNavigator';
import ArtistaNavigator from './ArtistaNavigator';

export type RootStackParamList = {
  SeleccionRol: undefined;
  Cliente: undefined;
  Artista: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Navegador principal de la aplicación
 */
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="SeleccionRol" component={SeleccionRolScreen} />
        <Stack.Screen name="Cliente" component={ClienteNavigator} />
        <Stack.Screen name="Artista" component={ArtistaNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
