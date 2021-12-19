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

    getStatus(): EntityStatus;
    // status: EntityStatus;
    path: TerrainPath;

    getEneityIndex(): number;
    setFS32Data(srcFS32: Float32Array, index: number): void;
    build(sc: RendererScene, materialContext: CommonMaterialContext, size: number): void;
    
    destroy(): void;
    isReadySearchPath(): boolean;
    updateTrans(fs32: Float32Array): void;
    searchedPath(vs: Uint16Array): void;
    stopAndWait(): void;
}
export { IToyEntity };