import { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { globalStyle } from "../../style";

type DoseProps = {
    doseNumber: number;
    selectedTime?: string
    onTimePicked: (event: DateTimePickerEvent, selectedDate?: Date)=>void;
}
export default function DoseTime({doseNumber, selectedTime, onTimePicked}: DoseProps){
    const styles = StyleSheet.create({
        doseContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 24
        },
        timeContainer: {
            width: 80,
            height: 60,
            borderWidth: 1,
            borderColor: "black"
        },
        timeText: {
            fontSize: 24,
            width: "100%",
            height: "100%",
            textAlign: "center",
            textAlignVertical: "center"
        }
    });

    return (
        <View style={styles.doseContainer}>
            <Text style={[globalStyle.text]}>{doseNumber+1}° Dose </Text>
            <TouchableWithoutFeedback onPress={()=>{
                DateTimePickerAndroid.open({
                    value: new Date(),
                    onChange: onTimePicked,
                    mode: "time",
                    is24Hour: true
                })
            }}>
                <View style={styles.timeContainer}>
                    { selectedTime ? <Text style={[globalStyle.text, styles.timeText]}> {selectedTime} </Text> : undefined }
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}