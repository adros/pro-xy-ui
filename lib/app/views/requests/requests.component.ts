import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TrafficService } from '../../service/traffic.service';
import { Observable } from 'rxjs';
import {  ReqRes } from '../../model/http';

@Component({
    moduleId: module.id,
    templateUrl: 'requests.component.html',
    styleUrls: ['requests.component.css'],
    selector: 'requests',
    host: { class: 'flex-grow' }
})
export class RequestsComponent implements OnInit {

    constructor(private trafficService: TrafficService) { }

    requestsObservable: Observable<any[]>

    @Output() selected = new EventEmitter<ReqRes>();

    _maxRows = 50
    set maxRows(maxRows) {
        this._maxRows = maxRows;
        this.trafficService.maxRows = maxRows;
    }
    get maxRows() { return this._maxRows; }

    _replacedOnly = false
    set replacedOnly(replacedOnly) {
        this._replacedOnly = replacedOnly;
        this.trafficService.replacedOnly = replacedOnly;
    }
    get replacedOnly() { return this._replacedOnly; }

    ngOnInit(): void {
        this.trafficService.maxRows = this.maxRows;
        this.requestsObservable = this.trafficService.traffic
        // .filter(reqRes => !this.replacedOnly || !!reqRes. origUrl)
        // .scan((arr, req) => {
        //     arr.push(req);
        //     return arr.slice(-1 * this.maxRows);
        // }, []);
    }

    clear() {
        this.trafficService.clear();
    }

}
