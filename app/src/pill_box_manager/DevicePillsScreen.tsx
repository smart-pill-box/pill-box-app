import { useKeycloak } from "@react-keycloak/native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { DeviceEventEmitterStatic, ScrollView, StyleSheet, Text, useWindowDimensions, Vibration, View } from "react-native";
import AddButton from "../components/AddButton";
import ClickableButton from "../components/ClickabeButton";
import { MEDICINE_API_HOST } from "../constants";
import PillComponent from "../pill_calendar/components/PillComponent";
import PillList from "../pill_calendar/components/PillList";
import { Pill } from "../pill_calendar/PillCalendarScreen";
import { ProfileKeyContext } from "../profile_picker/ProfileKeyContext";
import { Profile } from "../profile_picker/ProfilePickerScreen";
import { globalStyle } from "../style";
import { Device } from "../types/device";
import { DevicePill } from "../types/device_pill";
import { ProfileDevice } from "../types/profile_device";
import { getDeviceKeyEventType } from "./add_device_screen/typeDefs";
import DeviceHeader from "./DevicePills/components/DeviceHeader";
import { PillBoxManagerStackList } from "./PillBoxManagerNavigator";

type Props = NativeStackScreenProps<PillBoxManagerStackList, "DevicePillsScreen">

type NoDevicesComponentProps = {
	onBackPressed: ()=>void;
	onRechargePressed: ()=>void;
	profileDevice: ProfileDevice;
}

function NoDevicesComponent({ onBackPressed, profileDevice, onRechargePressed }: NoDevicesComponentProps){
    const styles = StyleSheet.create({
        textAndButtonContainer: {
            height: "100%",
			alignItems: "center",
        },
        text: {
            color: "#909090",
            textAlign: "center",
            fontSize: 32
        },
		buttonContainer: {
			position: "absolute",
			bottom: 24
		}
    });

    return (
		<View style={styles.textAndButtonContainer}>
			<DeviceHeader
				onBackPressed={onBackPressed}
				profileDevice = {profileDevice}
			/>
			<Text style={[globalStyle.text, styles.text]}>
				Sua caixa de remédio está vazia, que tal recarregar ela agora?
			</Text>
			<View style = {styles.buttonContainer}>
				<ClickableButton
					width={250}
					height={60}
					onPress={onRechargePressed}
					text="Recarregar"
				/>
			</View>
		</View>
	)
}

function DevicePillsList({ devicePills }: { devicePills: Pill[] }){
    const windowDimensions = useWindowDimensions();
	devicePills.sort((a, b)=>{
		if(a.pillDatetime.getTime() == b.pillDatetime.getTime() && a.pillRoutineKey != b.pillRoutineKey){
			if(a < b){
				return -1;
			} else {
				return 1;
			}
		}

		if(a.pillDatetime.getTime() == b.pillDatetime.getTime() && a.pillRoutineKey == b.pillRoutineKey && a.index != b.index && a.index && b.index){
			return a.index - b.index;
		}

		return a.pillDatetime.getTime() - b.pillDatetime.getTime();
	});

    const dayToWeekday = (day: number)=>{
		switch (day) {
			case 0:
				return "Domingo";
			case 1:
				return "Segunda";
			case 2:
				return "Terça";
			case 3:
				return "Quarta";
			case 4:
				return "Quinta";
			case 5:
				return "Sexta";
			case 6:
				return "Sábado";

		}
    }

	const getDateText = (datetime: Date) => {
		return dayToWeekday(datetime.getDay()) + "   " + datetime.toLocaleDateString().substring(0,5)
	}

	const styles = StyleSheet.create({
		mainContainer: {
			justifyContent: "center",
			alignItems: "center",
			gap: 8
		},
		dateText: {
			fontSize: 20,
			color: "#575757"
		},
		scrollContainer: {
			gap: 24
		},
		scrollView: {
			height: windowDimensions.height - 240,
		}
	})

	let devicePillsByDate: {[key: string]: Pill[]} = {};
	let devicePillsComponent: React.JSX.Element[] = [];

	
	devicePills.forEach(pill => {
		const pillDateStr = pill.pillDatetime.toLocaleDateString();

		if(!devicePillsByDate[pillDateStr]){
			devicePillsByDate[pillDateStr] = []
		}

		devicePillsByDate[pillDateStr].push(pill);
	});

	for (const [pillDatetimeStr, pills] of Object.entries(devicePillsByDate)){
		const pillsOnDateComponent = pills.map((pill, index)=>{
			if(pill.status == "canceled" || pill.status == "pillBoxConfirmed"){
				return;
			}

			return (
				<PillComponent
					key={index}
					pill={pill}
					onPillManualConsumed={()=>{}}
					onPillDelete={()=>{}}
					onPillReeschadule={()=>{}}
				/>
			)
		});

		devicePillsComponent.push((
			<View style={styles.mainContainer}>
				<Text style={[globalStyle.text, styles.dateText]}> {getDateText(pills[0].pillDatetime)} </Text>
				<View style={styles.mainContainer}>
					{ pillsOnDateComponent }
				</View>
			</View>
		))
	}

	return (
		<View style={styles.scrollView}>
			<ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scrollView} persistentScrollbar={true}>
				{ devicePillsComponent }
			</ScrollView>
		</View>
	)
}

export default function DevicePillsScreen({ route, navigation }: Props){
	const { deviceKey } = route.params;
	const [ finishedLoading, setFinishedLoading ] = useState(false);

	const [ devicePills, setDevicePills ] = useState<Pill[] | undefined>();
	const [ profileDevice, setProfileDevice ] = useState<ProfileDevice>();
	const { keycloak } = useKeycloak();
	const { profileKey } = useContext(ProfileKeyContext);
	const [ rechargeWasPressed, setRechargeWasPressed ] = useState(false);
	let startRechargingTimeout: NodeJS.Timeout;

	useFocusEffect(
		useCallback(()=>{
			const loadDevicePills = async () => {
				const accountKey = keycloak?.tokenParsed?.sub;
				const resp = await axios.get(`${MEDICINE_API_HOST}/account/${accountKey}/profile/${profileKey}/pills?loadedOnDevice=${deviceKey}`, {
					headers: {
						Authorization: keycloak?.token
					}
				});

				const tempDevicePills: Pill[] = resp.data.data.map((pill: any) => {
					return {
						index: pill.index,
						name: pill.name,
						pillDatetime: new Date(pill.pillDatetime),
						pillRoutineKey: pill.pillRoutineKey,
						status: pill.status,
						statusEvents: pill.statusEvents
					}
				})
				setDevicePills(tempDevicePills);
			};
			const loadProfileDevices = async () => {
				const accountKey = keycloak?.tokenParsed?.sub;
				const resp = await axios.get(`${MEDICINE_API_HOST}/account/${accountKey}/profile/${profileKey}/profile_devices`, {
					headers: {
						Authorization: keycloak?.token
					}
				});
				setProfileDevice(resp.data.data.find((profileDevice: ProfileDevice) => profileDevice.deviceKey == deviceKey));
			};

			const loadAll = async () => {
				await loadDevicePills();
				await loadProfileDevices();

				setFinishedLoading(true);
			}

			setRechargeWasPressed(false);
			loadAll();

			return ()=>{
				console.log("Clearing startRechargingTimeout timeout");
				clearTimeout(startRechargingTimeout);
			};
		}, [])
	);

	const rechargingTask = async ()=>{
		// TODO implementar um timeout nisso aq, se n conseguir por 5 segundos, da merda
		console.log("Running recharging task");
		if(!profileDevice?.deviceIp){
			return
		}
		// try {
		//	const deviceIp = profileDevice.deviceIp.replace(/\s/g, '');
		//	const endpoint = `http://${deviceIp}/state`; 
		//	const resp = await axios.get(endpoint);
//
//			if(resp.data == 1){
//				navigation.navigate('DeviceRechargeScreen', {
//					deviceKey: deviceKey
//				});
//			}
//		} catch (err) {
//			console.log(err);
//			return;
//		}

		try {
			const deviceIp = profileDevice.deviceIp.replace(/\s/g, '');
			const endpoint = `http://${deviceIp}/start_reloading`; 
			await axios.post(endpoint, {});
		} catch (err) {
			console.log(err);
			return;
		}
	}

	const onRechargePressed = async ()=>{
		if(!profileDevice?.deviceIp){
			return
		}
		try {
			const deviceIp = profileDevice.deviceIp.replace(/\s/g, '');
			const endpoint = `http://${deviceIp}/start_reloading`; 
			await axios.post(endpoint, {});
		} catch (err) {
			console.log(err);
			return;
		}

		console.log("Starting recharging timeout");

		setRechargeWasPressed(true);
		startRechargingTimeout = setTimeout(rechargingTask, 500);
		console.log(deviceKey);
		navigation.navigate("DeviceRechargeScreen", {
			deviceKey: deviceKey
		});

	}

	if(!finishedLoading || !devicePills || !profileDevice){
		return (
			<View>
				<Text style={ globalStyle.text }> Is loading </Text>
			</View>
		)
	}

	if(rechargeWasPressed) {
		return (
			<View>
				<Text style={globalStyle.text}> 
					Trying to recharge
				</Text>
			</View>
		)
	}

	if(profileDevice.devicePills.length == 0){
		return (
			<View>
				<NoDevicesComponent 
					onBackPressed = { navigation.goBack } 
					onRechargePressed = { onRechargePressed }
					profileDevice = { profileDevice }/>
			</View>
		)
	}

	return (
		<View style={{height: "100%"}}>
			<DeviceHeader
				onBackPressed={()=>{}}
				profileDevice = {profileDevice}
				numOfPills = {devicePills.length}
			/>
			<DevicePillsList
				devicePills={devicePills}
			/>
			<View style={styles.rechargeBttn}>
				<ClickableButton
					width={250}
					height={60}
					text={"Recarregar"}
					onPress={ ()=>{onRechargePressed()} }
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	rechargeBttn: {
		position: "absolute",
		bottom: 42,
		right: 42
	}
})
