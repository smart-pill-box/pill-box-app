import { createContext } from "react";
import { RoutineTypeAnswers } from "./screens/RoutineTypeScreen";
import { NameDefinitionAnswers } from "./screens/NameDefinitionScreen";
import { WeekdaysPickerAnswers } from "./screens/WeekdaysPickerScreen";
import { TimesPerDayAnswers } from "./screens/TimesPerDayScreen";
import { DoseTimePickerAnswers } from "./screens/DoseTimePickerScreen";

export type PillRoutineType = "weekdays" | "everyday" | "dayPeriod";

export type WeekdaysPillRoutineData = {
    monday?: string[];
    tuesday?: string[];
    wednesday?: string[];
    thursday?: string[];
    friday?: string[];
    saturday?: string[];
    sunday?: string[];
}

export type WeekdaysPillRoutinePayload = {
    pillRoutineType: "weekdays";
    name: string;
    pillRoutineData: WeekdaysPillRoutineData;
};

export type DayPeriodPillRoutineData = {
    pillsTimes: string[];
    periodInDays: number;
}

export type DayPeriodRoutinePayload = {
    pillRoutineType: "dayPeriod";
    name: string;
    pillRoutineData: DayPeriodPillRoutineData
};

export type PillRoutinePayload = WeekdaysPillRoutinePayload | DayPeriodRoutinePayload;

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