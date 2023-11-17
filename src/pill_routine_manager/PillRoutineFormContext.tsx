import { createContext } from "react";

export type PillRoutineType = "weekdays" | "everyday" | "someDays";

export type PillRoutineForm = {
    name?: string,
    pillRoutineType?: "weekdays" | "everyday" | "someDays"
}

export type PillRoutineFormContextType = {
    setPillRoutineForm: (value: null | object)=>void;
    pillRoutineForm: PillRoutineForm | null
}

export const PillRoutineFormContext = createContext<PillRoutineFormContextType>({
    setPillRoutineForm: (value: null | object)=>{},
    pillRoutineForm: null
})