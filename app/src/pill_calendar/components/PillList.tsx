import { ScrollView, StyleSheet, View } from "react-native";
import { Pill } from "../PillCalendarScreen";
import PillComponent from "./PillComponent";
import { useState } from "react";

type Props = {
    pills: Pill[];
    onPillReeschadule: (pill: Pill)=>void;
    onPillDelete: (pill: Pill)=>void;
    onPillManualConsumed: (pill: Pill)=>void;
    componentIfEmpty: React.JSX.Element
}


export default function PillList({ pills, onPillReeschadule, onPillDelete, onPillManualConsumed, componentIfEmpty }: Props){
    const styes = StyleSheet.create({
        scroolContainer: {
            gap: 16,
            alignItems: "center"
        }
    })

    let haveSomePill = false;

    pills.sort((a, b)=> (new Date(a.pillDatetime)).getTime() - (new Date(b.pillDatetime)).getTime());
    
    const pillsComponents = pills.map((pill: Pill, index)=>{
        if((pill.status == "canceled") || (pill.status == "reeschaduled")){
            return
        }
        haveSomePill = true;
        return (
            <PillComponent
				key={index}
				pill={pill}
				onPillManualConsumed={onPillManualConsumed}
				onPillDelete={onPillDelete}
				onPillReeschadule={onPillReeschadule}
            />
            )
	});

        if(!haveSomePill){
            return componentIfEmpty
        }
    return (
        <ScrollView contentContainerStyle={styes.scroolContainer}>
            { pillsComponents }
        </ScrollView>
    )
}
