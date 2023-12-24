import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BackHandler, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PillRoutineStackParamList } from "../../PillRoutineManagerNavigator";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/native";
import { ProfileKeyContext } from "../../../profile_picker/ProfileKeyContext";
import { PillRoutine } from "../../../types/pill_routine";
import BackArrow from "../../../components/BackArrow";
import FormsHeader from "../../components/FormsHeader";
import { globalStyle } from "../../../style";
import ClickablePointer from "../../../components/ClickablePointer";
import ClickableButton from "../../../components/ClickabeButton";
import { PillRoutineEditContext } from "../../PillRoutineEditContext";
import { MEDICINE_API_HOST } from "../../../constants";
import PillNotificationManager from "../../../utils/pill_notification_manager";

type Props = NativeStackScreenProps<PillRoutineStackParamList, "EditPillRoutine">;

type DetailsBlockProps = {
    childrenDetails: React.JSX.Element | React.JSX.Element[];
    width: number;
    onPress: ()=>void;
}

const DetailsBlock = ({ childrenDetails, width, onPress }: DetailsBlockProps)=>{
    const styles = StyleSheet.create({
        container: {
            width: width,
            paddingVertical: 20,
            flexDirection: "row",
            backgroundColor: "white",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: "#DBDBDB",
            borderRadius: 40,
        },
        childrenContainer: {
            maxWidth: 200
        }
    })

    return (
        <TouchableOpacity
            onPress={onPress}
        >
            <View style={styles.container}>
                <View style={styles.childrenContainer}>
                    {childrenDetails}
                </View>
                <ClickablePointer
                    height={40}
                    width={40}
                    onPress={onPress}
                    orientation="right"
                />
            </View>
        </TouchableOpacity>
    )
} 


export default function EditPillRoutineScreen({ route, navigation }: Props){
    const back = (): undefined=>{
        setPillRoutine(undefined);
        navigation.goBack();
        return
    }
    const saveAndBack = async ()=>{
        console.log(pillRoutine);
        const payload = {...pillRoutine};
        delete payload.statusEvents;
        delete payload.pillRoutineKey;
        delete payload.name;
        delete payload.status;
        delete payload.startDatetime;

        await axios.put(`${MEDICINE_API_HOST}/account/${keycloak?.tokenParsed?.sub}/profile/${profileKey}/pill_routine/${pillRoutineKey}`, payload, {
            headers: {
                Authorization: keycloak?.token
            }
        });
        PillNotificationManager.deleteAndCreatePillsNotifications(
            keycloak?.tokenParsed?.sub!, keycloak?.token!, 30
        )

        navigation.goBack();
    }
    const pillRoutineKey = route.params.pillRoutineKey;
    const { profileKey, setProfileKey } = useContext(ProfileKeyContext);
    const { pillRoutine, setPillRoutine } = useContext(PillRoutineEditContext);
    const { keycloak } = useKeycloak();
    const [ isLoading, setIsLoading ] = useState(true);

    useFocusEffect(
        useCallback(()=>{
            const getPillRoutine = async () => {
                try{
                    const resp = await axios.get(`${MEDICINE_API_HOST}/account/${keycloak?.tokenParsed?.sub}/profile/${profileKey}/pill_routine/${pillRoutineKey}`, {
                        headers: {
                            Authorization: keycloak?.token
                        }
                    })
                    
                    setPillRoutine(resp.data);
                    setIsLoading(false);
                } 
                catch(err){
                    console.error(err);
                }
            }
            
            const subscription = BackHandler.addEventListener('hardwareBackPress', ()=>{setPillRoutine(undefined); return false});

            if (pillRoutine && pillRoutine.pillRoutineKey == pillRoutineKey){
                setIsLoading(false);
                return () => subscription.remove()
            }

            getPillRoutine();
            return () => subscription.remove()
        }, [pillRoutine, pillRoutineKey])
    );

    if (isLoading || !pillRoutine){
        return (
            <View>

            </View>
        )
    }

    return (
        <View style={styles.mainContainer}>
            <FormsHeader onBackPressed={back} pillName={pillRoutine!.name}/>
            <View style={styles.contentContainer}> 
                <View style={styles.detailsContainer}>
                    <View>
                        <Text style={[globalStyle.text, { fontSize: 24 }]}> Frequência </Text>
                    </View>
                    <DetailsBlock
                        width={300}
                        onPress={()=>navigation.navigate("EditPillRoutineFrequency")}
                        childrenDetails={(
                            <Text style={[globalStyle.text, { fontSize: 24, color: "#575757" }]}> {getFrequencyDetailsText(pillRoutine)} </Text>
                        )}
                    />
                </View>
                <View style={styles.detailsContainer}>
                    <View>
                        <Text style={[globalStyle.text, { fontSize: 24 }]}> Horário das doses </Text>
                    </View>
                    <DetailsBlock
                        width={200}
                        onPress={()=>navigation.navigate("EditPillRoutineDoses")}
                        childrenDetails={(
                            <View>
                                {
                                    getDosesTimesText(pillRoutine).map((hourString, index)=>{
                                        return (
                                            <Text 
                                                style={[globalStyle.text, { fontSize: 24, color: "#575757" }]} key={index}
                                            >
                                                {hourString} hrs
                                            </Text>
                                        )
                                    })
                                }
                            </View>
                        )}
                    />
                </View>
            </View>
            <View style={styles.buttonsContainer}>
                <ClickableButton
                    width={134}
                    height={52}
                    text="Cancelar"
                    buttonStyle={{ backgroundColor: "transparent", borderWidth: 1, borderColor: "#C46966" }}
                    textStyle={{ color: "#575757" }}
                    onPress={back}
                />
                <ClickableButton
                    width={134}
                    height={52}
                    text="Salvar"
                    onPress={saveAndBack}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        alignItems: "center",
        flex: 1
    },
    headerContainer: {

    },
    contentContainer: {
        gap: 16
    },
    buttonsContainer: {
        width: "100%",
        position: "absolute",
        bottom: 16,
        paddingHorizontal: 24,
        justifyContent: "space-between",
        flexDirection: "row"
    },
    detailsContainer: {
        gap: 8
    },
});

const weekdayTradutor: {[key: string]: string} = {
    monday: "seg",
    tuesday: "ter",
    wednesday: "qua",
    thursday: "qui",
    friday: "sex",
    saturday: "sab",
    sunday: "dom",
}

const getFrequencyDetailsText = (pillRoutine: PillRoutine)=>{
    if(pillRoutine.pillRoutineType == "weekdays"){
        const weekdays = Object.keys(pillRoutine.pillRoutineData);
    
        if (weekdays.length == 7){
            return "Tomar todos os dias"
        }
        else {
            let text = "Tomar toda ";
            if(["sunday", "saturday"].includes(weekdays[0])){
                text = "Tomar todo ";
            }
    
            weekdays.forEach((weekday: string)=>{
                text += `${weekdayTradutor[weekday]}, `
            })
    
            if (weekdays.length > 1){
                return text.slice(0, -7) + " e " + text.slice(-5, -2);
            }
            else {
                return text.slice(0, -2);
            }
        }
    }
    else if(pillRoutine.pillRoutineType == "dayPeriod"){
        return `Tomar a cada ${pillRoutine.pillRoutineData.periodInDays} dias`
    }
};

const getDosesTimesText = (pillRoutine: PillRoutine): string[]=>{
    const weekdays = Object.keys(pillRoutine.pillRoutineData);

    return pillRoutine.pillRoutineData[weekdays[0]]
}