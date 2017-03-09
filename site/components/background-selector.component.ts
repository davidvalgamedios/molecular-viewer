import { Component, Output, EventEmitter } from '@angular/core';
import {BackgroundsService} from "../services/backgrounds.service";

@Component({
    selector: 'background-selector',
    template: `
        <div class="blur"></div>
        <div class="popupContainer">
            <div class="header">
                Selecciona el fondo <i class="fa fa-close" (click)="closePopup()"></i>
            </div>
            <div class="content">
                <div class="backSelector" *ngFor="let oBack of allBackgrounds" (click)="selectBackground(oBack.id)"
                    [ngClass]="{'selected':actualBackground==oBack.id}">
                    <div class="img" [style.background-image]="'url(/dist/img/backgrounds/'+oBack.img+')'">
                        <div class="actual flxCntr">
                            <i class="fa fa-check"></i>
                        </div>
                    </div>
                    <div class="label">{{oBack.name}}</div>
                </div>
            </div>
            <div class="footer">
                <div (click)="sendBackground()" class="btn" [ngClass]="{'disabled': !actualBackground}">Elegir</div>
            </div>
        </div>
    `
})
export class BackgroundSelectorComponent {
    allBackgrounds:any;
    actualBackground:string;

    @Output() backgroundSelected: EventEmitter<string> = new EventEmitter<string>();

    constructor(private backgroundsService:BackgroundsService){
        this.allBackgrounds = backgroundsService.getBackgrounds();
    }

    selectBackground(backgroundId:string){
        this.actualBackground = backgroundId;
    }

    sendBackground(){
        if(this.actualBackground){
            this.backgroundSelected.emit(this.actualBackground);
        }
    }

    closePopup(){
        this.backgroundSelected.emit('closePopup');
    }
}