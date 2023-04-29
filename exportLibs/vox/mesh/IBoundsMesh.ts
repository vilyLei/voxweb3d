/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import IMeshBase from "../../vox/mesh/IMeshBase";
import ITestRay from "./ITestRay";

/**
 * bounds mesh
 */
export default interface IBoundsMesh extends IMeshBase {

	setBounds(minV: IVector3D, maxV: IVector3D): void;
	setRayTester(rayTester: ITestRay): void;

}
