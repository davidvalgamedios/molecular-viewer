import { Component } from '@angular/core';
import {ProjectService} from "../services/project.service";

@Component({
    selector: 'editor',
    template: `
        <div class="navbar">
            <span class="title" (click)="editProjectName()">
                <div *ngIf="!isEditingProjectName">
                    {{projectCfg.projectName}} <i class="fa fa-pencil"></i>
                </div>
                <div *ngIf="isEditingProjectName">
                    <input size="20" [(ngModel)]="projectNameEditor" (keypress)="finishEdit($event)">
                </div>
            </span>
        </div>
        <div class="editor">
            <project-assets></project-assets>
            <div class="mainContainer" *ngIf="!isNewEmptyProject()">
                <visor></visor>
            </div>
            
            <div *ngIf="isNewEmptyProject()" class="explanation flxCntr">
                <div class="big">¡Hola! Parece que este proyecto está vacio.</div>
                <div class="med">¿Que te parece si empezamos por añadir un fondo?</div>
                <div class="action">
                    <div class="btn" (click)="selectBackground()">
                        Añadir fondo <i class="fa fa-plus-circle"></i>
                    </div>
                </div>
                <div class="small">(Podrás cambiarlo más tarde si no te gusta)Psst. Todos tus cambios se guardarán automáticamente en tu ordenador. Solo recuerda guardar antes de irte.</div>
            </div>
        </div>
        <!--<footer></footer>-->
        <background-selector></background-selector>
    `
})
export class EditorPageComponent{
    isEditingProjectName:boolean = false;
    projectNameEditor:string;

    projectCfg:any;


    constructor(private projectService:ProjectService){
        this.projectCfg = projectService.getProjectConfig();
    }

    editProjectName(){
        this.projectNameEditor = this.projectCfg.projectName;
        this.isEditingProjectName = true;
    }
    finishEdit(event){
        if(event.code == 'Enter'){
            this.isEditingProjectName = false;
            this.projectService.updateProjectName(this.projectNameEditor);
        }
    }

    isNewEmptyProject(){
        return !this.projectCfg.hasOwnProperty('background') || this.projectCfg.background === null;
    }

    selectBackground(){

    }
}