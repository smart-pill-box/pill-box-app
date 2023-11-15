import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { View } from "react-native";
import MainHeader from "../components/MainHeader";
import ScrollableDatePicker from "./components/calendar/ScrollableDatePicker";

type Props = NativeStackScreenProps<RootStackParamList, "PillRoutine">

export default function PillRoutineScreen({route, navigation}: Props){
    const today = new Date();
    const onDateSelection = (date: Date)=>{
        
    }
    
    return (
        <View>
            <MainHeader avatarNumber={route.params.avatar} profileName={route.params.name}/>
            <ScrollableDatePicker startDate={new Date()} onDateSelection={onDateSelection}/>
        </View>
    )
}