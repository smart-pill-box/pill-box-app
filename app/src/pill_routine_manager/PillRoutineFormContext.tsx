import { createContext } from "react";
import { RoutineTypeAnswers } from "./screens/RoutineTypeScreen";
import { NameDefinitionAnswers } from "./screens/NameDefinitionScreen";
import { WeekdaysPickerAnswers } from "./screens/WeekdaysPickerScreen";
import { TimesPerDayAnswers } from "./screens/TimesPerDayScreen";
import { DoseTimePickerAnswers } from "./screens/DoseTimePickerScreen";

export type PillRoutineType = "weekdays" | "everyday" | "dayPeriod";

export interface PillRoutineForm {
    nameDefinitionAnswers?: NameDefinitionAnswers;
    routineTypeAnswers?: RoutineTypeAnswers;
    weekdaysPickerAnswers?: WeekdaysPickerAnswers;
    timesPerDayAnswers?: TimesPerDayAnswers;
}

export interface PillRoutineFormContextType{
    setPillRoutineForm: (value: object)=>void;
    pillRoutineForm: PillRoutineForm
}

export const PillRoutineFormContext = createContext<PillRoutineFormContextType>({
    setPillRoutineForm: (value: object)=>{},
    pillRoutineForm: {}
})