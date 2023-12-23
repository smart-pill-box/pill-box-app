import { Animated, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { Pill } from "../PillCalendarScreen";
import { globalStyle } from "../../style";
import ClockImage from "../assets/ClockImage";
import ClickableButton from "../../components/ClickabeButton";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";

type Props = {
    pill: Pill;
    onPillReeschadule: (pill: Pill)=>void;
    onPillDelete: (pill: Pill)=>void;
    onPillManualConsumed: (pill: Pill)=>void;
}

type getUnderHourTextProps = {
    pill: Pill
}

const getUnderHourText = ({ pill }: getUnderHourTextProps) =>{
    if (pill.status == "pending" && !pillTimePassed(pill)){
        return 
    }

    if (pill.status == "manualyConfirmed"){
        return (
            <Text style={[globalStyle.text, styles.underHourText]}> Tomado </Text>
        )
    }

    if (pillTimePassed(pill)){
        return (
            <Text style={[globalStyle.text, styles.underHourText, { color: getPillStatusColor(pill), fontWeight: "bold"}]}> ESQUECIDO </Text>
        )
    }
}

export default function PillComponent({ pill, onPillReeschadule, onPillDelete, onPillManualConsumed }: Props){
    const [isSelected, setIsSelected] = useState(false);
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
                duration: 100,
                useNativeDriver: false
            }),
            Animated.timing(dropDownAnimTop, {
                toValue: toTop,
                duration: 100,
                useNativeDriver: false
            })
        ]).start()
    }, [isSelected, dropDownAnimHeight, dropDownAnimTop])


    useEffect(()=>{
        setIsSelected(false)
    }, [pill])

    return (
        <TouchableWithoutFeedback
            onPress={()=>{
                if(pill.status == "pending"){
                    setIsSelected(!isSelected)
                }
            }}
        >
            <Animated.View style={{ ...styles.mainContainer, height: dropDownAnimHeight }}>
                <View style={{...styles.pillContainer}}>
                    <View style={styles.nameContainer}>
                        <Text 
                            style={[globalStyle.text, styles.nameText, { color: wasPillForgotten(pill) ? getPillStatusColor(pill) : styles.nameText.color }]}
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                        > {pill.name} </Text>
                    </View>
                    <View>
                        <View style={styles.hourContainer}>
                            <ClockImage
                                width={20}
                                height={20}
                                color={getPillStatusColor(pill)}
                            />
                            <Text style={[globalStyle.text, styles.hourText, { color: getPillStatusColor(pill) }]}> {getPillTimeStr(pill)} </Text>
                        </View>
                        { getUnderHourText({pill}) }
                    </View>
                </View>
                { isSelected && (
                        <Animated.View style={{...styles.dropdownContainer, top: dropDownAnimTop}}>
                            <ClickableButton
                                width={92}
                                height={32}
                                onPress={()=>{onPillReeschadule(pill)}}
                                text="Remarcar"
                                buttonStyle={styles.reeschaduleBttnContainer}
                                textStyle={[globalStyle.text, { fontSize: 16 }]}
                            />
                            <ClickableButton
                                width={92}
                                height={32}
                                onPress={()=>{onPillDelete(pill)}}
                                text="Deletar"
                                buttonStyle={styles.cancelBttnContainer}
                                textStyle={[globalStyle.text, { fontSize: 16 }]}
                            />
                            <ClickableButton
                                width={92}
                                height={32}
                                onPress={()=>{onPillManualConsumed(pill)}}
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

const getPillStatusColor = (pill: Pill)=>{
    if (pill.status == "manualyConfirmed"){
        return "#24FF00"
    }
    
    if (wasPillForgotten(pill)){
        return "#C80000"
    }
    
    return "#575757"
}

const pillTimePassed = (pill: Pill)=>{
    return pill.pillDatetime.getTime() < (new Date()).getTime()
}

const wasPillForgotten = (pill: Pill)=>{
    return pillTimePassed(pill) && (pill.status == "pending")
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
    },
    underHourText: {
        color: "#909090",
        fontSize: 14
    }
})

const getPillTimeStr = (pill: Pill) =>{
    return getTimeStr(pill.pillDatetime);
}

const getTimeStr = (datetime: Date)=>{
    const hours = String(datetime.getHours()).padStart(2, '0');
    const minutes = String(datetime.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
}