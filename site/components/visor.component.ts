/// <reference path="../definitions/three-pdbloader.d.ts" />
/// <reference path="../definitions/three-icosahedronbuffergeometry.d.ts" />
import {Component, OnInit} from '@angular/core';
import * as THREE from 'three';
import WebGLRenderer = THREE.WebGLRenderer;
import Scene = THREE.Scene;
import TrackballControls = THREE.TrackballControls;
import PerspectiveCamera = THREE.PerspectiveCamera;
import Mesh = THREE.Mesh;
import Group = THREE.Group;
import {MoleculesService} from "../services/molecules.service";
import {EditorService} from "../services/editor.service";

@Component({
    selector: 'visor',
    template: `
        <div id="canvas"></div>
    `
})
export class VisorComponent implements OnInit{
    private container: HTMLElement;
    private rootGroup: Group;
    private scene: Scene;
    private camera: PerspectiveCamera;
    private renderer: WebGLRenderer;
    private controls:TrackballControls;

    constructor(private moleculesService:MoleculesService, private editorService:EditorService){
        //this.initCSS2DRenderer();

        this.editorService.moleculeLoadSbj$.subscribe(
            molecule => {
                this.loadMolecule(molecule);
            });
    }

    ngOnInit(){
        this.container = document.getElementById('canvas');
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera( 70, width / height, 1, 5000 );
        this.camera.position.set(0, 0, 1000);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x050505);

        this.container.appendChild(this.renderer.domElement);

        //Root Group
        this.rootGroup = new THREE.Group();
        this.scene.add( this.rootGroup );


        // Lights
        let light = new THREE.DirectionalLight( 0xffffff, 0.8 );
        light.position.set( 1, 1, 1 );
        this.scene.add( light );

        let light2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
        light2.position.set( -1, -1, 1 );
        this.scene.add( light2 );

        //Controls
        this.controls = new THREE.TrackballControls( this.camera, this.renderer.domElement );
        this.controls.minDistance = 500;
        this.controls.maxDistance = 2000;

        this.animate();
        window.addEventListener('resize', _ => this.onResize());
    }

    public animate() {
        window.requestAnimationFrame(_ => this.animate());
        this.controls.update();

        /*this.stats.update();
        TWEEN.update();*/

        this.renderer.render(this.scene, this.camera);
    }

    public onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight - 90;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    loadMolecule(moleculeId:string){
        while ( this.rootGroup.children.length > 0 ) {
            let object = this.rootGroup.children[ 0 ];
            object.parent.remove( object );
        }

        let loader = new THREE.PDBLoader();
        loader.load(
            // resource URL
            'dist/models/'+moleculeId+'.pdb',
            // Function when resource is loaded
            ( geometry, geometryBonds, json ) => {
                //console.log( 'This molecule has ' + json.atoms.length + ' atoms' );
                this.parseMoleculeData(geometry, geometryBonds, json);
            },
            // Function called when download progresses
            function ( xhr ) {
                //console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // Function called when download errors
            function ( xhr ) {
                console.log( 'An error happened' );
            }
        );
    }

    parseMoleculeData(geometry:any, geometryBonds:any, json:any){
        var boxGeometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
        var sphereGeometry = new THREE.IcosahedronBufferGeometry( 1, 2 );
        var offset = geometry.center();
        geometryBonds.translate( offset.x, offset.y, offset.z );
        var positions = geometry.getAttribute( 'position' );
        var colors = geometry.getAttribute( 'color' );
        var position = new THREE.Vector3();
        var color = new THREE.Color();
        for ( var i = 0; i < positions.count; i ++ ) {
            position.x = positions.getX( i );
            position.y = positions.getY( i );
            position.z = positions.getZ( i );
            color.r = colors.getX( i );
            color.g = colors.getY( i );
            color.b = colors.getZ( i );
            var element = geometry.elements[ i ];
            var material = new THREE.MeshPhongMaterial( );
            var object = new THREE.Mesh( sphereGeometry, material );
            object.position.copy( position );
            object.position.multiplyScalar( 75 );
            object.scale.multiplyScalar( 25 );
            this.rootGroup.add( object );
            var atom = json.atoms[ i ];
            var text = document.createElement( 'div' );
            text.className = 'label';
            text.style.color = 'rgb(' + atom[ 3 ][ 0 ] + ',' + atom[ 3 ][ 1 ] + ',' + atom[ 3 ][ 2 ] + ')';
            text.textContent = atom[ 4 ];
            /*var label = new THREE.CSS2DObject( text );
            label.position.copy( object.position );
            this.rootGroup.add( label );*/
        }
        positions = geometryBonds.getAttribute( 'position' );
        var start = new THREE.Vector3();
        var end = new THREE.Vector3();
        for ( var i = 0; i < positions.count; i += 2 ) {
            start.x = positions.getX( i );
            start.y = positions.getY( i );
            start.z = positions.getZ( i );
            end.x = positions.getX( i + 1 );
            end.y = positions.getY( i + 1 );
            end.z = positions.getZ( i + 1 );
            start.multiplyScalar( 75 );
            end.multiplyScalar( 75 );
            var object = new THREE.Mesh( boxGeometry, new THREE.MeshPhongMaterial( 0xffffff ) );
            object.position.copy( start );
            object.position.lerp( end, 0.5 );
            object.scale.set( 5, 5, start.distanceTo( end ) );
            object.lookAt( end );
            this.rootGroup.add( object );
        }
    }

    /*private initCSS2DRenderer(){

        THREE.CSS2DObject = function ( element ) {

            THREE.Object3D.call( this );

            this.element = element;
            this.element.style.position = 'absolute';

            this.addEventListener( 'removed', function ( event ) {

                if ( this.element.parentNode !== null ) {

                    this.element.parentNode.removeChild( this.element );

                }

            } );

        };

        THREE.CSS2DObject.prototype = Object.create( THREE.Object3D.prototype );
        THREE.CSS2DObject.prototype.constructor = THREE.CSS2DObject;

//

        THREE.CSS2DRenderer = function () {

            console.log( 'THREE.CSS2DRenderer', THREE.REVISION );

            var _width, _height;
            var _widthHalf, _heightHalf;

            var vector = new THREE.Vector3();
            var viewMatrix = new THREE.Matrix4();
            var viewProjectionMatrix = new THREE.Matrix4();

            var domElement = document.createElement( 'div' );
            domElement.style.overflow = 'hidden';

            this.domElement = domElement;

            this.setSize = function ( width, height ) {

                _width = width;
                _height = height;

                _widthHalf = _width / 2;
                _heightHalf = _height / 2;

                domElement.style.width = width + 'px';
                domElement.style.height = height + 'px';

            };

            var renderObject = function ( object, camera ) {

                if ( object instanceof THREE.CSS2DObject ) {

                    vector.setFromMatrixPosition( object.matrixWorld );
                    vector.applyMatrix4( viewProjectionMatrix );

                    var element = object.element;
                    var style = 'translate(-50%,-50%) translate(' + ( vector.x * _widthHalf + _widthHalf ) + 'px,' + ( - vector.y * _heightHalf + _heightHalf ) + 'px)';

                    element.style.WebkitTransform = style;
                    element.style.MozTransform = style;
                    element.style.oTransform = style;
                    element.style.transform = style;

                    if ( element.parentNode !== domElement ) {

                        domElement.appendChild( element );

                    }

                }

                for ( var i = 0, l = object.children.length; i < l; i ++ ) {

                    renderObject( object.children[ i ], camera );

                }

            };

            this.render = function ( scene, camera ) {

                scene.updateMatrixWorld();

                if ( camera.parent === null ) camera.updateMatrixWorld();

                camera.matrixWorldInverse.getInverse( camera.matrixWorld );

                viewMatrix.copy( camera.matrixWorldInverse.getInverse( camera.matrixWorld ) );
                viewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, viewMatrix );

                renderObject( scene, camera );

            };

        };

    }*/
}