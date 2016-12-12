import { Component, OnInit, Input } from '@angular/core';
import {  ReqRes } from '../../model/http';

var gui = nw.require('nw.gui');
var clipboard = gui.Clipboard.get();

@Component({
    moduleId: module.id,
    templateUrl: 'inspector.component.html',
    styleUrls: ['inspector.component.css'],
    selector: 'inspector',
    host: { class: 'flex-grow' }
})
export class InspectorComponent implements OnInit {

    @Input() reqRes: ReqRes;

    private menuItems: any[]

    constructor() {
        this.menuItems = [
            new nw.MenuItem({ label: "Copy URL", click: () => this.reqRes && clipboard.set(this.reqRes.url, "text") }),
            new nw.MenuItem({ label: "Copy req & res", click: () => this.reqRes && clipboard.set(this.reqRes.toString(), "text") }),
            new nw.MenuItem({ type: "separator" })
        ];
    }

    ngOnInit(): void { }

    selectAll(evt) {
        var sel = window.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.selectNodeContents(evt.target);
        sel.addRange(range);
    }

    hCtxMenu(evt) {
        evt.menuItems = (evt.menuItems || []).concat(this.menuItems);
    }

}
