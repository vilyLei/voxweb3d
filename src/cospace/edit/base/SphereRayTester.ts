/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import ITestRay from "../../../vox/mesh/ITestRay";

import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";
declare var CoMath: ICoMath;
declare var CoAGeom: ICoAGeom;

class SphereRayTester implements ITestRay {

    private m_radius: number;
    private m_center: IVector3D;
    isHit: boolean = false;    
    constructor(radius: number, center: IVector3D = null) {
        if(center == null) {
            center = CoMath.createVec3();
        }
        this.m_radius = radius;
        this.m_center = center;
    }
    testRay(rlpv: IVector3D, rltv: IVector3D, outV: IVector3D, boundsHit: boolean): number {

        this.isHit = CoAGeom.RayLine.IntersectSphereNearPos(rlpv, rltv, this.m_center, this.m_radius, outV);
        return this.isHit ? 1 : 0;
    }
    destroy(): void {
        this.m_center = null;
    }
}
export { SphereRayTester }