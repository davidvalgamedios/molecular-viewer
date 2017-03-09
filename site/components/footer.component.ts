import { Component } from '@angular/core';
import {EditorService} from "../services/editor.service";

@Component({
    selector: 'footer',
    template: `
        <div class="loadedMol" *ngFor="let sMol of loadedMolecules">
            <img src="/dist/img/molecules/placeholder.jpeg">
            {{sMol}}
        </div>
    `
})
export class FooterComponent {
    loadedMolecules:any;
    constructor(private editorService:EditorService){
        this.loadedMolecules = editorService.getLoadedMolecules();
    }

}