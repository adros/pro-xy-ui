import { Pipe } from '@angular/core';

@Pipe({
    name: 'jsonhtml'
})
export class JsonHtmlPipe {
    transform(val) {
        return JSON.stringify(val, null, 4)
            .replace(' ', '&nbsp;')
            .replace('\n', '<br/>');
    }
}

@Pipe({
    name: 'json'
})
export class JsonPipe {
    transform(val) {
        return JSON.stringify(val, null, "\t");
    }
}
