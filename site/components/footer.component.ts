import { Component } from '@angular/core';

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
    loadedMolecules:any = [];
    constructor(){
    }

}