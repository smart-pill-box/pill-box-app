// 1) Checar Permissões
// 2) Ligar Bluetooth
// 3) Escaneia dispositivos IOT (startBleScan(prefix, promise))
//      - eventos "scanBle"
//          - scanStartFailed {"status": 0, "message": "Bluetooth scan start failed"}
//          - onFailure {"status": 0, "message": exception }
//          - scanCompleted {"status": 1}
//          - onPeripheralFound [ {"deviceName": "name", "serviceUuid": "uuid"} ]
// 4) Conecta no dispositivo (connectDevice(uuid, pop, promise))
//      - eventos "connection"
//          - {"status": numero}
//              - EVENT_DEVICE_CONNECTED: numero = 1;
//              - EVENT_DEVICE_CONNECTION_FAILED: numero = 2;
//              - EVENT_DEVICE_DISCONNECTED: numero = 3;
// 5) Lista as wifi's que o dispositivo observa (startWifiScan(promise))
//      - eventos "scanWifi"
//          - onWifiListReceived [ {"ssid": "ssid", "auth": "auth", "rssi": "rssi"} ]
//          - onWiFiScanFailed {"status": 0, "message": exception}
// 6) Provisiona (doProvisioning(ssid, password, promise))
//      - eventos "provisioning"
//          - createSessionFailed {"status": 0, "message": exception}
//          - wifiConfigFailed {"status": 2, "message": exception}
//          - wifiConfigApplied {"status": 3}
//          - wifiConfigApplyFailed {"status": 4, "message": exception}
//          - deviceProvisioningSuccess {"status": 5}
//          - provisioningFailedFromDevice {"status": 6, "message": failure_reason}
//          - onProvisioningFailed {"status": 6, "message": exception}
//
import { useReducer, useEffect, useState } from 'react';
import {
    PermissionsAndroid,
    SafeAreaView,
    Text,
    View,
    NativeEventEmitter,
    NativeModules,
    Button,
  } from 'react-native';

import BleManager, { BleEventType } from 'react-native-ble-manager';
import {
    espProvisionEvent, 
    bleScanEventType, 
    wifiScanEventType, 
    deviceConnectionEventType,
    bluetoothEventType, 
    provisionStateType,
    userEventType,
    ProvisionActionType,
    BleDevice,
    Wifi,
    ProvisionAction,
    initialStateEvent,
    deviceProvisionEventType
} from "./typeDefs"
import BleDevicesList from "./components/BleDeviceList"
import WifisList from './components/WifiList';
import { globalStyle } from '../../style';
import PendingPermissions from './components/PendingPermissions';
import PendingBluetoothEnable from './components/PendingBluetoothEnabled';
import Loading from './components/Loading';

const EspProvisioningModule = NativeModules.EspProvisioningModule;
const espProvisioningEmitter = new NativeEventEmitter(EspProvisioningModule);

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const isPermissionGranted = async () => {
    try {
        const is_granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        return is_granted;
    }
    catch (e){
        console.warn("Error checking permissions");
        return false;
    }
};
const isBluetoothEnabled = async () => {
    try {
        const bleState = await BleManager.checkState();
        if (bleState == "on"){
            return true;
        } else {
            return false;
        }

    } catch (e){
        console.warn(e);
    }
};

export default function AddDeviceScreen() {
    const [bleDevices, setBleDevices] = useState([]);
    const [selectedBleDevice, setSelectedBleDevice] = useState<BleDevice>({
        serviceUuid: "", deviceName: ""
    });
    const [wifisList, setWifisList] = useState([]);
    const [selectedWifiCredentials, setSelectedWifiCredentials] = useState<{wifi: Wifi, password: string}>();
    const [provisioningState, dispatch] = useReducer(provisioningStateReducer, provisionStateType.initial);

    function provisioningStateReducer(provisioningState: provisionStateType, action: ProvisionAction){
        if (action.type == ProvisionActionType.initialState){
            return action.payload.data;
        } else if (action.type == ProvisionActionType.provisionEvent) {
            let event = action.payload.event;
    
            switch (provisioningState) {
                case provisionStateType.pendingPermissions:
                    if (event == bluetoothEventType.permissionGranted){
                        return provisionStateType.pendingBluetoothEnable;
                    } 
                case provisionStateType.pendingBluetoothEnable:
                    if (event == bluetoothEventType.bluetoothEnabled){
                        return provisionStateType.scanningPillDevices;
                    } 
                case provisionStateType.scanningPillDevices:
                    if (event == bleScanEventType.BleScanCompleted){
                        setBleDevices(action.payload.data);
                        return provisionStateType.selectingPillDevice;
                    }
                case provisionStateType.selectingPillDevice:
                    if (event == userEventType.pillDeviceSelected){
                        console.log(action.payload.data);
                        setSelectedBleDevice(action.payload.data);
                        return provisionStateType.connectingToPillDevice;
                    } else if(event == userEventType.retryBleDeviceScan){
                        return provisionStateType.scanningPillDevices;
                    }
                case provisionStateType.connectingToPillDevice:
                    if (event == deviceConnectionEventType.DeviceConnected){
                        return provisionStateType.scanningWifis
                    } 
                case provisionStateType.scanningWifis:
                    if (event == wifiScanEventType.WifiListReceived){
                        setWifisList(action.payload.data);
                        return provisionStateType.selectingWifi;
                    }
                case provisionStateType.selectingWifi:
                    if (event == userEventType.wifiCredentialReceived){
                        setSelectedWifiCredentials({
                            wifi: action.payload.data.wifi,
                            password: action.payload.data.password
                        })
                        return provisionStateType.provisioningDevice;
                    } 
                case provisionStateType.provisioningDevice:
                    if (event == deviceProvisionEventType.ProvisionError){
                        return provisionStateType.provisionError;
                    } else if (event == deviceProvisionEventType.WrongCredentials){
                        return provisionStateType.provisionWrongPassword;
                    } else if (event == deviceProvisionEventType.ProvisionSuccess) {
                        return provisionStateType.finished;
                    }
            }
            return provisioningState;
        }
    };

    const setInitialState = async () => {
        let initialState = provisionStateType.pendingPermissions;
        let permissionGranted = await isPermissionGranted();
        let bleEnabled = await isBluetoothEnabled();
    
        if (permissionGranted){
            initialState = provisionStateType.pendingBluetoothEnable;
            if (bleEnabled){
                initialState = provisionStateType.scanningPillDevices;
            }
        }
        console.log("Initial State is ", initialState);
        dispatch({ type: ProvisionActionType.initialState, payload: {event: initialStateEvent.initial, data: initialState} });
    };

    useEffect(() => {
        let bleUpdateListener = bleManagerEmitter.addListener("BleManagerDidUpdateState", (args) => {
            const newState = args.state;
            if (newState == "on") {
                dispatch({ type: ProvisionActionType.provisionEvent, payload: {event: bluetoothEventType.bluetoothEnabled} });
            } else {
                dispatch({ type: ProvisionActionType.provisionEvent, payload: {event: bluetoothEventType.bluetoothDisabled} });
            }
        });

        let espProvisionBleScanListener = espProvisioningEmitter.addListener(espProvisionEvent.BleScan, (args) => {
            switch (args.eventType){
                case bleScanEventType.BleDeviceFound:
                    break;
                    case bleScanEventType.BleScanCompleted:
                    dispatch({
                        type: ProvisionActionType.provisionEvent, 
                        payload: {
                            event: bleScanEventType.BleScanCompleted, 
                            data: args.data
                        }
                    });
                    break;
                case bleScanEventType.BleScanFailed:
                    console.log("Ble scan failed");
                    break;
                case bleScanEventType.BleScanStartFailed:
                    console.log("Ble scan start failed");
                    break;
            }
        });
        let espProvisionWifiScanListener = espProvisioningEmitter.addListener(espProvisionEvent.WifiScan, (args) => {
            switch (args.eventType){
                case wifiScanEventType.WifiListReceived:
                    console.log("Wifi list received");
                    console.log(args.data);
                    dispatch({
                        type: ProvisionActionType.provisionEvent, 
                        payload: {
                            event: wifiScanEventType.WifiListReceived, 
                            data: args.data
                        }
                    });
                case wifiScanEventType.WifiScanFailed:
                    break;
            }
        });
        let espProvisionDeviceConnectionListener = espProvisioningEmitter.addListener(espProvisionEvent.DeviceConnection, (args) => {
            switch (args.eventType) {
                case deviceConnectionEventType.DeviceConnected:
                    dispatch({
                        type: ProvisionActionType.provisionEvent, 
                        payload: {
                            event: deviceConnectionEventType.DeviceConnected
                        }
                    });
                    break;
                case deviceConnectionEventType.DeviceConnectionFailed:
                    console.log("Failed connecting");
                    break;
                case deviceConnectionEventType.DeviceDisconnected:
                    console.log("Device disconnected");
                    break;
            }
        });

        let espDeviceProvisioningListener = espProvisioningEmitter.addListener(espProvisionEvent.DeviceProvision, (args) => {
            switch(args.eventType) {
                case deviceProvisionEventType.ProvisionError:
                    dispatch({
                        type: ProvisionActionType.provisionEvent,
                        payload: {
                            event: deviceProvisionEventType.ProvisionError
                        }
                    })
                    break;
                
                case deviceProvisionEventType.WrongCredentials:
                    dispatch({
                        type: ProvisionActionType.provisionEvent,
                        payload: {
                            event: deviceProvisionEventType.WrongCredentials
                        }
                    })
                    break;

                case deviceProvisionEventType.ProvisionSuccess:
                    dispatch({
                        type: ProvisionActionType.provisionEvent,
                        payload: {
                            event: deviceProvisionEventType.ProvisionSuccess
                        }
                    })
                    break;
            }
        })

        BleManager.start().then(()=>{
            setInitialState();
        }).catch((error)=>{
            console.error(error);
        });

        return ()=>{
            bleUpdateListener.remove();
            espProvisionBleScanListener.remove();
            espProvisionWifiScanListener.remove();
            espProvisionDeviceConnectionListener.remove();
            espDeviceProvisioningListener.remove();
        }
    }, []);

    useEffect(()=>{
        if (provisioningState == provisionStateType.pendingPermissions){
            console.log("I will request permissions");
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
                console.log("Permissions was " + permissionStatus);
                if (permissionStatus == PermissionsAndroid.RESULTS.GRANTED){
                    dispatch({type: ProvisionActionType.provisionEvent, payload: {event: bluetoothEventType.permissionGranted}});
                }
            }).catch((err)=>{
                console.error("Error requesting permission " + err);
            });
        } else if(provisioningState == provisionStateType.scanningPillDevices){
            EspProvisioningModule.serchBleEspDevices("MY_").then().catch(()=>{
                console.log("DEU MERDA CARAIO");
                setInitialState();
            })
        } else if(provisioningState == provisionStateType.connectingToPillDevice){
            EspProvisioningModule.connectBleDevice(selectedBleDevice.serviceUuid, "pop");
        } else if(provisioningState == provisionStateType.scanningWifis){
            EspProvisioningModule.scanNetworks();
        } else if(provisioningState == provisionStateType.provisioningDevice){
            EspProvisioningModule.sendWifiConfig(selectedWifiCredentials?.wifi.Ssid, selectedWifiCredentials?.password)
        }
    }, [provisioningState])

    const onPillDeviceSelected = (bleDevice: BleDevice) => {
        dispatch({
            type: ProvisionActionType.provisionEvent,
            payload: {
                event: userEventType.pillDeviceSelected,
                data: bleDevice
            }
        });
    };

    const onBleScanRetryPressed = () => {
        dispatch({
            type: ProvisionActionType.provisionEvent,
            payload: {
                event: userEventType.retryBleDeviceScan
            }
        });
    };

    const onWifiCredentialReceived = (wifi: Wifi, password: string) => {
        dispatch({
            type: ProvisionActionType.provisionEvent,
            payload: {
                event: userEventType.wifiCredentialReceived,
                data: {
                    wifi: wifi,
                    password: password
                }
            }
        })
    };

    const onWifiScanRetryPressed = () => {
        dispatch({
            type: ProvisionActionType.provisionEvent,
            payload: {
                event: userEventType.retryWifiScan
            }
        });
    };

    return (
        <View>
            {provisioningState == provisionStateType.pendingPermissions && (
                <PendingPermissions 
                    onBackPressed={()=>{}} 
                    onPermissionsGranted={()=>{
                        dispatch({type: ProvisionActionType.provisionEvent, payload: {event: bluetoothEventType.permissionGranted}});
                    }}
                />
            )}
            {provisioningState == provisionStateType.pendingBluetoothEnable && (
                <PendingBluetoothEnable 
                    onBackPressed={()=>{}}
                />
            )}
            {provisioningState == provisionStateType.scanningPillDevices && (
                <Loading
                    onBackPressed={()=>{}}
                    message="Buscando dispositivos ..."
                />
            )}
            {provisioningState == provisionStateType.selectingPillDevice && (
                <BleDevicesList
                    bleDevices={bleDevices}
                    onPillDeviceSelected={onPillDeviceSelected}
                    onRetryPressed={onBleScanRetryPressed}
                    onBackPressed={()=>{}}
                />
            )}
            {provisioningState == provisionStateType.connectingToPillDevice && (
                <Loading
                    onBackPressed={()=>{}}
                    message={"Conectando ao dispositivo " + selectedBleDevice.deviceName}
                />
            )}
            {provisioningState == provisionStateType.scanningWifis && (
                <Loading
                    onBackPressed={()=>{}}
                    message="Buscando redes Wifi ..."
                />
            )}
            {provisioningState == provisionStateType.selectingWifi && (
                <WifisList
                    onBackPressed={()=>{}}
                    wifisList={wifisList}
                    onCredentialReceived={onWifiCredentialReceived}
                    onRetryPressed={onWifiScanRetryPressed}
                />
            )
            }
            (provisionState == provisionStateType.provisioningDevice && (
                <Loading 
                    onBackPressed={()=>{}}
                    message="Conectando ..."
                />
            ))
            (provisionState == provisionStateType.provisionWrongPassword && (
                
            ))
            (provisionState == provisionStateType.provisionError && (

            ))
            (provisionState == provisionStateType.finished && (

            ))
        </View>
    )
};
