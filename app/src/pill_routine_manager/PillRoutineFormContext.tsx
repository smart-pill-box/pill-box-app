import { createContext } from "react";
import { RoutineTypeAnswers } from "./screens/create_pill_routine/RoutineTypeScreen";
import { NameDefinitionAnswers } from "./screens/create_pill_routine/NameDefinitionScreen";
import { WeekdaysPickerAnswers } from "./screens/create_pill_routine/WeekdaysPickerScreen";
import { TimesPerDayAnswers } from "./screens/create_pill_routine/TimesPerDayScreen";
import { DoseTimePickerAnswers } from "./screens/create_pill_routine/DoseTimePickerScreen";
import { DayPeriodAnswers } from "./screens/create_pill_routine/DayPeriodScreen";

export type PillRoutineType = "weekdays" | "everyday" | "dayPeriod";

export interface PillRoutineForm {
    nameDefinitionAnswers?: NameDefinitionAnswers;
    routineTypeAnswers?: RoutineTypeAnswers;
    weekdaysPickerAnswers?: WeekdaysPickerAnswers;
    dayPeriodAnswers?: DayPeriodAnswers;
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