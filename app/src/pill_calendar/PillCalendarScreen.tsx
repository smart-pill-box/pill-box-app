import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList, RootStackParamList } from "../../App";
import { View, Image, StyleSheet, Text } from "react-native";
import MainHeader from "../components/MainHeader";
import ScrollableDatePicker from "./components/calendar/ScrollableDatePicker";
import { useCallback, useContext, useEffect, useState } from "react";
import { globalStyle } from '../style';
import { ProfileKeyContext } from '../profile_picker/ProfileKeyContext';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/native';
import { PillRoutine } from '../types/pill_routine';
import PillList from './components/PillList';

type Props = BottomTabScreenProps<RootTabParamList, "PillCalendar">

export type Pill = {
    id: number;
    name: string;
    timeStr: string;
}

const weekdaysNumberToStr: {[key: number]: string} = {
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
    0: "sunday",
}

const getTodayPills = (pillRoutines: PillRoutine[], today: Date)=>{
    let todayPills: Pill[] = [];
    let id = 0;

    pillRoutines.forEach((pillRoutine: PillRoutine)=>{
        const pillName = pillRoutine.name;
        if (new Date(Date.parse(pillRoutine.startDate)) > today){
            return
        }

        if (pillRoutine.pillRoutineType == "weekdays"){
            const weekdays = Object.keys(pillRoutine.pillRoutineData);

            if(weekdays.includes(weekdaysNumberToStr[today.getDay()])){
                pillRoutine.pillRoutineData[weekdaysNumberToStr[today.getDay()]].forEach((timeStr: string)=>{
                    todayPills.push({
                        name: pillName,
                        timeStr: timeStr,
                        id: id
                    });
            
                    id += 1
                })
            }
        }
    })

    return todayPills;
}

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
    const [ pillRoutines, setPillRoutines ] = useState<PillRoutine[]>([])
    const { profileKey, setProfileKey } = useContext(ProfileKeyContext)
    const [ profileData, setProfileData ] = useState({
        name: "",
        avatarNumber: 1
    });
    const [todayPills, setTodayPills] = useState<Pill[]>([]);

    const today = new Date();

    useFocusEffect(
        useCallback(()=>{
            const getPillRoutines = async () => {
                try{
                    const resp = await axios.get(`/api/account/${keycloak?.tokenParsed?.sub}/profile/${profileKey}/pill_routines`)
                    
                    console.log(resp.data)
                    setPillRoutines(resp.data.data);
                } 
                catch(err){
                    console.error(err);
                }
            }
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
            getPillRoutines();
            getProfile();
        }, [])
    );

    useEffect(()=>{
        setTodayPills(getTodayPills(pillRoutines, selectedDate));
        console.log(todayPills);
    }, [selectedDate, pillRoutines])

    const onDateSelection = (date: Date)=>{
        setSelectedDate(date);
    }
    
    if (todayPills.length == 0){
        return (
            <View style={{height: "100%"}}>
                <MainHeader profileName={profileData.name} avatarNumber={profileData.avatarNumber}/>
                <ScrollableDatePicker startDate={initialDate} onDateSelection={onDateSelection}/>
                <NoPillContainer/>
            </View>
        )
    }

    return (
        <View style={{height: "100%"}}>
        <MainHeader profileName={profileData.name} avatarNumber={profileData.avatarNumber}/>
        <ScrollableDatePicker startDate={initialDate} onDateSelection={onDateSelection}/>
        <PillList
            pills={todayPills}
        />
    </View>
    )
}