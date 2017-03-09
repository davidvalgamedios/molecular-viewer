import { Component } from '@angular/core';
import {EditorService} from "../services/editor.service";
import {BackgroundsService} from "../services/backgrounds.service";

@Component({
    selector: 'background-selector',
    template: `
        <div class="blur"></div>
        <div class="popupContainer">
            <div class="header">
                Selecciona el fondo <i class="fa fa-close"></i>
            </div>
            <div class="content">
                <div class="backSelector" *ngFor="let oBack of allBackgrounds" (click)="selectBackground(oBack.id)"
                    [ngClass]="{'selected':selectedBackground==oBack.id}">
                    <div class="img" [style.background-image]="'url(/dist/img/backgrounds/'+oBack.img+')'">
                        <div class="actual flxCntr">
                            <i class="fa fa-check"></i>
                        </div>
                    </div>
                    <div class="label">{{oBack.name}}</div>
                </div>
            </div>
            <div class="footer">
                <div class="btn" [ngClass]="{'disabled': !selectedBackground}">Elegir</div>
            </div>
        </div>
    `
})
export class BackgroundSelectorComponent {
    allBackgrounds:any;
    selectedBackground:string;

    constructor(private backgroundsService:BackgroundsService){
        this.allBackgrounds = backgroundsService.getBackgrounds();
    }

    selectBackground(backgroundId:string){
        this.selectedBackground = backgroundId;
    }
}