package com.pillboxapp;

import android.Manifest;
import android.annotation.SuppressLint;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.le.ScanRecord;
import android.bluetooth.le.ScanResult;
import android.content.pm.PackageManager;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.espressif.provisioning.ESPConstants;
import com.espressif.provisioning.ESPDevice;
import com.espressif.provisioning.ESPProvisionManager;
import com.espressif.provisioning.WiFiAccessPoint;
import com.espressif.provisioning.DeviceConnectionEvent;
import com.espressif.provisioning.listeners.BleScanListener;
import com.espressif.provisioning.listeners.ResponseListener;
import com.espressif.provisioning.listeners.WiFiScanListener;
import com.espressif.provisioning.listeners.ProvisionListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Promise;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import javax.annotation.Nullable;

public class EspProvisioningModule extends ReactContextBaseJavaModule {
    BleScanListener bleScanListener;
    WiFiScanListener wifiScanListener;
    ProvisionListener provisionListener;
    Map<String, BluetoothDevice> devicesByUuid = new HashMap<String, BluetoothDevice>();
    ESPDevice espDevice;

    private ReactApplicationContext currentContext;

    EspProvisioningModule(ReactApplicationContext context) {
        super(context);
        currentContext = context;
        wifiScanListener = new WiFiScanListener() {
            public void onWifiListReceived(ArrayList<WiFiAccessPoint> wifiList) {
                WritableMap params = Arguments.createMap();
                params.putString("eventType", "WifiListReceived");

                WritableArray wifiMaps = Arguments.createArray();

                Log.i("WifiListener", "Wifi List Received");

                for (WiFiAccessPoint wifiAccessPoint : wifiList) {
                    WritableMap wifiMap = Arguments.createMap();
                    wifiMap.putString("Ssid", wifiAccessPoint.getWifiName());
                    wifiMaps.pushMap(wifiMap);
                }
                params.putArray("data", wifiMaps);

                sendEvent("WifiScan", params);
            }

            public void onWiFiScanFailed(Exception e) {
                WritableMap params = Arguments.createMap();
                params.putString("eventType", "WifiScanFailed");

                params.putString("data", "Scan failed with exception " + e.toString());

                sendEvent("WifiScan", params);
            }
        };
        bleScanListener = new BleScanListener() {
            public void scanStartFailed() {
                ESPProvisionManager.getInstance(currentContext).stopBleScan();

                WritableMap params = Arguments.createMap();
                params.putString("eventType", "BleScanStartFailed");

                params.putString("data", "The scan failed starting, be sure to activate BLE and request permissions");
                sendEvent("BleScan", params);
            }

            public void onPeripheralFound(BluetoothDevice device, ScanResult scanResult) {
                Log.i("BleScanner", "Found peripheral");
                WritableMap params = Arguments.createMap();
                params.putString("eventType", "BleDeviceFound");

                ScanRecord scanRecord = scanResult.getScanRecord();
                String mainUuidStr = scanRecord.getServiceUuids().get(0).toString();
                if (!devicesByUuid.containsKey(mainUuidStr)) {
                    devicesByUuid.put(mainUuidStr, device);
                    WritableMap deviceMap = Arguments.createMap();
                    deviceMap.putString("deviceName", scanRecord.getDeviceName());
                    deviceMap.putString("serviceUuid", mainUuidStr);

                    params.putMap("data", deviceMap);

                    sendEvent("BleScan", params);
                }
            }

            @SuppressLint("MissingPermission")
            public void scanCompleted() {
                WritableMap params = Arguments.createMap();
                params.putString("eventType", "BleScanCompleted");

                WritableArray devicesMaps = Arguments.createArray();
                Log.i("BleScanner", "Scan Completed");
                for (String serviceUuid : devicesByUuid.keySet()) {
                    WritableMap wifiMap = Arguments.createMap();
                    wifiMap.putString("deviceName", devicesByUuid.get(serviceUuid).getName());
                    wifiMap.putString("serviceUuid", serviceUuid);

                    devicesMaps.pushMap(wifiMap);
                }
                params.putArray("data", devicesMaps);

                sendEvent("BleScan", params);
            }

            public void onFailure(Exception e){
                ESPProvisionManager.getInstance(currentContext).stopBleScan();

                WritableMap params = Arguments.createMap();
                params.putString("eventType", "BleScanFailed");

                params.putString("data", "Scan failed with exception " + e.toString());
                sendEvent("BleScan", params);
            }
        };
        provisionListener = new ProvisionListener() {
            public void createSessionFailed(Exception e){
                WritableMap params = Arguments.createMap();
                params.putString("eventType", "ProvisionError");

                params.putString("data", "Provision failed to create session");
                sendEvent("DeviceProvision", params);
            }

            public void wifiConfigSent(){
                Log.i("wifiConfigSent", "wifiConfigSent");
            }

            public void wifiConfigFailed(Exception e){
                WritableMap params = Arguments.createMap();
                params.putString("eventType", "ProvisionError");

                params.putString("data", "Failed to send wifi config to device");
                sendEvent("DeviceProvision", params);
            }

            public void wifiConfigApplied(){
                Log.i("wifiConfigApplied", "wifiConfigApplied");
            }

            public void wifiConfigApplyFailed(Exception e){
                WritableMap params = Arguments.createMap();
                params.putString("eventType", "ProvisionError");

                params.putString("data", "Failed apply the wifi config into the device");
                sendEvent("DeviceProvision", params);
            }

            public void provisioningFailedFromDevice(ESPConstants.ProvisionFailureReason failureReason){
                if(failureReason == ESPConstants.ProvisionFailureReason.AUTH_FAILED) {
                    WritableMap params = Arguments.createMap();
                    params.putString("eventType", "WrongCredentials");

                    params.putString("data", "Wrong password");
                    sendEvent("DeviceProvision", params);
                    return;
                }

                WritableMap params = Arguments.createMap();
                params.putString("eventType", "ProvisionError");

                params.putString("data", "Wifi not found or device disconnected");
                sendEvent("DeviceProvision", params);
            }

            public void deviceProvisioningSuccess(){
                WritableMap params = Arguments.createMap();
                params.putString("eventType", "ProvisionSuccess");

                params.putString("data", "Success provisioning");
                sendEvent("DeviceProvision", params);
            }

            public void onProvisioningFailed(Exception e){
                WritableMap params = Arguments.createMap();
                params.putString("eventType", "ProvisionError");

                params.putString("data", "Provisioning failed");
                sendEvent("DeviceProvision", params);
            }
        };

        EventBus.getDefault().register(this);
    }

    private void sendEvent(String eventName){
        currentContext.getJSModule(ReactContext.RCTDeviceEventEmitter.class).emit(eventName, null);
    }
    private void sendEvent(String eventName, WritableMap params){
        currentContext.getJSModule(ReactContext.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
    private void sendEvent(String eventName, WritableArray params){
        currentContext.getJSModule(ReactContext.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    private boolean isPermisionGranted(){
        return ContextCompat.checkSelfPermission(currentContext, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onDeviceConnectionEvent(DeviceConnectionEvent event){
        WritableMap params = Arguments.createMap();
        if (event.getEventType() == ESPConstants.EVENT_DEVICE_CONNECTED){
            params.putString("eventType", "DeviceConnected");
            sendEvent("DeviceConnection", params);
        } else if (event.getEventType() == ESPConstants.EVENT_DEVICE_CONNECTION_FAILED) {
            params.putString("eventType", "DeviceConnectionFailed");
            sendEvent("DeviceConnection", params);
        } else if (event.getEventType() == ESPConstants.EVENT_DEVICE_DISCONNECTED) {
            params.putString("eventType", "DeviceDisconnected");
            sendEvent("DeviceConnection", params);
        }
    }


    @Override
    public String getName() {
        return "EspProvisioningModule";
    }

    @ReactMethod
    public void serchBleEspDevices(String prefix, Promise promise) {
        if (!isPermisionGranted()){
            promise.reject("Failed", "Please turn on the permissions");
            return;
        }
        promise.resolve(null);
        ESPProvisionManager.getInstance(currentContext).searchBleEspDevices(prefix, bleScanListener);
    }

    @ReactMethod
    public void stopBleScan(){
        ESPProvisionManager.getInstance(currentContext).stopBleScan();
    }

    @ReactMethod
    public void connectBleDevice(String serviceUuid, String pop){
        espDevice = ESPProvisionManager.getInstance(currentContext).createESPDevice(ESPConstants.TransportType.TRANSPORT_BLE, ESPConstants.SecurityType.SECURITY_1);

        BluetoothDevice bluetoothDevice = devicesByUuid.get(serviceUuid);
        espDevice.setProofOfPossession(pop);
        espDevice.connectBLEDevice(bluetoothDevice, serviceUuid);
    }

    @ReactMethod
    public void scanNetworks(){
        espDevice.scanNetworks(wifiScanListener);
    }

    @ReactMethod
    public void sendWifiConfig(String ssid, String passphrase){
        espDevice.provision(ssid, passphrase, provisionListener);
    }

    @ReactMethod
    public void getDeviceKey(){
        byte[] data = {0b0};
        espDevice.sendDataToCustomEndPoint("custom-data", data, new ResponseListener() {
            @Override
            public void onSuccess(byte[] bytes) {
                WritableMap params = Arguments.createMap();
                params.putString("eventType", "DeviceKeyReceived");
                params.putString("data", new String(bytes, StandardCharsets.UTF_8));
                sendEvent("GetDeviceKey", params);
            }

            @Override
            public void onFailure(Exception e) {
                WritableMap params = Arguments.createMap();
                params.putString("eventType", "DeviceKeyFailed");
                sendEvent("GetDeviceKey", params);
            }
        });
    }
}
