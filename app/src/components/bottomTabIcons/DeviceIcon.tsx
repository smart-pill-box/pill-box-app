import * as React from "react"
import Svg, { Path, Defs, Pattern, Use, Image } from "react-native-svg"

type Props = {
    focused: boolean,
    color: string,
    size: number
}

export default function DeviceIcon({focused, color, size}: Props) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 41 40"
            fill="none"
        >
            <Path fill="url(#pattern0)" d="M0 0H40.1111V40H0z" />
            <Defs>
                <Pattern
                    id="pattern0"
                    patternContentUnits="objectBoundingBox"
                    width={1}
                    height={1}
                >
                <Use
                    xlinkHref="#image0_2_532"
                    transform="matrix(.00997 0 0 .01 .001 0)"
                />
                </Pattern>
                <Image
                    id="image0_2_532"
                    width={100}
                    height={100}
                    xlinkHref="data:image/png;base64,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"
                />
            </Defs>
        </Svg>
    )
}