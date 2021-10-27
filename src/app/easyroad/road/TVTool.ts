import Vector3D from "../../../vox/math/Vector3D";
import { Bezier2Curve, Bezier3Curve } from "../../../vox/geom/curve/BezierCurve";
import StraightLine from "../../../vox/geom/StraightLine";
import {PathKeyNode} from "./PathKeyNode";

class TVTool {

    va: Vector3D = new Vector3D();
    vb: Vector3D = new Vector3D();
    vc: Vector3D = new Vector3D();
    nv: Vector3D = new Vector3D();
    tv: Vector3D = new Vector3D();
    calc(v0: Vector3D, v1: Vector3D, v2: Vector3D): void {
        this.va.subVecsTo(v1, v0);
        this.vb.subVecsTo(v1, v2);
        this.vc.addVecsTo(this.va, this.vb);
        this.vc.normalize();
        Vector3D.Cross(this.va, this.vb, this.nv);
        this.nv.normalize();
        Vector3D.Cross(this.nv, this.vc, this.tv);
    }
}

export { TVTool };