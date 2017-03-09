import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import {ProjectService} from "./services/project.service";
///import {ImageHelperService} from "./helpers/image-helper.service";
const platform = platformBrowserDynamic();

//import {enableProdMode} from '@angular/core';
//enableProdMode();
platform.bootstrapModule(AppModule, [ProjectService]);
