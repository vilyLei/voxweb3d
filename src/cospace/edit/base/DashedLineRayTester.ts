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

class DashedLineRayTester implements ITestRay {

    private m_vs: Float32Array;
    private m_rayTestRadius: number;
    private m_lsTotal: number;
    private m_pv0 = CoMath.createVec3();
    private m_pv1 = CoMath.createVec3();
    private m_tester: ITestRay = null;
    constructor(vs: Float32Array, lsTotal: number, rayTestRadius: number) {
        this.m_vs = vs;
        this.m_rayTestRadius = rayTestRadius;
        this.m_lsTotal = lsTotal;
    }
	setPrevTester(tester: ITestRay): void {
        if(tester != this) {
            this.m_tester = tester;
        }
    }
    testRay(rlpv: IVector3D, rltv: IVector3D, outV: IVector3D, boundsHit: boolean): number {
        if(this.m_tester != null) {
            if(this.m_tester.testRay(rlpv, rltv, outV, boundsHit) > 0) {
                return 0;
            }
        }
        let j: number = 0;
        let vs: Float32Array = this.m_vs;
        let flag = false;
        let radius = this.m_rayTestRadius;
        let pv0 = this.m_pv0;
        let pv1 = this.m_pv1;
        const RL = CoAGeom.RayLine;

        for (let i = 0; i < this.m_lsTotal; ++i) {
            pv0.setXYZ(vs[j], vs[j + 1], vs[j + 2]);
            pv1.setXYZ(vs[j + 3], vs[j + 4], vs[j + 5]);
            flag = RL.IntersectSegmentLine(rlpv, rltv, pv0, pv1, outV, radius);
            if (flag) {
                return 1;
            }
            j += 6;
        }
        return 0;
    }
    destroy(): void {
        this.m_vs = null;
    }
}
export { DashedLineRayTester }