import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import PillRoutineManagerScreen from "./PillRoutineManagerScreen";
import DoseTimePickerScreen from "./screens/create_pill_routine/DoseTimePickerScreen";
import NameDefinitionScreen from "./screens/create_pill_routine/NameDefinitionScreen";
import RoutineTypeScreen from "./screens/create_pill_routine/RoutineTypeScreen";
import TimesPerDayScreen from "./screens/create_pill_routine/TimesPerDayScreen";
import WeekdaysPickerScreen from "./screens/create_pill_routine/WeekdaysPickerScreen";
import { useContext, useState } from "react";
import { PillRoutineFormContext } from "./PillRoutineFormContext";
import { Profile } from "../profile_picker/ProfilePickerScreen";
import { RootTabParamList } from "../../App";
import { ProfileKeyContext } from "../profile_picker/ProfileKeyContext";
import EditPillRoutineScreen from "./screens/edit_pill_routine/EditPillRoutineScreen";
import { PillRoutine } from "../types/pill_routine";
import { PillRoutineEditContext } from "./PillRoutineEditContext";
import EditPillRoutineFrequencyScreen from "./screens/edit_pill_routine/EditPillRoutineFrequencyScreen";
import EditPillRoutineDosesScreen from "./screens/edit_pill_routine/EditPillRoutineDosesScreen";
import DayPeriodScreen from "./screens/create_pill_routine/DayPeriodScreen";

export type PillRoutineStackParamList = {
    PillRoutineManager: undefined;
    DoseTimePicker: undefined;
    NameDefinition: undefined;
    RoutineType: undefined;
    TimesPerDay: undefined;
    WeekdaysPicker: undefined;
    EditPillRoutine: { pillRoutineKey: string };
    EditPillRoutineFrequency: undefined;
    EditPillRoutineDoses: undefined;
    DayPeriod: undefined;
}

type Props = BottomTabScreenProps<RootTabParamList, "PillRoutineManagerNavigator">

const Stack = createNativeStackNavigator<PillRoutineStackParamList>()

export default function PillRoutineManagerNavigator({ route, navigation }: Props){
    const [ pillRoutineForm, setPillRoutineForm ] = useState<object>({});
    const [ editPillRoutine, setEditPillRoutine ] = useState<PillRoutine | undefined>()
 
    return (
        <PillRoutineFormContext.Provider value={{
            setPillRoutineForm: setPillRoutineForm,
            pillRoutineForm: pillRoutineForm
        }}>
        <PillRoutineEditContext.Provider value={{
            setPillRoutine: setEditPillRoutine,
            pillRoutine: editPillRoutine
        }}>
            <Stack.Navigator
                initialRouteName="PillRoutineManager"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="PillRoutineManager" component={PillRoutineManagerScreen}/>

                <Stack.Group>
                    <Stack.Screen name="EditPillRoutine" component={EditPillRoutineScreen}/>
                    <Stack.Screen name="EditPillRoutineFrequency" component={EditPillRoutineFrequencyScreen}/>
                    <Stack.Screen name="EditPillRoutineDoses" component={EditPillRoutineDosesScreen}/>
                </Stack.Group>

                <Stack.Group>
                    <Stack.Screen name="NameDefinition" component={NameDefinitionScreen}/>
                    <Stack.Screen name="RoutineType" component={RoutineTypeScreen}/>
                    <Stack.Screen name="WeekdaysPicker" component={WeekdaysPickerScreen}/>
                    <Stack.Screen name="TimesPerDay" component={TimesPerDayScreen}/>
                    <Stack.Screen name="DoseTimePicker" component={DoseTimePickerScreen}/>
                    <Stack.Screen name="DayPeriod" component={DayPeriodScreen}/>
                </Stack.Group>
            </Stack.Navigator>
        </PillRoutineEditContext.Provider>
        </PillRoutineFormContext.Provider>
    )
}
