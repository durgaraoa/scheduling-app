import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule, MatRadioModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ChartModule } from 'primeng/primeng';
import { ScheduleComponent } from './schedule.component';
import {InputMaskModule} from 'primeng/inputmask';
import {NgbDatepickerModule, NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
    { path: '', component: ScheduleComponent }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes),
        DialogModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatPaginatorModule,
        BrowserModule,
        MatRadioModule,
        FormsModule,
        ChartModule,
        ConfirmDialogModule,
        MatGridListModule,
        CalendarModule,
        InputMaskModule,
        NgbDatepickerModule,
        NgbTimepickerModule
        
    ],
    declarations: [
        ScheduleComponent
    ]
})
export class ScheduleModule { }
