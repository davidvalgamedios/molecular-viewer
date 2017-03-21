import { Component, Output, EventEmitter } from '@angular/core';
import {BackgroundsService} from "../services/backgrounds.service";
import {ProjectService} from "../services/project.service";

@Component({
    selector: 'editor-navbar',
    template: `
        <div class="navbar">
            <span class="title" (click)="editProjectName()">
                <div *ngIf="!isEditingProjectName">
                    {{projectName}} <i class="fa fa-pencil"></i>
                </div>
                <div *ngIf="isEditingProjectName">
                    <input size="20" [(ngModel)]="projectName" (keypress)="finishEdit($event)">
                </div>
            </span>
        </div>
    `
})
export class EditorNavbarComponent {
    isEditingProjectName:boolean = false;
    projectName:string;

    constructor(private projectService:ProjectService){
        this.projectName = this.projectService.getProjectName();
    }

    editProjectName(){
        this.isEditingProjectName = true;
    }
    finishEdit(event:any){
        if(event.code == 'Enter'){
            this.isEditingProjectName = false;
            this.projectService.updateProjectName(this.projectName);
        }
    }
}