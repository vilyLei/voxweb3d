/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ROVertexBuffer from "../../../vox/mesh/ROVertexBuffer";
import VtxBufConst from "../../../vox/mesh/VtxBufConst";
import IMeshBase from "../../../vox/mesh/IMeshBase";


/**
 * rawMesh
 */
export default interface IRawMesh extends IMeshBase {

	/**
	 * the default value is true
	 */
	autoBuilding: boolean;

    reset(): void;
	addFloat32Data(fs32: Float32Array, step: number, status?: number): void;
	setIVS(ivs: Uint16Array | Uint32Array): void;
    initialize(): void;
	setBufData4fAt(vertexI: number, attribI: number, px: number, py: number, pz: number, pw: number): void;
    setBufData3fAt(vertexI: number, attribI: number, px: number, py: number, pz: number): void;
    setBufData2fAt(vertexI: number, attribI: number, px: number, py: number): void;
}
