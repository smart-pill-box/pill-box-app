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
import BorderTextInput from "../../../profile_picker/components/BorderTextInput";

type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
type Props = NativeStackScreenProps<PillRoutineStackParamList, "EditPillRoutineFrequency">

function EditWeekdaysRoutineFrequency({ route, navigation }: Props){
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
            <View style={weekdaysStyle.mainContainer}>
                <Text style={[globalStyle.text, weekdaysStyle.text]}> Selecione os dias da semana em que você tomará esse remédio </Text>
                <SelectableWeekdays
                    selectedDays={selectedDays}
                    setSelectedDays={setSelectedDays}
                />

            </View>
            <View style={weekdaysStyle.nextButtonContainer}>
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

function EditDayPeriodRoutineFrequency({ route, navigation }: Props){
    const { pillRoutine, setPillRoutine } = useContext(PillRoutineEditContext);
    const [ periodInDays, setPeriodInDays ] = useState<number>(pillRoutine?.pillRoutineData.periodInDays);

    const validateAndContinue = ()=>{
        const newPillRoutine = {...pillRoutine};
        newPillRoutine.pillRoutineData.periodInDays = periodInDays;

        setPillRoutine(newPillRoutine as PillRoutine);
        navigation.goBack();
    }

    return (
        <View style={{height: "100%"}}>
            <FormsHeader onBackPressed={()=>{navigation.goBack()}} pillName={pillRoutine?.name}/>
            <View style={dayPeriodStyle.mainContainer}>
                <Text style={[globalStyle.text, dayPeriodStyle.questionText]}>A cada quantos dias você precisa tomar esse remédio? </Text>
                <View style={dayPeriodStyle.inputContainer}>
                    <BorderTextInput
                        width={80}
                        height={80}
                        onChangeText={periodStr=>setPeriodInDays(+periodStr)}
                        currentValue={String(periodInDays)}
                        keyboardType="numeric"
                        maxLength={2}
                        style={{ fontSize: 32 }}
                    />
                    <Text style={[globalStyle.text, { fontSize: 24 }]}> dias </Text>
                </View>

            </View>
            <View style={dayPeriodStyle.nextButtonContainer}>
                <ClickableButton
                    width={200}
                    height={52}
                    onPress={validateAndContinue}
                    text="Alterar"
                    buttonStyle={{width: "100%"}}
                />
            </View>
        </View>
    )
}

export default function EditPillRoutineFrequencyScreen({ route, navigation }: Props){
    const { pillRoutine, setPillRoutine } = useContext(PillRoutineEditContext);

    if(pillRoutine?.pillRoutineType == "weekdays"){
        return EditWeekdaysRoutineFrequency({ route, navigation });
    }
    else if(pillRoutine?.pillRoutineType == "dayPeriod"){
        return EditDayPeriodRoutineFrequency({ route, navigation });
    }
};

const weekdaysStyle = StyleSheet.create({
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
});

const dayPeriodStyle = StyleSheet.create({
    mainContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 40,
        paddingHorizontal: 28
    },
    questionText: {
        color: "#575757",
        width: "100%",
        fontSize: 24
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    nextButtonContainer: {
        position: "absolute",
        width: "100%",
        paddingHorizontal: 16,
        bottom: 16
    }
})