import { Image, StyleSheet, Text, View } from "react-native";
import MainHeader from "../components/MainHeader";
import { useCallback, useContext, useState } from "react";
import { ProfileKeyContext } from "../profile_picker/ProfileKeyContext";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { MEDICINE_API_HOST } from "../constants";
import keycloak from "../../keycloak";
import { globalStyle } from "../style";
import ClickableButton from "../components/ClickabeButton";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PillBoxManagerStackList } from "./PillBoxManagerNavigator";
import { Device } from "../types/device";
import { ProfileDevice } from "../types/profile_device";
import DeviceComponent from "./components/DeviceComponent";

type Props = NativeStackScreenProps<PillBoxManagerStackList, "PillBoxManager">;

function NoDevicesContainer({ route, navigation }: Props){
    const styles = StyleSheet.create({
        textAndButtonContainer: {
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            height: 240,
            paddingTop: 16
        },
        text: {
            color: "#909090",
            textAlign: "center",
            fontSize: 32
        }
    });


    return (
    <View style={styles.textAndButtonContainer}>
        <Text style={[globalStyle.text, styles.text]}>
            Comece adicionando sua primeira caixa de remédios inteligente
        </Text>
        <ClickableButton
            width={250}
            height={60}
            onPress={()=>{navigation.navigate("AddDeviceScreen")}}
            text="Vamos lá"
        />
    </View>
    )
}

export default function PillBoxManagerScreen({ route, navigation }: Props){
    const { profileKey, setProfileKey } = useContext(ProfileKeyContext);
    const [ profileData, setProfileData ] = useState({
        name: "",
        avatarNumber: 1
    });
	const [ profileDevices, setProfileDevices ] = useState<ProfileDevice[]>();
	const [ finishLoading, setFinishLoading ] = useState(false);

    useFocusEffect(
        useCallback(()=>{
            const getProfile = async () => {
                try {
                    const { data } = await axios.get(`${MEDICINE_API_HOST}/account/${keycloak?.tokenParsed?.sub}/profile/${profileKey}`, {
                        headers: {
                            Authorization: keycloak?.token
                        }
                    })

                    setProfileData({
                        name: data.name,
                        avatarNumber: data.avatarNumber
                    })
                }
                catch(err){
                    console.error(err);
                }
            }
			const getProfileDevices = async () => {
				try {
					const { data } = await axios.get(`${MEDICINE_API_HOST}/account/${keycloak?.tokenParsed?.sub}/profile/${profileKey}/profile_devices`, {
						headers: {
							Authorization: keycloak?.token
						}
					});
					
					setProfileDevices(data.data);
					setFinishLoading(true);
				} catch (err) {
					console.error(err);
				}
			}

			const loadAll = async ()=> {
				await getProfile();
				await getProfileDevices();
				setFinishLoading(true);
			}

			loadAll();
        }, [])
    );

	if(!finishLoading || !profileDevices) {
		return (
			<View>
			</View>
		)
	}

	if(profileDevices?.length == 0){
		return (
			<View style={{height: "100%"}}>
				<MainHeader profileName={profileData.name} avatarNumber={profileData.avatarNumber}/>
				<NoDevicesContainer route={route} navigation={navigation}/>
			</View>
		)
	}

	return (
		<View>
			<MainHeader
				profileName={profileData.name}
				avatarNumber={profileData.avatarNumber}
			/>
			<View>
				<DeviceComponent
					profileDevice={ profileDevices[0] }
					onPress={ ()=> { console.log(profileDevices[0].deviceKey); navigation.navigate("DevicePillsScreen", {
						deviceKey: profileDevices[0].deviceKey
					}); }}
				/>
			</View>
		</View>
	)

}
