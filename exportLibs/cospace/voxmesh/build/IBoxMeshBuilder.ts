/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import { IMeshBuilder } from "./IMeshBuilder";

interface IBoxMeshBuilder extends IMeshBuilder {

    flatNormal: boolean;
    normalScale: number;
    uScale: number;
    vScale: number;
    flipVerticalUV: boolean;
    /**
     * the default value is false
     */
    uvPartsNumber: number;
    createCube(cubeSize: number): IRawMesh;
    create(minV: IVector3D, maxV: IVector3D): IRawMesh;
}
export { IBoxMeshBuilder };