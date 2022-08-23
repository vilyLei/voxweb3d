/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MeshBase from "../../vox/mesh/MeshBase";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import ITestRay from "./ITestRay";
import IVector3D from "../../vox/math/IVector3D";
import AABB from "../../vox/geom/AABB";

export default class BoundsMesh extends MeshBase {
	private m_rayTester: ITestRay = null;
    constructor() {
        super();
    }
    setBounds(minV: IVector3D, maxV: IVector3D): void {
        if(this.bounds == null) {
            this.bounds = new AABB();
        }
        this.bounds.min.copyFrom(minV);
        this.bounds.max.copyFrom(maxV);
        this.bounds.updateFast();
    }
	setRayTester(rayTester: ITestRay): void {
		this.m_rayTester = rayTester;
	}
    __$attachVBuf(): ROVertexBuffer {
        return null;
    }
    __$detachVBuf(vbuf: ROVertexBuffer): void {
    }
    isEnabled(): boolean {
        return this.bounds != null;
    }
    isPolyhedral(): boolean { return false; }
    
	/**
     * 射线和自身的相交检测(多面体或几何函数(例如球体))
     * @rlpv            表示物体坐标空间的射线起点
     * @rltv            表示物体坐标空间的射线朝向
     * @outV            如果检测相交存放物体坐标空间的交点
     * @boundsHit       表示是否包围盒体已经和射线相交了
     * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
     */
	testRay(rlpv: IVector3D, rltv: IVector3D, outV: IVector3D, boundsHit: boolean): number {
		if(this.m_rayTester != null) {
			return this.m_rayTester.testRay(rlpv, rltv, outV, boundsHit);
		}
        return -1;
    }
    __$destroy(): void {
        this.bounds = null;
        this.m_rayTester = null;
    }
}