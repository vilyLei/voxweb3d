/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
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
    private m_pv0 = CoMath.createVec3();
    private m_outV0 = CoMath.createVec3();
    private m_direcV: IVector3D;
    constructor(radius: number, center: IVector3D, direcV: IVector3D, pnv: IVector3D, pdis: number, rayTestRadius: number) {
        this.m_radius = radius;
        this.m_center = center;
        this.m_direcV = direcV;
        this.m_planeNV = pnv;
        this.m_planeDis = pdis;
        this.m_rayTestRadius = rayTestRadius;
    }

    setPrevTester(tester: ITestRay): void {
    }
    testRay(rlpv: IVector3D, rltv: IVector3D, outV: IVector3D, boundsHit: boolean): number {

        const rv = this.m_outV0;
        const u = CoAGeom.PlaneUtils;
        this.isHit = u.IntersectRayLinePos2(this.m_planeNV, this.m_planeDis, rlpv, rltv, rv);
        if (this.isHit) {
            this.isHit = u.Intersection == CoAGeom.Intersection.Hit;
            if (this.isHit) {
                // 计算出center -> rv 这个 line 与 圆心的交点
                let pv0 = this.m_pv0;
                pv0.subVecsTo(rv, this.m_center);
                if (pv0.getLengthSquared() > 0.1) {
                    pv0.normalize();
                    pv0.scaleBy(this.m_radius);
                    let dis = CoAGeom.Line.CalcPVDis(rltv, rlpv, pv0);
                    this.isHit = dis < this.m_rayTestRadius;
                    if (this.isHit) {
                        if (this.m_direcV == null || this.m_direcV.dot(rv) > 0) {
                            outV.copyFrom(pv0);
                            return 1;
                        }
                        // console.log("hit the plane circle, its nv: ", this.m_planeNV, ", this.m_radius: ", this.m_radius);
                    }
                }

                // let dis = CoMath.Vector3D.Distance(rv, this.m_center);
                // this.isHit = Math.abs(dis - this.m_radius) < this.m_rayTestRadius;
                // // console.log("value: ", dis - this.m_radius, this.m_rayTestRadius, this.isHit);
                // // console.log("hit the plane, its nv: ", this.m_planeNV, this.isHit);
                // // 应该是计算 和 圆弧 形状的 管道 体 相交测试，上面的计算是错误的不准确的
                // if( this.isHit ) {
                //     if(this.m_direcV == null || this.m_direcV.dot(rv) > 0) {
                //         outV.copyFrom(rv);
                //         return 1;
                //     }
                //     // console.log("hit the plane circle, its nv: ", this.m_planeNV, ", this.m_radius: ", this.m_radius);
                // }
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