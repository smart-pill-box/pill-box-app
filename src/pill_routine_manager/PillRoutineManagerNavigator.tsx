import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import PillRoutineManagerScreen from "./PillRoutineManagerScreen";
import DoseTimePickerScreen from "./screens/DoseTimePickerScreen";
import NameDefinitionScreen from "./screens/NameDefinitionScreen";
import RoutineTypeScreen from "./screens/RoutineTypeScreen";
import TimesPerDayScreen from "./screens/TimesPerDayScreen";
import WeekdaysPickerScreen from "./screens/WeekdaysPickerScreen";
import { useState } from "react";
import { PillRoutineFormContext } from "./PillRoutineFormContext";
import { Profile } from "../profile_picker/ProfilePickerScreen";
import { RootTabParamList } from "../../App";

export type PillRoutineStackParamList = {
    PillRoutineManager: Profile;
    DoseTimePicker: Profile;
    NameDefinition: Profile;
    RoutineType: Profile;
    TimesPerDay: Profile;
    WeekdaysPicker: Profile;
}

type Props = BottomTabScreenProps<RootTabParamList, "PillRoutineManagerNavigator">

const Stack = createNativeStackNavigator<PillRoutineStackParamList>()

export default function PillRoutineManagerNavigator({ route, navigation }: Props){
    const [ pillRoutineForm, setPillRoutineForm ] = useState<null | object>(null);

    return (
        <PillRoutineFormContext.Provider value={{
            setPillRoutineForm: setPillRoutineForm,
            pillRoutineForm: pillRoutineForm
        }}>
            <Stack.Navigator
                initialRouteName="PillRoutineManager"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="PillRoutineManager" component={PillRoutineManagerScreen} initialParams={route.params}/>
                <Stack.Screen name="DoseTimePicker" component={DoseTimePickerScreen} initialParams={route.params}/>
                <Stack.Screen name="NameDefinition" component={NameDefinitionScreen} initialParams={route.params}/>
                <Stack.Screen name="RoutineType" component={RoutineTypeScreen} initialParams={route.params}/>
                <Stack.Screen name="TimesPerDay" component={TimesPerDayScreen} initialParams={route.params}/>
                <Stack.Screen name="WeekdaysPicker" component={WeekdaysPickerScreen} initialParams={route.params}/>
            </Stack.Navigator>
        </PillRoutineFormContext.Provider>
    )
}