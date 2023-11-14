import { Text, View, Image, StyleSheet, useWindowDimensions, GestureResponderEvent } from "react-native"
import { RootStackParamList } from "../../App"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import Svg, { Ellipse, ClipPath } from 'react-native-svg';
import MyMedSafe from "../components/MyMedSafe"
import AddButton from "../components/AddButton"
import ProfileList from "./components/ProfileList"
import MaskedView from "@react-native-masked-view/masked-view";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

type Props = NativeStackScreenProps<RootStackParamList, "ProfilePicker">
type MaskedPillsImageProps = {
    imgHeight: number,
    imgWidth: number,
    screenWidth: number,
    style?: object
};

export type Profile = {
    name: string,
    avatar: 1 | 2,
    profileKey: string
}


function MaskedPillsImage({imgHeight, imgWidth, screenWidth, style}: MaskedPillsImageProps){
    return (
        <SafeAreaView style={{position: "absolute", ...style}}>
            <MaskedView
                maskElement={
                    <Svg height={imgHeight} width={imgWidth}>
                        <Ellipse cx={screenWidth/2 - 20} cy={imgHeight/2 + 20} rx={7*screenWidth/8} ry={imgHeight/2}/>
                    </Svg>
                }
            >
                <Image
                    source={require("./assets/pills_shuffled.png")}
                    width={imgWidth}
                    height={imgHeight}
                />
            </MaskedView>
        </SafeAreaView>
    )
}

export default function ProfilePickerScreen({ route, navigation }: Props){
    const windowDimensions = useWindowDimensions();
    const style = StyleSheet.create({
        mainContainer: {
            flexDirection: "column",
            position: "relative",
            width: windowDimensions.width,
            height: windowDimensions.height
        },
        maskedImage: {
            left: 0,
            bottom: -30
        },
        headerContainer: {
            width: windowDimensions.width,
            height: 80,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
        },
        addButtonContainer: {
            padding: 16
        }
    });
    
    const [profiles, setProfiles] = useState([]);
    const onAddBttnPress = (event: GestureResponderEvent) =>{
        navigation.navigate("AddProfile");
    };

    useEffect(()=>{
        AsyncStorage.getItem("profiles").then((profiles)=>{
            console.log(profiles);
            if (!profiles){
                return
            }
            setProfiles(JSON.parse(profiles));
        })
    }, [])


    return (
        <View style={style.mainContainer}>
            <View style={style.headerContainer}>
                <MyMedSafe/>
                <View style={style.addButtonContainer}>
                    <AddButton size={33} onPress={onAddBttnPress}/>
                </View>
            </View>
            <View>
                <ProfileList profiles={profiles}/>
            </View>
            <MaskedPillsImage 
                imgWidth={591}
                imgHeight={394}
                screenWidth={windowDimensions.width}
                style={style.maskedImage}
            />
        </View>
    )
}