import { Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
var app = nw.require('nw.gui').App;

@Component({
    moduleId: module.id,
    templateUrl: 'composer.component.html',
    styleUrls: ['composer.component.css'],
    selector: 'composer',
    host: { class: 'flex-grow' },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComposerComponent implements OnInit {

    invalid = false
    model = 'GET http://sample.foo/bar?baz\ncontent-type: application/json\naccept: */*\n\n{"sample":1}'

    constructor(private http: Http) {
    }

    ngOnInit(): void {
    }

    hBlur() {
        if (this.invalid) { return; }
        //this.model = JSON.stringify(JSON.parse(this.model), null, 4);
    }

    send() {
        //TODO read port from config
        app.setProxyConfig("http=localhost:8000,direct://;direct://");
        this.http.get("http://registry.npmjs.org/pro-xy-ui?cacheBust=" + Math.random())
            .toPromise()
            .then(response => console.log(response))
            .catch(err => console.error(err))
            .then(() => app.setProxyConfig(""));
    }
}
