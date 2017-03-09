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
            <div class="mainContainer">
                <visor></visor>
            </div>
        </div>
        <!--<footer></footer>-->
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
}