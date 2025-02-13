import * as React from "react"
import Svg, { Path } from "react-native-svg"

type Props = {
	color: string,
	width: number | string,
	height: number | string
}
export default function Wifi({ color, width, height }: Props) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Path
        d="M13.693 17.25a1.125 1.125 0 000 2.25v-2.25zm.01 2.25a1.125 1.125 0 000-2.25v2.25zm3.016-4.455a1.125 1.125 0 001.514-1.664l-1.514 1.664zm3.784-4.162a1.125 1.125 0 101.514-1.665l-1.514 1.665zM9.152 13.38a1.125 1.125 0 101.514 1.664l-1.514-1.664zM5.368 9.218a1.125 1.125 0 101.514 1.665L5.368 9.218zM13.693 19.5h.01v-2.25h-.01v2.25zm0-5.625a4.48 4.48 0 013.026 1.17l1.514-1.664a6.73 6.73 0 00-4.54-1.756v2.25zm0-5.625c2.623 0 5.011.996 6.81 2.633l1.514-1.665A12.334 12.334 0 0013.693 6v2.25zm-3.027 6.795a4.48 4.48 0 013.027-1.17v-2.25a6.73 6.73 0 00-4.541 1.756l1.514 1.664zm-3.784-4.162a10.084 10.084 0 016.81-2.633V6c-3.204 0-6.127 1.22-8.324 3.218l1.514 1.665z"
        fill={ color }
      />
    </Svg>
  )
}


