import { View, Text, Image, StyleSheet } from "react-native"
import { globalStyle } from "../../style"
import { Profile } from "../ProfilePickerScreen";

type ProfileListProps = {
    profiles: Profile[]
}

export default function ProfileList({ profiles }: ProfileListProps){
    const styles = StyleSheet.create({
        container: {
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            flexWrap: "wrap"
        },
        profileContainer: {
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999
        },
        profileName: {
            textAlign: "center",
        }
    });
    type AvatarsLocation = {
        [key: number]: any
    };
    const avatarsLocations: AvatarsLocation = {
        1: require("../../assets/avatars/old-man.png"),
        2: require("../../assets/avatars/old-woman.png")
    };

    return (
        <View style={styles.container}>
            {profiles.map((profile)=>{
                return (
                    <View style={styles.profileContainer} key={profile.profileKey}>
                        <Image
                            source={avatarsLocations[profile.avatar] || avatarsLocations[1]}
                            width={150}
                            height={150}
                        />
                        <Text style={[styles.profileName, globalStyle.text]}> {profile.name} </Text>
                    </View>
                )
            })}
        </View>
    )
}