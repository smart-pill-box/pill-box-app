import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import PillIcon from "../../components/bottomTabIcons/PillIcon";
import ClickablePointer from "../../components/ClickablePointer";
import Wifi from "../../components/Wifi";
import { globalStyle } from "../../style";
import { ProfileDevice } from "../../types/profile_device";


type Props = {
	profileDevice: ProfileDevice,
	onPress: ()=>void
}

export default function DeviceComponent({ profileDevice, onPress }: Props) {
	return (
		<TouchableOpacity 
			onPress={onPress}
		>
		<View style={styles.deviceContainer}>
			<View>

			</View>
			<View>
				<ClickablePointer
					width={24}
					height={24}
					orientation={"right"}
					onPress={()=>{}}
				/>
			</View>

			<View style={styles.deviceNameContainer}>
				<Text style = {[globalStyle.text, styles.deviceName]}> {profileDevice.name} </Text>
			</View>

			<View style={styles.infoContainer}>
				<View style={styles.numberOfPillsContainer}>
					<Text style={[globalStyle.text, styles.numberOfPillsText]}> {profileDevice.devicePills.length} / {profileDevice.maxPositions} </Text>
					<PillIcon
						focused={true}
						color={"#000000"}
						size={20}
					/>
				</View>
				<View>
					<Wifi
						width={24}
						height={24}
						color={"#24FF00"}
					/>
				</View>
			</View>
		</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
    deviceContainer: {
        width: 320,
        height: 64,
        borderRadius: 12,
        borderColor: "#DBDBDB",
        borderWidth: 1,
        alignSelf: "center",
		alignItems: "center",
        flexDirection: "row",
        backgroundColor: "white",
        zIndex: 1,
		paddingHorizontal: 8,
    },
	pointerContainer: {
		width: 32
	},
	deviceNameContainer: {
		width: "50%",
	},
	deviceName: {
		fontSize: 24,
		color: "#575757"
	},
	infoContainer: {
		position: "absolute",
		right: 8,
		width: 100,
		gap: 4,
		height: "80%",
		alignItems: "flex-end"
	},
	numberOfPillsContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 4
	},
	numberOfPillsText: {
		fontWeight: "700",
		color: "#575757"
	}
})
