import { StyleSheet, View } from "react-native"
import SelectableButton from "./SelectableButton"
import { useEffect, useState } from "react";

type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

type Props = {
    selectedDays: Weekday[];
    setSelectedDays: (weekdays: Weekday[])=>void
}

export default function SelectableWeekdays({ selectedDays, setSelectedDays }: Props){
    const toggleDaySelection = (day: Weekday)=>{
        if (selectedDays.includes(day)){
            setSelectedDays(selectedDays.filter((weekday)=>weekday != day))
        }
        else {
            setSelectedDays([...selectedDays, day])
        }
    };


    return (
        <View style={styles.selectionContainer}>
            <SelectableButton
                width={80}
                heigh={80}
                text="Seg"
                onPress={()=>{toggleDaySelection("monday")}}
                isSelected={selectedDays.includes("monday")}
            />
            <SelectableButton
                width={80}
                heigh={80}
                text="Ter"
                onPress={()=>{toggleDaySelection("tuesday")}}
                isSelected={selectedDays.includes("tuesday")}
            />
            <SelectableButton
                width={80}
                heigh={80}
                text="Qua"
                onPress={()=>{toggleDaySelection("wednesday")}}
                isSelected={selectedDays.includes("wednesday")}
            />
            <SelectableButton
                width={80}
                heigh={80}
                text="Qui"
                onPress={()=>{toggleDaySelection("thursday")}}
                isSelected={selectedDays.includes("thursday")}
            />
            <SelectableButton
                width={80}
                heigh={80}
                text="Sex"
                onPress={()=>{toggleDaySelection("friday")}}
                isSelected={selectedDays.includes("friday")}
            />
            <SelectableButton
                width={80}
                heigh={80}
                text="Sab"
                onPress={()=>{toggleDaySelection("saturday")}}
                isSelected={selectedDays.includes("saturday")}
            />
            <SelectableButton
                width={280}
                heigh={80}
                text="Domingo"
                onPress={()=>{toggleDaySelection("sunday")}}
                isSelected={selectedDays.includes("sunday")}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    selectionContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        flexWrap: "wrap",
        width: "100%",
        gap: 24
    }
})