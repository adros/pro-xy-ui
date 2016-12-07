import { Injectable }           from "@angular/core";
import { Observable  }          from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { SocketService }        from './socket.service'
import { ReqRes, Req, Res }             from '../model/http';

@Injectable()
export class TrafficService {

    traffic: Observable<ReqRes[]>
    _cache: Map<number, ReqRes>
    _list: ReqRes[] = []


    _maxRows = Infinity
    set maxRows(maxRows) {
        this._maxRows = maxRows;
        if (this._list.length > maxRows) {
            this._list.splice(maxRows - this._list.length);
        }
    }

    _replacedOnly = false
    set replacedOnly(replacedOnly) {
        this._replacedOnly = replacedOnly;
        // if (this._list.length > maxRows) {
        //     this._list.splice(maxRows - this._list.length);
        // }
        if (replacedOnly) {
            this._list.splice(0).forEach(item => {
                if (item.origUrl) {
                    this._list.push(item);
                }
            });
        }
    }

    constructor(private socketService: SocketService) {
        this._cache = new Map<number, ReqRes>();

        this.traffic = Observable.merge(
            socketService.getRequestsObservable(),
            socketService.getResponseObservable()
        ).scan(this._process.bind(this), this._list);

        socketService.reqBodyChunkObservable.subscribe(evt => this._hReqChunk(evt));
        socketService.resBodyChunkObservable.subscribe(evt => this._hResChunk(evt));
        socketService.reqBodyEndObservable.subscribe(evt => this._hReqEnd(evt));
        socketService.resBodyEndObservable.subscribe(evt => this._hResEnd(evt));
    }

    clear() {
        this._list.splice(0)
    }

    _process(list, item) {
        if (item instanceof Req) {
            if (this._replacedOnly && !item.origUrl) {
                return list;
            }
            var rr = new ReqRes(item);
            list.push(rr);
            this._cache.set(item.id, rr);
        } else {
            var res = item as Res;
            var rr = this._cache.get(res.id);
            rr && (rr.res = res);
        }
        if (list.length > this._maxRows) {
            list.shift();
        }
        return list;
    }

    _hReqChunk(evt) {
        var rr = this._cache.get(evt.id);
        rr && rr.addReqChunk(evt.chunk);
    }

    _hResChunk(evt) {
        var rr = this._cache.get(evt.id);
        rr && rr.addResChunk(evt.chunk);
    }

    _hReqEnd(evt) {
        var rr = this._cache.get(evt.id);
        rr && rr.endReq();
    }

    _hResEnd(evt) {
        var rr = this._cache.get(evt.id);
        rr && rr.endRes();
    }

}
