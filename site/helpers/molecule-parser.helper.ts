import {root} from "rxjs/util/root";
export class MoleculeParserHelper{

    constructor(){
    }

    public static getMoleculeObject(geometry:any, geometryBonds:any, json:any){
        let rootGroup = new THREE.Group();

        let lim:any = {
            minX:null,
            maxX:null,
            minY:null,
            maxY:null,
            minZ:null,
            maxZ:null
        };

        let boxGeometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
        let sphereGeometry = new THREE.IcosahedronBufferGeometry( 1, 2 );
        let offset = geometry.center();
        geometryBonds.translate( offset.x, offset.y, offset.z );
        let positions = geometry.getAttribute( 'position' );
        let colors = geometry.getAttribute( 'color' );
        let position = new THREE.Vector3();
        let color = new THREE.Color();

        for ( let i = 0; i < positions.count; i ++ ) {
            position.x = positions.getX( i );
            position.y = positions.getY( i );
            position.z = positions.getZ( i );

            if(position.x > lim.maxX || lim.maxX == null){
                lim.maxX = position.x;
            }
            if(position.x < lim.minX || lim.minX == null){
                lim.minX = position.x;
            }
            if(position.y > lim.maxY || lim.maxY == null){
                lim.maxY = position.y;
            }
            if(position.y < lim.minY || lim.minY == null){
                lim.minY = position.y;
            }
            if(position.z > lim.maxZ || lim.maxZ == null){
                lim.maxZ = position.z;
            }
            if(position.z < lim.minZ || lim.minZ == null){
                lim.minZ = position.z;
            }



            color.r = colors.getX( i );
            color.g = colors.getY( i );
            color.b = colors.getZ( i );
            //let element = geometry.elements[ i ];
            let material = new THREE.MeshPhongMaterial( {color:color.getHex()} );
            let object = new THREE.Mesh( sphereGeometry, material );
            object.position.copy( position );
            object.position.multiplyScalar( 75 );
            object.scale.multiplyScalar( 25 );
            rootGroup.add( object );
            //var atom = json.atoms[ i ];
            //var text = document.createElement( 'div' );
            //text.className = 'label';
            //text.style.color = 'rgb(' + atom[ 3 ][ 0 ] + ',' + atom[ 3 ][ 1 ] + ',' + atom[ 3 ][ 2 ] + ')';
            //text.textContent = atom[ 4 ];
            //var label = new THREE.CSS2DObject( text );
            //label.position.copy( object.position );
            //this.rootGroup.add( label );
        }

        positions = geometryBonds.getAttribute( 'position' );
        let start = new THREE.Vector3();
        let end = new THREE.Vector3();
        for ( let i = 0; i < positions.count; i += 2 ) {
            start.x = positions.getX( i );
            start.y = positions.getY( i );
            start.z = positions.getZ( i );
            end.x = positions.getX( i + 1 );
            end.y = positions.getY( i + 1 );
            end.z = positions.getZ( i + 1 );
            start.multiplyScalar( 75 );
            end.multiplyScalar( 75 );
            let object = new THREE.Mesh( boxGeometry, new THREE.MeshPhongMaterial( 0xffffff ) );
            object.position.copy( start );
            object.position.lerp( end, 0.5 );
            object.scale.set( 5, 5, start.distanceTo( end ) );
            object.lookAt( end );
            rootGroup.add( object );
        }

        return rootGroup;
    }
}