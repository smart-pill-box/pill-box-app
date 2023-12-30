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
import keycloak from '../../keycloak';
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { MEDICINE_API_HOST } from '../constants';
import PillNotificationManager from '../utils/pill_notification_manager';
import { addDays, isAfter, isBefore } from 'date-fns';

type Props = BottomTabScreenProps<RootTabParamList, "PillCalendar">

type PillStatus = "pending" | "manualyConfirmed" | "pillBoxConfirmed" | "canceled" | "reeschaduled"

type PillsByDate = {
    [key: string]: Pill[] | string;
    fromDate: string;
    toDate: string;
};

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
    const { profileKey, setProfileKey } = useContext(ProfileKeyContext)
    const [ profileData, setProfileData ] = useState({
        name: "",
        avatarNumber: 1
    });
    const [todayPills, setTodayPills] = useState<Pill[]>([]);
    const [pillsByDate, setPillsByDate] = useState<PillsByDate>();

    const today = new Date();

    useFocusEffect(
        useCallback(()=>{
            const getProfile = async () => {
                try {
                    const { data } = await axios.get(`${MEDICINE_API_HOST}/account/${keycloak?.tokenParsed?.sub}/profile/${profileKey}`, {
                        headers: {
                            Authorization: keycloak?.token
                        }
                    })

                    setProfileData({
                        name: data.name,
                        avatarNumber: data.avatarNumber
                    })
                }
                catch(err){
                    console.error(err);
                }
            }
            getProfile();
        }, [])
    );

    useEffect(()=>{
        getPillsByDate(selectedDate, 20).catch(err=>console.error(err));
    }, [])

    useEffect(()=>{
        getPillsOnDate(selectedDate).then((pills)=>setTodayPills(pills)).catch(err=>console.error(err));
    }, [pillsByDate, selectedDate])

    const onDateSelection = (date: Date)=>{
        setSelectedDate(date);
    }

    const getPillsByDate = async (meanDate: Date, range: number)=>{
        const fromDate = getLocalDateString(addDays(meanDate, -range-1));
        const toDate = getLocalDateString(addDays(meanDate, range+1));
        const response = await axios.get(`${MEDICINE_API_HOST}/account/${keycloak?.tokenParsed?.sub}/profile/${profileKey}/pills?fromDate=${fromDate}&toDate=${toDate}`, {
            headers: {
                Authorization: keycloak?.token
            }
        });
        
        const newPillsByDate: PillsByDate = {
            fromDate: fromDate,
            toDate: toDate
        };
        let pillsOnDate: Pill[] = [];
        response.data.data.forEach((pill: any)=>{
            const pillDatetime = new Date(pill.pillDatetime);
            const localDateString = getLocalDateString(pillDatetime);

            if(!newPillsByDate[localDateString]){
                newPillsByDate[localDateString] = []
            }
            (newPillsByDate[localDateString] as Pill[]).push({
                pillDatetime: pillDatetime,
                name: pill.name,
                pillRoutineKey: pill.pillRoutineKey,
                status: pill.status,
                statusEvents: pill.statusEvents
            });
        })

        setPillsByDate({
            ...pillsByDate,
            ...newPillsByDate
        });

        console.log(pillsByDate);
    }

    const getPillsOnDate = async (onDate: Date) => {
        if(isAfter(onDate, new Date(pillsByDate?.toDate as string))){
            await getPillsByDate(onDate, 10);
        }
        if(isBefore(onDate, new Date(pillsByDate?.fromDate as string))){
            await getPillsByDate(onDate, 10);
        }

        if(!pillsByDate){
            return [];
        }

        if(!pillsByDate[getLocalDateString(onDate)]){
            return [];
        } 

        return pillsByDate[getLocalDateString(onDate)] as Pill[];
    }

    const onPillManualyConsumed = async (pill: Pill)=>{
        await axios.put(`${MEDICINE_API_HOST}/account/${keycloak?.tokenParsed?.sub}/profile/${profileKey}/pill_routine/${pill.pillRoutineKey}/pill/${pill.pillDatetime.toISOString()}/status`, {
            status: "manualyConfirmed",
        }, {
            headers: {
                Authorization: keycloak?.token
            }
        });
        PillNotificationManager.deleteAndCreatePillsNotifications(
            keycloak?.tokenParsed?.sub!, keycloak?.token!, 5
        )

        getPillsByDate(selectedDate, 2);
    }

    const onPillReeschadule = async (pill: Pill, newDatetime: Date)=>{
        await axios.post(`${MEDICINE_API_HOST}/account/${keycloak?.tokenParsed?.sub}/profile/${profileKey}/pill_routine/${pill.pillRoutineKey}/pill/${pill.pillDatetime.toISOString()}/reeschadule`, {
            newPillDatetime: newDatetime.toISOString(),
        }, {
            headers: {
                Authorization: keycloak?.token
            }
        });
        PillNotificationManager.deleteAndCreatePillsNotifications(
            keycloak?.tokenParsed?.sub!, keycloak?.token!, 5
        )

        getPillsByDate(selectedDate, 2);
    }

    const onPillDeleted = async (pill: Pill)=>{
        await axios.put(`${MEDICINE_API_HOST}/account/${keycloak?.tokenParsed?.sub}/profile/${profileKey}/pill_routine/${pill.pillRoutineKey}/pill/${pill.pillDatetime.toISOString()}/status`, {
            status: "canceled",
        }, {
            headers: {
                Authorization: keycloak?.token
            }
        });
        PillNotificationManager.deleteAndCreatePillsNotifications(
            keycloak?.tokenParsed?.sub!, keycloak?.token!, 5
        )

        getPillsByDate(selectedDate, 2);
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
            onPillReeschadule={(pill)=>{
                DateTimePickerAndroid.open({
                    value: pill.pillDatetime,
                    onChange: (event, date)=>{
                        if((event.type == "set")){
                            DateTimePickerAndroid.open({
                                value: date!,
                                onChange: (event, selectedDatetime)=>{
                                    if((event.type == "set") && (pill.pillDatetime.toISOString() != selectedDatetime?.toISOString())){
                                        onPillReeschadule(pill, selectedDatetime!)
                                    }
                                },
                                mode: "time",
                                is24Hour: true
                            })
                        }
                    },
                    mode: "date"
                })
            }}
            componentIfEmpty={<NoPillContainer/>}
        />
    </View>
    )
}

const getLocalDateString = (date: Date)=>{
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}