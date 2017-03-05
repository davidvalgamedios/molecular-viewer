import * as io from 'socket.io-client';
import { UUID } from 'angular2-uuid';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class SocketService {
    private socketUrl = '/';
    private myUuid:string;

    //Observables
    private ownPlayerInfoObs:Observable<string>;
    private guestChangesObs:Observable<any>;
    //Observables

    private socket:any;


    constructor(){
        console.info("CONSTRUCT SOCKET SERVICE");

        this.socket = io(this.socketUrl);

        this.guestChangesObs = new Observable((observer:any) => {
            this.socket.on('current-players', (data:any) => {
                observer.next({action:'current-players', data:data});
            });
            this.socket.on('player-moved', (data:any) => {
                observer.next({action:'moved', data:data});
            });
            this.socket.on('player-joined', (data:any) => {
                observer.next({action:'joined', data:data});
            });
            this.socket.on('player-disconnect', (data:any) => {
                observer.next({action:'disconnect', data:data});
            });
            this.socket.on('player-enter-room', (data:any) => {
                observer.next({action:'enter-room', data:data});
            });
            this.socket.on('player-leave-room', (data:any) => {
                observer.next({action:'leave-room', data:data});
            });
        });

        this.ownPlayerInfoObs = new Observable((observer:any) => {
            this.socket.on('own-player-info', (list:any) => {
                observer.next(list);
                observer.complete();
            });
        });
    }

    initialize(roomId:string){
        let savedUuid = localStorage.getItem('savedUuid');
        if(savedUuid){
            this.myUuid = savedUuid;
        }
        else{
            this.myUuid = UUID.UUID();
            localStorage.setItem('savedUuid', this.myUuid);
        }

        this.socket.emit('identify-me', {myId:this.myUuid,roomId:roomId});
    }

    getGuestChanges(){
        return this.guestChangesObs;
    }
    getOwnPlayerInfo(){
        return this.ownPlayerInfoObs;
    }

    send(action:string, msg:any){
        this.socket.emit(action, msg);
    }

}