import { PermissionsAndroid, StyleSheet, Text, View } from "react-native";
import BackArrow from "../../../components/BackArrow";
import { globalStyle } from "../../../style";
import ClickableButton from "../../../components/ClickabeButton";

type Props = {
    onBackPressed: ()=>void;
}

export default function PendingBluetoothEnable({onBackPressed}: Props){
    const styles = StyleSheet.create({
        backArrowContainer: {
            marginLeft: 12
        },
        header: {
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            position: "relative",
            height: 64,
            width: "100%",
        },
        text: {
            color: "#909090",
            textAlign: "center",
            fontSize: 32
        },
        contentContainer: {
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 12
        }
    })

    return (
        <View>
            <View style={styles.header}>
                <View style={styles.backArrowContainer}>
                    <BackArrow width={30} height={30} onPress={onBackPressed}/>
                </View>
            </View>
            <View style={[styles.contentContainer]}>
                <Text style={[globalStyle.text, styles.text]}> Para continuar ative o bluetooth </Text>
                <View style={{marginTop: 24}}>
                </View>
            </View>

        </View>
    )
}