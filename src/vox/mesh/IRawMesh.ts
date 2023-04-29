/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IMeshBase from "../../vox/mesh/IMeshBase";
import ITestRay from "./ITestRay";


/**
 * rawMesh
 */
export default interface IRawMesh extends IMeshBase {

	/**
	 * the default value is true
	 */
	autoBuilding: boolean;
	/**
	 * the default value is true
	 */
	ivsEnabled: boolean;
	/**
	 * the default value is true
	 */
	aabbEnabled: boolean;

	setRayTester(rayTester: ITestRay): void;

    reset(): void;
	addFloat32Data(fs32: Float32Array, step: number, status?: number): void;
	setIVS(ivs: Uint16Array | Uint32Array): void;
    initialize(): void;
	setBufData4fAt(vertexI: number, attribI: number, px: number, py: number, pz: number, pw: number): void;
    setBufData3fAt(vertexI: number, attribI: number, px: number, py: number, pz: number): void;
    setBufData2fAt(vertexI: number, attribI: number, px: number, py: number): void;
}
