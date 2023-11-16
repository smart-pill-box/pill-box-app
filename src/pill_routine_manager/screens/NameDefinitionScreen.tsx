import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PillRoutineStackParamList } from "../PillRoutineManagerNavigator";
import ClickableButton from "../../components/ClickabeButton";
import { globalStyle } from "../../style";
import FormsHeader from "../components/FormsHeader";
import BorderTextInput from "../../profile_picker/components/BorderTextInput";
import { useContext, useState } from "react";
import { PillRoutineFormContext } from "../PillRoutineFormContext";

type Props = NativeStackScreenProps<PillRoutineStackParamList, "NameDefinition">;

export default function NameDefinitionScreen({ route, navigation }: Props){
    const styles = StyleSheet.create({
        container: {
            flexDirection: "column",
            justifyContent: "space-between",
            height: 220,
            paddingHorizontal: 28
        },
        text: {
            color: "#575757",
            width: "100%",
            fontSize: 24
        },
        buttonContainer: {
            alignItems: "flex-end",
            justifyContent: "flex-end"
        }
    })

    const validateAndContinue = ()=>{
        if (!pillName || pillName.length == 0){
            return
        }

        setPillRoutineForm({
            name: pillName
        });

        navigation.navigate("RoutineType", route.params)
    }

    const { pillRoutineForm, setPillRoutineForm } = useContext(PillRoutineFormContext);
    const [ pillName, setPillName ] = useState<undefined|string>()

    return (
        <View>
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
                <View style={styles.buttonContainer}>
                    <ClickableButton
                        width={204}
                        height={52}
                        text="Próximo"
                        onPress={validateAndContinue}
                    />
                </View>
            </View>
        </View>
    )
}