import { Animated, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { Pill } from "../PillCalendarScreen";
import { globalStyle } from "../../style";
import ClockImage from "../assets/ClockImage";
import ClickableButton from "../../components/ClickabeButton";
import { useEffect, useRef, useState } from "react";

export default function PillComponent({ pill }: {pill: Pill}){
    const [isSelected, setisSelected] = useState(false);
    const dropDownAnimHeight = useRef(new Animated.Value(64)).current;
    const dropDownAnimTop = useRef(new Animated.Value(0)).current;

    useEffect(()=>{
        let toHeight = 64;
        let toTop = 0;

        if (isSelected){
            toHeight = 120;
            toTop = 52;
        }
        Animated.parallel([
            Animated.timing(dropDownAnimHeight, {
                toValue: toHeight,
                duration: 500,
                useNativeDriver: false
            }),
            Animated.timing(dropDownAnimTop, {
                toValue: toTop,
                duration: 500,
                useNativeDriver: false
            })
        ]).start()
    }, [isSelected, dropDownAnimHeight, dropDownAnimTop])

    return (
        <TouchableWithoutFeedback
            onPress={()=>{setisSelected(!isSelected)}}
        >
            <Animated.View style={{ ...styles.mainContainer, height: dropDownAnimHeight }}>
                <View style={styles.pillContainer}>
                    <View style={styles.nameContainer}>
                        <Text 
                            style={[globalStyle.text, styles.nameText]}
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                        > {pill.name} </Text>
                    </View>
                    <View style={styles.hourContainer}>
                        <ClockImage
                            width={20}
                            height={20}
                        />
                        <Text style={[globalStyle.text, styles.hourText]}> {pill.timeStr} </Text>
                    </View>
                </View>
                { isSelected && (
                        <Animated.View style={{...styles.dropdownContainer, top: dropDownAnimTop}}>
                            <ClickableButton
                                width={92}
                                height={32}
                                onPress={()=>{}}
                                text="Remarcar"
                                buttonStyle={styles.reeschaduleBttnContainer}
                                textStyle={[globalStyle.text, { fontSize: 16 }]}
                            />
                            <ClickableButton
                                width={92}
                                height={32}
                                onPress={()=>{}}
                                text="Deletar"
                                buttonStyle={styles.cancelBttnContainer}
                                textStyle={[globalStyle.text, { fontSize: 16 }]}
                            />
                            <ClickableButton
                                width={92}
                                height={32}
                                onPress={()=>{}}
                                text="Já tomei"
                                buttonStyle={styles.consumedBttnContainer}
                                textStyle={[globalStyle.text, { fontSize: 16, color: "white" }]}
                            />
                        </Animated.View>
                    )}
            </Animated.View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    pillContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: 320,
        height: 64,
        borderRadius: 12,
        borderColor: "#DBDBDB",
        borderWidth: 1,
        position: "relative",
        backgroundColor: "white"
    },
    mainContainer: {
        width: 320,
        alignItems: "flex-start",
    },
    nameContainer: {
        paddingLeft: 16,
        height: "100%",
        justifyContent: "center",
        width: "50%"
    },
    nameText: {
        fontSize: 24,
        color: "#575757"
    },
    hourContainer: {
        paddingTop: 4,
        paddingRight: 8,
        flexDirection: "row",
        alignItems: "center"
    },
    hourText: {
        fontSize: 20,
        color: "#575757"
    },
    dropdownContainer: {
        position: "absolute",
        width: "100%",
        height: 68,
        flex: 1,
        paddingTop: 23,
        borderBottomRightRadius: 16,
        backgroundColor: "white",
        borderBottomLeftRadius: 16,
        borderColor: "black",
        elevation: 2,
        zIndex: -1,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    reeschaduleBttnContainer: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#FEDE35",
        backgroundColor: "transparent"
    },
    cancelBttnContainer: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#DF9090",
        backgroundColor: "transparent"
    },
    consumedBttnContainer: {
        borderRadius: 16,
    }
})