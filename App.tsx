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

import ProfilePickerScreen from './src/profile_picker/ProfilePickerScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddProfileScreen from './src/profile_picker/AddProfileScreen';

export type RootStackParamList = {
  ProfilePicker: undefined;
  AddProfile: undefined;
}

function App(): JSX.Element {

  const Stack = createNativeStackNavigator<RootStackParamList>();
  useEffect(()=>{
    const exampleProfiles = [
      {
        name: "André",
        avatar: 1,
        profileKey: "aksjdkasjd"
      },
      {
        name: "Jessica",
        avatar: 2,
        profileKey: "vakjsdasd"
      }
    ]
    AsyncStorage.setItem("profiles", JSON.stringify(exampleProfiles)).then(()=>{
      return
    })
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName="AddProfile"
      screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="ProfilePicker" component={ProfilePickerScreen}/>
        <Stack.Screen name="AddProfile" component={AddProfileScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
