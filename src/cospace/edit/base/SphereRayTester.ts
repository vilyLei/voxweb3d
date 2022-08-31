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
    private m_outV0 = CoMath.createVec3();
    constructor(radius: number, center: IVector3D) {
        this.m_radius = radius;
        this.m_center = center;
    }
    testRay(rlpv: IVector3D, rltv: IVector3D, outV: IVector3D, boundsHit: boolean): number {

        let Ray = CoAGeom.RayLine;
        this.isHit = Ray.IntersectSphereNearPos(rlpv, rltv, this.m_center, this.m_radius, this.m_outV0);
        if(this.isHit) {
            outV.copyFrom(this.m_outV0);
            return 1;
        }
        this.isHit = false;
        return 0;
    }
    destroy(): void {
        this.m_center = null;
    }
}
export { SphereRayTester }