import { StyleSheet, View, useWindowDimensions, Text } from "react-native";
import MyMedSafe from "./MyMedSafe";
import Avatar from "./Avatar";
import { globalStyle } from "../style";

type MainHeaderProps = {
    avatarNumber: number;
    profileName: string;
}

export default function MainHeader({ avatarNumber, profileName }: MainHeaderProps){
    const windowDimensions = useWindowDimensions();

    const styles = StyleSheet.create({
        headerContainer: {
            width: windowDimensions.width,
            paddingTop: 16,
            paddingBottom: 32,
            height: 112,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
        },
        avatarAndNameContainer: {
            height: "100%",
            padding: 16,
            justifyContent: "center",
            alignItems: "center"
        }
    })
    return (
        <View style={styles.headerContainer}>
            <MyMedSafe/>
            <View style={styles.avatarAndNameContainer}>
                <Avatar widht={60} height={60} avatarNumber={avatarNumber}/>
                <Text style={globalStyle.text}> { profileName } </Text>
            </View>
        </View>
    )
}