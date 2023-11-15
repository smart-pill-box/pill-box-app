import { StyleSheet, FlatList, View } from "react-native";
import React, { useState, useMemo, useCallback, useRef } from "react";
import SelectableDate from "./SelectableDate";

type DateItem = {
    date: Date;
    index: number;
}

function generateDateList(startDate: Date, dateRange: number): {dateList: DateItem[], startDateIndex: number}{
    const dateList: DateItem[] = [];

    const endDate = new Date(startDate.getTime());
    endDate.setDate(endDate.getUTCDate() + dateRange);

    const firstDate = new Date(startDate.getTime());
    firstDate.setDate(firstDate.getUTCDate() - dateRange);

    let index = 0;
    for (let dateIterator = new Date(firstDate.getTime()); dateIterator <= endDate; dateIterator.setDate(dateIterator.getUTCDate() + 1)) {
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
            scrollContainer: {
                flexDirection: "row",
                justifyContent: "space-between"
            },
            weekdayText: {
                color: "#909090",
                fontSize: 12
            },
            monthdayText: {
                color: "#575757",
                fontSize: 18,
                width: "100%",
                textAlign: "center"
            },
            dateContainer: {
                alignItems: "center"
            },
            dateNumberContainer: {
                width: 40,
                height: 40,
                backgroundColor: "#E0F2FF",
                borderRadius: 8,
                justifyContent: "center"
            },
            selectableDateContainer: {
                paddingRight: 8
            }
        })
    }, [])

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
    )
}

