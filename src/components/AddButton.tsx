import { GestureResponderEvent, TouchableHighlight, TouchableOpacity, View } from "react-native"
import Svg, { Circle, Rect } from 'react-native-svg';

type AddButtonProps = {
    size: number,
    onPress: (event: GestureResponderEvent) => void
};

export default function AddButton({ size, onPress }: AddButtonProps){
    return (
        <TouchableOpacity onPress={onPress}>
            <View>
                <Svg width={size} height={size} viewBox="0 0 33 33" fill="none">
                <Circle cx={16.5} cy={16.5} r={16.5} fill="#66E7A9" />
                <Rect x={15.125} y={4.125} width={2.75} height={24.75} rx={1.375} fill="white" />
                <Rect
                    x={28.875}
                    y={15.125}
                    width={2.75}
                    height={24.75}
                    rx={1.375}
                    transform="rotate(90 28.875 15.125)"
                    fill="white"
                />
                <Circle cx={16.5} cy={16.5} r={16.5} fill="#66E7A9" />
                <Rect x={15.125} y={4.125} width={2.75} height={24.75} rx={1.375} fill="white" />
                <Rect
                    x={28.875}
                    y={15.125}
                    width={2.75}
                    height={24.75}
                    rx={1.375}
                    transform="rotate(90 28.875 15.125)"
                    fill="white"
                />
                </Svg>
            </View>
        </TouchableOpacity>
    )
}