/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../math/IVector3D";
import IMatrix4 from "../math/IMatrix4";
import IAABB from "../geom/IAABB";
import { IVtxBufRenderData } from "../../vox/render/IVtxBufRenderData";
import { IROVertexBuffer } from "../../vox/mesh/IROVertexBuffer";

export default interface IMeshBase {
	vtCount: number;
	drawMode: number;
	trisNumber: number;
	vtxTotal: number;
	/**
	 * the default is true
	 */
	vbWholeDataEnabled: boolean;
	/**
	 * 强制更新 vertex indices buffer 数据, 默认值为false
	 */
	forceUpdateIVS: boolean;
	/**
	 * 是否启用线框模式数据, 默认值为false
	 */
	wireframe: boolean;
	/**
	 * vtx positons bounds AABB in the local space, the default value is null
	 */
	bounds: IAABB;
	
	isUVSEnabled(): boolean;
    isNVSEnabled(): boolean;
    isCVSEnabled(): boolean;

	toElementsTriangles(): void;
    toElementsTriangleStrip(): void;
    toElementsTriangleFan(): void;
    toElementsInstancedTriangles(): void;
    toArraysLines(): void;
    toArraysLineStrip(): void;
    toArraysPoints(): void;
    toElementsLines(): void;
    toDisable(): void;
	/**
	 * @param ivs the default value is null
	 */
	createWireframeIvs(ivs?: Uint16Array | Uint32Array): Uint16Array | Uint32Array;
	setTransformMatrix(matrix: IMatrix4): void;
    getTransformMatrix(): IMatrix4;

	/**
	 * @param layoutBit vertex shader vertex attributes layout bit status.
	 *                  the value of layoutBit comes from the material shdder program.
	 */
	setBufSortFormat(layoutBit: number): void;
	getBufSortFormat(): number;
	getAttachCount(): number;
	__$attachThis(): void;
	__$detachThis(): void;
	__$attachVBuf(): IROVertexBuffer;
	__$detachVBuf(vbuf: IROVertexBuffer): void;
	__$attachIVBuf(): any;
	__$detachIVBuf(ivbuf: any): void;
	/**
	 * @returns vertex position buffer Float32Array
	 */
	getVS(): Float32Array;

	/**
	 * @returns vertex uv buffer Float32Array
	 */
	getUVS(): Float32Array;

	/**
	 * @returns vertex normal buffer Float32Array
	 */
	getNVS(): Float32Array;
	/**
	 * @returns vertex vtx color(r,g,b) buffer Float32Array
	 */
	getCVS(): Float32Array;

	/**
	 * @returns vertex indices buffer Uint16Array or Uint32Array
	 */
	getIVS(): Uint16Array | Uint32Array;

	setVtxBufRenderData(vtxData: IVtxBufRenderData): void;

	setPolyhedral(polyhedral: boolean): void;
	/**
	 * 射线和自身的相交检测(多面体或几何函数(例如球体))
	 * @boundsHit       表示是否包围盒体已经和射线相交了
	 * @rlpv            表示物体坐标空间的射线起点
	 * @rltv            表示物体坐标空间的射线朝向
	 * @outV            如果检测相交存放物体坐标空间的交点
	 * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
	 */
	testRay(rlpv: IVector3D, rltv: IVector3D, outV: IVector3D, boundsHit: boolean): number;
	isEnabled(): boolean;
	isResFree(): boolean;
	isPolyhedral(): boolean;
	isGeomDynamic(): boolean;
	rebuild(): void;
}
