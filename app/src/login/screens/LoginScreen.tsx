import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Button, Text, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../../App"
import { useKeycloak } from "@react-keycloak/native"
import PillNotificationManager from "../../utils/pill_notification_manager"
import AsyncStorage from "@react-native-async-storage/async-storage"

type Props = NativeStackScreenProps<RootStackParamList, "Login">

export default function LoginScreen({route, navigation}: Props){
    const { keycloak } = useKeycloak();
    return (
        <View>
            <TouchableOpacity
                onPress={()=>{keycloak?.login({
                    redirectUri: "mymedsafe.pillbox://add_profile"
                }).catch(err=>console.log(err))}}
            >
                <View style={{ width: 200, height: 100, alignSelf: "center", borderColor: "black", borderWidth: 1 }}>
                    <Text style={{color: "black", fontSize: 30}}> {keycloak?.authenticated ? "YES" : "NO"} </Text>
                </View>
            </TouchableOpacity>

        </View>
    )
}