import { Injectable }           from "@angular/core";
import { Observable  }          from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { SocketService }        from './socket.service'
import { ReqRes, Req, Res }             from '../model/http';

@Injectable()
export class TrafficService {

    traffic: Observable<ReqRes[]>
    _cache: Map<number, ReqRes>

    constructor(private socketService: SocketService) {
        var list: ReqRes[] = [];
        this._cache = new Map<number, ReqRes>();

        this.traffic = Observable.merge(
            socketService.getRequestsObservable(),
            socketService.getResponseObservable()
        ).scan(this._process.bind(this), list);
    }

    _process (list,item){
        if (item instanceof Req) {
            var rr = new ReqRes(item);
            list.push(rr);
            this._cache.set(item.id, rr);
        } else {
            var res = item as Res;
            var rr = this._cache.get(res.id);
            rr && (rr.res = res);
        }
        return list;
    }

}
