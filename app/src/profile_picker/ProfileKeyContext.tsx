import { createContext } from "react";


export type ProfileKeyContextType = {
    setProfileKey: (profile: string )=>void;
    profileKey: string;
}

export const ProfileKeyContext = createContext<ProfileKeyContextType>({
    setProfileKey: (profileKey: string)=>{},
    profileKey: ""
})