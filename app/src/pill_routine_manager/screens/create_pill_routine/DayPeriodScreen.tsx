import { StyleSheet, Text, View } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PillRoutineStackParamList } from "../../PillRoutineManagerNavigator";
import { useContext, useState } from "react";
import { PillRoutineForm, PillRoutineFormContext } from "../../PillRoutineFormContext";
import FormsHeader from "../../components/FormsHeader";
import { globalStyle } from "../../../style";
import ClickableButton from "../../../components/ClickabeButton";
import BorderTextInput from "../../../profile_picker/components/BorderTextInput";

export type DayPeriodAnswers = {
    periodInDays: number
}

type Props = NativeStackScreenProps<PillRoutineStackParamList, "DayPeriod">;

export default function DayPeriodScreen({ route, navigation }: Props){
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
        if (!periodInDays){
            return
        }

        if(isNaN(+periodInDays)){
            return
        }

        if(!Number.isInteger(+periodInDays)){
            return
        }

        if(+periodInDays == 0){
            return
        }

        setPillRoutineForm((pillRoutineForm: PillRoutineForm)=>{
            pillRoutineForm.dayPeriodAnswers = {
                periodInDays: (+periodInDays)
            }

            return pillRoutineForm;
        })

        navigation.navigate("TimesPerDay", route.params);
    }

    const { pillRoutineForm, setPillRoutineForm } = useContext(PillRoutineFormContext);
    if (!pillRoutineForm || !pillRoutineForm.nameDefinitionAnswers){
        throw new Error();
    }

    const [ periodInDays, setPeriodInDays ] = useState<string | undefined>();

    return (
        <View style={{height: "100%"}}>
            <FormsHeader onBackPressed={()=>{navigation.goBack()}} pillName={pillRoutineForm.nameDefinitionAnswers.name}/>
            <View style={styles.mainContainer}>
                <Text style={[globalStyle.text, styles.questionText]}>A cada quantos dias você precisa tomar esse remédio? </Text>
                <View style={styles.inputContainer}>
                    <BorderTextInput
                        width={80}
                        height={80}
                        onChangeText={setPeriodInDays}
                        currentValue={periodInDays}
                        keyboardType="numeric"
                        maxLength={2}
                        style={{ fontSize: 32 }}
                    />
                    <Text style={[globalStyle.text, { fontSize: 24 }]}> dias </Text>
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