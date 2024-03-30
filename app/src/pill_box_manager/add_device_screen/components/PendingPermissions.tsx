import { PermissionsAndroid, StyleSheet, Text, View } from "react-native";
import BackArrow from "../../../components/BackArrow";
import { globalStyle } from "../../../style";
import ClickableButton from "../../../components/ClickabeButton";

type Props = {
    onBackPressed: ()=>void;
    onPermissionsGranted: ()=>void;
}

export default function PendingPermissions({onBackPressed, onPermissionsGranted}: Props){
    const styles = StyleSheet.create({
        backArrowContainer: {
            marginLeft: 12
        },
        header: {
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            position: "relative",
            height: 64,
            width: "100%",
        },
        text: {
            color: "#909090",
            textAlign: "center",
            fontSize: 32
        },
        contentContainer: {
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 12
        }
    })

    const requestPermissions = ()=>{
        console.log("Requesting permissions");
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Permissão de localização',
                message: "Para encontrar o dispositivo precisamos acessar sua localização precisa",
                buttonNeutral: 'Perguntar depois',
                buttonNegative: 'Cancelar',
                buttonPositive: 'OK',
            },
        ).then((permissionStatus)=>{
            if(permissionStatus == PermissionsAndroid.RESULTS.GRANTED){
                onPermissionsGranted();
            }
            console.log("Permissions was " + permissionStatus);
        }).catch((err)=>{
            console.error("Error requesting permission " + err);
        });
    }
    return (
        <View>
            <View style={styles.header}>
                <View style={styles.backArrowContainer}>
                    <BackArrow width={30} height={30} onPress={onBackPressed}/>
                </View>
            </View>
            <View style={[styles.contentContainer]}>
                <Text style={[globalStyle.text, styles.text]}> Para continuar é necessário permitir o acesso a sua localização </Text>
                <View style={{marginTop: 24}}>
                    <ClickableButton
                        width={250}
                        height={60}
                        onPress={requestPermissions}
                        text="Permitir"
                    />
                </View>
            </View>

        </View>
    )
}