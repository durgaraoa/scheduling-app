import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Schedule, ScheduleSlot } from '../shared/models/schedule.model';
import { ScheduleService } from './schedule.service';

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['schedule.component.scss'],
    providers: [ScheduleService, ConfirmationService, MessageService]
})
export class ScheduleComponent {

    schedulesList: Schedule[] = [];
    searchSchedulesResultsList: Schedule[] = [];
    createSlotsList: ScheduleSlot[] = [];
    displaySlots: boolean = false;
    displayAddSchedule: boolean = false;
    displayEditSchedule: boolean = false;
    showSlotAdd: boolean = false;
    noDataMsg:boolean = false;

    scheduleObj: any;

    searchForm: FormGroup;
    createForm: FormGroup;
    createSlotForm: FormGroup;
    scheduleObjIndex: any;

    constructor(private service: ScheduleService, private confirmationService: ConfirmationService, private fb: FormBuilder,
        private messageService: MessageService) {
    }

    ngOnInit() {
        this.initSarchForm();
        this.intScheduleCreateForm();
        this.initSlot();
        this.getAllSchedules();
    }

    getAllSchedules(){
        this.service.getAllSchedules().subscribe(resData =>{
            this.schedulesList = resData;
            if(this.searchSchedulesResultsList.length == 0){
                this.searchSchedulesResultsList = resData;
            }
        })
    }


    initSarchForm() {
        this.searchForm = this.fb.group({
            studioName: [null, Validators.required],
            dateValue: [null, Validators.required],
            localDate: [null]
        });

    }

    intScheduleCreateForm(){
        this.createForm = this.fb.group({
            studioName: [null, Validators.required],
            studioScheduleId: [null, Validators.required],
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

    resetSlotCreation(){
        this.initSlot();
        this.showSlotAdd = false;
        this.noDataMsg = false;
    }



    confirmScheduleDelete(index) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to DELETE the schedule',
            accept: () => {
                this.schedulesList.splice(index, 1);
                this.messageService.add({severity:'success', summary:'Success', detail:'Schedule Deleted Successfully.'});
                // this.service.updateSchedule(this.schedulesList).subscribe(resData => {
                //     console.log(resData)
                // }, (error:any) => {
                //     console.log('oops', error)
                //     alert("Server:" + error.statusText)
                // })
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

        this.searchSchedulesResultsList = this.schedulesList.filter(
            item =>
                ((item.studioName.toUpperCase().indexOf(this.searchForm.value.studioName.toUpperCase()) >= 0) && 
                (item.date == this.searchForm.value.localDate))
        )

        if(this.searchSchedulesResultsList.length == 0){
            this.noDataMsg = true;
        }

        if(this.searchSchedulesResultsList.length > 0){
            this.noDataMsg = false;
        }

        // this.service.getSchedules(this.searchForm.value).subscribe(resData => {
        //     console.log(resData);
        // }, (error:any) => {
        //     console.log('oops', error)
        //     alert("Server:" + error.statusText)
        // })
    }

    resetSearch(){
        this.initSarchForm();
        this.searchSchedulesResultsList = this.schedulesList;
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
        this.messageService.add({severity:'success', summary:'Success', detail:'Slot Updated Successfully.'});
        //     }
        // });
        // this.service.updateSchedule(this.scheduleObj).subscribe(resData =>{
        //     console.log(resData);   
        // }, (error:any) => {
        //     console.log('oops', error)
        //     alert("Server:" + error.statusText)
        // })
    }

    saveSchedule() {
        this.createForm.controls['localDate'].patchValue(this.prepareDateStringFromObject(this.createForm.controls['dateValue'].value));
        this.createForm.controls['studioScheduleSlotList'].patchValue(this.createSlotsList);
        this.createForm.controls['date'].patchValue(this.createForm.controls['localDate'].value)
        console.log(this.createForm.value)
        this.displayAddSchedule = false;
        this.createSlotsList = [];
        this.schedulesList.push(this.createForm.value);
        this.searchSchedulesResultsList = this.schedulesList;
        this.intScheduleCreateForm();
        this.initSarchForm();
        this.noDataMsg = false;
        this.messageService.add({severity:'success', summary:'Success', detail:'Schedule Added Successfully.'});
        // this.service.saveSchedule(this.createForm.value).subscribe(resData => {
        //     console.log(resData);
        // }, (error:any) => {
        //     console.log('oops', error)
        //     alert("Server:" + error.statusText)
        // })
    }

    displayEditFn(item, index) {
        this.scheduleObjIndex = index;
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
        this.searchSchedulesResultsList[this.scheduleObjIndex].date = this.createForm.controls['date'].value;
        this.searchSchedulesResultsList[this.scheduleObjIndex].studioName = this.createForm.controls['studioName'].value;
        this.searchSchedulesResultsList[this.scheduleObjIndex].studioScheduleId = this.createForm.controls['studioScheduleId'].value;
        this.messageService.add({severity:'success', summary:'Success', detail:'Schedule Updated Successfully.'});
        // this.service.updateSchedule(this.createForm.value).subscribe(resData => {
        //     console.log(resData);
        // }, (error:any) => {  
        //     console.log('oops', error)
        //     alert("Server:" + error.statusText)
        // })
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
