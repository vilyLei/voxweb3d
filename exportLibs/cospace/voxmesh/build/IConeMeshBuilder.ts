/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRawMesh from "../../../vox/mesh/IRawMesh";
import { IMeshBuilder } from "./IMeshBuilder";

interface IConeMeshBuilder extends IMeshBuilder {

    inverseUV: boolean;
    uScale: number;
    vScale: number;

    create(radius: number, height: number, longitudeNumSegments: number, alignYRatio?: number): IRawMesh;
}
export { IConeMeshBuilder };