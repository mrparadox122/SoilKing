import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../Pages/Splash';
import Login from '../Pages/Login';

const Stack = createStackNavigator();



export default function App() {
  return (
    <NavigationContainer>
       <AuthProvider>
        <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}} />
         <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
       </AuthProvider>
    </NavigationContainer>
  );
}
