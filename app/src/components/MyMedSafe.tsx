import { StyleSheet, Text, View } from "react-native"

export default function MyMedSafe(){
    const styles = StyleSheet.create({
        container: {
            padding: 16,
            paddingLeft: 8,
            flexDirection: "column"
        },
        word: {
            fontFamily: "KronaOne-Regular",
            fontSize: 20,
            letterSpacing: 3.6
        },
        safeWord: {
            color: "#66E7A9"
        },
        myMedWord: {
            color: "#000"
        }
    });

    return (
        <View style={styles.container}>
            <Text style={[styles.myMedWord, styles.word]}> My Med </Text>
            <Text style={[styles.safeWord, styles.word]}> Safe </Text>
        </View>
    )
}