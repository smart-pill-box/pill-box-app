import { useKeycloak } from '@react-keycloak/native';
import uuid from 'react-native-uuid';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import axios, { AxiosError } from 'axios';
import { addDays, isAfter } from 'date-fns';
import { startTransition, useCallback, useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { MEDICINE_API_HOST } from '../../constants';
import { ProfileKeyContext } from '../../profile_picker/ProfileKeyContext';
import { Pill } from '../../pill_calendar/PillCalendarScreen'
import { Profile } from '../../profile_picker/ProfilePickerScreen';
import { ProfileDevice } from '../../types/profile_device';
import DeviceHeader from '../DevicePills/components/DeviceHeader';
import { PillBoxManagerStackList } from '../PillBoxManagerNavigator'
import { globalStyle } from '../../style';
import PillIcon from '../../components/bottomTabIcons/PillIcon';
import ClickablePointer from '../../components/ClickablePointer';
import ClickableButton from '../../components/ClickabeButton';

// Buscar os remédios com status idle desse perfil mês a mês até que complete 20 remédios ou complete um ano
// Criar uma lista ordenada com esses remédios
// Decidir quantos desses remédios da lista serão tomados na próxima iteração
// Tirar os remédios adicionados após adiciona-los
// Buscar esse device para ver quanto espaço ele tem

type Props = NativeStackScreenProps<PillBoxManagerStackList, "DeviceRechargeScreen">;
let currentDevicePillKey: string;
let loadingPillInterval: NodeJS.Timeout;

export default function DeviceRechargeScreen({ route, navigation }: Props){
	const { deviceKey } = route.params;
	const { keycloak } = useKeycloak();
	const [ finishedLoading, setFinishLoading ] = useState(false);
	const { profileKey } = useContext(ProfileKeyContext);
	const [ profileDevice, setProfileDevice ] = useState<ProfileDevice | undefined>(undefined);
	const [ pillsToLoad, setPillsToLoad ] = useState<Pill[]>([]);
	const [ numOfLoadedPills, setNumOfLoadedPills ] = useState(0);
	const [ isLoadingPill, setIsLoadingPill ] = useState(false);
	
    useFocusEffect(
        useCallback(()=>{
			const getProfileDevices = async () => {
				const accountKey = keycloak?.tokenParsed?.sub;
				try {
					const { data } = await axios.get(`${MEDICINE_API_HOST}/account/${accountKey}/profile/${profileKey}/profile_devices`, {
						headers: {
							Authorization: keycloak?.token
						}
					});
					
					setProfileDevice(data.data.find((profileDevice: ProfileDevice) => profileDevice.deviceKey == deviceKey));
				} catch (err) {
					console.error(err);
				}
			}


			const loadAll = async ()=> {
				await getProfileDevices();
			}

			loadAll();

			return ()=>{
				console.log("Clearing the timeout1");
				clearInterval(loadingPillInterval);
			}
        }, [])
    );

	useEffect(()=>{
		const getProfilePills = async () => {
			const accountKey = keycloak?.tokenParsed?.sub;
			if (!profileDevice) {
				return;
			}

			setNumOfLoadedPills(profileDevice.devicePills.length);

			let fromDate = new Date();
			let toDate = addDays(fromDate, 30);

			let monthsIterated = 0;
			let spaceLeft = profileDevice.maxPositions - profileDevice.devicePills.length - 1;

			let tempPillsToLoad: Pill[] = [];

			while (spaceLeft > 0 && monthsIterated < 12) {
				fromDate = addDays(fromDate, 30 * monthsIterated);
				toDate = addDays(fromDate, 30);

				let queryParams = "fromDate=" + getLocalDateString(fromDate) + "&toDate=" + getLocalDateString(toDate);
				const response = await axios.get(`${MEDICINE_API_HOST}/account/${accountKey}/profile/${profileKey}/pills?${queryParams}`, {
					headers: {
						Authorization: keycloak?.token
					}
				});

				response.data.data.forEach((pill: Pill) => {
					const pillDatetime = new Date(pill.pillDatetime);

					if(pill.status != "pending"){
						return;
					}

					tempPillsToLoad.push({
						index: pill.index,
						pillDatetime: pillDatetime,
						name: pill.name,
						pillRoutineKey: pill.pillRoutineKey,
						status: pill.status,
						statusEvents: pill.statusEvents
					});
					spaceLeft -= 1;
				});
				monthsIterated += 1;
			}

			tempPillsToLoad.sort((a, b)=>{
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
			setPillsToLoad(tempPillsToLoad);
			console.log(tempPillsToLoad);
			setFinishLoading(true);
		};

		getProfilePills();
	}, [profileDevice])

	useEffect(()=>{
		const setPillsAndPrepareToLoad = async () => {
			if(!profileDevice?.deviceIp){
				return;
			}

			try {
				const deviceIp = profileDevice.deviceIp.replace(/\s/g, '');
				const endpoint = `http://${deviceIp}/will_load_pill`;
				currentDevicePillKey = uuid.v4().toString();
				const body = {
					pill_key: currentDevicePillKey,
					pill_datetime: pillsToLoad[0].pillDatetime.toISOString()
				}
				console.log(body)
				await axios.post(endpoint, body);
			} catch (err) {
				console.log(err);
				return;
			}
		};

		setPillsAndPrepareToLoad();
	}, [pillsToLoad])

	const generateInsertPillsText = ()=>{
		let pillsText = "";
		
		let quantityByPillName: {[key: string]: number} = {};
		quantityByPillName[pillsToLoad[0].name] = 1;

		let isFirstPill = true;
		for(const [name, quantity] of Object.entries(quantityByPillName)){
			if(!isFirstPill){
				pillsText += ", ";
			}
			isFirstPill = false;
			pillsText += `${quantity} ${name}`;
		}
		return pillsText;
	}

	const insertPillAndFinish = () => {

	}

	const onCancel = () => {
		navigation.goBack();
	}

	const loadingPillTask = async (pill: Pill)=>{
		// TODO colocar um limite de retentativas
		console.log("LOOPING");

		const accountKey = keycloak?.tokenParsed?.sub;
		const pillString = `${pill.pillDatetime.toISOString()}I${pill.index}`

		const endpoint = `${MEDICINE_API_HOST}/account/${accountKey}/profile/${profileKey}/pill_routine/${pill.pillRoutineKey}/pill/${pillString}/status`


		console.log("Device pill key is " + currentDevicePillKey);
		try {

			const { data, status } = await axios.put(endpoint, {
				status: "loaded",
				devicePillKey: currentDevicePillKey

			}, {
				headers: {
					Authorization: keycloak?.token
				}
			});
			if(status == 201) {
				console.log("SUCCESS, CLEARING TIMEOUT");
				setIsLoadingPill(false);
				clearInterval(loadingPillInterval);
				onNextPillLoadedWithSuccess();
			}
		} catch(err: AxiosError | any){
			if((!axios.isAxiosError(err) && err.response?.status == 404 && err.response?.data.code == "ERR00018")){
				throw(err);
			}

		}	
	};

	const onNextPillLoadedWithSuccess = async () => {
		if(!profileDevice?.deviceIp){
			return;
		}
		
		setPillsToLoad((pillsToLoad)=>{
			const newPillsToLoad = [
				...pillsToLoad
			];

			newPillsToLoad.shift()

			return newPillsToLoad;
		});
		setNumOfLoadedPills(old => old+1);
	}

	const onNextPill = async () => {
		if(!profileDevice?.deviceIp){
			return;
		}

		setIsLoadingPill(true);
		loadingPillInterval = setInterval(loadingPillTask, 500, pillsToLoad[0]);
		// TODO ativar animação de carregando e desativar esse botão

		try {
			const deviceIp = profileDevice.deviceIp.replace(/\s/g, '');
			const endpoint = `http://${deviceIp}/load_pill`; 
			console.log(endpoint);
			await axios.post(endpoint);
		} catch (err) {
			console.log(err);
			return;
		}

	}

	if(!finishedLoading || !profileDevice){
		return (
			<View>
			</View>
		)
	}

	if(isLoadingPill){
		return (

			<View style={{ height: '100%' }}>
				<DeviceHeader 
					profileDevice={profileDevice}
					onBackPressed={()=>{navigation.goBack()}}
					numOfPills={numOfLoadedPills}
				/>
				<Text style={[globalStyle.text, { fontSize: 24 }]}>
					Carregando ...
				</Text>
			</View>
		)
	}

	return (
		<View style={{ height: '100%' }}>
			<DeviceHeader 
				profileDevice={profileDevice}
				onBackPressed={()=>{navigation.goBack()}}
				numOfPills={numOfLoadedPills}
			/>
			<View style={styles.mainContainer}>
				<View style = {styles.textContainer}>
					<Text style = {[globalStyle.text, styles.mainText]}>
						Insira <Text style={[globalStyle.text, styles.insertText]}>{generateInsertPillsText()}</Text> na caixa de remédios 
					</Text>
				</View>
				
				{numOfLoadedPills < profileDevice.maxPositions && (
					<TouchableOpacity style={styles.nextPillContainer} onPress={onNextPill}>
						<Text style={[globalStyle.text, styles.nextText]}>
							Próximo
						</Text>
						<PillIcon
							focused={true}
							size={32}
							color={'#000000'}
						/>
						<View style={styles.pointerContainer}>
							<ClickablePointer
								width={32}
								height={32}
								onPress={()=>{}}
								orientation={'right'}
							/>
						</View>
					</TouchableOpacity>
				)}

				<View style={styles.bottomButtonsContainer}>
					<ClickableButton
						buttonStyle={styles.cancelBttn}
						width={'auto'}
						height={'100%'}
						onPress={onCancel}
						text={'Cancelar'}
						bttnContainerStyle={styles.bttnContainer}
						textStyle={styles.cancelBtnText}
					/>
					<ClickableButton
						buttonStyle={styles.finishBttn}
						width={'auto'}
						height={'100%'}
						onPress={()=>{}}
						text={'Concluir'}
						bttnContainerStyle={styles.bttnContainer}
					/>
				</View>
			</View>
		</View>
	)
}

const getLocalDateString = (date: Date)=>{
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const styles = StyleSheet.create({
	mainContainer: {
		paddingHorizontal: 12,
		height: '100%'
	},
	textContainer: {
		marginTop: 24,
		width: '100%'
	},
	mainText: {
		textAlign: 'center',
		color: '#575757',
		fontSize: 32
	},
	insertText: {
		color: '#575757',
		textDecorationLine: 'underline',
		fontWeight: '800',
		fontSize: 32
	},
	nextPillContainer: {
		position: 'absolute',
		width: 220,
		borderTopLeftRadius: 24,
		borderBottomLeftRadius: 24,
		height: 72,
		right: 0,
		bottom: 280,
		borderColor: 'black',
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		gap: 8
	},
	pointerContainer: {
		paddingLeft: 24
	},
	nextText: {
		fontSize: 24
	},
	bottomButtonsContainer: {
		position: 'absolute',
		alignSelf: 'center',
		width: '100%',
		height: 66,
		bottom: 140,
		flexDirection: 'row',
		gap: 24
	},
	bttnContainer: {
		flex: 1
	},
	cancelBttn: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#DF9090",
        backgroundColor: "transparent",
	},
	cancelBtnText: {
		color: '#575757'	
	},
	finishBttn: {
        borderRadius: 16,
	}
})
