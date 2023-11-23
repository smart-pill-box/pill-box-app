export type WeekdaysPillRoutineData = {
    monday?: string[];
    tuesday?: string[];
    wednesday?: string[];
    thursday?: string[];
    friday?: string[];
    saturday?: string[];
    sunday?: string[];
}

export type DayPeriodPillRoutineData = {
    pillsTimes: string[];
    periodInDays: number;
}

interface PillRoutineStatusEvent {
    status: "active" | "canceled";
    eventDatetime: string
};

interface PillRoutineBase {
    pillRoutineKey: string;
    name: string;
    status: "active" | "canceled";
    pillRoutineType: "weekdays" | "dayPeriod";
    startDate: string;
    expirationDate?: string;
    statusEvents: PillRoutineStatusEvent[]
}

export interface PillRoutine extends PillRoutineBase {
    pillRoutineData: DayPeriodPillRoutineData | WeekdaysPillRoutineData
}
