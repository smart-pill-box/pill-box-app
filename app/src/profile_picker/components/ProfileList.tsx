import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { globalStyle } from "../../style"
import { Profile } from "../ProfilePickerScreen";
import Avatar from "../../components/Avatar";

type ProfileListProps = {
    profiles: Profile[],
    onProfileClick: (profile: Profile)=>void
}

export default function ProfileList({ profiles, onProfileClick }: ProfileListProps){
    const styles = StyleSheet.create({
        container: {
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            flexWrap: "wrap"
        },
        profileContainer: {
            width: "50%",
            paddingTop: 16,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999
        },
        profileName: {
            paddingTop: 2,
            textAlign: "center",
        }
    });

    return (
        <View style={styles.container}>
            {profiles.map((profile)=>{
                return (
                    <View style={styles.profileContainer} key={profile.profileKey}>
                        <TouchableOpacity onPress={()=>onProfileClick(profile)}>
                            <Avatar
                                widht={100}
                                height={100}
                                avatarNumber={profile.avatar}
                            />
                            <Text style={[styles.profileName, globalStyle.text]}> {profile.name} </Text>
                        </TouchableOpacity>
                    </View>
                )
            })}
        </View>
    )
}