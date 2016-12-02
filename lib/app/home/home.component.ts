import { Component, OnInit } from '@angular/core';
import { TrafficService } from '../service/traffic.service';
import { Observable } from 'rxjs';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
    selector: 'home',
    host: { class: 'flex-grow' }
})
export class HomeComponent implements OnInit {

    constructor(private trafficService: TrafficService) { }

    requestsObservable: Observable<any[]>

    replacedOnly = false
    maxRows = 50

    ngOnInit(): void {
        this.requestsObservable = this.trafficService.traffic
            // .filter(reqRes => !this.replacedOnly || !!reqRes. origUrl)
            // .scan((arr, req) => {
            //     arr.push(req);
            //     return arr.slice(-1 * this.maxRows);
            // }, []);
    }

}
