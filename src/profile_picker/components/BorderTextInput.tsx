import { StyleSheet, View, TextInput } from "react-native";
import { globalStyle } from "../../style";

type Props = {
    placeholder?: string;
    onChangeText: (text: string)=>void;
    currentValue: string | undefined;
    width: number;
    height: number;
}

export default function BorderTextInput({placeholder, onChangeText, currentValue, width, height}: Props){
    const styles = StyleSheet.create({
        textInputContainer: {
            borderRadius: 6,
            borderWidth: 1,
            borderColor: "#A3A3A3",
            width: width,
            height: height,
            alignItems: "center"
        },
        textInput: {
            textAlign: "center",
            width: "100%"
        },
    })

    return (
        <View style={styles.textInputContainer}>
            <TextInput
                placeholderTextColor="#909090"
                placeholder={placeholder}
                onChangeText={onChangeText}
                maxLength={50}
                value={currentValue}
                style={[globalStyle.text, styles.textInput]}
            />
        </View>
    )
}