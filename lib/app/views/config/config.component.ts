import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../service/socket.service';
import { Observable } from 'rxjs/Observable';

var diff = nw.require("diff");

@Component({
    moduleId: module.id,
    templateUrl: 'config.component.html',
    styleUrls: ['config.component.css'],
    selector: 'config',
    host: { class: 'flex-grow' }
})
export class ConfigComponent implements OnInit {

    configObservable: Observable<any>

    invalid = false
    _message = ""
    set message(message) {
        this._message = message;
        this.invalid = !!message;
    }
    get message() {
        return this._message;
    }

    get dirty() {
        return this.model != this.origModel;
    }

    origModel: string

    _model: string
    get model() {
        return this._model;
    }
    set model(model) {
        this._model = model;
        try {
            JSON.parse(this.model);
            this.message = null;
        } catch (e) {
            this.message = "Invalid JSON";
        }
    }

    constructor(private socketService: SocketService) { }

    ngOnInit(): void {
        this.socketService.configObservable.subscribe(config => {
            var model = JSON.stringify(config, null, 4);
            if (!this.dirty) {
                this.model = model;
            }
            this.origModel = model;
        });
    }

    save(): void {
        var confObj = JSON.parse(this.model); //we do not allow save for invalid
        this.socketService.replaceConfig(confObj);
    }

    hBlur() {
        if (this.invalid) { return; }
        this.model = JSON.stringify(JSON.parse(this.model), null, 4);
    }

    reset() { this.model = this.origModel; }

    showDiff() {
        diff.diffLines(this.origModel, this.model)
            .forEach(part => {
                console.log(`%c ${part.value}`, `color: ${part.added ? 'green' : part.removed ? 'red' : 'black'}`);
            });
    }
}
