import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { PillRoutineStackParamList } from "../../PillRoutineManagerNavigator";
import FormsHeader from "../../components/FormsHeader";
import { useContext, useState } from "react";
import { PillRoutineEditContext } from "../../PillRoutineEditContext";
import { globalStyle } from "../../../style";
import SelectableWeekdays from "../../components/SelectableWeekdays";
import ClickableButton from "../../../components/ClickabeButton";
import { PillRoutine } from "../../../types/pill_routine";

type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
type Props = NativeStackScreenProps<PillRoutineStackParamList, "EditPillRoutineFrequency">

export default function EditPillRoutineFrequencyScreen({ route, navigation }: Props){
    const updatePillRoutineDates = (pillRoutine: PillRoutine)=>{
        const hours = pillRoutine.pillRoutineData[Object.keys(pillRoutine.pillRoutineData)[0]]
        let newData: any = {};
        selectedDays.forEach((weekday: Weekday)=>{
            newData[weekday] = hours;
        })
        pillRoutine.pillRoutineData = newData;

        return {...pillRoutine}
    }

    const onFinish = ()=>{
        if(selectedDays.length == 0){
            return
        };

        const newPillRoutine = updatePillRoutineDates(pillRoutine!);

        setPillRoutine(newPillRoutine);

        navigation.goBack();
    }

    const { pillRoutine, setPillRoutine } = useContext(PillRoutineEditContext);

    const [ selectedDays, setSelectedDays ] = useState<Weekday[]>(Object.keys(pillRoutine!.pillRoutineData) as Weekday[])
    return (
        <View style={{ flex: 1}}>
            <FormsHeader pillName={pillRoutine?.name} onBackPressed={navigation.goBack}/>
            <View style={styles.mainContainer}>
                <Text style={[globalStyle.text, styles.text]}> Selecione os dias da semana em que você tomará esse remédio </Text>
                <SelectableWeekdays
                    selectedDays={selectedDays}
                    setSelectedDays={setSelectedDays}
                />

            </View>
            <View style={styles.nextButtonContainer}>
                <ClickableButton
                    width={200}
                    height={52}
                    onPress={onFinish}
                    text="Alterar"
                    buttonStyle={{width: "100%"}}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 40,
        paddingHorizontal: 28
    },
    text: {
        color: "#575757",
        width: "100%",
        fontSize: 24
    },
    selectionContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        flexWrap: "wrap",
        width: "100%",
        gap: 24
    },
    nextButtonContainer: {
        position: "absolute",
        width: "100%",
        paddingHorizontal: 16,
        bottom: 16
    }
})