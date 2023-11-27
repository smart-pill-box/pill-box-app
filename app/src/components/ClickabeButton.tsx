import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";
import { globalStyle } from "../style";

interface ClickableButtonProps {
  width: number;
  height: number;
  onPress: () => void;
  text: string;
  isEnabled?: boolean;
  buttonStyle?: object;
  textStyle?: any;
}

export default function ClickableButton({ width, height, onPress, text, isEnabled, buttonStyle, textStyle }: ClickableButtonProps){
    if (isEnabled == undefined){
        isEnabled = true
    }
    const styles = StyleSheet.create({
      buttonContainer: {
        backgroundColor: "#66E7A9", // Adjust the background color as needed
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 13
      },
      buttonText: {
        color: "white", // Adjust the text color as needed
        fontSize: 24,
        textAlign: "center"
      },
    });

  return (
    <TouchableOpacity onPress={onPress} disabled={!isEnabled}>
      <View style={[styles.buttonContainer, { width, height }, buttonStyle]}>
        <Text style={[globalStyle.text, styles.buttonText, textStyle]}> {text} </Text>
      </View>
    </TouchableOpacity>
  );
};

