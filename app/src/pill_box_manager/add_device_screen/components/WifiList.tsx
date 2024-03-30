import { useReducer, useEffect, useState } from 'react';
import {
    PermissionsAndroid,
    SafeAreaView,
    Text,
    View,
    ScrollView,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
  } from 'react-native';

import BleManager, { BleEventType } from 'react-native-ble-manager';
import { Wifi } from '../typeDefs';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import BackArrow from '../../../components/BackArrow';
import ClickableButton from '../../../components/ClickabeButton';
import { globalStyle } from '../../../style';
import WifiOption from './WifiOption';
import ClickablePointer from '../../../components/ClickablePointer';
type Props = {
    wifisList: Wifi[];
    onCredentialReceived: (wifi: Wifi, password: string)=>void;
    onBackPressed: ()=>void;
    onRetryPressed: ()=>void;
}

const WifisList = ({wifisList, onCredentialReceived, onRetryPressed, onBackPressed}: Props) => {
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
        noNetworksText: {
            textAlign: "center",
            fontSize: 32,
            color: "#909090",
        },
        noNetworksContainer: {
            alignItems: "center",
            gap: 12
        },
        contentContainer: {
            position: "relative",
            alignItems: "center",
            gap: 24,
            marginHorizontal: 12
        },
        scrollView: {
            height: "50%",
            width: "80%",
            borderRadius: 12,
            borderColor: "#DBDBDB",
            borderWidth: 1,
            backgroundColor: "white",
            gap: 12
        },
        textTitle: {
            textAlign: "center", 
            fontSize: 28, 
            color: "#575757"
        },
        selectedWifiContainer: {
            padding: 12,
            borderRadius: 12,
            alignItems: "center",
            width: "90%",
            borderColor: "#DBDBDB",
            borderWidth: 1,
            backgroundColor: "white",
        },
        passwordInput: {
            width: "60%",
            padding: 0,
            marginTop: 8,
            marginBottom: 24,
            borderWidth: 1,
            textAlign: "center",
            borderRadius: 8,
        }
    })

    let [wifiPass, setWifiPass] = useState("");
    let [selectedWifi, setSelectedWifi] = useState<undefined | Wifi>()

    if (wifisList.length == 0){
        return (
            <View>
                <View style={styles.header}>
                    <View style={styles.backArrowContainer}>
                        <BackArrow width={30} height={30} onPress={onBackPressed}/>
                    </View>
                </View>
                <View style={styles.noNetworksContainer}>
                    <Text style={[globalStyle.text, styles.noNetworksText]}>
                        Nenhuma rede Wi-Fi encontrada
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

    console.log("WIFIS LIST IS");
    console.log(wifisList);
    if(selectedWifi == undefined){
        return (
            <View>
                <View style={styles.header}>
                    <View style={styles.backArrowContainer}>
                        <BackArrow width={30} height={30} onPress={onBackPressed}/>
                    </View>
                </View>
                <View style={styles.contentContainer}>
                    <Text style={[globalStyle.text, styles.textTitle]}> 
                        Selecione a rede que deseja que seu dispositivo se conecte 
                    </Text>
                    <ScrollView style={styles.scrollView}>
                        {
                            wifisList.map((wifi)=>(
                                <WifiOption
                                    key={wifi.Ssid}
                                    wifi={wifi}
                                    onSelected={()=>setSelectedWifi(wifi)}
                                />
                            ))
                        }
                    </ScrollView>
                </View>
            </View>
        );
    }

    return (
        <View>
            <View style={styles.header}>
                <View style={styles.backArrowContainer}>
                    <BackArrow width={30} height={30} onPress={onBackPressed}/>
                </View>
            </View>
            <View style={styles.contentContainer}>
                <Text style={[globalStyle.text, styles.textTitle]}> 
                    Selecione a rede que deseja que seu dispositivo se conecte 
                </Text>
                <View style={styles.selectedWifiContainer}>
                    <View style={{position: "absolute", left: 12, top: 12, zIndex: 999}}>
                        <ClickablePointer
                            width={24}
                            height={24}
                            orientation='left'
                            onPress={()=>{
                                setSelectedWifi(undefined);
                                setWifiPass("");
                            }}
                        />
                    </View>
                    <Text style={[globalStyle.text ,{width: "100%", textAlign: "center"}]}>
                        {selectedWifi.Ssid}
                    </Text>
                    <TextInput
                        placeholderTextColor="#909090"
                        placeholder="Digite a senha"
                        onChangeText={setWifiPass}
                        maxLength={12}
                        value={wifiPass}
                        style={[globalStyle.text, styles.passwordInput]}
                    />
                    <View style={{gap: 12}}>
                        <View>
                            <Text style={[globalStyle.text, {fontWeight: "900"}]}>
                                Porque precisamos dessa informação?
                            </Text>
                            <Text style={globalStyle.text}>
                                Para podermos conectar seu dispositivo em sua rede residencial precisaremos da sua senha
                            </Text>
                        </View>

                        <View style={{gap: 0}}>
                            <Text style={[globalStyle.text, {fontWeight: "900"}]}>
                                Eu estou protegido?
                            </Text>
                            <Text style={globalStyle.text}>
                                Sim, sua senha não será enviada para nós e não sera compartilhada com ninguem além do dispositivo
                            </Text>
                        </View>
                    </View>
                </View>
                <ClickableButton
                    width={250}
                    height={60}
                    onPress={()=>{
                        console.log("wifi pass is " + wifiPass);
                        if(wifiPass != ""){
                            onCredentialReceived(selectedWifi!, wifiPass)
                        }
                    }}
                    text='Conectar'
                />
            </View>
        </View>
    )
}

export default WifisList