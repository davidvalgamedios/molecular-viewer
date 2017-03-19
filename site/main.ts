import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import {ProjectService} from "./services/project.service";
const platform = platformBrowserDynamic();

//import {enableProdMode} from '@angular/core';
//enableProdMode();
platform.bootstrapModule(AppModule, [ProjectService]);
