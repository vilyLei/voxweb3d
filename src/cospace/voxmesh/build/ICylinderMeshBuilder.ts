/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRawMesh from "../../../vox/mesh/IRawMesh";
import { IMeshBuilder } from "./IMeshBuilder";

interface ICylinderMeshBuilder extends IMeshBuilder {
    /**
     * the default value is false
     */
    inverseUV: boolean;
    /**
     * the default value is 1.0
     */
    uScale: number;
    /**
     * the default value is 1.0
     */
    vScale: number;
    
    /**
     * @param radius sphere radius
     * @param height sphereheight
     * @param longitudeNumSegments the default value is 20
     * @param uvType the default value is 1
     * @param alignYRatio the default value is -0.5
     */
    create(radius: number, height: number, longitudeNumSegments?: number, uvType?: number, alignYRatio?: number): IRawMesh;
}
export { ICylinderMeshBuilder };