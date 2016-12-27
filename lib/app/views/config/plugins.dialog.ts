import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
    moduleId: module.id,
    selector: "plugins-dialog",
    // styles: ["pre{max-height:800px;}"],
    templateUrl: "plugins.dialog.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PluginsDialog {
    constructor(public dialogRef: MdDialogRef<PluginsDialog>) { }

    plugins: { current: string[], expected: string[] }


}
