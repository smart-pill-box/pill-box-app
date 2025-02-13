
import { Modal, StyleSheet, Text, View } from "react-native";
import { globalStyle } from "../../../style";
import ClickableButton from "../../../components/ClickabeButton";
import { useState } from "react";

type Props = {
	onNameSet: (name: string) => void;
}

export default function SetDeviceName({ onNameSet }: Props){
    return (
		<View>
		</View>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%"
    }
})
