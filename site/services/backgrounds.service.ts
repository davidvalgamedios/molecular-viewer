import { Injectable } from '@angular/core';

@Injectable()
export class BackgroundsService {
    private backgroundList:any;

    constructor(){
        this.backgroundList = [
            {
                name: 'Bio',
                id: 'bio',
                img: 'bio.jpg'
            },
            {
                name: 'Sangre',
                id: 'blood',
                img: 'blood.jpg'
            },
            {
                name: 'ADN',
                id: 'dna',
                img: 'dna.png'
            }
        ];
    }

    getBackgrounds(){
        return this.backgroundList;
    }

    getBackgroundData(backgroundId){
        for(let data of this.backgroundList){
            if(data.id == backgroundId){
                return data;
            }
        }
        return null;
    }
}