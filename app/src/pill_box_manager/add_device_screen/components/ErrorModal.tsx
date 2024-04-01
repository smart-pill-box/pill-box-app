import { Modal, StyleSheet, Text, View } from "react-native";
import { globalStyle } from "../../../style";
import ClickableButton from "../../../components/ClickabeButton";
import { useState } from "react";

type Props = {
    onClose: ()=>void;
    text: string
}

export default function ErrorModal({ onClose, text }: Props){
    const [isVisible, setIsVisible] = useState<boolean>(true)
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={isVisible}
            onRequestClose={()=>{
                setIsVisible(false);
                onClose();
            }}
        >
            <View style={styles.modalContainer}>
                <Text style={[globalStyle.text]}>
                    {text}
                </Text>
                <ClickableButton
                    width={250}
                    height={60}
                    onPress={()=>{
                        setIsVisible(false);
                        onClose();
                    }}
                    text="Ok"
                />
            </View>

        </Modal>
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