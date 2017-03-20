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
const rangy = require("rangy/lib/rangy-textrange");
require("rangy/lib/rangy-classapplier");
let FindComponent = class FindComponent {
    constructor(rootElement, cd) {
        this.rootElement = rootElement;
        this.cd = cd;
        this.count = 0;
        this.current = 0;
    }
    set term(term) {
        this._term = term;
        if (!term) {
            this.clearSearch();
            return;
        }
        this.search();
    }
    get term() { return this._term; }
    ngOnInit() {
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
    }
    show() {
        this.rootElement.nativeElement.classList.remove("minimized");
        this.termInput.nativeElement.focus();
        this.term && this.search(); //reinit search
        this.cd.markForCheck();
    }
    hide() {
        this.rootElement.nativeElement.classList.add("minimized");
        this.term = "";
    }
    search() {
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
        let n = document.querySelector(".search-result-current");
        n && n.scrollIntoViewIfNeeded();
        this.current++;
    }
    clearSearch() {
        if (!this.range) {
            return;
        } //not initialized yet
        this.count = 0;
        this.current = 0;
        this.range.selectNodeContents(document.body);
        this.searchResultApplier.undoToRange(this.range);
        this.searchResultCurrentApplier.undoToRange(this.range);
    }
};
__decorate([
    core_1.ViewChild("termInput"),
    __metadata("design:type", Object)
], FindComponent.prototype, "termInput", void 0);
FindComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'find.component.html',
        styleUrls: ['find.component.css'],
        selector: 'find',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.ChangeDetectorRef])
], FindComponent);
exports.FindComponent = FindComponent;
