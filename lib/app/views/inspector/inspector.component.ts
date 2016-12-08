import { Component, OnInit, Input } from '@angular/core';
import {  ReqRes } from '../../model/http';

@Component({
    moduleId: module.id,
    templateUrl: 'inspector.component.html',
    styleUrls: ['inspector.component.css'],
    selector: 'inspector',
    host: { class: 'flex-grow' }
})
export class InspectorComponent implements OnInit {

    @Input() reqRes: ReqRes;

    constructor() { }

    ngOnInit(): void { }

    selectAll(evt) {
        var sel = window.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.selectNodeContents(evt.target);
        sel.addRange(range);
    }

}
