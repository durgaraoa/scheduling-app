import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { IMyDpOptions } from 'mydatepicker';
import { Schedule, ScheduleSlot } from '../shared/models/schedule.model';
import { ScheduleService } from './schedule.service';

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['schedule.component.scss'],
    providers: [ScheduleService, ConfirmationService]
})
export class ScheduleComponent {

    schedulesList: Schedule[] = [];
    createSlotsList: ScheduleSlot[] = [];
    displaySlots: boolean = false;
    displayAddSchedule: boolean = false;
    displayEditSchedule: boolean = false;
    showSlotAdd: boolean = false;

    scheduleObj: any;

    searchForm: FormGroup;
    createForm: FormGroup;
    createSlotForm: FormGroup;

    constructor(private service: ScheduleService, private confirmationService: ConfirmationService, private fb: FormBuilder) {
    }

    ngOnInit() {
        this.schedulesList = [
            {
                "studioScheduleId": "",
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
        this.initSlot();
    }


    initSarchForm() {
        this.searchForm = this.fb.group({
            studioName: [null, Validators.required],
            dateValue: [null, Validators.required],
            localDate: [null]
        });

        this.createForm = this.fb.group({
            studioName: [null, Validators.required],
            studioScheduleId: [null],
            dateValue: [null, Validators.required],
            localDate: [null],
            date: [null],
            studioScheduleSlotList: []
        });

    }

    initSlot() {
        this.createSlotForm = this.fb.group({
            startTimeValue: [null, Validators.required],
            startTime: [null],
            endTime: [null],
            endTimeValue: [null, Validators.required],
            faculty: [null, Validators.required],
            assignerName: [null, Validators.required]
        });
    }



    confirmScheduleDelete(index) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to DELETE the schedule',
            accept: () => {
                this.schedulesList.splice(index, 1);
                this.service.updateSchedule(this.schedulesList).subscribe(resData => {
                    console.log(resData)
                }, (error:any) => {
                    console.log('oops', error)
                    alert(error.statusText)
                })
            }
        });
    }

    prepareDateStringFromObject(date: any) {
        return date.year + "-" + (date.month > 9 ? date.month : "0" + date.month) + "-" + (date.day > 9 ? date.day : "0" + date.day)
    }
    prepareTimeStringFromObject(date: any) {
        return (date.hour > 9 ? date.hour : "0" + date.hour) + ":" + (date.minute > 9 ? date.minute : "0" + date.minute) + ":" + (date.second > 9 ? date.second : "0" + date.second)
    }

    prepareDateObjectFromString(date: any) {
        let dtArr = date.split("-");
        return { year: Number(dtArr[0]), month: Number(dtArr[1]), day: Number(dtArr[2]) }
    }

    searchSchedules() {
        console.log(this.searchForm.value)
        let localDate = this.prepareDateStringFromObject(this.searchForm.controls['dateValue'].value);
        this.searchForm.controls['localDate'].patchValue(localDate);
        console.log(this.searchForm.value);
        this.service.getSchedules(this.searchForm.value).subscribe(resData => {
            console.log(resData);
        }, (error:any) => {
            console.log('oops', error)
            alert(error.statusText)
        })
    }

    displaySlotsFn(schedule) {
        this.displaySlots = true;
        this.scheduleObj = schedule;
    }

    addSchedule() {
        this.displayAddSchedule = true;
    }

    addRowInSlots(body) {
        body.startTime = this.prepareTimeStringFromObject(body.startTimeValue);
        body.endTime = this.prepareTimeStringFromObject(body.endTimeValue);
        this.createSlotsList.push(body);
        this.initSlot();
    }

    deleteRowInSlots(index) {
        // this.confirmationService.confirm({
        //     message: 'Are you sure that you want to DELETE the Slot',
        //     accept: () => {
        this.scheduleObj.studioScheduleSlotList.splice(index, 1);
        //     }
        // });
        this.service.updateSchedule(this.scheduleObj).subscribe(resData =>{
            console.log(resData);   
        }, (error:any) => {
            console.log('oops', error)
            alert(error.statusText)
        })
    }

    saveSchedule() {
        this.createForm.controls['localDate'].patchValue(this.prepareDateStringFromObject(this.createForm.controls['dateValue'].value));
        this.createForm.controls['studioScheduleSlotList'].patchValue(this.createSlotsList);
        console.log(this.createForm.value)
        this.displayAddSchedule = false;
        this.service.saveSchedule(this.createForm.value).subscribe(resData => {
            console.log(resData);
        }, (error:any) => {
            console.log('oops', error)
            alert(error.statusText)
        })
    }

    displayEditFn(item) {
        this.displayEditSchedule = true;
        this.scheduleObj = item;
        this.createForm.controls['studioName'].patchValue(item.studioName);
        this.createForm.controls['studioScheduleId'].patchValue(item.studioScheduleId);
        if (item.date) {
            console.log(this.prepareDateObjectFromString(item.date))
            this.createForm.controls['dateValue'].patchValue(this.prepareDateObjectFromString(item.date));
        }
    }

    updateSchedule() {
        this.createForm.controls['date'].patchValue(this.prepareDateStringFromObject(this.createForm.controls['dateValue'].value));
        this.createForm.controls['studioScheduleSlotList'].patchValue(this.scheduleObj.studioScheduleSlotList);
        this.displayEditSchedule = false;
        console.log(this.createForm.value)
        this.service.updateSchedule(this.createForm.value).subscribe(resData => {
            console.log(resData);
        }, (error:any) => {
            console.log('oops', error)
            alert(error.statusText)
        })
    }

    displayAddSlotFn() {
        this.showSlotAdd = true;
    }

    addRowInAddSlots(body) {
        body.startTime = this.prepareTimeStringFromObject(body.startTimeValue);
        body.endTime = this.prepareTimeStringFromObject(body.endTimeValue);
        this.scheduleObj.studioScheduleSlotList.push(body);
        this.initSlot();
        this.showSlotAdd = false;
    }


}
