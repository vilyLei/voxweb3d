/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
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
    /**
     * center align in the XOY Plane, its size is 1
     */
    readonly unitXOYPlane: IRenderEntity;
    /**
     * center align in the XOZ Plane, its size is 1
     */
    readonly unitXOZPlane: IRenderEntity;
    /**
     * center align in the YOZ Plane, its size is 1
     */
    readonly unitYOZPlane: IRenderEntity;
    /**
     * center align, its size is 1
     */
    readonly unitBox: IRenderEntity;

    /**
     * axis origin align in the XOY Plane, its size is 1
     */
     readonly unitOXOYPlane: IRenderEntity;
     /**
      * axis origin align in the XOZ Plane, its size is 1
      */
     readonly unitOXOZPlane: IRenderEntity;
     /**
      * axis origin align in the YOZ Plane, its size is 1
      */
     readonly unitOYOZPlane: IRenderEntity;
     /**
      * axis origin align, its size is 1
      */
     readonly unitOBox: IRenderEntity;

    initialize(): void;

    createVector3(x?: number, y?: number, z?: number, w?: number): IVector3D;
    createMatrix4(): IMatrix4;
    createAABB(): IAABB;

    createEntity(): IRenderEntity;
    createMesh(): IDataMesh;
}

export { IRenderableEntityBlock }