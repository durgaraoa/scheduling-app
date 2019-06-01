export class Schedule {
    date:string;
    studioName:string;
    studioScheduleSlotList: Array<ScheduleSlot>;
}

export class ScheduleSlot {
    startTime:string;
    endTime:string;
    faculty:string;
    assignerName:string;
}
	
