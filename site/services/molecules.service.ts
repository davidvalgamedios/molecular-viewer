import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';



@Injectable()
export class MoleculesService {
    private moleculeList:any;

    constructor(){
        this.moleculeList = [
            {
                name: 'Ethanol',
                id: 'ethanol'
            },
            {
                name: 'Aspirin',
                id: 'aspirin'
            },
            {
                name: 'Caffeine',
                id: 'caffeine'
            },
            {
                name: 'Nicotine',
                id: 'nicotine'
            },
            {
                name: 'LSD',
                id: 'lsd'
            },
            {
                name: 'Cocaine',
                id: 'cocaine'
            },
            {
                name: 'Cholesterol',
                id: 'cholesterol'
            },
            {
                name: 'Lycopene',
                id: 'lycopene'
            },
            {
                name: 'Glucose',
                id: 'glucose'
            },
            {
                name: 'Aluminium Oxide',
                id: 'Al2O3'
            },
            {
                name: 'Cubane',
                id: 'cubane'
            },
            {
                name: 'Copper',
                id: 'cu'
            },
            {
                name: 'Fluorite',
                id: 'caf2'
            },
            {
                name: 'Salt',
                id: 'nacl'
            },
            {
                name: 'Graphite',
                id: 'graphite'
            }
        ];
    }

    getMoleculesList(){
        return this.moleculeList;
    }
}