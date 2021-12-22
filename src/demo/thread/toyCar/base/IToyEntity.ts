/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererScene from "../../../../vox/scene/RendererScene";
import {TerrainPath} from "../terrain/TerrainPath";
import { EntityStatus } from "./EntityStatus";
import { CommonMaterialContext } from "../../../../materialLab/base/CommonMaterialContext";

interface IToyEntity {

    path: TerrainPath;
    boundsChanged: boolean;
    getStatus(): EntityStatus;
    setEntityIndex(index: number): void
    getEntityIndex(): number;
    
    setFS32Data(srcFS32: Float32Array): void;
    build(sc: RendererScene, materialContext: CommonMaterialContext, size: number): void;
    
    destroy(): void;
    isReadySearchPath(): boolean;
    updateTrans(fs32: Float32Array): void;
    updateBounds(): void;
    searchedPath(vs: Uint16Array): void;
    stopAndWait(): void;
}
export { IToyEntity };