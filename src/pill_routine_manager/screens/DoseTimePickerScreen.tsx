import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PillRoutineStackParamList } from "../PillRoutineManagerNavigator";
import ClickableButton from "../../components/ClickabeButton";
import { globalStyle } from "../../style";
import FormsHeader from "../components/FormsHeader";
import { useContext, useState } from "react";
import { DayPeriodPillRoutineData, PillRoutineForm, PillRoutineFormContext, PillRoutinePayload, WeekdaysPillRoutineData } from "../PillRoutineFormContext";
import { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { TimesPerDayWeekdaysAnswers, TimesPerDayDayPeriodAnswers, TimesPerDayAnswers } from "./TimesPerDayScreen";

type WeekdaysAnswers = {
    monday?: string[];
    tuesday?: string[];
    wednesday?: string[];
    thursday?: string[];
    friday?: string[];
    saturday?: string[];
    sunday?: string[];
};

type DayPeriodAnswers = {
    dosesTimes: string[];
}

export type DoseTimePickerAnswers = WeekdaysAnswers | DayPeriodAnswers

type Props = NativeStackScreenProps<PillRoutineStackParamList, "RoutineType">;
type DoseProps = {
    doseNumber: number;
    selectedTime?: string
    onTimePicked: (event: DateTimePickerEvent, selectedDate?: Date)=>void;
}
type PickedTimesPerDose = {[key: number]: string};

function Dose({doseNumber, selectedTime, onTimePicked}: DoseProps){
    const styles = StyleSheet.create({
        doseContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 24
        },
        timeContainer: {
            width: 80,
            height: 60,
            borderWidth: 1,
            borderColor: "black"
        },
        timeText: {
            fontSize: 24,
            width: "100%",
            height: "100%",
            textAlign: "center",
            textAlignVertical: "center"
        }
    });

    return (
        <View style={styles.doseContainer}>
            <Text style={[globalStyle.text]}>{doseNumber+1}° Dose </Text>
            <TouchableWithoutFeedback onPress={()=>{
                DateTimePickerAndroid.open({
                    value: new Date(),
                    onChange: onTimePicked,
                    mode: "time",
                    is24Hour: true
                })
            }}>
                <View style={styles.timeContainer}>
                    { selectedTime ? <Text style={[globalStyle.text, styles.timeText]}> {selectedTime} </Text> : undefined }
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default function DoseTimePickerScreen({ route, navigation }: Props){
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

    const setDateByIndex = (index: number, selectedDate?: Date)=>{
        if (!selectedDate){
            return
        }
        setPickedTimesPerDose((prev: PickedTimesPerDose)=>{
            const pickedTimesPerDose = {...prev};
            pickedTimesPerDose[index] = getTimeString(selectedDate);
            return pickedTimesPerDose;
        })
    }

    const validateAndFinish = ()=>{
        if(dosesArray.length != numberOfDoses){
            return
        }

        const payload = createPillRoutinePayload(pillRoutineForm, pickedTimesPerDose);

        console.log(payload);
    }

    const { pillRoutineForm, setPillRoutineForm } = useContext(PillRoutineFormContext);

    const [ pickedTimesPerDose, setPickedTimesPerDose ] = useState<PickedTimesPerDose>({})

    if (!pillRoutineForm || !pillRoutineForm.nameDefinitionAnswers || !pillRoutineForm.timesPerDayAnswers){
        throw(Error);
    }
    const nameDefinitionAnswers = pillRoutineForm.nameDefinitionAnswers;

    const numberOfDoses = getNumberOfDoses(pillRoutineForm.timesPerDayAnswers)


    const dosesArray = Array.from({length: numberOfDoses}, (_, index) => index);

    return (
        <View style={{height: "100%"}}>
            <FormsHeader onBackPressed={()=>{navigation.goBack()}} pillName={nameDefinitionAnswers.name}/>
            <View style={styles.mainContainer}>
                <Text style={[globalStyle.text, styles.text]}> Em quais horários você tomará as doses desse remédio? </Text>
                <View style={styles.dosesContainer}>
                    { dosesArray.map((_, index)=>(
                        <Dose
                            doseNumber={index}
                            selectedTime={pickedTimesPerDose[index]}
                            onTimePicked={(event: DateTimePickerEvent, selectedDate?: Date)=>{setDateByIndex(index, selectedDate)}}
                            key={index}
                        />
                    )) }
                </View>

            </View>
            <View style={styles.nextButtonContainer}>
                <ClickableButton
                    width={200}
                    height={52}
                    onPress={validateAndFinish}
                    text="Finalizar"
                    buttonStyle={{width: "100%"}}
                />
            </View>
        </View>
    )
}

const createPillRoutinePayload = (pillRoutineForm: PillRoutineForm, pickedTimesPerDose: PickedTimesPerDose)=>{
    const routineType = pillRoutineForm.routineTypeAnswers?.routineType ?? "dayPeriod";
    const pillName = pillRoutineForm.nameDefinitionAnswers?.name ?? "default name";

    let routineData = {};
    if (routineType == "weekdays"){
        const weekdays = pillRoutineForm.weekdaysPickerAnswers?.weekdays;
        const weekdaysRoutineData: WeekdaysAnswers = {};
        weekdays?.forEach((weekday)=>{
            weekdaysRoutineData[weekday] = pickedTimesPerDoseToArray(pickedTimesPerDose)
        });
        routineData = weekdaysRoutineData;
    }
    else if (routineType == "dayPeriod"){
        routineData = {
            periodInDays: 5,
            pillsTimes: pickedTimesPerDoseToArray(pickedTimesPerDose)
        };
    }
    else {
        throw new Error();
    }

    const pillRoutineData: (WeekdaysPillRoutineData | DayPeriodPillRoutineData) = routineData;

    const payload = {
        pillRoutineType: routineType,
        name: pillName,
        pillRoutineData: pillRoutineData
    };

    return payload;
}

const pickedTimesPerDoseToArray = (pickedTimesPerDose: PickedTimesPerDose)=>{
    const timesArray: string[] = [];
    Object.keys(pickedTimesPerDose).forEach(index => {
        timesArray.push(pickedTimesPerDose[+index])
    });

    return timesArray;
}

const getNumberOfDoses = (timesPerDayAnswers: TimesPerDayAnswers)=>{
    let numberOfDoses: number;

    if ("timesPerDay" in timesPerDayAnswers){
        numberOfDoses = timesPerDayAnswers.timesPerDay
    }
    else {
        const timesPerDayWeekdaysAnswers = timesPerDayAnswers as TimesPerDayWeekdaysAnswers;
        const weekday = Object.keys(timesPerDayWeekdaysAnswers)[0] as keyof TimesPerDayWeekdaysAnswers;

        numberOfDoses = timesPerDayWeekdaysAnswers[weekday] ?? 0;
    }

    return numberOfDoses;
}

const getTimeString = (date: Date) => {
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
};
