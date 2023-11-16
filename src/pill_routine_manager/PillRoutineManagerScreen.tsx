import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PillRoutineStackParamList } from "./PillRoutineManagerNavigator";
import { View, Text, StyleSheet } from "react-native";
import MainHeader from "../components/MainHeader";
import ClickableButton from "../components/ClickabeButton";
import { globalStyle } from "../style";

type Props = NativeStackScreenProps<PillRoutineStackParamList, "PillRoutineManager">;

export default function PillRoutineManagerScreen({ route, navigation }: Props){
    const styles = StyleSheet.create({
        textAndButtonContainer: {
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            height: 240,
            paddingTop: 16
        },
        text: {
            color: "#909090",
            textAlign: "center",
            fontSize: 32
        }
    })

    return (
        <View>
            <MainHeader profileName={route.params.name} avatarNumber={route.params.avatar}/>
            <View style={styles.textAndButtonContainer}>
                <Text style={[globalStyle.text, styles.text]}>Comece adicionando sua primeira rotina de tratamento</Text>
                <ClickableButton
                    width={250}
                    height={60}
                    onPress={()=>{navigation.navigate("NameDefinition", route.params)}}
                    text="Vamos lá"
                />
            </View>
        </View>
    )
}