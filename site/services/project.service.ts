import { Injectable } from '@angular/core';

@Injectable()
export class ProjectService {
    private projectCfg:any;

    constructor(){
        this.projectCfg = {
            projectName: 'Proyecto de prueba',
        }
    }

    getProjectConfig(){
        return this.projectCfg;
    }

    updateProjectName(newName:string){
        this.projectCfg.projectName = newName;
    }
}