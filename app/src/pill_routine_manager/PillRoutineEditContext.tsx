import { createContext } from "react";
import { PillRoutine } from "../types/pill_routine";


export interface PillRoutineEditContextType{
    setPillRoutine: (pillRoutine: PillRoutine | undefined)=>void;
    pillRoutine: PillRoutine | undefined
}

export const PillRoutineEditContext = createContext<PillRoutineEditContextType>({
    setPillRoutine: (pillRoutine: PillRoutine | undefined)=>{},
    pillRoutine: undefined
})