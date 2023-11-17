import { StyleSheet, Text, View } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PillRoutineStackParamList } from "../PillRoutineManagerNavigator";
import { useContext, useState } from "react";
import { PillRoutineFormContext } from "../PillRoutineFormContext";
import FormsHeader from "../components/FormsHeader";
import { globalStyle } from "../../style";
import ClickableButton from "../../components/ClickabeButton";
import BorderTextInput from "../../profile_picker/components/BorderTextInput";

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

        console.log("ok")
    }

    const { pillRoutineForm, setPillRoutineForm } = useContext(PillRoutineFormContext);
    const [ timesPerDay, setTimesPerDay ] = useState<string | undefined>();

    return (
        <View style={{height: "100%"}}>
            <FormsHeader onBackPressed={()=>{navigation.goBack()}} pillName={pillRoutineForm?.name}/>
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