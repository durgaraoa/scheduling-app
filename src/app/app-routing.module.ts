import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleComponent } from './schedule/schedule.component';

const routes: Routes = [
  { path: '', redirectTo: 'scheduling', pathMatch: 'full' },
  {
    path: 'scheduling',
    component: ScheduleComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
