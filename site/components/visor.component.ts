import {Component, OnInit, RootRenderer} from '@angular/core';
import * as THREE from 'three';
import WebGLRenderer = THREE.WebGLRenderer;
import Scene = THREE.Scene;
import TrackballControls = THREE.TrackballControls;
import PerspectiveCamera = THREE.PerspectiveCamera;
import Mesh = THREE.Mesh;
import Group = THREE.Group;

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

    constructor(){
        this.initPDBLoader();
        this.initCSS2DRenderer();
    }

    ngOnInit(){
        this.container = document.getElementById( 'canvas' );
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, width/height);
        this.camera.position.set(0, 0, 100);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x050505);

        this.container.appendChild(this.renderer.domElement);

        //Root Group
        this.rootGroup = new THREE.Group();
        this.scene.add( this.rootGroup );


        //Insert here molecules
        this.loadMolecule('caffeine');

        // Lights
        const ambientLight = new THREE.AmbientLight(0xcccccc);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff);
        pointLight.position.set(300, 0, 300);
        this.scene.add(pointLight);

        this.animate();
        /*

        let scene = new THREE.Scene();
        //let camera = new THREE.PerspectiveCamera( 75, element.offsetWidth / element.offsetHeight, 0.1, 1000 );
        let camera = new THREE.PerspectiveCamera( 70, this.element.offsetWidth / this.element.offsetHeight, 1, 5000 );
        camera.position.z = 1000;
        scene.add( camera );

        let light = new THREE.DirectionalLight( 0xffffff, 0.8 );
        light.position.set( 1, 1, 1 );
        scene.add( light );

        let light2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
        light2.position.set( -1, -1, 1 );
        scene.add( light2 );

        let root = new THREE.Group();
        scene.add( root );

        let renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setClearColor( 0x050505 );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( this.element.offsetWidth, this.element.offsetHeight );
        console.log(this.element.offsetWidth, this.element.offsetHeight);
        this.element.appendChild( renderer.domElement );

        this.loadMolecule('caffeine', root);

        function render() {
            requestAnimationFrame( render );
            renderer.render( scene, camera );
        }
        render();*/
    }

    public animate() {
        console.log("ANIMATING");
        window.requestAnimationFrame(_ => this.animate());

        /*this.stats.update();
        this.controls.update();
        TWEEN.update();*/

        this.renderer.render(this.scene, this.camera);
    }

    loadMolecule(moleculeId){
        var loader = new THREE.PDBLoader();
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
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // Function called when download errors
            function ( xhr ) {
                console.log( 'An error happened' );
            }
        );
    }

    parseMoleculeData(geometry, geometryBonds, json){
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
            var material = new THREE.MeshPhongMaterial( { color: color } );
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
            var label = new THREE.CSS2DObject( text );
            label.position.copy( object.position );
            this.rootGroup.add( label );
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
            this.scene.add( object );
        }
    }


    private initPDBLoader(){
        THREE.PDBLoader = function ( manager ) {

            this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

        };

        THREE.PDBLoader.prototype = {

            constructor: THREE.PDBLoader,

            load: function ( url, onLoad, onProgress, onError ) {

                var scope = this;

                var loader = new THREE.FileLoader( scope.manager );
                loader.load( url, function ( text ) {

                    var json = scope.parsePDB( text );
                    scope.createModel( json, onLoad );

                }, onProgress, onError );

            },

            // Based on CanvasMol PDB parser

            parsePDB: function ( text ) {

                function trim( text ) {

                    return text.replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' );

                }

                function capitalize( text ) {

                    return text.charAt( 0 ).toUpperCase() + text.substr( 1 ).toLowerCase();

                }

                function hash( s, e ) {

                    return "s" + Math.min( s, e ) + "e" + Math.max( s, e );

                }

                function parseBond( start, length ) {

                    var eatom = parseInt( lines[ i ].substr( start, length ) );

                    if ( eatom ) {

                        var h = hash( satom, eatom );

                        if ( bhash[ h ] === undefined ) {

                            bonds.push( [ satom - 1, eatom - 1, 1 ] );
                            bhash[ h ] = bonds.length - 1;

                        } else {

                            // doesn't really work as almost all PDBs
                            // have just normal bonds appearing multiple
                            // times instead of being double/triple bonds
                            // bonds[bhash[h]][2] += 1;

                        }

                    }

                }

                var CPK = { "h": [ 255, 255, 255 ], "he": [ 217, 255, 255 ], "li": [ 204, 128, 255 ], "be": [ 194, 255, 0 ], "b": [ 255, 181, 181 ], "c": [ 144, 144, 144 ], "n": [ 48, 80, 248 ], "o": [ 255, 13, 13 ], "f": [ 144, 224, 80 ], "ne": [ 179, 227, 245 ], "na": [ 171, 92, 242 ], "mg": [ 138, 255, 0 ], "al": [ 191, 166, 166 ], "si": [ 240, 200, 160 ], "p": [ 255, 128, 0 ], "s": [ 255, 255, 48 ], "cl": [ 31, 240, 31 ], "ar": [ 128, 209, 227 ], "k": [ 143, 64, 212 ], "ca": [ 61, 255, 0 ], "sc": [ 230, 230, 230 ], "ti": [ 191, 194, 199 ], "v": [ 166, 166, 171 ], "cr": [ 138, 153, 199 ], "mn": [ 156, 122, 199 ], "fe": [ 224, 102, 51 ], "co": [ 240, 144, 160 ], "ni": [ 80, 208, 80 ], "cu": [ 200, 128, 51 ], "zn": [ 125, 128, 176 ], "ga": [ 194, 143, 143 ], "ge": [ 102, 143, 143 ], "as": [ 189, 128, 227 ], "se": [ 255, 161, 0 ], "br": [ 166, 41, 41 ], "kr": [ 92, 184, 209 ], "rb": [ 112, 46, 176 ], "sr": [ 0, 255, 0 ], "y": [ 148, 255, 255 ], "zr": [ 148, 224, 224 ], "nb": [ 115, 194, 201 ], "mo": [ 84, 181, 181 ], "tc": [ 59, 158, 158 ], "ru": [ 36, 143, 143 ], "rh": [ 10, 125, 140 ], "pd": [ 0, 105, 133 ], "ag": [ 192, 192, 192 ], "cd": [ 255, 217, 143 ], "in": [ 166, 117, 115 ], "sn": [ 102, 128, 128 ], "sb": [ 158, 99, 181 ], "te": [ 212, 122, 0 ], "i": [ 148, 0, 148 ], "xe": [ 66, 158, 176 ], "cs": [ 87, 23, 143 ], "ba": [ 0, 201, 0 ], "la": [ 112, 212, 255 ], "ce": [ 255, 255, 199 ], "pr": [ 217, 255, 199 ], "nd": [ 199, 255, 199 ], "pm": [ 163, 255, 199 ], "sm": [ 143, 255, 199 ], "eu": [ 97, 255, 199 ], "gd": [ 69, 255, 199 ], "tb": [ 48, 255, 199 ], "dy": [ 31, 255, 199 ], "ho": [ 0, 255, 156 ], "er": [ 0, 230, 117 ], "tm": [ 0, 212, 82 ], "yb": [ 0, 191, 56 ], "lu": [ 0, 171, 36 ], "hf": [ 77, 194, 255 ], "ta": [ 77, 166, 255 ], "w": [ 33, 148, 214 ], "re": [ 38, 125, 171 ], "os": [ 38, 102, 150 ], "ir": [ 23, 84, 135 ], "pt": [ 208, 208, 224 ], "au": [ 255, 209, 35 ], "hg": [ 184, 184, 208 ], "tl": [ 166, 84, 77 ], "pb": [ 87, 89, 97 ], "bi": [ 158, 79, 181 ], "po": [ 171, 92, 0 ], "at": [ 117, 79, 69 ], "rn": [ 66, 130, 150 ], "fr": [ 66, 0, 102 ], "ra": [ 0, 125, 0 ], "ac": [ 112, 171, 250 ], "th": [ 0, 186, 255 ], "pa": [ 0, 161, 255 ], "u": [ 0, 143, 255 ], "np": [ 0, 128, 255 ], "pu": [ 0, 107, 255 ], "am": [ 84, 92, 242 ], "cm": [ 120, 92, 227 ], "bk": [ 138, 79, 227 ], "cf": [ 161, 54, 212 ], "es": [ 179, 31, 212 ], "fm": [ 179, 31, 186 ], "md": [ 179, 13, 166 ], "no": [ 189, 13, 135 ], "lr": [ 199, 0, 102 ], "rf": [ 204, 0, 89 ], "db": [ 209, 0, 79 ], "sg": [ 217, 0, 69 ], "bh": [ 224, 0, 56 ], "hs": [ 230, 0, 46 ], "mt": [ 235, 0, 38 ],
                    "ds": [ 235, 0, 38 ], "rg": [ 235, 0, 38 ], "cn": [ 235, 0, 38 ], "uut": [ 235, 0, 38 ], "uuq": [ 235, 0, 38 ], "uup": [ 235, 0, 38 ], "uuh": [ 235, 0, 38 ], "uus": [ 235, 0, 38 ], "uuo": [ 235, 0, 38 ] };


                var atoms = [];
                var bonds = [];
                var histogram = {};

                var bhash = {};

                var lines = text.split( "\n" );

                var x, y, z, e;

                for ( var i = 0, l = lines.length; i < l; ++ i ) {

                    if ( lines[ i ].substr( 0, 4 ) == "ATOM" || lines[ i ].substr( 0, 6 ) == "HETATM" ) {

                        x = parseFloat( lines[ i ].substr( 30, 7 ) );
                        y = parseFloat( lines[ i ].substr( 38, 7 ) );
                        z = parseFloat( lines[ i ].substr( 46, 7 ) );

                        e = trim( lines[ i ].substr( 76, 2 ) ).toLowerCase();

                        if ( e === "" ) e = trim( lines[ i ].substr( 12, 2 ) ).toLowerCase();
                        atoms.push( [ x, y, z, CPK[ e ], capitalize( e ) ] );

                        if ( histogram[ e ] === undefined ) histogram[ e ] = 1;
                        else histogram[ e ] += 1;

                    } else if ( lines[ i ].substr( 0, 6 ) == "CONECT" ) {

                        var satom = parseInt( lines[ i ].substr( 6, 5 ) );

                        parseBond( 11, 5 );
                        parseBond( 16, 5 );
                        parseBond( 21, 5 );
                        parseBond( 26, 5 );

                    }

                }

                return { "ok": true, "atoms": atoms, "bonds": bonds, "histogram": histogram };

            },

            createModel: function ( json, callback ) {

                var geometryAtoms = new THREE.BufferGeometry();
                var geometryBonds = new THREE.BufferGeometry();

                var i, l;

                var verticesAtoms = [];
                var colors = [];
                var verticesBonds = [];

                geometryAtoms.elements = [];

                var atoms = json.atoms;
                var bonds = json.bonds;

                for ( i = 0, l = atoms.length; i < l; i ++ ) {

                    var atom = atoms[ i ];

                    var x = atom[ 0 ];
                    var y = atom[ 1 ];
                    var z = atom[ 2 ];

                    verticesAtoms.push( x, y, z );

                    var r = atom[ 3 ][ 0 ] / 255;
                    var g = atom[ 3 ][ 1 ] / 255;
                    var b = atom[ 3 ][ 2 ] / 255;

                    colors.push( r, g, b );

                    geometryAtoms.elements.push( atom[ 4 ] );

                }

                for ( i = 0, l = bonds.length; i < l; i ++ ) {

                    var bond = bonds[ i ];

                    var start = bond[ 0 ];
                    var end = bond[ 1 ];

                    verticesBonds.push( verticesAtoms[ ( start * 3 ) + 0 ] );
                    verticesBonds.push( verticesAtoms[ ( start * 3 ) + 1 ] );
                    verticesBonds.push( verticesAtoms[ ( start * 3 ) + 2 ] );

                    verticesBonds.push( verticesAtoms[ ( end * 3 ) + 0 ] );
                    verticesBonds.push( verticesAtoms[ ( end * 3 ) + 1 ] );
                    verticesBonds.push( verticesAtoms[ ( end * 3 ) + 2 ] );

                }

                geometryAtoms.addAttribute( 'position', new THREE.Float32BufferAttribute( verticesAtoms, 3 ) );
                geometryAtoms.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

                geometryBonds.addAttribute( 'position', new THREE.Float32BufferAttribute( verticesBonds, 3 ) );

                callback( geometryAtoms, geometryBonds, json );

            }
        }
    }

    private initCSS2DRenderer(){
        /**
         * @author mrdoob / http://mrdoob.com/
         */

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

    }
}