import { StyleSheet, FlatList, View, TouchableOpacity, Text } from "react-native";
import React, { useState, useMemo, useCallback, useRef } from "react";
import SelectableDate from "./SelectableDate";
import { globalStyle } from "../../../style";

type DateItem = {
    date: Date;
    index: number;
}

function generateDateList(startDate: Date, dateRange: number): {dateList: DateItem[], startDateIndex: number}{
    const dateList: DateItem[] = [];

    const endDate = new Date(startDate.getTime());
    endDate.setDate(endDate.getDate() + dateRange);

    const firstDate = new Date(startDate.getTime());
    firstDate.setDate(firstDate.getDate() - dateRange);

    let index = 0;
    for (let dateIterator = new Date(firstDate.getTime()); dateIterator <= endDate; dateIterator.setDate(dateIterator.getDate() + 1)) {
        dateList.push({
            date: new Date(dateIterator.getTime()),
            index: index
        });
        
        index += 1;
    }
    return {
        dateList: dateList,
        startDateIndex: Math.round(index/2-1)
    }
}

type ScrollableDatePickerProps = {
    startDate: Date;
    onDateSelection: (selectedDate: Date)=>void
} 

export default function ScrollableDatePicker({ startDate, onDateSelection }: ScrollableDatePickerProps){
    const styles = useMemo(()=>{
        return StyleSheet.create({
            mainContainer: {
                flexDirection: "column",
                alignItems: "flex-end"
            },
            scrollContainer: {
                flexDirection: "row",
                justifyContent: "space-between"
            },
            selectableDateContainer: {
                paddingRight: 8
            },
            backText: {
                color: "#909090",
                fontSize: 12,
                width: 64,
                textAlign: "center"
            },
            backTextContainer: {
                height: 44,
                width: 80,
                alignItems: "center",
                justifyContent: "center"
            }
        })
    }, [])

    const onBackPressed = ()=>{
        flatlistRef.current?.scrollToIndex({animated: true, index: startDateIndex});
        setSelectedIndex(startDateIndex);
    }

    const flatlistRef = useRef<FlatList<DateItem>>(null);

    const { dateList, startDateIndex } = useMemo(()=>generateDateList(startDate, 30), []);
    const [selectedIndex, setSelectedIndex] = useState<number>(startDateIndex);
    const handleClick = useCallback((index: number) => {
        setSelectedIndex(index)
        onDateSelection(dateList[index].date)
    }, []);
    
    const renderItem = useCallback(({ item }: { item: DateItem }) =>{
        return (
            <View style={styles.selectableDateContainer}>
                <SelectableDate 
                    date={item.date}
                    index={item.index}
                    isSelected={selectedIndex == item.index}
                    onClick={handleClick}
                    isToday={item.index == startDateIndex}
                />
            </View>
        )
    }, [selectedIndex])
    const keyExtractor = useCallback((item: DateItem) => item.index.toString(), [])

    return (
        <View style={styles.mainContainer}>
            <FlatList 
                contentContainerStyle={styles.scrollContainer}
                horizontal={true}
                data={dateList}
                ref={flatlistRef}
                extraData={selectedIndex}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                initialScrollIndex={startDateIndex}
                getItemLayout={(_, index) => ({ length: 48, offset: 48*index, index})}
            />
            <TouchableOpacity onPress={onBackPressed}>
                <View style={styles.backTextContainer}>
                    <Text style={[globalStyle.text, styles.backText]}> Voltar para hoje </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

