import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class EditorService {
    private loadedMolecules = [];
    // Observable sources
    private loadMoleculeSbj = new Subject<string>();

    // Observable  streams
    moleculeLoadSbj$ = this.loadMoleculeSbj.asObservable();


    constructor(){

    }


    // Service message commands
    sendLoadMolecule(moleculeId: string){
        this.loadedMolecules.push(moleculeId);
        this.loadMoleculeSbj.next(moleculeId);
        console.log(this.loadedMolecules);
    }


    getLoadedMolecules(){
        return this.loadedMolecules;
    }
}