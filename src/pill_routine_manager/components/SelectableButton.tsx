import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyle } from "../../style";

type SelectableButtonProps = {
    isSelected: boolean;
    onPress: ()=>void;
    text: string;
    width: number;
    heigh: number;
}

export default function SelectableButton({isSelected, onPress, text, width, heigh}: SelectableButtonProps){
    const styles = StyleSheet.create({
        touchableContainer: {
            justifyContent: "center",
            alignItems: "center"
        },
        container: {
            width: width,
            height: heigh,
            borderWidth: 1,
            borderColor: "#A1A1A1",
            borderRadius: 7,
            backgroundColor: isSelected ? "#66E7A9" : "transparent",
            alignItems: "center",
            justifyContent: "center"
        },
        text: {
            color: isSelected ? "white" : "black",
            fontSize: 20,
            textAlign: "center"
        }
    });

    return (
        <TouchableOpacity onPress={onPress} style={styles.touchableContainer}>
            <View style={styles.container}>
                <Text style={[globalStyle.text, styles.text]}> {text} </Text>
            </View>
        </TouchableOpacity>
    )
}