import React, { useEffect } from 'react';
import Navigation from './Controllers/Navigation';
import { enableScreens } from 'react-native-screens';
import { Appearance } from 'react-native';

enableScreens();

export default function App() {
  useEffect(() => Appearance.setColorScheme('light'),
  []);
  return (
    <Navigation/>
  );
}