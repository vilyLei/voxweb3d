/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IGeometry from "../../../vox/mesh/IGeometry";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import { IMeshBuilder } from "./IMeshBuilder";

interface ITorusMeshBuilder extends IMeshBuilder {

    readonly geometry: IGeometry;
    uScale: number;
    vScale: number;
    /**
     * 0: vertical to x-axis, 1: vertical to y-axis, 2: vertical to z-axis, the default value is 0
     */
    axisType: number;
    /**
     * @param ringRadius the default value is 200
     * @param axisRadius the default value is 50
     * @param longitudeNumSegments the default value is 30
     * @param latitudeNumSegments the default value is 20
     * @param uvType the default value is 1 
     * @param alignYRatio the default value is -0.5 
     */
    create(ringRadius?: number, axisRadius?: number, longitudeNumSegments?: number, latitudeNumSegments?: number, uvType?: number, alignYRatio?: number): IRawMesh;
}
export { ITorusMeshBuilder };