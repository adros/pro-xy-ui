import { Component, OnInit, ElementRef, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as rangy from "rangy/lib/rangy-textrange";
import "rangy/lib/rangy-classapplier";

@Component({
    moduleId: module.id,
    templateUrl: 'find.component.html',
    styleUrls: ['find.component.css'],
    selector: 'find',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FindComponent implements OnInit {

    constructor(private rootElement: ElementRef, private cd: ChangeDetectorRef) { }

    @ViewChild("termInput") termInput: any;

    termControl = new FormControl();

    _term: string
    set term(term) {
        this._term = term;
        if (!term) {
            this.clearSearch();
            return;
        }
        this.search();
    }
    get term() { return this._term; }

    range: any
    options: any
    searchResultApplier: any
    searchResultCurrentApplier: any
    count = 0
    current = 0

    ngOnInit(): void {
        this.range = rangy.createRange();
        var searchScopeRange = rangy.createRange();
        searchScopeRange.selectNodeContents(document.body);
        this.searchResultApplier = rangy.createClassApplier("search-result");
        this.searchResultCurrentApplier = rangy.createClassApplier("search-result-current");

        this.options = {
            caseSensitive: false,
            wholeWordsOnly: false,
            withinRange: searchScopeRange,
            direction: "forward"
        };

        this.termControl.valueChanges
            .debounceTime(400)
            .subscribe(term => { this.term = term; this.cd.markForCheck(); });
    }

    show() {
        this.rootElement.nativeElement.classList.remove("minimized");
        this.termInput.nativeElement.focus();
        this.termInput.nativeElement.select();
        this.term && this.search(); //reinit search
        this.cd.markForCheck();
    }
    hide() {
        this.rootElement.nativeElement.classList.add("minimized");
        this.term = "";
    }

    private search() {
        this.clearSearch();
        while (this.range.findText(this.term, this.options)) {
            this.searchResultApplier.applyToRange(this.range);
            this.range.collapse(false);
            this.count++;
        }

        this.range.selectNodeContents(document.body);
        this.highlightCurrent();
    }

    next() {
        this.searchResultCurrentApplier.undoToRange(this.range);
        this.range.collapse(false);
        if (this.current == this.count) {
            this.range.selectNodeContents(document.body);
            this.current = 0;
        }
        this.highlightCurrent();
    }

    highlightCurrent() {
        if (!this.range.findText(this.term, this.options)) {
            return;
        }
        this.searchResultCurrentApplier.applyToRange(this.range);
        let n = document.querySelector(".search-result-current")
        n && n.scrollIntoView();
        this.current++;
    }

    private clearSearch() {
        if (!this.range) { return; } //not initialized yet
        this.count = 0;
        this.current = 0;
        this.range.selectNodeContents(document.body);
        this.searchResultApplier.undoToRange(this.range);
        this.searchResultCurrentApplier.undoToRange(this.range);
    }

}
