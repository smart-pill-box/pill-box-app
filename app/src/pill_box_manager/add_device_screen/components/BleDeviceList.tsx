import { useReducer, useEffect, useState } from 'react';
import {
    PermissionsAndroid,
    SafeAreaView,
    Text,
    View,
    ScrollView,
    NativeModules,
    Button,
    StyleSheet,
  } from 'react-native';

import { BleDevice } from '../typeDefs';
import { globalStyle } from '../../../style';
import ClickableButton from '../../../components/ClickabeButton';
import BackArrow from '../../../components/BackArrow';

type Props = {
    bleDevices: BleDevice[];
    onPillDeviceSelected: (bleDevice: BleDevice)=>void;
    onRetryPressed: ()=>void;
    onBackPressed: ()=>void;
}

const BleDevicesList = ({bleDevices, onPillDeviceSelected, onRetryPressed, onBackPressed}: Props) => {
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
        noDevicesText: {
            textAlign: "center",
            fontSize: 32,
            color: "#909090",
        },
        noDevicesContainer: {
            alignItems: "center",
            gap: 12
        }
    })

    if (bleDevices.length == 0){
        return (
            <View>
                <View style={styles.header}>
                    <View style={styles.backArrowContainer}>
                        <BackArrow width={30} height={30} onPress={onBackPressed}/>
                    </View>
                </View>
                <View style={styles.noDevicesContainer}>
                    <Text style={[globalStyle.text, styles.noDevicesText]}>
                        Nenhum dispositivo encontrado
                    </Text>
                    <ClickableButton
                        width={250}
                        height={60}
                        onPress={onRetryPressed}
                        text="Tentar novamente"
                    />
                </View>
            </View>
        );
    }
    if(bleDevices.length == 1){
        onPillDeviceSelected(bleDevices[0]);
    }

    return (
        <ScrollView>
            {
                bleDevices.map((bleDevice: BleDevice)=>(
                    <View key={bleDevice.serviceUuid}>
                        <Text>{bleDevice.deviceName}</Text>
                        <Button
                            onPress={()=>{
                                console.log("SELECTED DEVICE " + bleDevice.deviceName);
                                onPillDeviceSelected(bleDevice);
                            }}
                            title="Selecionar"
                        />
                    </View>
                ))
            }
        </ScrollView>
    );
}

export default BleDevicesList