export class CreateSpecWorkingDayDto {
    specId: string;
    dayOfWeek: [Number];
    startTime: string;
    finishTime: string;
    restStartTime?: string;
    restFinishTime?: string;
}
