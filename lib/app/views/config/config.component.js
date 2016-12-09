"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require("@angular/core");
const socket_service_1 = require("../../service/socket.service");
const material_1 = require("@angular/material");
const diff_dialog_component_1 = require("./diff-dialog.component");
var diff = nw.require("diff");
let ConfigComponent = class ConfigComponent {
    constructor(dialog, socketService) {
        this.dialog = dialog;
        this.socketService = socketService;
        this.isConcurentModification = false;
        this.invalid = false;
        this._message = "";
    }
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
    get model() {
        return this._model;
    }
    set model(model) {
        this._model = model;
        try {
            JSON.parse(this.model);
            this.message = null;
        }
        catch (e) {
            this.message = "Invalid JSON";
        }
    }
    get resetTitle() {
        if (!this.isConcurentModification) {
            return "";
        }
        return "Config was modified outside of 'Config' tab. Use 'Reset' to load new config. 'Save' will override new config.";
    }
    ngOnInit() {
        this.socketService.configObservable.subscribe(config => {
            var model = JSON.stringify(config, null, 4);
            if (!this.dirty) {
                this.model = model;
            }
            this.origModel = model;
            //if still dirty - concurent modif (else - it was our save reflected back)
            this.isConcurentModification = this.dirty;
        });
    }
    save() {
        var confObj = JSON.parse(this.model); //we do not allow save for invalid
        this.socketService.replaceConfig(confObj);
    }
    hBlur() {
        if (this.invalid) {
            return;
        }
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
        this.dialogRef = this.dialog.open(diff_dialog_component_1.DiffDialog, { disableClose: false });
        this.dialogRef.componentInstance.diff = diff.diffLines(this.origModel, this.model);
    }
};
ConfigComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "config.component.html",
        styleUrls: ["config.component.css"],
        selector: "config",
        host: { class: "flex-grow" }
    }), 
    __metadata('design:paramtypes', [material_1.MdDialog, socket_service_1.SocketService])
], ConfigComponent);
exports.ConfigComponent = ConfigComponent;
