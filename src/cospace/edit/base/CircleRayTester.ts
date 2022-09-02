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

class CircleRayTester implements ITestRay {

    private m_rayTestRadius: number;
    private m_planeNV: IVector3D;
    private m_planeDis: number;
    private m_radius: number;
    private m_center: IVector3D;
    isHit: boolean = false;
    private m_outV0 = CoMath.createVec3();
    // private m_pv1 = CoMath.createVec3();
    constructor(radius: number, center: IVector3D, pnv: IVector3D, pdis: number, rayTestRadius: number) {
        this.m_radius = radius;
        this.m_center = center;
        this.m_planeNV = pnv;
        this.m_planeDis = pdis;
        this.m_rayTestRadius = rayTestRadius;
    }
    
	setPrevTester(tester: ITestRay): number {
        return null;
    }
    testRay(rlpv: IVector3D, rltv: IVector3D, outV: IVector3D, boundsHit: boolean): number {

        let u = CoAGeom.PlaneUtils;
        this.isHit = u.IntersectRayLinePos2(this.m_planeNV, this.m_planeDis, rlpv, rltv, this.m_outV0);
        if(this.isHit) {
            this.isHit = u.Intersection == CoAGeom.Intersection.Hit;
            if(this.isHit) {
                // console.log("hit the plane, its nv: ", this.m_planeNV);
                let dis = CoMath.Vector3D.Distance(this.m_outV0, this.m_center);
                this.isHit = Math.abs(dis - this.m_radius) < this.m_rayTestRadius;
                if( this.isHit ) {
                    outV.copyFrom(this.m_outV0);
                    return 1;
                    // console.log("hit the plane circle, its nv: ", this.m_planeNV, ", this.m_radius: ", this.m_radius);
                }
            }
        }
        this.isHit = false;
        return 0;
    }
    destroy(): void {
        this.m_center = null;
        this.m_planeNV = null;
    }
}
export { CircleRayTester }