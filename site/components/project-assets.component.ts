import { Component } from '@angular/core';
import {MoleculesService} from "../services/molecules.service";
import {EditorService} from "../services/editor.service";

@Component({
    selector: 'project-assets',
    template: `
        <div class="box">
            <div class="header">
                Fondo <i class="fa fa-pencil"></i>
            </div>
            <div class="elem background">
                Celulas
            </div>
        </div>
        
        <div class="box">
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

    constructor(private moleculesService:MoleculesService, private editorService:EditorService){

    }


}