/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import keycloakClient from './keycloak';
import ProfilePickerScreen, { Profile } from './src/profile_picker/ProfilePickerScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddProfileScreen from './src/profile_picker/AddProfileScreen';
import PillRoutineScreen from './src/pill_calendar/PillCalendarScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PillCalendarScreen from './src/pill_calendar/PillCalendarScreen';
import PillBoxManagerScreen from './src/pill_box_manager/PillBoxManagerScreen';
import PillRoutineManagerNavigator from './src/pill_routine_manager/PillRoutineManagerNavigator';
import { ReactNativeKeycloakProvider, useKeycloak } from '@react-keycloak/native';
import LoginScreen from './src/login/screens/LoginScreen';
import { ProfileKeyContext } from './src/profile_picker/ProfileKeyContext';


export type RootTabParamList = {
  PillCalendar: undefined;
  PillBoxManager: undefined;
  PillRoutineManagerNavigator: undefined;
}

export type RootStackParamList = {
  ProfilePicker: undefined;
  AddProfile: undefined;
  Login: undefined;
  Home: NavigatorScreenParams<RootTabParamList>;
}

const linking = {
  prefixes: ["mymedsafe.pillbox://", "mymedsafe.pillbox.auth://"],
  config: {
    screens: {
      ProfilePicker: "profile_picker",
      AddProfile: "add_profile"
    }
  }
}

type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function Home({ route, navigation }: HomeProps): JSX.Element {

  return (
      <Tab.Navigator initialRouteName="PillCalendar" screenOptions={{
        headerShown: false
      }}>
        <Tab.Screen name="PillCalendar" component={PillCalendarScreen}/>
        <Tab.Screen name="PillRoutineManagerNavigator" component={PillRoutineManagerNavigator}/>
        <Tab.Screen name="PillBoxManager" component={PillBoxManagerScreen}/>
      </Tab.Navigator>
  )
}

function NavigatorContainer(){
  const { keycloak } = useKeycloak();
  const [profileKey, setProfileKey] = useState<string>("");
  
  return (
    <NavigationContainer linking={linking}>
    <ProfileKeyContext.Provider value={{
      profileKey: profileKey,
      setProfileKey: setProfileKey
    }}
    >
      <Stack.Navigator
      initialRouteName="ProfilePicker"
      screenOptions={{
        headerShown: false,
      }}>
        {keycloak?.authenticated ? (
          <>
          <Stack.Screen name="ProfilePicker" component={ProfilePickerScreen}/>
          <Stack.Screen name="AddProfile" component={AddProfileScreen}/>
          <Stack.Screen name="Home" component={Home}/>
          </>
        ) : (
          <>
          <Stack.Screen name="Login" component={LoginScreen}/>
          </>
        )
        }
      </Stack.Navigator>
    </ProfileKeyContext.Provider>
  </NavigationContainer>
  )
}

function App(): JSX.Element {
  const { keycloak } = useKeycloak();

  return (
    <ReactNativeKeycloakProvider
      authClient={keycloakClient}
      initOptions={{
        redirectUri: "mymedsafe.pillbox://add_profile"
      }}
    >
      <NavigatorContainer/>
    </ReactNativeKeycloakProvider>
  );
}

export default App;
