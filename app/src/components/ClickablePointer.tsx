import React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type Props = {
  onPress: (event: GestureResponderEvent) => void
  width: number,
  height: number,
  orientation?: "up" | "down" | "left" | "right"  
}

export default function ClickablePointer({ onPress, width, height, orientation="left" }: Props){
  const orientationToRotation = {
    up: "270deg",
    down: "90deg",
    left: "180deg",
    right: "0deg"
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <Svg width={width} height={height} viewBox="0 0 47 47" fill="none" style={{ transform: [{ rotateY: orientationToRotation[orientation] }] }}>
        <Path
          d="M11.75 5.54306L14.0648 2.9375L35.25 23.5L14.0648 44.0625L11.75 41.4569L30.2504 23.5L11.75 5.54306Z"
          fill="black"
        />
      </Svg>
    </TouchableOpacity>
  );
};
