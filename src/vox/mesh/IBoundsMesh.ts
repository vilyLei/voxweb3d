/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IMeshBase from "../../vox/mesh/IMeshBase";
import ITestRay from "./ITestRay";


/**
 * rawMesh
 */
export default interface IBoundsMesh extends IMeshBase {
	
	setRayTester(rayTester: ITestRay): void;

}
