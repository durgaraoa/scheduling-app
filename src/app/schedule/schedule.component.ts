import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { IMyDpOptions } from 'mydatepicker';
import { Schedule } from '../shared/models/schedule.model';
import { ScheduleService } from './schedule.service';

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['schedule.component.scss'],
    providers: [ScheduleService, ConfirmationService]
})
export class ScheduleComponent {

    displayPreview: boolean = false;
 

    schedulesList: Schedule[] = [];
    displaySlots:boolean = false;


    searchForm: FormGroup;
    scheduleDatePickerOption: IMyDpOptions;

    constructor(private service: ScheduleService, private confirmationService: ConfirmationService, private fb: FormBuilder) {
    }

    ngOnInit() {
        this.schedulesList = [
            {
                "date": "2019-01-28",
                "studioName": "Studio-1",
                "studioScheduleSlotList": [
                    {
                        "startTime": "00:00:00",
                        "endTime": "00:00:00",
                        "faculty": "vdsghGFVS",
                        "assignerName": "GDVBS"
                    }
                ]
            }
        ]
        this.initSarchForm();
    }


    initSarchForm() {
        this.searchForm = this.fb.group({
            studioName: [null, Validators.required],
            dateValue: [null, Validators.required],
            localDate: [null],
        });
    }

   

    // confirmSubmit() {
    //     this.confirmationService.confirm({
    //         message: 'Are you sure that you want to save the schedule',
    //         accept: () => {
    //             // this.submitted = true;
    //         }
    //     });
    // }


    prepareDateJson(date: any) {
        let yearL = this.getDate(date).getFullYear();
        let monthL = this.getDate(date).getMonth() + 1;
        let dayL = this.getDate(date).getDate();
        let dateJson = {
            date: { year: yearL, month: monthL, day: dayL },
            formatted: yearL + "-" + (monthL > 9 ? monthL : "0" + monthL) + "-" + (dayL > 9 ? dayL : "0" + dayL)
        };
        return dateJson;
    }

    getDate(millis): Date {
        return millis ? new Date(millis) : null;
    }

    scheduleObj:any;
    displaySlotsFn(schedule){
        this.displaySlots = true;
        this.scheduleObj = schedule;
    }
}
