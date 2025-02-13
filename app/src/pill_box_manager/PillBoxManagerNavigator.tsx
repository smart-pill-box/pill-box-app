import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from "../../App";
import PillBoxManagerScreen from "./PillBoxManagerScreen";
import AddDeviceScreen from "./add_device_screen/AddDeviceScreen";
import { useLayoutEffect } from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import DevicePillsScreen from "./DevicePillsScreen";
import DeviceRechargeScreen from "./DeviceRecharge/DeviceRechargeScreen";

export type PillBoxManagerStackList = {
    PillBoxManager: undefined;
    AddDeviceScreen: undefined;
	DevicePillsScreen: { deviceKey: string };
	DeviceRechargeScreen: { deviceKey: string };
}

type Props = BottomTabScreenProps<RootTabParamList, "PillBoxManagerNavigator">

const Stack = createNativeStackNavigator<PillBoxManagerStackList>()

export default function PillBoxManagerNavigator({ route, navigation }: Props){
    useLayoutEffect(() => {
        const tabHiddenRoutes = [
            "AddDeviceScreen",
			"DevicePillsScreen",
			"DeviceRechargeScreen"
        ]
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName && tabHiddenRoutes.includes(routeName)){
            navigation.setOptions({tabBarStyle: { display: "none"}});
        }else {
            navigation.setOptions({tabBarStyle: { display: "flex"}});
        }
    }, [navigation, route]);

    return (
        <Stack.Navigator
            initialRouteName="PillBoxManager"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="PillBoxManager" component={PillBoxManagerScreen}/>
            <Stack.Screen name="AddDeviceScreen" component={AddDeviceScreen}/>
			<Stack.Screen name="DevicePillsScreen" component={DevicePillsScreen}/>
			<Stack.Screen name="DeviceRechargeScreen" component={DeviceRechargeScreen}/>
        </Stack.Navigator>
    )
}
