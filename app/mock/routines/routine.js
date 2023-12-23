class Routine {
    isDatetimeInRoutineRange(pillRoutine, datetime){
        if(datetime.getTime() < pillRoutine.startDatetime.getTime()){
            return false;
        }

        if(pillRoutine.expirationDatetime && (datetime.getTime() > pillRoutine.expirationDatetime.getTime())){
            return false;
        }

        if(pillRoutine.status == "updated"){
            for (let statusEvent of pillRoutine.statusEvents){
                if(statusEvent.status.enumerator == "updated"){
                    if(statusEvent.eventDatetime.getTime() < datetime.getTime()){
                        return false;
                    }
                }
            }
        }

        return true;
    }
}