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
const socket_service_1 = require("./socket.service");
const http_1 = require("../model/http");
let TrafficService = class TrafficService {
    constructor(socketService) {
        this.socketService = socketService;
        this._list = [];
        this._maxRows = Infinity;
        this._replacedOnly = false;
        this._urlPattern = "";
        this._cache = new Map();
        this.traffic = socketService.reqObservable
            .filter(req => !this._replacedOnly || !!req.headers["x-pro-xy-url-replace"])
            .filter(req => !this._urlPatterRegex || this._urlPatterRegex.test(req.url))
            .scan(this._hReq.bind(this), this._list);
        socketService.resObservable.subscribe(evt => this._hRes(evt));
        socketService.reqBodyChunkObservable.subscribe(evt => this._hReqChunk(evt));
        socketService.resBodyChunkObservable.subscribe(evt => this._hResChunk(evt));
        socketService.reqBodyEndObservable.subscribe(evt => this._hReqEnd(evt));
        socketService.resBodyEndObservable.subscribe(evt => this._hResEnd(evt));
    }
    set maxRows(maxRows) {
        this._maxRows = maxRows;
        if (this._list.length > maxRows) {
            this._list.splice(maxRows - this._list.length);
        }
    }
    set replacedOnly(replacedOnly) {
        this._replacedOnly = replacedOnly;
        // if (this._list.length > maxRows) {
        //     this._list.splice(maxRows - this._list.length);
        // }
        // if (replacedOnly) {
        //     this._list.splice(0).forEach(item => {
        //         if (item.headers["x-pro-xy-url-replace"]) {
        //             this._list.push(item);
        //         }
        //     });
        // }
    }
    set urlPattern(urlPattern) {
        this._urlPattern = urlPattern;
        try {
            this._urlPatterRegex = urlPattern && new RegExp(urlPattern) || null;
        }
        catch (e) {
            this._urlPatterRegex = null;
        }
    }
    clear() {
        this._list.splice(0);
    }
    _hReq(list, item) {
        var rr = new http_1.ReqRes(item);
        list.push(rr);
        this._cache.set(item.id, rr);
        if (list.length > this._maxRows) {
            list.shift();
        }
        return list;
    }
    _hRes(res) {
        var rr = this._cache.get(res.id);
        rr && (rr.res = res);
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
};
TrafficService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [socket_service_1.SocketService])
], TrafficService);
exports.TrafficService = TrafficService;
