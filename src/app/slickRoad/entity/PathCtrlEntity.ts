
import Vector3D from "../../../vox/math/Vector3D";
import { RoadPath } from "../road/RoadPath";
import {EditableEntity} from "../../../voxeditor/entity/EditableEntity";

class PathCtrlEntity extends EditableEntity {

    path: RoadPath = null;
    pathCtrlPosIndex: number = -1;
    private m_currPos: Vector3D = new Vector3D();
    private m_newPos: Vector3D = new Vector3D();
    constructor() {
        super();
    }
    update(): void {

        this.m_currPos.setXYZ(0.0,0.0,0.0);
        this.getMatrix(false).transformVector3Self(this.m_currPos);
        super.update();
        this.getPosition(this.m_newPos);
        let dis: number = Vector3D.DistanceSquared(this.m_currPos, this.m_newPos);
        if(dis > 0.001) {
            if(this.path != null) {
                let posList: Vector3D[] =  this.path.getPosList();
                if(posList != null && this.pathCtrlPosIndex >= 0 && this.pathCtrlPosIndex < posList.length) {
                    let pv: Vector3D = posList[this.pathCtrlPosIndex];
                    this.getPosition(pv);
                    this.path.version ++;
                    //console.log("posList["+this.pathCtrlPosIndex+"]: ",posList[this.pathCtrlPosIndex]);
                }
            }
        }
    }
    destroy(): void {
        super.destroy();        
        this.path = null;
        this.pathCtrlPosIndex = -1;
    }
}
export { PathCtrlEntity };