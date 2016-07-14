import {$WebSocket} from 'angular2-websocket/angular2-websocket';
import {Injectable} from '@angular/core';

@Injectable()
export class jsonrpcService{
    private _maxRequest: number = 100;
    public client: jsonrpcClient;
    public server: jsonrpcServer;

    newClient(addr: string, initialMsg: string = ""): jsonrpcClient {
        this.client = {
            i: 0,
            maxRequest: this._maxRequest,
            request: [],
            addr: addr,
            ws: new $WebSocket(addr),
        };
        this.client.ws.onMessage(this.onClientMessage.bind(this), null);

        // Send a first message for initial handshake
        this.client.ws.send(initialMsg);
        return this.client;
    }

    Call(method: string, params: any, callback?: Function): void {
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

    newServer(addr: string, initialMsg: string = "nil"): jsonrpcServer {
        this.server = {
            i: 0,
            method: [],
            addr: addr,
            ws: new $WebSocket(addr)
        };
        this.server.ws.onMessage(this.onServerMessage.bind(this), null);

        // Send a first empty message for initial handshake
        let test = this.server.ws.send(initialMsg);
        console.log(test);
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
                    console.log(response);
                    data = JSON.stringify(response);
                    this.server.ws.send(data);
                    return;
                }
                response = {
                    id: d.id,
                    error: {
                        code: -32000,
                        message: 'Method registered but is not a function'
                    }
                };
                data = JSON.stringify(response);
                this.server.ws.send(data);
                return;
            }
        }

        response = {
            id: d.id,
            error: {
                code: -32601,
                message: 'Method not found'
            }
        };
        data = JSON.stringify(response);
        this.server.ws.send(data);
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
    error?: jsonrpcError;
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
