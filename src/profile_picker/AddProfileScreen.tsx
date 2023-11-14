import { GestureResponderEvent, View, Text, Image, StyleSheet, useWindowDimensions, TextInput } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import BackArrow from "../components/BackArrow";
import { RootStackParamList } from "../../App"
import ClickablePointer from "../components/ClickablePointer";
import { globalStyle } from "../style";
import ClickableButton from "../components/ClickabeButton";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";


type Props = NativeStackScreenProps<RootStackParamList, "AddProfile">

function AvatarNavigator(){
    const onPointerClick = (orientation: string)=>{
        console.log("Clicked to ", orientation)
    }

    const styles = StyleSheet.create({
        avatarNavigatorContainer: {
            flexDirection: "row",
            alignItems: "center"
        },
    })

    return (
        <View style={styles.avatarNavigatorContainer}>
            <ClickablePointer width={47} height={47} orientation="left" onPress={()=>{onPointerClick("left")}}/>
            <Image 
                source={require("../assets/avatars/old-man.png")}
                width={300}
                height={300}
            />
            <ClickablePointer width={47} height={47} orientation="right" onPress={()=>{onPointerClick("right")}}/>
        </View>
    )
}

export default function AddProfileScreen({ route, navigation }: Props){
    const windowDimensions = useWindowDimensions();

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
            flexDirection: "row",
            paddingTop: 80,
            paddingRight: 16,
            justifyContent: "flex-end"
        }

    })

    
    const onBackArrowPress = (event: GestureResponderEvent)=>{
        navigation.navigate("ProfilePicker");
    };
    
    const onCreatePressed = async ()=>{
        setIsButtonEnabled(false);
        let newProfile = {
            name: newProfileName,
            avatar: 1,
            profileKey: Math.random().toString()
        };

        let oldProfiles = await AsyncStorage.getItem("profiles");
        if (oldProfiles == null){
            console.log("Entrei em 1");
            await AsyncStorage.setItem("profiles", JSON.stringify([newProfile]));
            navigation.navigate("ProfilePicker");
            return;
        }
        
        const oldProfilesObj = JSON.parse(oldProfiles);
        if (oldProfilesObj == null){
            console.log("Entrei em 2");
            await AsyncStorage.setItem("profiles", JSON.stringify([newProfile]));
            navigation.navigate("ProfilePicker");
            return;
        }
        
        oldProfilesObj.push(newProfile);
        
        await AsyncStorage.setItem("profiles", JSON.stringify(oldProfilesObj));
        
        navigation.navigate("ProfilePicker");
    }
    
    const [newProfileName, setNewProfileName] = useState("");
    const [isButtonEnabled, setIsButtonEnabled] = useState(true);
    
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
                    <AvatarNavigator/>
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
                <View style={styles.createButtonContainer}>
                    <ClickableButton 
                        width={204} 
                        height={52}
                        text="Criar Perfil"
                        onPress={onCreatePressed}
                        isEnabled={isButtonEnabled}
                    />
                </View>
            </View>
        </View>
    )
}