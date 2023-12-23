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

type PillStatus = "pending" | "manualyConfirmed" | "pillBoxConfirmed" | "canceled"

export type PillStatusEvent = {
    status: PillStatus,
    eventDatetime: Date | string
}

export type Pill = {
    name: string;
    pillDatetime: Date;
    pillRoutineKey: string;
    status: PillStatus;
    statusEvents: PillStatusEvent[]

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
                > Sem remédios nesse dia! </Text>
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
    const { keycloak } = useKeycloak()
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
                    const resp = await axios.get(`http://192.168.0.23:8080/account/${keycloak?.tokenParsed?.sub}/profile/${profileKey}/pill_routines`, {
                        headers: {
                            Authorization: keycloak?.token
                        }
                    })
                    
                    console.log(resp.data)
                    setPillRoutines(resp.data.data);
                } 
                catch(err){
                    console.error(err);
                }
            }
            const getProfile = async () => {
                try {
                    const { data } = await axios.get(`http://192.168.0.23:8080/account/${keycloak?.tokenParsed?.sub}/profile/${profileKey}`, {
                        headers: {
                            Authorization: keycloak?.token
                        }
                    })
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
        getPillsOnDate(pillRoutines, selectedDate).then(pills=>setTodayPills(pills)).catch(err=>console.error(err));
    }, [selectedDate, pillRoutines])

    const onDateSelection = (date: Date)=>{
        setSelectedDate(date);
    }

    const getPillsOnDate = async (pillRoutines: PillRoutine[], today: Date)=>{
        const response = await axios.get(`http://192.168.0.23:8080/account/${keycloak?.tokenParsed?.sub}/profile/${profileKey}/pills?fromDate=${today.toISOString().split("T")[0]}&toDate=${today.toISOString().split("T")[0]}`, {
            headers: {
                Authorization: keycloak?.token
            }
        });
        console.log(response.data)
        
        let pillsOnDate: Pill[] = [];
        response.data.data.forEach((pill: any)=>{
            const pillDatetime = new Date(pill.pillDatetime);

            if (
                pillDatetime.getDate == today.getDate 
                && pillDatetime.getMonth == today.getMonth
                && pillDatetime.getFullYear == today.getFullYear
            ){
                pillsOnDate.push({
                    pillDatetime: pillDatetime,
                    name: pill.name,
                    pillRoutineKey: pill.pillRoutineKey,
                    status: pill.status,
                    statusEvents: pill.statusEvents
                })
            }
        })

        console.log("Today pills are ", pillsOnDate)
    
        return pillsOnDate;
    }

    const onPillManualyConsumed = async (pill: Pill)=>{
        await axios.put(`http://192.168.0.23:8080/account/${keycloak?.tokenParsed?.sub}/profile/${profileKey}/pill_routine/${pill.pillRoutineKey}/pill/${pill.pillDatetime.toISOString()}/status`, {
            status: "manualyConfirmed",
        }, {
            headers: {
                Authorization: keycloak?.token
            }
        });

        getPillsOnDate(pillRoutines, selectedDate).then(pills=>setTodayPills(pills)).catch(err=>console.error(err));
    }

    const onPillDeleted = async (pill: Pill)=>{
        await axios.put(`http://192.168.0.23:8080/account/${keycloak?.tokenParsed?.sub}/profile/${profileKey}/pill_routine/${pill.pillRoutineKey}/pill/${pill.pillDatetime.toISOString()}/status`, {
            status: "canceled",
        }, {
            headers: {
                Authorization: keycloak?.token
            }
        });

        getPillsOnDate(pillRoutines, selectedDate).then(pills=>setTodayPills(pills)).catch(err=>console.error(err));
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
            onPillDelete={onPillDeleted}
            onPillManualConsumed={onPillManualyConsumed}
            onPillReeschadule={(pill)=>{}}
            componentIfEmpty={<NoPillContainer/>}
        />
    </View>
    )
}