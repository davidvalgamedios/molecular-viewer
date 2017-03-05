// Type definitions for three.js (CTMLoader.js)
// Project: https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/PDBLoader.js
// Definitions by: David Valga Medios <https://github.com/davidvalgamedios>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="three" />

declare namespace THREE {
    export class PDBLoader extends THREE.Loader {
        constructor();

        load(url: string, success: (geometry:any, bonds:any, json:any) => any, progress: (xhr:any) => any, error: (error:any) => any): any;

        parsePDB(text: string): any;
        
        createModel(json: string, callback: () => any): any;
    }
}
