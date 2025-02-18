import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PillRoutineStackParamList } from "../../PillRoutineManagerNavigator";
import ClickableButton from "../../../components/ClickabeButton";
import { globalStyle } from "../../../style";
import FormsHeader from "../../components/FormsHeader";
import BorderTextInput from "../../../profile_picker/components/BorderTextInput";
import { useContext, useState } from "react";
import { PillRoutineForm, PillRoutineFormContext, PillRoutineFormContextType } from "../../PillRoutineFormContext";

export type NameDefinitionAnswers = {
    name: string
}

type Props = NativeStackScreenProps<PillRoutineStackParamList, "NameDefinition">;

export default function NameDefinitionScreen({ route, navigation }: Props){
    const styles = StyleSheet.create({
        container: {
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            height: 220,
        },
        text: {
            color: "#575757",
            width: "100%",
            fontSize: 24
        },
        nextButtonContainer: {
            position: "absolute",
            width: "100%",
            paddingHorizontal: 16,
            bottom: 16
        }
    })

    const validateAndContinue = ()=>{
        if (!pillName || pillName.length == 0){
            return
        }

        setPillRoutineForm((pillRoutineForm: PillRoutineForm)=>{
            pillRoutineForm.nameDefinitionAnswers = {
                name: pillName
            };

            return pillRoutineForm;
        });

        navigation.navigate("RoutineType", route.params)
    }

    const { pillRoutineForm, setPillRoutineForm } = useContext(PillRoutineFormContext);
    const [ pillName, setPillName ] = useState<undefined|string>()

    return (
        <View style={{ height: "100%", alignItems: "center", position: "relative" }}>
            <FormsHeader onBackPressed={()=>{navigation.goBack()}}/>
            <View style={styles.container}>
                <Text style={[globalStyle.text, styles.text]}> Qual o nome do seu medicamento? </Text>
                <BorderTextInput
                    width={297}
                    height={44}
                    placeholder="Nome do remédio"
                    onChangeText={setPillName}
                    currentValue={pillName}
                />
            </View>
            <View style={styles.nextButtonContainer}>
                <ClickableButton
                    width={200}
                    height={52}
                    text="Próximo"
                    onPress={validateAndContinue}
                    buttonStyle={{ width: "100%" }}
                />
            </View>
        </View>
    )
}