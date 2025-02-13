export type BleDevice = {
    serviceUuid: string,
    deviceName: string
}

export type Wifi = {
    Ssid: string
}

export enum espProvisionEvent {
    WifiScan = "WifiScan",
    BleScan = "BleScan",
    DeviceConnection = "DeviceConnection",
    DeviceProvision = "DeviceProvision",
	GetDeviceKey = "GetDeviceKey",
}

export enum deviceProvisionEventType {
    ProvisionError = "ProvisionError",
    WrongCredentials = "WrongCredentials",
    ProvisionSuccess = "ProvisionSuccess"
}

export enum bleScanEventType {
    BleScanStartFailed = "BleScanStartFailed",
    BleScanFailed = "BleScanFailed",
    BleDeviceFound = "BleDeviceFound",
    BleScanCompleted = "BleScanCompleted",
}

export enum wifiScanEventType {
    WifiListReceived = "WifiListReceived",
    WifiScanFailed = "WifiScanFailed",
}

export enum deviceConnectionEventType {
    DeviceConnected = "DeviceConnected",
    DeviceConnectionFailed = "DeviceConnectionFailed",
    DeviceDisconnected = "DeviceDisconnected",
}

export enum getDeviceKeyEventType {
	DeviceKeyReceived = "DeviceKeyReceived",
	DeviceKeyFailed = "DeviceKeyFailed",
}

export enum bluetoothEventType {
    permissionGranted = "permissionGranted",
    bluetoothEnabled = "bluetoothEnabled",
    bluetoothDisabled = "bluetoothDisabled",
}

export enum userEventType {
    pillDeviceSelected = "pillDeviceSelected",
    retryBleDeviceScan = "retryBleDeviceScan",
    retryWifiScan = "retryWifiScan",
    wifiCredentialReceived = "wifiCredentialReceived"
};

export enum initialStateEvent {
    initial = "initial"
};

export enum provisionStateType {
    initial = "initial",
    pendingPermissions = "pendingPermissions",
    pendingBluetoothEnable = "pendingBluetoothEnable",
    scanningPillDevices = "scanningPillDevices",
    selectingPillDevice = "selectingPillDevice", 
    connectingToPillDevice = "connectingToPillDevice",
	retrievingDeviceKey = "retrievingDeviceKey",
    scanningWifis = "scanningWifis",
    selectingWifi = "selectingWifi",
    provisioningDevice = "provisioningDevice",
    provisionWrongPassword = "provisionWrongPassword",
    provisionError = "provisionError",
    finished = "finished",
};

export enum ProvisionActionType {
    initialState = "initialState",
    provisionEvent = "provisionEvent",
}

export type ActionPayload = {
    event: deviceProvisionEventType | espProvisionEvent | bleScanEventType | wifiScanEventType | deviceConnectionEventType | bluetoothEventType | userEventType | ProvisionActionType | initialStateEvent | getDeviceKeyEventType, 
    data?: any
}

export type ProvisionAction = {
    type: ProvisionActionType,
    payload: ActionPayload
}
