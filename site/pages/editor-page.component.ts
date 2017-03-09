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
            <div class="mainContainer" *ngIf="!isNewEmptyProject()">
                <visor></visor>
            </div>
            
            <div *ngIf="isNewEmptyProject()" class="explanation flxCntr">
                <div class="big">Parece que este proyecto está vacio.</div>
                <div class="med">¿Que te parece si empezamos por añadir un fondo?</div>
                <div class="action">
                    <div class="btn" (click)="openBackgroundSelection()">
                        Añadir fondo <i class="fa fa-plus-circle"></i>
                    </div>
                </div>
                <div class="small">(Podrás cambiarlo más tarde si no te gusta)</div>
            </div>
            
            <div *ngIf="isNewEmptyProject()" class="explanation flxCntr">
                <div class="big">¡Genial!</div>
                <div class="med">Ahora que ya tienes un fondo ¿Añadimos algunas moléculas?</div>
                <div class="action">
                    <div class="btn" (click)="openBackgroundSelection()">
                        Añadir moléculas <i class="fa fa-plus-circle"></i>
                    </div>
                </div>
                <div class="small">Psst. Todos tus cambios se guardarán automáticamente en tu ordenador. Solo recuerda guardar antes de irte.</div>
            </div>
        </div>
        <!--<footer></footer>-->
        <background-selector *ngIf="isSelectingBackground" (backgroundSelected)="setBackground($event)"></background-selector>
    `
})
export class EditorPageComponent{
    isEditingProjectName:boolean = false;
    projectNameEditor:string;
    isSelectingBackground:boolean = false;

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
    finishEdit(event){
        if(event.code == 'Enter'){
            this.isEditingProjectName = false;
            this.projectService.updateProjectName(this.projectNameEditor);
        }
    }

    isNewEmptyProject(){
        return !this.projectCfgCopy.hasOwnProperty('background') || this.projectCfgCopy.background === null;
    }

    openBackgroundSelection(){
        this.isSelectingBackground = true;
    }
    setBackground(backgroundId){
        this.isSelectingBackground = false;
        if(backgroundId !== 'closePopup'){
            this.projectService.updateBackground(backgroundId);
        }
    }


    parseEditorCommand(signal){
        if(signal == 'editBackground'){
            this.isSelectingBackground = true;
        }
    }
}