import {$WebSocket} from 'angular2-websocket/angular2-websocket';
import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Rx";

@Injectable()
export class jsonrpcService{
    private _maxRequest: number = 100;
    public client: jsonrpcClient;
    public server: jsonrpcServer;

    public connectionStatusUp: boolean = false;
    public connectionStatusChange: Subject<boolean> = new Subject<boolean>();

    checkStatus() {
        this.connectionStatusUp = this.server && this.client ? true : false;
        console.log("jsonRPC.checkStatus : ", this.connectionStatusUp);
        this.connectionStatusChange.next(this.connectionStatusUp);
    }
    resetConn() {
        this.server.ws.close(true);
        this.client.ws.close(true);
        this.server = null;
        this.client = null;
        this.checkStatus();
    }

    newClient(addr: string, initialMsg: string = ""): jsonrpcClient {
        console.log("jsonRPC.newClient : ", initialMsg);
        this.client = {
            i: 0,
            maxRequest: this._maxRequest,
            request: [],
            addr: addr,
            ws: new $WebSocket(addr),
        };
        this.client.ws.onMessage(this.onClientMessage.bind(this), null);
        this.client.ws.onError(this.onClientError.bind(this));
        this.client.ws.onClose(this.onClientClose.bind(this));

        // Send a first message for initial handshake
        this.client.ws.send(initialMsg);
        this.checkStatus();
        return this.client;
    }

    Call(method: string, params: any, callback?: Function): void {
        if (!this.client) {
            console.log("Client is not ready ! ", method, params);
            return;
        }
        let data: string;
        let dataObj: jsonrpcRequest;

        while (this.client.request[this.client.i] != null) {
            this.client.i++;

            if (this.client.i >= this.client.maxRequest) {
                this.client.i = 0;
            }
        }

        dataObj = {
            id: this.client.i,
            method: method,
            params: [params]
        };

        data = JSON.stringify(dataObj);
        this.client.ws.send(data);

        if (callback != null) {
            dataObj.callback = callback;
        }
        this.client.request[this.client.i] = dataObj;
    }

    PromiseCall(method: string, params: any): Promise<any> {
        let self = this;
        return new Promise(function(success, reject) {
            self.Call(method, params, function(result, error) {
                if (error) reject(error);
                else success(result);
            });
        });
    }

    onClientMessage(message: any): void {
        let data = JSON.parse(message.data);
        if (this.client.request[data.id].callback != null) {
            this.client.request[data.id].callback(data.result, data.error);
        }
        this.client.request[data.id] = null;
    }
    onClientError(error: any): void {
        console.log("RPC Client Error : ", error);
    }
    onClientClose(): void {
        console.log("jsonRPC.onClientClose()");
        if (this.connectionStatusUp == true) {
            this.resetConn();
        }
    }

    newServer(addr: string, initialMsg: string = "nil"): jsonrpcServer {
        this.server = {
            i: 0,
            method: [],
            addr: addr,
            ws: new $WebSocket(addr)
        };
        this.server.ws.onMessage(this.onServerMessage.bind(this), null);
        this.server.ws.onError(this.onServerError.bind(this));
        this.server.ws.onClose(this.onServerClose.bind(this));

        // Send a first empty message for initial handshake
        let test = this.server.ws.send(initialMsg);
        console.log(test);
        this.checkStatus();
        return this.server;
    }

    Register(method: string, func: Function): void  {
        this.server.method[this.server.i] = {
            method: method,
            func: func
        };
        this.server.i++;
    }

    onServerMessage(message: any): void {
        if (message.data == "ping") {
            this.server.ws.send("pong");
            return
        }
        let response: jsonrpcResponse;
        let data: string;
	    let d: jsonrpcRequest;
        d = JSON.parse(message.data);
        for (let i = 0; i < this.server.i; i++) {
            if (this.server.method[i].method == d.method) {
                let fn = this.server.method[i].func;
                if (typeof fn === "function") {
                    let result = fn.apply(null, d.params);
                    response = {
                        id: d.id,
                        result: result
                    };
                    data = JSON.stringify(response);
                    this.server.ws.send(data);
                    return;
                }
                response = {
                    id: d.id,
                    error: 'Method registered but is not a function'
                };
                data = JSON.stringify(response);
                this.server.ws.send(data);
                return;
            }
        }

        response = {
            id: d.id,
            error: 'Method not found'
        };
        data = JSON.stringify(response);
        this.server.ws.send(data);
    }
    onServerError(error: any): void {
        console.log("RPC Server Error : ", error)
    }
    onServerClose(): void {
        console.log("jsonRPC.onServerClose()");
        if (this.connectionStatusUp == true) {
            this.resetConn();
        }
    }
}

interface jsonrpcRequest {
    id: number;
    method: string;
    params?: any;
    callback?: Function;
}

interface jsonrpcResponse {
    id: number;
    result?: any;
    error?: string;
}

interface jsonrpcError {
    code: number;
    message: string;
    data?: any;
}

interface jsonrpcClient {
    i: number;
    maxRequest: number;
    request: Array<any>;
    addr: string;
    ws: $WebSocket;
}

interface jsonrpcServer {
    i: number;
    method: Array<any>;
    addr: string;
    ws: $WebSocket;
}