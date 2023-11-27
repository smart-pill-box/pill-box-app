import { ScrollView, StyleSheet, View, Text } from "react-native"
import { PillRoutine } from "../../types/pill_routine"
import { globalStyle } from "../../style"

type Props = {
    pillRoutines: PillRoutine[]
}

const weekdayTradutor: {[key: string]: string} = {
    monday: "seg",
    tuesday: "ter",
    wednesday: "qua",
    thursday: "qui",
    friday: "sex",
    saturday: "sab",
    sunday: "dom",
}

const getDescriptionText = (pillRoutine: PillRoutine)=>{
    if(pillRoutine.pillRoutineType == "weekdays"){
        const weekdays = Object.keys(pillRoutine.pillRoutineData); 
        if(weekdays.length == 7){
            return "Todos os dias"
        }

        let text = "";
        weekdays.forEach((weekday)=>{
            text += `${weekdayTradutor[weekday]}, `
        })
        return text;
    }
    else if(pillRoutine.pillRoutineType == "dayPeriod"){
        return `A cada ${pillRoutine.pillRoutineData.periodInDays} dias`
    }
    else {
        console.error("Erro uai");
        return ""
    }
}

export default function PillRoutineList({ pillRoutines }: Props){
    const styles = StyleSheet.create({
        scroolContainerStyle: {
            gap: 8
        },
        scroolStyle: {
            height: "100%"
        },
        routineContainer: {
            width: 320,
            height: 60,
            borderRadius: 13,
            borderColor: "#DBDBDB",
            borderWidth: 1,
            alignSelf: "center",
            flexDirection: "row"
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
        }
    })

    return (
        <ScrollView contentContainerStyle={styles.scroolContainerStyle} style={styles.scroolStyle}>
            {pillRoutines.map((pillRoutine)=>{
                return (
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
                )
            })}
        </ScrollView>
    )
}
