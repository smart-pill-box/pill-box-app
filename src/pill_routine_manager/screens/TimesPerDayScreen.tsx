import { StyleSheet, Text, View } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PillRoutineStackParamList } from "../PillRoutineManagerNavigator";
import { useContext, useState } from "react";
import { PillRoutineForm, PillRoutineFormContext } from "../PillRoutineFormContext";
import FormsHeader from "../components/FormsHeader";
import { globalStyle } from "../../style";
import ClickableButton from "../../components/ClickabeButton";
import BorderTextInput from "../../profile_picker/components/BorderTextInput";

export type TimesPerDayWeekdaysAnswers = {
    monday?: number;
    tuesday?: number;
    wednesday?: number;
    thursday?: number;
    friday?: number;
    saturday?: number;
    sunday?: number;
};

export type TimesPerDayDayPeriodAnswers = {
    timesPerDay: number;
};

export type TimesPerDayAnswers = TimesPerDayDayPeriodAnswers | TimesPerDayWeekdaysAnswers;  

type Props = NativeStackScreenProps<PillRoutineStackParamList, "TimesPerDay">;

export default function TimesPerDayScreen({ route, navigation }: Props){
    const styles = StyleSheet.create({
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

    const validateAndContinue = ()=>{
        if (!timesPerDay){
            return
        }

        if(isNaN(+timesPerDay)){
            return
        }

        if(!Number.isInteger(+timesPerDay)){
            return
        }

        if(+timesPerDay == 0){
            return
        }

        if(pillRoutineForm.routineTypeAnswers?.routineType == "weekdays"){
            const weekdays = pillRoutineForm.weekdaysPickerAnswers?.weekdays
            if (!weekdays){
                throw new Error();
            }

            let weekdayAnswers: TimesPerDayWeekdaysAnswers = {};
            
            weekdays.forEach(weekday => {
                weekdayAnswers[weekday] = +timesPerDay;
            });
            setPillRoutineForm((pillRoutineForm: PillRoutineForm)=>{
                pillRoutineForm.timesPerDayAnswers = weekdayAnswers;
                return pillRoutineForm;
            })
        }
        else if(pillRoutineForm.routineTypeAnswers?.routineType == "dayPeriod"){
            setPillRoutineForm((pillRoutineForm: PillRoutineForm)=>{
                pillRoutineForm.timesPerDayAnswers = {
                    timesPerDay: +timesPerDay
                };
                return pillRoutineForm;
            });
        }
        else {
            throw new Error();
        }

        navigation.navigate("DoseTimePicker", route.params);
    }

    const { pillRoutineForm, setPillRoutineForm } = useContext(PillRoutineFormContext);
    if (!pillRoutineForm || !pillRoutineForm.nameDefinitionAnswers){
        throw new Error();
    }

    const [ timesPerDay, setTimesPerDay ] = useState<string | undefined>();

    return (
        <View style={{height: "100%"}}>
            <FormsHeader onBackPressed={()=>{navigation.goBack()}} pillName={pillRoutineForm.nameDefinitionAnswers.name}/>
            <View style={styles.mainContainer}>
                <Text style={[globalStyle.text, styles.questionText]}>Quantas vezes por dia você tomará esse remédio? </Text>
                <View style={styles.inputContainer}>
                    <BorderTextInput
                        width={80}
                        height={80}
                        onChangeText={setTimesPerDay}
                        currentValue={timesPerDay}
                        keyboardType="numeric"
                        maxLength={2}
                        style={{ fontSize: 32 }}
                    />
                    <Text style={[globalStyle.text, { fontSize: 24 }]}> vezes por dia </Text>
                </View>

            </View>
            <View style={styles.nextButtonContainer}>
                <ClickableButton
                    width={200}
                    height={52}
                    onPress={validateAndContinue}
                    text="Próximo"
                    buttonStyle={{width: "100%"}}
                />
            </View>
        </View>
    )
}