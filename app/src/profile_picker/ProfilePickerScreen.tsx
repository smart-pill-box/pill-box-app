import { Text, View, Image, StyleSheet, useWindowDimensions, GestureResponderEvent, TouchableOpacity } from "react-native"
import { RootStackParamList } from "../../App"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import Svg, { Ellipse, ClipPath } from 'react-native-svg';
import MyMedSafe from "../components/MyMedSafe"
import AddButton from "../components/AddButton"
import ProfileList from "./components/ProfileList"
import MaskedView from "@react-native-masked-view/masked-view";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useContext, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useKeycloak } from "@react-keycloak/native";
import axios from "axios";
import BorderTextInput from "./components/BorderTextInput";
import AvatarNavigator from "./components/AvatarNavigator";
import { globalStyle } from "../style";
import SelectableButton from "../pill_routine_manager/components/SelectableButton";
import ClickableButton from "../components/ClickabeButton";
import { ProfileKeyContext } from "./ProfileKeyContext";

type Props = NativeStackScreenProps<RootStackParamList, "ProfilePicker">
type MaskedPillsImageProps = {
    imgHeight: number,
    imgWidth: number,
    screenWidth: number,
    style?: object
};

export type Profile = {
    name: string,
    avatarNumber: number,
    profileKey: string
}


function MaskedPillsImage({imgHeight, imgWidth, screenWidth, style}: MaskedPillsImageProps){
    return (
        <SafeAreaView style={{position: "absolute", zIndex: -1, ...style}}>
            <MaskedView
                maskElement={
                    <Svg height={imgHeight} width={imgWidth}>
                        <Ellipse cx={screenWidth/2 + 20} cy={imgHeight/2 + 20} rx={7*screenWidth/8} ry={imgHeight/2}/>
                    </Svg>
                }
            >
                <Image
                    source={require("./assets/pills_doodle.png")}
                    width={imgWidth}
                    height={imgHeight}
                />
            </MaskedView>
        </SafeAreaView>
    )
};

function FirstAccessComponent({ onAccountCreated }: {onAccountCreated: (newAccount: any)=>void}){
    const windowDimensions = useWindowDimensions();
    const { keycloak } = useKeycloak();

    const styles = StyleSheet.create({
        mainContainer: {
            width: windowDimensions.width,
            height: windowDimensions.height,
            position: "relative"
        },
        contentContainer: {
            width: windowDimensions.width,
            height: 400,
            gap: 20,
            justifyContent: "flex-end",
            alignItems: "center"
        },
        text: {
            textAlign: "center",
            color: "#575757",
            fontSize: 32
        },
        textContainer: {
            width: "90%"
        },
        buttonContainer: {
            position: "absolute",
            alignSelf: "center",
            bottom: 16
        }
    });

    const [avatarNumber, setAvatarNumber] = useState(0)
    const [profileName, setProfileName] = useState("")
    const onButtonPressed = ()=>{
        axios.post("/api/account", {
            mainProfileName: profileName,
            mainProfileAvatarNumber: avatarNumber
        }, {
            headers: {
                Authorization: keycloak?.token
            }
        }).then(resp=>{
            onAccountCreated(resp.data);
        }).catch(err=>{
            console.error(err);
        })
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.contentContainer}>
                <View style={styles.textContainer}>
                    <Text style={[globalStyle.text, styles.text]}> Comece escolhendo seu perfil principal </Text>
                </View>
                <AvatarNavigator
                    onAvatarChange={setAvatarNumber}
                />
                <BorderTextInput
                    width={300}
                    height={44}
                    onChangeText={setProfileName}
                    currentValue={profileName}
                />
            </View>
            <View style={styles.buttonContainer}>
                <ClickableButton
                    width={340}
                    height={44}
                    text="Criar Perfil"
                    onPress={onButtonPressed}

                />
            </View>
        </View>
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
            position: "absolute",
            left: 0,
            bottom: -100
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
        },
        newProfileContentContainer: {
            width: windowDimensions.width,
            alignItems: "center",
            justifyContent: "center"
        }
    });


    const onProfileChoice = (profile: Profile)=>{
        setProfileKey(profile.profileKey);
        navigation.navigate("Home", {
            screen: "PillCalendar"
        });
    }

    const {profileKey, setProfileKey} = useContext(ProfileKeyContext);
    
    const { keycloak } = useKeycloak();
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mainProfileName, setMainProfileName] = useState("");
    const onAddBttnPress = (event: GestureResponderEvent) =>{
        navigation.navigate("AddProfile");
    };

    const retrieveProfiles = () => {
        axios.get(`/api/account/${keycloak?.tokenParsed?.sub}`).then(res=>{
            setProfiles(res.data.profiles)
            setIsLoading(false)

        }).catch((err)=>{
            if(err.response && err.response.data.code == "ERR00001"){
                setProfiles([])
                setIsLoading(false)
            }
            else (
                console.error("unexpected error", err)
            )
        })
    }

    useFocusEffect(
        useCallback(()=>{
            retrieveProfiles()
        }, [])
    );

    if (isLoading){
        return (
            <Text style={{color: "black", fontSize: 40}}> LOADING ... </Text>
        )
    }

    if (profiles.length == 0){
        return (
            <FirstAccessComponent
                onAccountCreated={(newAccount: any)=>{
                    setProfileKey(newAccount.profiles[0].profileKey);
                    navigation.navigate("Home", {
                        screen: "PillRoutineManagerNavigator"
                    })
                }}
            />
        )
    }

    return (
        <View style={style.mainContainer}>
            <View style={style.headerContainer}>
                <MyMedSafe/>
                <View style={style.addButtonContainer}>
                    <AddButton size={33} onPress={onAddBttnPress}/>
                </View>
            </View>
            <View>
                <ProfileList profiles={profiles} onProfileClick={onProfileChoice}/>
            </View>
            <MaskedPillsImage 
                imgWidth={400}
                imgHeight={400}
                screenWidth={windowDimensions.width}
                style={style.maskedImage}
            />
        </View>
    )
}