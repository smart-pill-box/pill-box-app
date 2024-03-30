import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Wifi } from "../typeDefs";
import { globalStyle } from "../../../style";
import ClickablePointer from "../../../components/ClickablePointer";

type Props = {
    onSelected: ()=>void;
    wifi: Wifi
}

export default function WifiOption({wifi, onSelected}: Props){
    const styles = StyleSheet.create({
        wifiContainer: {
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            height: 48,

        },
        wifiIcon: {
            position: "absolute",
            left: 12
        }
    })
    return (
        <TouchableOpacity onPress={onSelected}>
            <View style={styles.wifiContainer}>
                <Image
                    source={require("../../assets/Wi-Fi.png")}
                    style={styles.wifiIcon}
                />
                <Text style={[globalStyle.text]}>
                    {wifi.Ssid}
                </Text>
                <View style={{position: "absolute", right: 12}}>
                    <ClickablePointer
                        width={20}
                        height={20}
                        orientation="right"
                        onPress={()=>{onSelected}}
                    />
                </View>
            </View>
        </TouchableOpacity>
    )
}