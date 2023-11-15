/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  useColorScheme,
} from 'react-native';

import ProfilePickerScreen, { Profile } from './src/profile_picker/ProfilePickerScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddProfileScreen from './src/profile_picker/AddProfileScreen';
import PillRoutineScreen from './src/pill_routine/PillRoutineScreen';

export type RootStackParamList = {
  ProfilePicker: undefined;
  AddProfile: undefined;
  PillRoutine: Profile;
}

function App(): JSX.Element {

  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName="ProfilePicker"
      screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="ProfilePicker" component={ProfilePickerScreen}/>
        <Stack.Screen name="AddProfile" component={AddProfileScreen}/>
        <Stack.Screen name="PillRoutine" component={PillRoutineScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
