import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PillRoutineStackParamList } from "./PillRoutineManagerNavigator";
import { View, Text, StyleSheet } from "react-native";
import MainHeader from "../components/MainHeader";
import { PillRoutine } from "../types/pill_routine"
import ClickableButton from "../components/ClickabeButton";
import { globalStyle } from "../style";
import { useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PillRoutineList from "./components/PillRoutineList";
import { useFocusEffect } from "@react-navigation/native";
import { ProfileKeyContext } from "../profile_picker/ProfileKeyContext";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/native";

type Props = NativeStackScreenProps<PillRoutineStackParamList, "PillRoutineManager">;

export default function PillRoutineManagerScreen({ route, navigation }: Props){
    const styles = StyleSheet.create({
        textAndButtonContainer: {
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            height: 240,
            paddingTop: 16
        },
        text: {
            color: "#909090",
            textAlign: "center",
            fontSize: 32
        }
    });

    const {profileKey, setProfileKey} = useContext(ProfileKeyContext);

    useFocusEffect(useCallback(()=>{
        const getPillRoutines = async () => {
            setIsLoading(true);
            const pillRoutinesStr = await AsyncStorage.getItem("pillRoutines");
            if (!pillRoutinesStr){
                return
            }
            const pillRoutines = JSON.parse(pillRoutinesStr);
            if (!pillRoutines){
                return
            }
            console.log("SDKJSDKJSDKJSDKJDSKSDJKDS");
            console.log(pillRoutines);

            setPillRoutines(pillRoutines);
            setIsLoading(false);
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

        getProfile()
        getPillRoutines()
    }, []))

    const {keycloak} = useKeycloak()
    const [profileData, setProfileData] = useState({
        name: "",
        avatarNumber: 0
    })
    const [ pillRoutines, setPillRoutines ] = useState<PillRoutine[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    if(isLoading){
        return (
            <View>
                <MainHeader profileName={profileKey} avatarNumber={0}/>
            </View>
        )
    }

    if(pillRoutines.length == 0){
        return (
            <View>
                <MainHeader profileName={profileData.name} avatarNumber={profileData.avatarNumber}/>
                <View style={styles.textAndButtonContainer}>
                    <Text style={[globalStyle.text, styles.text]}>Comece adicionando sua primeira rotina de tratamento</Text>
                    <ClickableButton
                        width={250}
                        height={60}
                        onPress={()=>{navigation.navigate("NameDefinition", route.params)}}
                        text="Vamos lá"
                    />
                </View>
            </View>
        )
    }
    else {
        return (
            <View>
                <MainHeader profileName={profileData.name} avatarNumber={profileData.avatarNumber}/>
                <PillRoutineList
                    pillRoutines={pillRoutines}
                />
            </View>
        )
    }

}