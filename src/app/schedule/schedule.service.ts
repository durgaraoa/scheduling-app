import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ScheduleService {
    constructor(private http: HttpClient) {
     }
 
     public hostIP = "http://192.168.0.35:8082";
     public getSchedules(body:any): Observable<any> {
        return this.http.post(this.hostIP + "/schedule/check", body);
    }

     public saveSchedule(body:any): Observable<any> {
        return this.http.post(this.hostIP + "/schedule", body);
    }

    public updateSchedule(body:any): Observable<any> {
        return this.http.put(this.hostIP + "/schedule", body);
    }

    public getAllSchedules(): Observable<any>{
        return this.http.get("assets/data/data.json");
    }
}