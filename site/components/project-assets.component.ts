import { Component, Output, EventEmitter } from '@angular/core';
import {MoleculesService} from "../services/molecules.service";
import {EditorService} from "../services/editor.service";
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
            [style.background-image]="'url(/dist/img/backgrounds/'+getBackgroundData('img')+')'">
                {{getBackgroundData('name')}}
            </div>
            <div class="elem empty" *ngIf="!isBackgroundSelected()">
                Sin fondo
            </div>
        </div>
        
        <div class="box" *ngIf="isBackgroundSelected()">
            <div class="header">
                Moléculas <i class="fa fa-plus" (click)="sendEditorSignal('addMolecule')"></i>
            </div>
            <div *ngIf="isAnyMolecule()">
                <div class="elem" *ngFor="let sMol of projectCfgCopy.molecules">
                   {{sMol}}
                </div>
            </div>
            <div *ngIf="!isAnyMolecule()" class="elem empty">
                Ninguna molécula
            </div>
        </div>
    `
})
export class ProjectAssetsComponent {
    projectCfgCopy:any;

    @Output() editorCommands: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private moleculesService:MoleculesService,
        private editorService:EditorService,
        private backgroundsService: BackgroundsService,
        private projectService: ProjectService){
        this.projectCfgCopy = projectService.getProjectConfig();
    }

    isBackgroundSelected(){
        return this.projectCfgCopy.hasOwnProperty('background') && this.projectCfgCopy.background !== null;
    }
    getBackgroundData(dataId:string){
        if(this.isBackgroundSelected()){
            let backgroundData = this.backgroundsService.getBackgroundData(this.projectCfgCopy.background);

            return backgroundData[dataId];
        }
    }
    isAnyMolecule(){
        return this.projectCfgCopy.hasOwnProperty('molecules') && this.projectCfgCopy.molecules.length != 0;
    }
    getMoleculeData(dataId:string){

    }

    sendEditorSignal(signal:string){
        this.editorCommands.emit(signal);
    }
}