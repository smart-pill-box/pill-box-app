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
    status: "active" | "canceled" | "updated";
    pillRoutineType: "weekdays" | "dayPeriod";
    startDatetime: string;
    expirationDatetime?: string;
    statusEvents: PillRoutineStatusEvent[]
}

export interface PillRoutine extends PillRoutineBase {
    pillRoutineData: any
}
