import { Component, Output, EventEmitter } from '@angular/core';
import {BackgroundsService} from "../services/backgrounds.service";
import {ProjectService} from "../services/project.service";
import {MoleculesService} from "../services/molecules.service";

@Component({
    selector: 'molecules-selector',
    template: `
        <div class="blur"></div>
        <div class="popupContainer">
            <div class="header">
                Selecciona una molécula <i class="fa fa-close" (click)="closePopup()"></i>
            </div>
            <div class="content">
            <!--TODO: Add search function--> 
                <div class="backSelector" *ngFor="let oMol of allMolecules" (click)="selectMolecule(oMol.id)"
                    [ngClass]="{'selected':actualMolecule==oMol.id}">
                    <div class="img" [style.background-image]="'url(/dist/img/molecules/placeholder.jpeg)'">
                        <div class="actual flxCntr">
                            <i class="fa fa-check"></i>
                        </div>
                    </div>
                    <div class="label">{{oMol.name}}</div>
                </div>
            </div>
            <div class="footer">
                <div (click)="addMolecule()" class="btn" [ngClass]="{'disabled': !actualMolecule}">Añadir</div>
            </div>
        </div>
    `
})
export class MoleculesSelectorComponent {
    allMolecules:any;
    actualMolecule:string;

    @Output() moleculeSelected: EventEmitter<string> = new EventEmitter<string>();

    constructor(private moleculesService:MoleculesService, private projectService:ProjectService){
        let projectData = this.projectService.getProjectConfig();
        /*if(projectData.hasOwnProperty('background') && projectData['background'] !== null){
            this.actualMolecule = projectData['background'];
        }*/
        this.allMolecules = moleculesService.getMoleculesList();
    }

    selectMolecule(moleculeId:string){
        this.actualMolecule = moleculeId;
    }

    addMolecule(){
        if(this.actualMolecule){
            this.moleculeSelected.emit(this.actualMolecule);
        }
    }

    closePopup(){
        this.moleculeSelected.emit('closePopup');
    }
}