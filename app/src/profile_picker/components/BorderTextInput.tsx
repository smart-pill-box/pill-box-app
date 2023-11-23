import { StyleSheet, View, TextInput, KeyboardTypeOptions } from "react-native";
import { globalStyle } from "../../style";

type Props = {
    placeholder?: string;
    onChangeText: (text: string)=>void;
    currentValue: string | undefined;
    width: number;
    height: number;
    keyboardType?: KeyboardTypeOptions;
    maxLength?: number;
    style?: object;
}

export default function BorderTextInput({placeholder, onChangeText, currentValue, width, height, keyboardType, maxLength, style}: Props){
    const styles = StyleSheet.create({
        textInputContainer: {
            borderRadius: 6,
            borderWidth: 1,
            borderColor: "#A3A3A3",
            width: width,
            height: height,
            alignItems: "center",
        },
        textInput: {
            textAlign: "center",
            textAlignVertical: "center",
            width: "100%",
            height: "100%"
        },
    })

    return (
        <View style={styles.textInputContainer}>
            <TextInput
                placeholderTextColor="#909090"
                placeholder={placeholder}
                onChangeText={onChangeText}
                maxLength={maxLength ? maxLength : 50}
                value={currentValue}
                style={[globalStyle.text, styles.textInput, style]}
                keyboardType={keyboardType}
            />
        </View>
    )
}