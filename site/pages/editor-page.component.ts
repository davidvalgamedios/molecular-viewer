import { Component } from '@angular/core';

@Component({
    selector: 'editor',
    template: `
        <div class="editor">
            <library></library>
            <visor></visor>
        </div>
        <footer></footer>
    `
})
export class EditorPageComponent{

    constructor(){

    }
}