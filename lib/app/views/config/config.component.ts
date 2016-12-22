import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { SocketService } from "../../service/socket.service";
import { Observable } from "rxjs/Observable";
import { MdDialogRef, MdDialog } from "@angular/material";
import { DiffDialog } from "./diff-dialog.component";
import defaultConfig from "../../service/config.defaultConfig";

var diff = nw.require("diff");

@Component({
    moduleId: module.id,
    templateUrl: "config.component.html",
    styleUrls: ["config.component.css"],
    selector: "config",
    host: { class: "flex-grow" },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigComponent implements OnInit {

    dialogRef: MdDialogRef<DiffDialog>;

    constructor(private dialog: MdDialog, private socketService: SocketService, private cd: ChangeDetectorRef) { }

    configObservable: Observable<any>
    isConcurentModification = false
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

    get resetTitle() {
        if (!this.isConcurentModification) { return ""; }
        return "Config was modified outside of 'Config' tab. Use 'Reset' to load new config. 'Save' will override new config.";
    }

    ngOnInit(): void {
        this.socketService.configObservable.subscribe(config => {
            var model = JSON.stringify(config, null, 4);
            if (!this.dirty) {
                this.model = model;
            }
            this.origModel = model;
            //if still dirty - concurent modif (else - it was our save reflected back)
            this.isConcurentModification = this.dirty;
            this.cd.markForCheck();
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

    reset() {
        this.model = this.origModel;
        this.isConcurentModification = false;
    }

    showDiff() {
        diff.diffLines(this.origModel, this.model)
            .forEach(part => {
                console.log(`%c ${part.value}`, `color: ${part.added ? "green" : part.removed ? "red" : "black"}`);
            });

        this.dialogRef = this.dialog.open(DiffDialog, { disableClose: false });
        this.dialogRef.componentInstance.diff = diff.diffLines(this.origModel, this.model);
    }

    loadDefault() {
        this.model = JSON.stringify(defaultConfig, null, 4);
    }
}
