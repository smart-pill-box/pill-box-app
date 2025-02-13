import axios from "axios";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native"
import ClickableButton from "../../../components/ClickabeButton";
import BorderTextInput from "../../../profile_picker/components/BorderTextInput";
import { globalStyle } from "../../../style";

type Props = {
	onNameSet: (name: string) => void;
}

export default function SetDeviceName({ onNameSet }: Props) {
	const [deviceName, setDeviceName] = useState("");	

	const validateAndContinue = () => {
		if(deviceName == ""){
			return;
		}

		onNameSet( deviceName );
	}

	return (
		<View style={{ width: "100%", height: "100%" }}>
			<View style={styles.container}>
				<Text style={[globalStyle.text, styles.text]}> Escolha um nome para essa caixa de remédios </Text>
				<BorderTextInput
					width={297}
					height={44}
					placeholder="Nome da caixa"
					onChangeText={setDeviceName}
					currentValue={deviceName}
				/>
				<View style={styles.buttonContainer}>
					<ClickableButton
						width={297}
						height={52}
						text="Finalizar"
						onPress={validateAndContinue}
					/>
				</View>
			</View>
		</View>
	)
}


const styles = StyleSheet.create({
	container: {
		marginTop: 24,
		height: "100%",
		flexDirection: "column",
		alignItems: "center",
		paddingHorizontal: 28,
		gap: 24
	},
	text: {
		color: "#575757",
		width: "100%",
		fontSize: 32
	},
	buttonContainer: {
		position: "absolute",
		alignItems: "center",
		justifyContent: "center",
		bottom: 42
	},
})

