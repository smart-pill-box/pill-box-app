import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from "react-native"
import { globalStyle } from "../../style"
import { PillRoutine } from "../../types/pill_routine"
import { useEffect, useRef, useState } from "react"
import ClickableButton from "../../components/ClickabeButton"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"
import { PillRoutineStackParamList } from "../PillRoutineManagerNavigator"


const weekdayTradutor: {[key: string]: string} = {
    monday: "seg",
    tuesday: "ter",
    wednesday: "qua",
    thursday: "qui",
    friday: "sex",
    saturday: "sab",
    sunday: "dom",
}

const weekdaysOrder = Object.keys(weekdayTradutor);

const getDescriptionText = (pillRoutine: PillRoutine)=>{
    if(pillRoutine.pillRoutineType == "weekdays"){
        let weekdays = Object.keys(pillRoutine.pillRoutineData); 
        if(weekdays.length == 7){
            return "Todos os dias"
        }

        weekdays = weekdays.sort((a, b) => weekdaysOrder.indexOf(a) - weekdaysOrder.indexOf(b));
        let text = "";
        weekdays.forEach((weekday)=>{
            text += `${weekdayTradutor[weekday]}, `
        })
        if (weekdays.length > 1){
            return text.slice(0, -7) + " e " + text.slice(-5, -2);
        }
        else {
            return text.slice(0, -2);
        }
    }
    else if(pillRoutine.pillRoutineType == "dayPeriod"){
        return `A cada ${pillRoutine.pillRoutineData.periodInDays} dias`
    }
    else {
        console.error("Erro uai");
        return ""
    }
}

type Props = {
    pillRoutine: PillRoutine,
    onPillRoutineEdit: (pillRoutineKey: string)=>void;
    onPillRoutineDelete: (pillRoutineKey: string)=>void;
}

export default function PillRoutineComponent({ pillRoutine, onPillRoutineEdit, onPillRoutineDelete }: Props){

    const [isSelected, setIsSelected] = useState(false);
    const dropDownAnimHeight = useRef(new Animated.Value(64)).current;
    const dropDownAnimTop = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation<NativeStackNavigationProp<PillRoutineStackParamList>>();

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

    return (
        <TouchableWithoutFeedback
            onPress={()=>{ setIsSelected(!isSelected) }}
        >
            <Animated.View style={{ height: dropDownAnimHeight }}>
                <View style={styles.routineContainer} key={pillRoutine.pillRoutineKey}>
                    <View style={styles.nameContainer}>
                        <Text 
                            style={[globalStyle.text, styles.nameText]}
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                            
                        > { pillRoutine.name } </Text>
                    </View>
                    <View style={styles.descriptionTextContainer}>
                        <Text
                            style={[globalStyle.text, styles.frequencyText]}
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                        > {
                            pillRoutine.pillRoutineType == "dayPeriod" ? 
                            "Periodicamente" : "Semanalmente" 
                        } 
                        </Text>
                        <Text style={[globalStyle.text, styles.descriptionText]}> { getDescriptionText(pillRoutine) } </Text>
                    </View>
                </View>
                { isSelected && (
                        <Animated.View style={{...styles.dropdownContainer, top: dropDownAnimTop}}>
                            <ClickableButton
                                width={140}
                                height={32}
                                onPress={()=>onPillRoutineEdit(pillRoutine.pillRoutineKey)}
                                // onPress={()=>{navigation.navigate("EditPillRoutine", {
                                //     pillRoutineKey: pillRoutine.pillRoutineKey
                                // })}}
                                text="Editar"
                                buttonStyle={styles.editBttnContainer}
                                textStyle={[globalStyle.text, { fontSize: 16 }]}
                            />
                            <ClickableButton
                                width={140}
                                height={32}
                                onPress={()=>{onPillRoutineDelete(pillRoutine.pillRoutineKey)}}
                                text="Deletar"
                                buttonStyle={styles.deleteBttnContainer}
                                textStyle={[globalStyle.text, { fontSize: 16 }]}
                            />
                        </Animated.View>
                    )}
            </Animated.View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    routineContainer: {
        width: 320,
        height: 64,
        borderRadius: 12,
        borderColor: "#DBDBDB",
        borderWidth: 1,
        alignSelf: "center",
        flexDirection: "row",
        backgroundColor: "white",
        zIndex: 1,
    },
    nameText: {
        fontSize: 24,
        flex: 1,
        textAlignVertical: "center",
    },
    descriptionTextContainer: {
        alignItems: "center",
        flexDirection: "column",
        flex: 3
    },
    dropdownContainer: {
        position: "absolute",
        width: "100%",
        height: 68,
        flex: 1,
        paddingTop: 23,
        backgroundColor: "white",
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderColor: "black",
        elevation: 2,
        zIndex: -1,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    frequencyText: {
        color: "#909090",
        fontSize: 12,
        textAlign: "center",
        width: "100%"
    },
    descriptionText: {
        fontSize: 12,
        width: "100%"
    },
    nameContainer: {
        flex: 4,
        paddingLeft: 16
    },
    editBttnContainer: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#FEDE35",
        backgroundColor: "transparent"
    },
    deleteBttnContainer: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#DF9090",
        backgroundColor: "transparent"
    },
    consumedBttnContainer: {
        borderRadius: 16,
    }
})