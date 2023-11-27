import { ScrollView, StyleSheet, View } from "react-native";
import { Pill } from "../PillCalendarScreen";
import PillComponent from "./PillComponent";

export default function PillList({ pills }: {pills: Pill[]}){
    const styes = StyleSheet.create({
        scroolContainer: {
            gap: 16,
            alignItems: "center"
        }
    })

    return (
        <ScrollView contentContainerStyle={styes.scroolContainer}>
            {
                pills.map((pill: Pill)=>{
                    return (
                        <PillComponent
                            key={pill.id}
                            pill={pill}
                        />
                    )
                })
            }
        </ScrollView>
    )
}