/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderEntity from "../../../vox/render/IRenderEntity";
import IDataMesh from "../../mesh/IDataMesh";
import IVector3D from "../../math/IVector3D";
import IMatrix4 from "../../math/IMatrix4";
import IAABB from "../../geom/IAABB";

interface IRenderableEntityBlock {
    
    readonly screenPlane: IRenderEntity;
    readonly unitXOYPlane: IRenderEntity;
    readonly unitXOZPlane: IRenderEntity;
    readonly unitBox: IRenderEntity;

    initialize(): void;

    createVector3D(x?: number, y?: number, z?: number, w?: number): IVector3D;
    createMatrix4(): IMatrix4;
    createAABB(): IAABB;

    createEntity(): IRenderEntity;
    createMesh(): IDataMesh;
}

export { IRenderableEntityBlock }