import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { globalStyle } from "../../../style";
import React, { useEffect, useMemo, useRef } from "react";

type SelectableDateProps = {
    date: Date;
    isSelected: boolean;
    isToday: boolean;
    index: number;
    onClick: (index: number)=>void;
}

const SelectableDate = React.memo(({date, isSelected, onClick, index, isToday}: SelectableDateProps)=>{
    const styles = useMemo(()=>StyleSheet.create({
        weekdayText: {
            color: "#909090",
            fontSize: 12
        },
        monthdayText: {
            fontSize: 18,
            width: "100%",
            textAlign: "center"
    
        },
        dateContainer: {
            alignItems: "center",
            width: 40,
            height: 58
        },
        dateNumberContainer: {
            width: 40,
            height: 40,
            borderRadius: 8,
            justifyContent: "center",
            borderColor: "#66E7A9",
        }
    }), []);

    type DayToWeekday = {
        [key: number]: any
    };

    const dayToWeekday: DayToWeekday = useMemo(()=>{
        return {
            0: "Dom",
            1: "Seg",
            2: "Ter",
            3: "Qua",
            4: "Qui",
            5: "Sex",
            6: "Sab"
        }
    }, [])


    return (
        <View style={styles.dateContainer}>
            <Text style={[globalStyle.text, styles.weekdayText]}> { dayToWeekday[date.getDay()] } </Text>
            <TouchableOpacity onPress={()=>onClick(index)}>
                <View style={[styles.dateNumberContainer, {
                    backgroundColor: isSelected ? "#005A9C" : "#E0F2FF", borderWidth: isToday ? 2 : 0
                }]}>
                    <Text style={[globalStyle.text, styles.monthdayText, {
                        color: isSelected ? "#FFFFFF" : "#575757", textDecorationLine: isSelected ? "underline" : "none"
                    }]}> {date.getDate()} </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
})

export default SelectableDate;