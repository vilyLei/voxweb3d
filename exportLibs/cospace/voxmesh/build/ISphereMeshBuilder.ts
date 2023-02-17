/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRawMesh from "../../../vox/mesh/IRawMesh";
import { IMeshBuilder } from "./IMeshBuilder";

interface ISphereMeshBuilder extends IMeshBuilder {
    /**
     * the default value is false
     */
    inverseUV: boolean;
    /**
     * the default value is 1.0
     */
    uvScale: number;
    /**
     * 
     * @param radius sphere radius
     * @param longitudeNumSegments the default value is 20
     * @param latitudeNumSegments the default value is 20
     * @param doubleTriFaceEnabled the default value is false
     */
    create(radius: number, longitudeNumSegments?: number, latitudeNumSegments?: number, doubleTriFaceEnabled?: boolean): IRawMesh;
}
export { ISphereMeshBuilder };