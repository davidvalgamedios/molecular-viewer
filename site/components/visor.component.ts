import {Component, OnInit} from '@angular/core';
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
    private rootGroup: THREE.Group;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls:THREE.TrackballControls;

    constructor(private moleculesService:MoleculesService, private editorService:EditorService){
        this.editorService.moleculeLoadSbj$.subscribe(
            molecule => {
                this.loadMolecule(molecule);
            });
    }

    ngOnInit(){
        this.container = document.getElementById('canvas');
        let width = this.container.offsetWidth;
        let height = this.container.offsetHeight;

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
            var material = new THREE.MeshPhongMaterial( {color:color.getHex()} );
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
            //var label = new THREE.CSS2DObject( text );
            //label.position.copy( object.position );
            //this.rootGroup.add( label );
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

    private componentToHex(c:number):string {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    private rgbToHex(r:number, g:number, b:number):string {
        return "0x" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }
}