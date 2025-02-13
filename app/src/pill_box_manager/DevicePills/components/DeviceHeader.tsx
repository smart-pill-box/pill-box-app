import { StyleSheet, View, Text } from "react-native"
import BackArrow from "../../../components/BackArrow"
import PillIcon from "../../../components/bottomTabIcons/PillIcon"
import ClickablePointer from "../../../components/ClickablePointer"
import { globalStyle } from "../../../style"
import { Device } from "../../../types/device"
import { ProfileDevice } from "../../../types/profile_device"

type Props = {
	profileDevice: ProfileDevice,
	onBackPressed: ()=>void,
	numOfPills?: number
}

export default function DeviceHeader({ profileDevice, onBackPressed, numOfPills}: Props ){
	return (
		<View style={styles.mainContainer}>
			<View style={styles.backArrowContainer}>
				<BackArrow
					width={30}
					height={30}
					onPress={onBackPressed}
				/>
			</View>
			<Text style={[globalStyle.text, styles.deviceNameText]}> {profileDevice.name} </Text>
			<View style = {styles.infoContainer}>
				<Text style={[globalStyle.text, styles.nunOfPillsText]}> {numOfPills ? numOfPills : profileDevice.devicePills.length} / {profileDevice.maxPositions} </Text>
				<PillIcon
					focused={true}
					color={"#575757"}
					size={20}
				/>
			</View>
		</View>
	)	
}

const styles = StyleSheet.create({
	mainContainer: {
		alignItems: "center",
		justifyContent: "center",
		gap: 4,
		marginBottom: 32,
		marginTop: 12,
		width: "100%"
	},
	deviceNameText: {
		textAlign: "center",
		fontSize: 24
	},
	nunOfPillsText: {
		textAlign: "center",
		fontSize: 20,
		color: "#575757"
	},
	infoContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
	},
	backArrowContainer: {
		position: "absolute",
		left: 20,
		top: 20
	}
})

