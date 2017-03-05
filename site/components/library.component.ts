import { Component } from '@angular/core';
import {MoleculesService} from "../services/molecules.service";
import {EditorService} from "../services/editor.service";

@Component({
    selector: 'library',
    template: `
        <div class="library">
            <div class="title">Librería</div>
            <div class="elem" *ngFor="let mol of moleculeList" (click)="loadMolecule(mol.id)">
                {{mol.name}}
            </div>
        </div>
    `
})
export class LibraryComponent {
    moleculeList;
    loadedMolecules;

    constructor(private moleculesService:MoleculesService, private editorService:EditorService){
        this.moleculeList = this.moleculesService.getMoleculesList();
    }

    loadMolecule(moleculeId){
        this.editorService.sendLoadMolecule(moleculeId);
    }
}