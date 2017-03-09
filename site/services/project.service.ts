import { Injectable } from '@angular/core';

@Injectable()
export class ProjectService {
    private projectId:string;
    private projectCfg:any;

    constructor(){
        this.projectId = 'demo';

        let savedData = localStorage.getItem('prj-'+this.projectId);
        if(savedData){
            this.projectCfg = JSON.parse(savedData);
        }
        else{
            this.projectCfg = {
                projectName: 'Proyecto de prueba',
                background: null,
                molecules: []
            }
        }
    }

    getProjectConfig():any{
        return this.projectCfg;
    }

    updateProjectName(newName:string){
        this.projectCfg.projectName = newName;
        this.saveChangesLocally();
    }

    updateBackground(backgroundId:string){
        this.projectCfg.background = backgroundId;
        this.saveChangesLocally();
    }

    addMolecule(moleculeId:string){
        if(!this.projectCfg.hasOwnProperty('molecules')){
            this.projectCfg.molecules = [];
        }

        if(this.projectCfg.molecules.length < 2 && this.projectCfg.molecules.indexOf(moleculeId) === -1){
            this.projectCfg.molecules.push(moleculeId);
            this.saveChangesLocally();
        }
    }


    private saveChangesLocally():void{
        localStorage.setItem('prj-'+this.projectId, JSON.stringify(this.projectCfg));
    }
}