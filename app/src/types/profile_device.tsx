import { DevicePill } from "./device_pill";

export type ProfileDevice = {
	deviceKey: string,
	name: string,
	maxPositions: number,
	deviceIp?: string,
	devicePills: DevicePill[],
};
