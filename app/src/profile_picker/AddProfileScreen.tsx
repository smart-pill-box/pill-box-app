import { GestureResponderEvent, View, Text, Image, StyleSheet, useWindowDimensions, TextInput } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import BackArrow from "../components/BackArrow";
import { RootStackParamList } from "../../App"
import ClickablePointer from "../components/ClickablePointer";
import { globalStyle } from "../style";
import ClickableButton from "../components/ClickabeButton";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import AvatarNavigator from "./components/AvatarNavigator";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/native";


type Props = NativeStackScreenProps<RootStackParamList, "AddProfile">

export default function AddProfileScreen({ route, navigation }: Props){
    const windowDimensions = useWindowDimensions();
    const buttonWidth = windowDimensions.width - 40;

    const styles = StyleSheet.create({
        mainContainer: {
            width: windowDimensions.width,
            height: windowDimensions.height,
            flexDirection: "column",
            position: "relative"
        },
        backArrowContainer: {
            padding: 16
        },
        avatarNavigatorContainer: {
            flexDirection: "row",
            alignItems: "center"
        },
        contentContainer: {
            flexDirection: "column",
            alignItems: "center",
        },
        bigSoftText: {
            fontSize: 32,
            color: "#575757"
        },
        textInputContainer: {
            borderRadius: 6,
            borderWidth: 1,
            borderColor: "#A3A3A3",
            width: 300,
            alignItems: "center"
        },
        textInput: {
            textAlign: "center",
            width: "100%"
        },
        createButtonContainer: {
            position: "absolute",
            bottom: 16,
            left: windowDimensions.width/2 - buttonWidth/2
        }

    })

    
    const onBackArrowPress = (event: GestureResponderEvent)=>{
        navigation.navigate("ProfilePicker");
    };
    
    const onCreatePressed = async ()=>{
        setIsButtonEnabled(false);
        try{
            await axios.post(`http://192.168.0.23:8080/account/${keycloak?.tokenParsed?.sub}/profile`, {
                name: newProfileName,
                avatarNumber: avatarNumber
            }, {
                headers: {
                    Authorization: keycloak?.token
                }
            })

            navigation.navigate("ProfilePicker");
        }catch(err){
            console.error(err);
        }
        
    }
    
    const { keycloak } = useKeycloak()
    const [newProfileName, setNewProfileName] = useState("");
    const [isButtonEnabled, setIsButtonEnabled] = useState(true);
    const [avatarNumber, setAvatarNumber] = useState(1);
    
    useFocusEffect(
        useCallback(() => {
            setNewProfileName("");
            setIsButtonEnabled(true);
        }, [])
    );
    return (
        <View style={styles.mainContainer}>
            <View style={styles.backArrowContainer}>
                <BackArrow width={40} height={30} onPress={onBackArrowPress}/>
            </View>
            <View>
                <View style={styles.contentContainer}>
                    <View style={{ paddingBottom: 20 }}>
                        <Text style={[globalStyle.text, styles.bigSoftText]}> Novo Perfil </Text>
                    </View>
                    <AvatarNavigator onAvatarChange={setAvatarNumber}/>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            placeholderTextColor="#909090"
                            placeholder="Nome do Perfil"
                            onChangeText={text => setNewProfileName(text)}
                            maxLength={50}
                            value={newProfileName}
                            style={[styles.textInput, globalStyle.text]}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.createButtonContainer}>
                <ClickableButton 
                    width={buttonWidth} 
                    height={48}
                    text="Criar Perfil"
                    onPress={onCreatePressed}
                    isEnabled={isButtonEnabled}
                />
            </View>
        </View>
    )
}