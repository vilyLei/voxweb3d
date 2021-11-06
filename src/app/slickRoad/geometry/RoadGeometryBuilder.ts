import Vector3D from "../../../vox/math/Vector3D";
import {RoadMesh} from "./RoadMesh";
import RoadSurfaceGeometry from "./RoadSurfaceGeometry";
import AABB from "../../../vox/geom/AABB";

class RoadGeometryBuilder {

    private m_initFlag: boolean = true;
    constructor() { }
    roadWidth: number = 120;
    
    offsetXYZ: Vector3D = new Vector3D();
    geometry: RoadSurfaceGeometry = null;
    initialize(): void {

        console.log("RoadGeometryBuilder::initialize()......");
        if( this.m_initFlag ) {

            this.m_initFlag = false;
        }
    }

    buildRoadSurface(mesh: RoadMesh, posTable: Vector3D[][], uScale: number = 1.0, vScale: number = 1.0, uvType: number = 0): RoadMesh {
        if(this.geometry == null) {
            this.geometry = new RoadSurfaceGeometry();
        }
        let geom: RoadSurfaceGeometry = this.geometry;

        geom.offsetXYZ.copyFrom( this.offsetXYZ );
        geom.uScale = uScale;
        geom.vScale = vScale;
        geom.roadWidth = this.roadWidth;
        geom.initialize(posTable, uvType);
        if(mesh == null) {
            mesh = new RoadMesh();
            mesh.changed = true;
            mesh.bounds = new AABB();
        }
        else {
            mesh.changed = true;
        }
        mesh.bounds.copyFrom( geom.bounds );
        mesh.distance = geom.distance;
        mesh.setVS(geom.getVS());
        mesh.setUVS(geom.getUVS());
        mesh.setIVS( geom.getIVS() );
        return mesh;
    }    
}

export { RoadGeometryBuilder };