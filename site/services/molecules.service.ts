import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';



@Injectable()
export class MoleculesService {
    private moleculeList:any;

    constructor(){
        this.moleculeList = [
            {
                id: '3i64',
                name: '3i64'
            },
            {
                id: '4hhb',
                name: '4hhb'
            }
        ];
    }

    getMoleculesList(){
        return this.moleculeList;
    }
}