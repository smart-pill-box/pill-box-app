import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PillRoutineStackParamList } from "../../PillRoutineManagerNavigator";
import ClickableButton from "../../../components/ClickabeButton";
import { globalStyle } from "../../../style";
import FormsHeader from "../../components/FormsHeader";
import { useContext, useState } from "react";
import { PillRoutineForm, PillRoutineFormContext } from "../../PillRoutineFormContext";
import { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { TimesPerDayWeekdaysAnswers, TimesPerDayDayPeriodAnswers, TimesPerDayAnswers } from "./TimesPerDayScreen";
import { DayPeriodPillRoutineData, WeekdaysPillRoutineData } from "../../../types/pill_routine";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ProfileKeyContext } from "../../../profile_picker/ProfileKeyContext";
import { useKeycloak } from "@react-keycloak/native";
import DoseTime from "../../components/DoseTime";

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

type Props = NativeStackScreenProps<PillRoutineStackParamList, "DoseTimePicker">;

type PickedTimesPerDose = {[key: number]: string};



export default function DoseTimePickerScreen({ route, navigation }: Props){
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

    const validateAndFinish = async ()=>{
        if(dosesArray.length != numberOfDoses){
            return
        }

        const payload = createPillRoutinePayload(pillRoutineForm, pickedTimesPerDose);

        try {
            const resp = await axios.post(`http://192.168.0.23:8080/account/${keycloak?.tokenParsed?.sub}/profile/${profileKey}/pill_routine`, payload, {
                headers: {
                    Authorization: keycloak?.token
                }
            })
            
            navigation.navigate("PillRoutineManager")
        } catch(err){
            console.error(err);
        }
    }

    const { pillRoutineForm, setPillRoutineForm } = useContext(PillRoutineFormContext);
    const {profileKey, setProfileKey} = useContext(ProfileKeyContext)
    const { keycloak } = useKeycloak()

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
                        <DoseTime
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
