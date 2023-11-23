import { StyleSheet, View } from "react-native";
import { Image } from "react-native"

type AvatarProps = {
    widht: number;
    height: number;
    avatarNumber: number;
}

export default function Avatar({widht, height, avatarNumber}: AvatarProps){
    type AvatarByNumber = {
        [key: number]: any
    };

    const styles = StyleSheet.create({
        image: {
            width: widht,
            height: height
        }
    })

    const avatarByNumber: AvatarByNumber = {
        1: require("../assets/avatars/man.png"),
        2: require("../assets/avatars/woman.png")
    }
    return (
        <View>
            <Image
                style={styles.image}
                source={avatarByNumber[avatarNumber]}
            />
        </View>
    )
}