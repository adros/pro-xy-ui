import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from "@angular/core";
import { SocketService } from "../../service/socket.service";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { DiffDialog } from "./diff.dialog";
import { PluginsDialog } from "./plugins.dialog";
import defaultConfig from "../../service/config.defaultConfig";
import { Config } from "../../model/config";
import { MdSnackBar, MdSnackBarConfig } from "@angular/material";

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

    constructor(private dialog: MdDialog, private socketService: SocketService, private cd: ChangeDetectorRef, private snackBar: MdSnackBar) { }

    @Output()
    restartNeeded = new EventEmitter<any>();

    //PRE with content editable is used, to support CTRL-F (search) in config; it would not work in textarea
    @ViewChild("preNode") preNode: any;

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
        if (this.preNode.nativeElement.innerText != model) {
            this.preNode.nativeElement.innerText = model;
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

        this.socketService.configObservable
            .filter(config => !config.isEmpty)
            .first()
            .subscribe(config => this.checkPlugins(config));

        this.preNode.nativeElement
    }

    trySave(): void {
        this.hBlur();
        if (!this.dirty || this.invalid) {
            return this.msg(this.dirty ? "Invalid JSON!" : "No changes in config!");
        }
        this.save();
    }

    save(): void {
        var confObj = JSON.parse(this.model); //we do not allow save for invalid
        this.socketService.replaceConfig(confObj);
        this.msg("Config was saved.");
    }

    msg(str: string) {
        var ref = this.snackBar.open(str, null, {
            duration: 1000,
        } as MdSnackBarConfig);
    }

    hBlur() {
        if (this.invalid) { return; }
        this.model = JSON.stringify(JSON.parse(this.model), null, 4);
        this.cd.markForCheck();
    }

    hPaste(evt) {
        evt.preventDefault();// cancel paste
        var text = evt.clipboardData.getData("text/plain"); // get text representation of clipboard
        document.execCommand("insertHTML", false, text); // insert text manually
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

        var dialogRef = this.dialog.open(DiffDialog, {
            disableClose: false,
            height: '90%',
            width: '850px'
        });
        dialogRef.componentInstance.diff = diff.diffLines(this.origModel, this.model);
    }

    defaultConfigJson = JSON.stringify(defaultConfig, null, 4)

    checkPlugins(config: Config) {
        if (JSON.stringify(config.plugins) == JSON.stringify(defaultConfig.plugins)) { return; }
        var dialogRef = this.dialog.open(PluginsDialog, {
            disableClose: true,
            height: '450px',
            width: '850px'
        });
        dialogRef.componentInstance.plugins = { current: config.plugins, expected: defaultConfig.plugins };

        dialogRef.afterClosed().subscribe(doReplace => {
            if (!doReplace) { return; }
            this.socketService.updateConfig(Object.assign(config, { plugins: defaultConfig.plugins }));
            this.restartNeeded.emit();
        });
    }
}
