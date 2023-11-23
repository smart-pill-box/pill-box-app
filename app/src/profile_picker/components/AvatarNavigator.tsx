import { View,  Image, StyleSheet } from "react-native";
import ClickablePointer from "../../components/ClickablePointer";
import { useEffect, useState } from "react";


type AvatarNavigatorProps = {
    onAvatarChange: (avatar: number) => void
}

export default function AvatarNavigator({ onAvatarChange }: AvatarNavigatorProps){

    const styles = StyleSheet.create({
        avatarNavigatorContainer: {
            flexDirection: "row",
            alignItems: "center"
        },
        image: {
            width: 150,
            height: 150
        },
        imageContainer: {
            padding: 16
        }
    });

    type AvatarsLocations = {
        [key: number]: any;
    };

    const avatarsLocations: AvatarsLocations = {
        1: require("../../assets/avatars/man.png"),
        2: require("../../assets/avatars/woman.png")
    };

    const nextAvatar = ()=>{
        if(avatarNumber == 2){
            setAvatarNumber(1)
            return
        }

        setAvatarNumber(avatarNumber+1);
    };

    const previusAvatar = ()=>{
        if(avatarNumber == 1){
            setAvatarNumber(2)
            return
        }

        setAvatarNumber(avatarNumber-1);
    }

    const [ avatarNumber, setAvatarNumber ] = useState(1);

    useEffect(()=>{
        onAvatarChange(avatarNumber);
    }, [avatarNumber])

    return (
        <View style={styles.avatarNavigatorContainer}>
            <ClickablePointer width={47} height={47} orientation="left" onPress={previusAvatar}/>
            <View style={styles.imageContainer}>
                <Image 
                    source={avatarsLocations[avatarNumber] || avatarsLocations[1]}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
            <ClickablePointer width={47} height={47} orientation="right" onPress={nextAvatar}/>
        </View>
    )
}