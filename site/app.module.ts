import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { HttpModule }       from '@angular/http';
import { RouterModule }     from '@angular/router';
import {FormsModule} from "@angular/forms";

import { AppComponent }     from './pages/app.component';
import { EditorPageComponent } from "./pages/editor-page.component";
import {FooterComponent} from "./components/footer.component";
import {LibraryComponent} from "./components/library.component";
import {VisorComponent} from "./components/visor.component";
import {MoleculesService} from "./services/molecules.service";
import {EditorService} from "./services/editor.service";
import {ProjectAssetsComponent} from "./components/project-assets.component";
import {ProjectService} from "./services/project.service";



@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot([
            {
                path: '',
                component: EditorPageComponent
            }
        ])
    ],
    declarations: [ AppComponent, EditorPageComponent, LibraryComponent, VisorComponent, FooterComponent, ProjectAssetsComponent],
    bootstrap:    [ AppComponent ],
    providers: [ MoleculesService, EditorService, ProjectService]
})
export class AppModule {}