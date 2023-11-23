import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList, RootStackParamList } from "../../App";
import { View, Image, StyleSheet, Text } from "react-native";
import MainHeader from "../components/MainHeader";
import ScrollableDatePicker from "./components/calendar/ScrollableDatePicker";
import { useCallback, useContext, useState } from "react";
import { globalStyle } from '../style';
import { ProfileKeyContext } from '../profile_picker/ProfileKeyContext';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/native';

type Props = BottomTabScreenProps<RootTabParamList, "PillCalendar">

function NoPillContainer(){
    const styles = StyleSheet.create({
        mainContainer: {
            position: "absolute",
            bottom: 0,
            width: "100%",
            alignItems: "center"
        },
        imageContainer: {
            alignItems: "flex-end",
            width: "100%"
        },
        image: {
            width: 240,
            transform: [{translateY: 28}]
        },
        text: {
            color: "#909090",
            fontSize: 28,
            textAlign: "center"
        },
        textContainer: {
            width: 280,
            top: 40
        }
    })
    return (
        <View style={styles.mainContainer}>
            <View style={styles.textContainer}>
                <Text 
                    style={[globalStyle.text, styles.text]}
                > Sem remédios para hoje! </Text>
            </View>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    resizeMode="contain"
                    source={require("./assets/no-pills-image.png")}
                />
            </View>
        </View>
    )
}

export default function PillCalendarScreen({ route, navigation }: Props){
    const initialDate = new Date();
    const {keycloak} = useKeycloak()
    const [ selectedDate, setSelectedDate ] = useState<Date>(initialDate)
    const { profileKey, setProfileKey } = useContext(ProfileKeyContext)
    const [ profileData, setProfileData ] = useState({
        name: "",
        avatarNumber: 1
    })

    const today = new Date();

    useFocusEffect(
        useCallback(()=>{
            const getProfile = async () => {
                try {
                    const { data } = await axios.get(`api/account/${keycloak?.tokenParsed?.sub}/profile/${profileKey}`)
                    console.log(data);
                    
                    setProfileData({
                        name: data.name,
                        avatarNumber: data.avatarNumber
                    })
                }
                catch(err){
                    console.error(err);
                }
            }

            getProfile()
        }, [])
    )
    const onDateSelection = (date: Date)=>{
        setSelectedDate(date);
    }
    
    return (
        <View style={{height: "100%"}}>
            <MainHeader profileName={profileData.name} avatarNumber={profileData.avatarNumber}/>
            <ScrollableDatePicker startDate={initialDate} onDateSelection={onDateSelection}/>
            <NoPillContainer/>
        </View>
    )
}