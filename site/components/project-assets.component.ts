import { Component, Output, EventEmitter } from '@angular/core';
import {MoleculesService} from "../services/molecules.service";
import {BackgroundsService} from "../services/backgrounds.service";
import {ProjectService} from "../services/project.service";

@Component({
    selector: 'project-assets',
    template: `
        <div class="box">
            <div class="header">
                Fondo <i class="fa fa-pencil" (click)="sendEditorSignal('editBackground')"></i>
            </div>
            <div class="elem background" *ngIf="isBackgroundSelected()"
            [style.background-image]="'url(/dist/img/backgrounds/'+backgroundData.img+')'">
                {{backgroundData.name}}
            </div>
            <div class="elem empty" *ngIf="!isBackgroundSelected()">
                Sin fondo
            </div>
        </div>
        
        <div class="box" *ngIf="isBackgroundSelected()">
            <div class="header">
                Moléculas <i class="fa fa-plus" *ngIf="moleculesData.length < 2" (click)="sendEditorSignal('addMolecule')"></i>
            </div>
            <div *ngIf="isAnyMolecule()">
                <div class="elem" *ngFor="let sMol of moleculesData">
                   {{sMol}} <i class="fa fa-minus" (click)="removeMolecule(sMol)"></i>
                </div>
            </div>
            <div *ngIf="!isAnyMolecule()" class="elem empty">
                Ninguna molécula
            </div>
        </div>
        
        <div class="box" *ngIf="isBackgroundSelected() && isAnyMolecule()">
            <div class="header">
                Pasos <i class="fa fa-plus"></i>
            </div>
        </div>
    `
})
export class ProjectAssetsComponent {
    backgroundData:any = null;
    moleculesData:any = [];

    @Output() editorCommands: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private moleculesService:MoleculesService,
        private backgroundsService: BackgroundsService,
        private projectService: ProjectService){
        this.projectService.changesDetector.subscribe((changed)=>{
            this.updateProjectValues(changed)
        });

        let backgroundId = this.projectService.getBackground();
        if(backgroundId){
            this.backgroundData = this.backgroundsService.getBackgroundData(backgroundId);
        }

        let moleculesId = this.projectService.getMolecules();
        if(moleculesId){
            this.moleculesData = moleculesId;
        }
    }

    isBackgroundSelected(){
        return this.backgroundData != null;
    }
    getBackgroundData(dataId:string){
        if(this.isBackgroundSelected() && this.backgroundData.hasOwnProperty(dataId)){
            return this.backgroundData[dataId];
        }
    }
    isAnyMolecule(){
        return this.moleculesData.length != 0;
    }
    getMoleculeData(dataId:string){

    }

    sendEditorSignal(signal:string){
        this.editorCommands.emit(signal);
    }

    updateProjectValues(changed:string){
        if(changed == 'background'){
            let backgroundId = this.projectService.getBackground();
            if(backgroundId){
                this.backgroundData = this.backgroundsService.getBackgroundData(backgroundId);
            }
            else{
                this.backgroundData = null;
            }
        }
        else if(changed == 'molecules'){
            let moleculesId = this.projectService.getMolecules();
            if(moleculesId){
                this.moleculesData = moleculesId;
            }
        }
    }

    removeMolecule(moleculeId){
        this.projectService.removeMolecule(moleculeId);
    }
}