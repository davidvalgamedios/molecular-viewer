import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class EditorService {
    // Observable sources
    private loadMoleculeSbj = new Subject<string>();

    // Observable  streams
    moleculeLoadSbj$ = this.loadMoleculeSbj.asObservable();


    constructor(){

    }


    // Service message commands
    sendLoadMolecule(moleculeId: string){
        this.loadMoleculeSbj.next(moleculeId);
    }
}