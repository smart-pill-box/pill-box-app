import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import PillRoutineManagerScreen from "./PillRoutineManagerScreen";
import DoseTimePickerScreen from "./screens/DoseTimePickerScreen";
import NameDefinitionScreen from "./screens/NameDefinitionScreen";
import RoutineTypeScreen from "./screens/RoutineTypeScreen";
import TimesPerDayScreen from "./screens/TimesPerDayScreen";
import WeekdaysPickerScreen from "./screens/WeekdaysPickerScreen";
import { useContext, useState } from "react";
import { PillRoutineFormContext } from "./PillRoutineFormContext";
import { Profile } from "../profile_picker/ProfilePickerScreen";
import { RootTabParamList } from "../../App";
import { ProfileKeyContext } from "../profile_picker/ProfileKeyContext";

export type PillRoutineStackParamList = {
    PillRoutineManager: undefined;
    DoseTimePicker: undefined;
    NameDefinition: undefined;
    RoutineType: undefined;
    TimesPerDay: undefined;
    WeekdaysPicker: undefined;
}

type Props = BottomTabScreenProps<RootTabParamList, "PillRoutineManagerNavigator">

const Stack = createNativeStackNavigator<PillRoutineStackParamList>()

export default function PillRoutineManagerNavigator({ route, navigation }: Props){
    const [ pillRoutineForm, setPillRoutineForm ] = useState<object>({});
    const {profileKey, setProfileKey} = useContext(ProfileKeyContext);

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
                <Stack.Screen name="PillRoutineManager" component={PillRoutineManagerScreen}/>
                <Stack.Screen name="DoseTimePicker" component={DoseTimePickerScreen}/>
                <Stack.Screen name="NameDefinition" component={NameDefinitionScreen}/>
                <Stack.Screen name="RoutineType" component={RoutineTypeScreen}/>
                <Stack.Screen name="TimesPerDay" component={TimesPerDayScreen}/>
                <Stack.Screen name="WeekdaysPicker" component={WeekdaysPickerScreen}/>
            </Stack.Navigator>
        </PillRoutineFormContext.Provider>
    )
}