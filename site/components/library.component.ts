import { Component } from '@angular/core';
import {MoleculesService} from "../services/molecules.service";

@Component({
    selector: 'library',
    template: `
        <div class="library">
            <div class="title">Librería</div>
            <div class="elem" *ngFor="let mol of list">
                {{mol.name}}
            </div>
        </div>
    `
})
export class LibraryComponent {
    list:Object;

    constructor(private moleculesService:MoleculesService){
        this.list = this.moleculesService.getMoleculesList();
    }

}