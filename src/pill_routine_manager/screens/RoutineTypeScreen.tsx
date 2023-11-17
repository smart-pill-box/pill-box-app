import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PillRoutineStackParamList } from "../PillRoutineManagerNavigator";
import FormsHeader from "../components/FormsHeader";
import { useContext, useState } from "react";
import { PillRoutineForm, PillRoutineFormContext, PillRoutineFormContextType, PillRoutineType } from "../PillRoutineFormContext";
import SelectableButton from "../components/SelectableButton";
import { globalStyle } from "../../style";
import ClickableButton from "../../components/ClickabeButton";

type Props = NativeStackScreenProps<PillRoutineStackParamList, "RoutineType">;

export default function RoutineTypeScreen({route, navigation}: Props){
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
        optionsContainer: {
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
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

    const validateAndContinue = ()=>{
        if (!selectedType){
            return
        }

        setPillRoutineForm((pillRoutineForm: PillRoutineForm)=>{
            pillRoutineForm.pillRoutineType = selectedType;
            return pillRoutineForm;
        });

        navigation.navigate("TimesPerDay", route.params)
    }

    const { pillRoutineForm, setPillRoutineForm } = useContext(PillRoutineFormContext);
    const [ selectedType, setSelectedType ] = useState<PillRoutineType | undefined>();

    return (
        <View style={{height: "100%"}}>
            <FormsHeader onBackPressed={()=>{navigation.goBack()}} pillName={pillRoutineForm?.name}/>
            <View style={styles.mainContainer}>
                <Text style={[globalStyle.text, styles.text]}> Com qual frequência você toma esse remédio?</Text>
                <View style={styles.optionsContainer}>
                    <SelectableButton
                        width={240}
                        heigh={40}
                        text="Todos os dias"
                        onPress={()=>{setSelectedType("everyday")}}
                        isSelected={selectedType == "everyday"}
                    />
                    <SelectableButton
                        width={240}
                        heigh={40}
                        text="Alguns dias da semana"
                        onPress={()=>{setSelectedType("weekdays")}}
                        isSelected={selectedType == "weekdays"}
                    />
                    <SelectableButton
                        width={240}
                        heigh={40}
                        text="A cada X dias"
                        onPress={()=>{setSelectedType("someDays")}}
                        isSelected={selectedType == "someDays"}
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