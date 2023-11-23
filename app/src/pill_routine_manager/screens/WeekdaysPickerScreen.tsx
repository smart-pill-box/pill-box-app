import { StyleSheet, Text, View } from "react-native";
import ClickableButton from "../../components/ClickabeButton";
import { useContext, useState } from "react";
import { PillRoutineForm, PillRoutineFormContext } from "../PillRoutineFormContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PillRoutineStackParamList } from "../PillRoutineManagerNavigator";
import FormsHeader from "../components/FormsHeader";
import { globalStyle } from "../../style";
import SelectableButton from "../components/SelectableButton";

type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export type WeekdaysPickerAnswers = {
    weekdays: Weekday[]
}

type Props = NativeStackScreenProps<PillRoutineStackParamList, "WeekdaysPicker">;

export default function WeekdaysPickerScreen({ route, navigation }: Props){
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
    const { pillRoutineForm, setPillRoutineForm } = useContext(PillRoutineFormContext);
    const [ selectedDays, setSelectedDays ] = useState<Weekday[]>([]);

    const toggleDaySelection = (day: Weekday)=>{
        if (selectedDays.includes(day)){
            setSelectedDays(prevSelectedDays=>{
                return prevSelectedDays.filter((weekday)=>weekday != day)
            })
        }
        else {
            setSelectedDays(prevSelectedDays=>{
                return [...prevSelectedDays, day]
            })
        }
    }

    const validateAndContinue = ()=>{
        if (selectedDays.length == 0){
            return
        }

        setPillRoutineForm((pillRoutineForm: PillRoutineForm)=>{
            pillRoutineForm.weekdaysPickerAnswers = {
                weekdays: selectedDays
            };
            return {...pillRoutineForm};
        });
        navigation.navigate("TimesPerDay", route.params);
    }

    if (!pillRoutineForm || !pillRoutineForm.nameDefinitionAnswers){
        throw(Error);
    }
    const nameDefinitionAnswers = pillRoutineForm.nameDefinitionAnswers;

    return (
        <View style={{height: "100%"}}>
            <FormsHeader onBackPressed={()=>{navigation.goBack()}} pillName={nameDefinitionAnswers.name}/>
            <View style={styles.mainContainer}>
                <Text style={[globalStyle.text, styles.text]}>Selecione os dias da semana em que você tomará esse remédio </Text>
                <View style={styles.selectionContainer}>
                    <SelectableButton
                        width={80}
                        heigh={80}
                        text="Seg"
                        onPress={()=>{toggleDaySelection("monday")}}
                        isSelected={selectedDays.includes("monday")}
                    />
                    <SelectableButton
                        width={80}
                        heigh={80}
                        text="Ter"
                        onPress={()=>{toggleDaySelection("tuesday")}}
                        isSelected={selectedDays.includes("tuesday")}
                    />
                    <SelectableButton
                        width={80}
                        heigh={80}
                        text="Qua"
                        onPress={()=>{toggleDaySelection("wednesday")}}
                        isSelected={selectedDays.includes("wednesday")}
                    />
                    <SelectableButton
                        width={80}
                        heigh={80}
                        text="Qui"
                        onPress={()=>{toggleDaySelection("thursday")}}
                        isSelected={selectedDays.includes("thursday")}
                    />
                    <SelectableButton
                        width={80}
                        heigh={80}
                        text="Sex"
                        onPress={()=>{toggleDaySelection("friday")}}
                        isSelected={selectedDays.includes("friday")}
                    />
                    <SelectableButton
                        width={80}
                        heigh={80}
                        text="Sab"
                        onPress={()=>{toggleDaySelection("saturday")}}
                        isSelected={selectedDays.includes("saturday")}
                    />
                    <SelectableButton
                        width={280}
                        heigh={80}
                        text="Domingo"
                        onPress={()=>{toggleDaySelection("sunday")}}
                        isSelected={selectedDays.includes("sunday")}
                    />
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