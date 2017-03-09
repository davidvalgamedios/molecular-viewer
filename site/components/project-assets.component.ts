import { Component } from '@angular/core';
import {MoleculesService} from "../services/molecules.service";
import {EditorService} from "../services/editor.service";
import {BackgroundsService} from "../services/backgrounds.service";
import {ProjectService} from "../services/project.service";

@Component({
    selector: 'project-assets',
    template: `
        <div class="box">
            <div class="header">
                Fondo <i class="fa fa-pencil"></i>
            </div>
            <div class="elem background" *ngIf="isBackgroundSelected()"
            [style.background-image]="'url(/dist/img/backgrounds/'+getBackgroundData('img')+')'">
                {{getBackgroundData('name')}}
            </div>
            <div class="elem italic center" *ngIf="!isBackgroundSelected()">
                Sin fondo
            </div>
        </div>
        
        <div class="box" *ngIf="isBackgroundSelected()">
            <div class="header">
                Celulas <i class="fa fa-pencil"></i>
            </div>
            <div class="elem">
                Celulas
            </div>
        </div>
    `
})
export class ProjectAssetsComponent {
    projectCfgCopy:any;
    backgroundData:any = null;

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
    getBackgroundData(dataId){
        if(this.isBackgroundSelected()){
            if(this.backgroundData === null){
                this.backgroundData = this.backgroundsService.getBackgroundData(this.projectCfgCopy.background);
            }

            return this.backgroundData[dataId];
        }
    }

}