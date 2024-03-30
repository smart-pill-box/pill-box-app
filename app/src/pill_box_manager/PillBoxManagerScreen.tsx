import { Image, StyleSheet, Text, View } from "react-native";
import MainHeader from "../components/MainHeader";
import { useCallback, useContext, useState } from "react";
import { ProfileKeyContext } from "../profile_picker/ProfileKeyContext";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { MEDICINE_API_HOST } from "../constants";
import keycloak from "../../keycloak";
import { globalStyle } from "../style";
import ClickableButton from "../components/ClickabeButton";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PillBoxManagerStackList } from "./PillBoxManagerNavigator";

type Props = NativeStackScreenProps<PillBoxManagerStackList, "PillBoxManager">;

function NoDevicesContainer({ route, navigation }: Props){
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


    return (
    <View style={styles.textAndButtonContainer}>
        <Text style={[globalStyle.text, styles.text]}>
            Comece adicionando sua primeira caixa de remédios inteligente
        </Text>
        <ClickableButton
            width={250}
            height={60}
            onPress={()=>{navigation.navigate("AddDeviceScreen")}}
            text="Vamos lá"
        />
    </View>
    )
}

export default function PillBoxManagerScreen({ route, navigation }: Props){
    const { profileKey, setProfileKey } = useContext(ProfileKeyContext);
    const [ profileData, setProfileData ] = useState({
        name: "",
        avatarNumber: 1
    });

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
    return (
        <View style={{height: "100%"}}>
            <MainHeader profileName={profileData.name} avatarNumber={profileData.avatarNumber}/>
            <NoDevicesContainer route={route} navigation={navigation}/>
        </View>
    )
}