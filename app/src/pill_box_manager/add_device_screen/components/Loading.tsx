import React from 'react';
import {NativeModules, StyleSheet, Animated, Image, View, SafeAreaView, Text} from 'react-native';
import { globalStyle } from '../../../style';
import BackArrow from '../../../components/BackArrow';
const {EspProvisioningModule} = NativeModules;

type Props = {
    message: string;
    onBackPressed: ()=>void;
}

const Loading = ({message, onBackPressed}: Props) => {
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

    let rotateValue = new Animated.Value(0)

    const rotateData = rotateValue.interpolate({
        inputRange: [0,1],
        outputRange: ['0deg', '360deg']
    })
    Animated.loop(
        Animated.timing(rotateValue, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true
        })
    ).start()

    return (
        <View style={{justifyContent: "center"}}>
            <View style={styles.header}>
                <View style={styles.backArrowContainer}>
                    <BackArrow width={30} height={30} onPress={onBackPressed}/>
                </View>
            </View>
            <View style={styles.contentContainer}>
                <Animated.Image
                    style={{transform: [{rotate: rotateData}], width: 60, height: 60, marginBottom: 24}}
                    source={require('../../../assets/pill.png')}
                />
                <Text style={[globalStyle.text, styles.text]}> {message} </Text>
            </View>
        </View>
    )
}

export default Loading