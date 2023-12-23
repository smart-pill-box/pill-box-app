import Svg, { Path } from "react-native-svg"

type Props = {
    focused: boolean,
    color: string,
    size: number
}

export default function CalendarIcon({ focused, color, size }: Props){
    return (
        <Svg
            width={size + 20}
            height={size + 20}
            viewBox="0 0 60 60"
            fill="none"
        >
        <Path
            d="M5 30c0-9.428 0-14.142 2.929-17.071C10.858 10 15.572 10 25 10h10c9.428 0 14.142 0 17.071 2.929C55 15.858 55 20.572 55 30v5c0 9.428 0 14.142-2.929 17.071C49.142 55 44.428 55 35 55H25c-9.428 0-14.142 0-17.071-2.929C5 49.142 5 44.428 5 35v-5z"
            stroke={color}
            strokeWidth={3.75}
        />
        <Path
            d="M17.5 10V6.25M42.5 10V6.25M6.25 22.5h47.5"
            stroke={color}
            strokeWidth={3.75}
            strokeLinecap="round"
        />
        <Path
            d="M45 42.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM45 32.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM32.5 42.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM32.5 32.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM20 42.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM20 32.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            fill={color}
        />
        </Svg>
    )
}