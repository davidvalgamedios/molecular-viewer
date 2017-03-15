/// <reference path="../definitions/three-pdbloader.d.ts" />
/// <reference path="../definitions/three-icosahedronbuffergeometry.d.ts" />
import {Component, OnInit, HostListener} from '@angular/core';
import {MoleculesService} from "../services/molecules.service";
import {EditorService} from "../services/editor.service";
import {ProjectService} from "../services/project.service";
import {BackgroundsService} from "../services/backgrounds.service";
import {MoleculeParserHelper} from "../helpers/molecule-parser.helper";
//import * as THREE from 'three';

@Component({
    selector: 'visor',
    template: `
        <div id="canvas"></div>
    `
})
export class VisorComponent implements OnInit{
    private container: HTMLElement;
    private firstMolecule: THREE.Group;
    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private renderer: THREE.WebGLRenderer;

    private width:number;
    private height:number;

    private mouseDown:boolean = false;
    private last: MouseEvent;

    constructor(private moleculesService:MoleculesService, private editorService:EditorService, private projectService:ProjectService, private backgroundsService:BackgroundsService){
        this.editorService.moleculeLoadSbj$.subscribe(
            molecule => {
                this.loadMolecule(molecule);
            });
    }


    @HostListener('mouseup')
    onMouseup() {
        this.mouseDown = false;
    }

    @HostListener('mousemove', ['$event'])
    onMousemove(event: MouseEvent) {
        if(this.mouseDown) {
            this.firstMolecule.rotateY((event.clientX-this.last.clientX)/100);
            this.firstMolecule.rotateX((event.clientY-this.last.clientY)/100);
            /*this.scene.rotate(
                event.clientX - this.last.clientX,
                event.clientY - this.last.clientY
            );*/
            this.last = event;
        }
    }

    @HostListener('mousedown', ['$event'])
    onMousedown(event:MouseEvent) {
        this.mouseDown = true;
        this.last = event;
    }

    ngOnInit(){
        this.container = document.getElementById('canvas');
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.scene = new THREE.Scene();

        this.camera = new THREE.OrthographicCamera(this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, 0.1, 2000);
        this.camera.position.set(0, 0, 1000);

        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x050505);
        //this.renderer.setClearColor(0xFFFFFF);

        this.container.appendChild(this.renderer.domElement);

        //Root Group
        //this.rootGroup = new THREE.Group();
        //this.scene.add( this.rootGroup );


        // Lights
        let light = new THREE.DirectionalLight( 0xffffff, 0.8 );
        light.position.set( 1, 1, 1 );
        this.scene.add( light );

        let light2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
        light2.position.set( -1, -1, 1 );
        this.scene.add( light2 );


        this.animate();
        window.addEventListener('resize', _ => this.onResize());

        let backgroundId = this.projectService.getBackground();
        if(backgroundId !== null){
            this.loadBackground(backgroundId);
        }

        let molecules = this.projectService.getMolecules();
        for(let moleculeId of molecules){
            this.loadMolecule(moleculeId);
            return;
        }
    }

    private loadBackground(backgroundId:string){
        let backgroundData = this.backgroundsService.getBackgroundData(backgroundId);

        let textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            '/dist/img/backgrounds/'+backgroundData.img,
            (texture) => {
                let imgMaterial = new THREE.MeshBasicMaterial({
                    map: texture
                });
                let planeSize = this.calculateBackgroundSize(texture.image.naturalWidth, texture.image.naturalHeight);
                let plane = new THREE.Mesh(new THREE.PlaneGeometry(planeSize.width, planeSize.height), imgMaterial);
                plane.position.set(0, 0, -1000);

                this.scene.add(plane);
            }
        );
    }

    public animate() {
        window.requestAnimationFrame(_ => this.animate());
        /*

        this.stats.update();
        TWEEN.update();*/

        this.renderer.render(this.scene, this.camera);
    }

    public onResize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        //this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
    }

    loadMolecule(moleculeId:string){
        /*while ( this.rootGroup.children.length > 0 ) {
            let object = this.rootGroup.children[ 0 ];
            object.parent.remove( object );
        }*/

        let loader = new THREE.PDBLoader();
        loader.load(
            // resource URL
            'dist/models/'+moleculeId+'.pdb',
            // Function when resource is loaded
            ( geometry, geometryBonds, json ) => {
                //console.log( 'This molecule has ' + json.atoms.length + ' atoms' );
                this.firstMolecule = MoleculeParserHelper.getMoleculeObject(geometry, geometryBonds, json);
                this.scene.add(this.firstMolecule);
            },
            // Function called when download progresses
            function (  ) {
                //console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // Function called when download errors
            function (  ) {
                console.log( 'An error happened' );
            }
        );
    }


    private calculateBackgroundSize(imgWidth, imgHeight){
        if(this.height > this.width){
            return {
                width: this.height,
                height: this.height
            }
        }
        else{
            return {
                width: this.width,
                height: this.width
            }
        }
    }
}