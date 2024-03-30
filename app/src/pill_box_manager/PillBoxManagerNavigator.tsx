import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from "../../App";
import PillBoxManagerScreen from "./PillBoxManagerScreen";
import AddDeviceScreen from "./add_device_screen/AddDeviceScreen";
import { useLayoutEffect } from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

export type PillBoxManagerStackList = {
    PillBoxManager: undefined;
    AddDeviceScreen: undefined;
}

type Props = BottomTabScreenProps<RootTabParamList, "PillBoxManagerNavigator">

const Stack = createNativeStackNavigator<PillBoxManagerStackList>()

export default function PillBoxManagerNavigator({ route, navigation }: Props){
    useLayoutEffect(() => {
        const tabHiddenRoutes = [
            "AddDeviceScreen",
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
        </Stack.Navigator>
    )
}
