import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { HttpModule }       from '@angular/http';
import { RouterModule }     from '@angular/router';

import { AppComponent }     from './pages/app.component';
import { TerrainComponent } from "./pages/terrain.component";


@NgModule({
    imports: [
        BrowserModule,
        //FormsModule,
        HttpModule,
        RouterModule.forRoot([
            {
                path: 'room/:terrainId',
                component: TerrainComponent
            },
            {
                path: '',
                component: TerrainComponent
            }
        ])
    ],
    declarations: [ AppComponent, TerrainComponent],
    bootstrap:    [ AppComponent ],
    providers: [ ]
})
export class AppModule {}