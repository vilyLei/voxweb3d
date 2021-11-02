import Vector3D from "../../../vox/math/Vector3D";
import DataMesh from "../../../vox/mesh/DataMesh";

class RoadMesh extends DataMesh {

    posTable: Vector3D[][] = null;
    changed: boolean = true;
    constructor() { super();}
    testPosTable(posTable: Vector3D[][]): boolean {
        if(this.posTable == null) {
            //return true;
        }
        return true;
    }

}

export { RoadMesh };