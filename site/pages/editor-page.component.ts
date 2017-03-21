import {Component, Output, EventEmitter} from '@angular/core';
import {ProjectService} from "../services/project.service";

@Component({
    selector: 'editor',
    template: `
        <div class="navbar">
            <span class="title" (click)="editProjectName()">
                <div *ngIf="!isEditingProjectName">
                    {{projectCfgCopy.projectName}} <i class="fa fa-pencil"></i>
                </div>
                <div *ngIf="isEditingProjectName">
                    <input size="20" [(ngModel)]="projectNameEditor" (keypress)="finishEdit($event)">
                </div>
            </span>
        </div>
        <div class="editor">
            <project-assets (editorCommands)="parseEditorCommand($event)"></project-assets>
            <div class="mainContainer" *ngIf="mustShowCanvas()">
                <visor></visor>
            </div>
            
            <msg-helper *ngIf="isNewEmptyProject()" [msgId]="'emptyProject'" (editorCommands)="parseEditorCommand($event)"></msg-helper>
            <msg-helper *ngIf="!isNewEmptyProject() && hasNoMolecules()" [msgId]="'noMolecules'" (editorCommands)="parseEditorCommand($event)"></msg-helper>
        </div>
        <events-footer></events-footer>
        <background-selector *ngIf="isSelectingBackground" (backgroundSelected)="setBackground($event)"></background-selector>
        <molecules-selector *ngIf="isAddingMolecule" (moleculeSelected)="addMolecule($event)"></molecules-selector>
    `
})
export class EditorPageComponent{
    isEditingProjectName:boolean = false;
    projectNameEditor:string;
    isSelectingBackground:boolean = false;
    isAddingMolecule:boolean = false;

    @Output() editorCommands: EventEmitter<string> = new EventEmitter<string>();
    @Output() backgroundSelected: EventEmitter<string> = new EventEmitter<string>();

    projectCfgCopy:any;


    constructor(private projectService:ProjectService){
        this.projectCfgCopy = projectService.getProjectConfig();
    }

    editProjectName(){
        this.projectNameEditor = this.projectCfgCopy.projectName;
        this.isEditingProjectName = true;
    }
    finishEdit(event:any){
        if(event.code == 'Enter'){
            this.isEditingProjectName = false;
            this.projectService.updateProjectName(this.projectNameEditor);
        }
    }

    isNewEmptyProject(){
        return !this.projectCfgCopy.hasOwnProperty('background') || this.projectCfgCopy.background === null;
    }
    hasNoMolecules(){
        return !this.projectCfgCopy.hasOwnProperty('molecules') || this.projectCfgCopy.molecules.length == 0;
    }
    mustShowCanvas(){
        return !this.isNewEmptyProject() && !this.hasNoMolecules();
    }

    openBackgroundSelection(){
        this.isSelectingBackground = true;
    }
    setBackground(backgroundId:string){
        this.isSelectingBackground = false;
        if(backgroundId !== 'closePopup'){
            this.projectService.updateBackground(backgroundId);
        }
    }
    addMolecule(moleculeId:string){
        this.isAddingMolecule = false;
        if(moleculeId !== 'closePopup'){
            this.projectService.addMolecule(moleculeId);
        }
    }


    parseEditorCommand(signal:string){
        if(signal == 'editBackground'){
            this.isSelectingBackground = true;
        }
        else if(signal == 'addMolecule'){
            this.isAddingMolecule = true;
        }
    }
}