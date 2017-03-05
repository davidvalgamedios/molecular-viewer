import { platformBrowser }    from '@angular/platform-browser';
import { AppModuleNgFactory } from '../aot/site/app.module.ngfactory';

import {enableProdMode} from '@angular/core';
enableProdMode();

//import {ImageHelperService} from "./helpers/image-helper.service";
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);