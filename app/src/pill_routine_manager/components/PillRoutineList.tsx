import { ScrollView, StyleSheet, View, Text } from "react-native"
import { PillRoutine } from "../../types/pill_routine"
import { globalStyle } from "../../style"
import PillRoutineComponent from "./PillRoutineComponent"

type Props = {
    pillRoutines: PillRoutine[],
    onPillRoutineEdit: (pillRoutineKey: string)=>void;
    onPillRoutineDelete: (pillRoutineKey: string)=>void
}

export default function PillRoutineList({ pillRoutines, onPillRoutineEdit, onPillRoutineDelete }: Props){
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
    });

    return (
        <ScrollView contentContainerStyle={styles.scroolContainerStyle} style={styles.scroolStyle}>
            {pillRoutines.map((pillRoutine)=>{
                if (["updated", "canceled"].includes(pillRoutine.status)){
                    return
                }
                if(pillRoutine.expirationDatetime && ((new Date(pillRoutine.expirationDatetime)).getTime() < (new Date()).getTime())){
                    return
                }
                return (
                    <PillRoutineComponent 
                        pillRoutine={pillRoutine} 
                        key={pillRoutine.pillRoutineKey} 
                        onPillRoutineDelete={onPillRoutineDelete} 
                        onPillRoutineEdit={onPillRoutineEdit}
                    />
                )
            })}
        </ScrollView>
    )
}
