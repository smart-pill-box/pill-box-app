import { View, Text, StyleSheet } from "react-native"
import BackArrow from "../../components/BackArrow"
import { globalStyle } from "../../style"

type FormsHeaderProps = {
    pillName?: string,
    onBackPressed: ()=> void
}

export default function FormsHeader({ onBackPressed, pillName }: FormsHeaderProps){
    const styles = StyleSheet.create({
        secudaryContainer: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            height: 64,
            width: "100%",
        },
        primaryContainer: {
            paddingBottom: 32,
            width: "100%",
        },
        text: {
            fontSize: 24,
            textAlign: "center"
        },
        backArrowContainer: {
            position: "absolute",
            left: 20,
            top: 20
        }
    })

    return (
        <View style={styles.primaryContainer}>
            <View style={styles.secudaryContainer}>
                <View style={styles.backArrowContainer}>
                    <BackArrow width={30} height={30} onPress={onBackPressed}/>
                </View>
                {pillName && <Text style={[globalStyle.text, styles.text]}> {pillName} </Text>}
            </View>
        </View>
    )
}