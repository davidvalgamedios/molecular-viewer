import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { HttpModule }       from '@angular/http';
import { RouterModule }     from '@angular/router';
import {FormsModule} from "@angular/forms";

import { AppComponent }     from './pages/app.component';
import { EditorPageComponent } from "./pages/editor-page.component";
import {VisorComponent} from "./components/visor.component";
import {MoleculesService} from "./services/molecules.service";
import {ProjectAssetsComponent} from "./components/project-assets.component";
import {ProjectService} from "./services/project.service";
import {BackgroundSelectorComponent} from "./components/background-selector.component";
import {BackgroundsService} from "./services/backgrounds.service";
import {EditorMessageHelperComponent} from "./components/editor-message-helper.component";
import {MoleculesSelectorComponent} from "./components/molecules-selector.component";
import {EventsFooterComponent} from "./components/events-footer.component";



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
    declarations: [ AppComponent, EditorPageComponent, VisorComponent, EventsFooterComponent, ProjectAssetsComponent, BackgroundSelectorComponent, EditorMessageHelperComponent, MoleculesSelectorComponent],
    bootstrap:    [ AppComponent ],
    providers: [ MoleculesService, ProjectService, BackgroundsService]
})
export class AppModule {}