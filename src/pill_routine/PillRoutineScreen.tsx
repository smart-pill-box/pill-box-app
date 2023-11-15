import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { View } from "react-native";
import MainHeader from "../components/MainHeader";

type Props = NativeStackScreenProps<RootStackParamList, "PillRoutine">

export default function PillRoutineScreen({route, navigation}: Props){
    return (
        <View>
            <MainHeader avatarNumber={route.params.avatar} profileName={route.params.name}/>
        </View>
    )
}