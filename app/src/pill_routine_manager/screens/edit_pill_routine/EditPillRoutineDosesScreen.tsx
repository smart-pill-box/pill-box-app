import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PillRoutineStackParamList } from "../../PillRoutineManagerNavigator";
import { useContext, useState } from "react";
import { PillRoutineEditContext } from "../../PillRoutineEditContext";
import FormsHeader from "../../components/FormsHeader";
import { globalStyle } from "../../../style";
import ClickableButton from "../../../components/ClickabeButton";
import DoseTime from "../../components/DoseTime";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { PillRoutine } from "../../../types/pill_routine";

type Props = NativeStackScreenProps<PillRoutineStackParamList, "EditPillRoutineDoses">

export default function EditPillRoutineDosesScreen({ route, navigation }: Props){
    const setPillTime = (index: number, newTime: Date)=>{
        dosesTimes[index] = getTimeString(newTime);

        setDosesTimes([...dosesTimes])
    };

    const updateRoutineData = (pillRoutine: PillRoutine)=>{
        if(pillRoutine.pillRoutineType == "weekdays"){
            const weekdays = Object.keys(pillRoutine.pillRoutineData);
    
            let newData: any = {}
            weekdays.forEach((weekday)=>{
                newData[weekday] = dosesTimes;  
            });
    
            pillRoutine.pillRoutineData = newData;
    
            return {...pillRoutine}
        }
        else {
            const newData = pillRoutine.pillRoutineData;
            newData.pillsTimes = dosesTimes;
            pillRoutine.pillRoutineData = newData;
            return {
                ...pillRoutine,
            }
        }
    }
    const onFinish = ()=>{
        setPillRoutine(updateRoutineData(pillRoutine!));
        navigation.goBack();
    }

    const { pillRoutine, setPillRoutine } = useContext(PillRoutineEditContext);
    const initDoseTimes = pillRoutine!.pillRoutineData[Object.keys(pillRoutine!.pillRoutineData)[0]]
    const [dosesTimes, setDosesTimes] = useState(initDoseTimes)

    return (
        <View style={{height: "100%"}}>
            <FormsHeader onBackPressed={()=>{navigation.goBack()}} pillName={pillRoutine!.name}/>
            <View style={styles.mainContainer}>
                <Text style={[globalStyle.text, styles.text]}> Em quais horários você tomará as doses desse remédio? </Text>
                <View style={styles.dosesContainer}>
                    { dosesTimes.map((doseTime: string, index: number)=>(
                        <DoseTime
                            doseNumber={index}
                            selectedTime={doseTime}
                            onTimePicked={(event: DateTimePickerEvent, selectedDate?: Date)=>{setPillTime(index, selectedDate!)}}
                            key={index}
                        />
                    )) }
                </View>

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
    dosesContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        width: "100%",
        gap: 24
    },
    doseContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 24
    },
    nextButtonContainer: {
        position: "absolute",
        width: "100%",
        paddingHorizontal: 16,
        bottom: 16
    }
});

const getTimeString = (date: Date) => {
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
};