import { ScrollView, StyleSheet, View, Text } from "react-native"
import { PillRoutine } from "../../types/pill_routine"
import { globalStyle } from "../../style"

type Props = {
    pillRoutines: PillRoutine[]
}

export default function PillRoutineList({ pillRoutines }: Props){
    const styles = StyleSheet.create({
        routineContainer: {
            width: 320,
            height: 60,
            borderRadius: 13,
            borderColor: "black",
            borderWidth: 1,
            alignSelf: "center",
            flexDirection: "row"
        },
        nameText: {
            fontSize: 24
        },
        descriptionTextContainer: {
            alignItems: "center",
            flexDirection: "column"
        },
        frequencyText: {
            color: "#909090",
            fontSize: 12
        },
        nameContainer: {
            width: "60%",
        }
    })

    return (
        <ScrollView>
            {pillRoutines.map((pillRoutine)=>{
                return (
                    <View style={styles.routineContainer}>
                        <View style={styles.nameContainer}>
                            <Text style={[globalStyle.text, styles.nameText]}> { pillRoutine.name } </Text>
                        </View>
                        <View style={styles.descriptionTextContainer}>
                            <Text
                                style={[globalStyle.text, styles.frequencyText]}
                            > {
                                pillRoutine.pillRoutineType == "dayPeriod" ? 
                                "Periodicamente" : "Semanalmente" 
                            } 
                            </Text>
                        </View>
                    </View>
                )
            })}
        </ScrollView>
    )
}
