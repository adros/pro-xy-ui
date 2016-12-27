import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
    moduleId: module.id,
    selector: "diff-dialog",
    styles: ["pre{height: calc(100% - 10px);}"],
    templateUrl: "diff.dialog.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiffDialog {
    constructor(public dialogRef: MdDialogRef<DiffDialog>) { }

    diff: any


}
