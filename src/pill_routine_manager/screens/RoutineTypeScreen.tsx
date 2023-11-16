import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PillRoutineStackParamList } from "../PillRoutineManagerNavigator";
import FormsHeader from "../components/FormsHeader";
import { useContext } from "react";
import { PillRoutineFormContext } from "../PillRoutineFormContext";

type Props = NativeStackScreenProps<PillRoutineStackParamList, "RoutineType">;

export default function RoutineTypeScreen({route, navigation}: Props){
    const { pillRoutineForm, setPillRoutineForm } = useContext(PillRoutineFormContext);

    return (
        <View>
            <FormsHeader onBackPressed={()=>{navigation.goBack()}} pillName={pillRoutineForm?.name}/>
        </View>
    )
}