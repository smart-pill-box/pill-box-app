import { createContext } from "react";

type PillRoutineForm = {
    name?: string
}

export type PillRoutineFormContextType = {
    setPillRoutineForm: (value: null | object)=>void;
    pillRoutineForm: PillRoutineForm | null
}

export const PillRoutineFormContext = createContext<PillRoutineFormContextType>({
    setPillRoutineForm: (value: null | object)=>{},
    pillRoutineForm: null
})