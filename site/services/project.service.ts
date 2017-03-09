import { Injectable } from '@angular/core';

@Injectable()
export class ProjectService {
    private projectCfg:any;

    constructor(){
        this.projectCfg = {
            projectName: 'Proyecto de prueba',
            background: null
        }
    }

    getProjectConfig(){
        return this.projectCfg;
    }

    updateProjectName(newName:string){
        this.projectCfg.projectName = newName;
    }

    updateBackground(backgroundId:string){
        this.projectCfg.background = backgroundId;
    }
}