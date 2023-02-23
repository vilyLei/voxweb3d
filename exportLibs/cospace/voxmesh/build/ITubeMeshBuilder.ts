/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IGeometry from "../../../vox/mesh/IGeometry";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import { IMeshBuilder } from "./IMeshBuilder";

interface ITubeMeshBuilder extends IMeshBuilder {
    /**
     * the default value is 1.0
     */
    uScale: number;
    /**
     * the default value is 1.0
     */
    vScale: number;
    
    readonly geometry: IGeometry;
    /**
     * @param radius sphere radius
     * @param long sphereheight
     * @param longitudeNumSegments the default value is 20
     * @param latitudeNumSegments the default value is 1
     * @param uvType the default value is 1
     * @param alignYRatio the default value is -0.5
     */
    create(radius: number, long: number, longitudeNumSegments?: number, latitudeNumSegments?: number, uvType?: number, alignYRatio?: number): IRawMesh;
}
export { ITubeMeshBuilder };