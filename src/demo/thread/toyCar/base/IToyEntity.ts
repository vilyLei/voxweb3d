/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererScene from "../../../../vox/scene/RendererScene";
import {PathNavigator} from "../../../../voxnav/tileTerrain/PathNavigator";
import { NavigationStatus } from "../../../../voxnav/tileTerrain/NavigationStatus";
import { CarEntityTransform } from "./CarEntityTransform";
import { CommonMaterialContext } from "../../../../materialLab/base/CommonMaterialContext";

interface IToyEntity {

    transform: CarEntityTransform;
    navigator: PathNavigator;
    boundsChanged: boolean;
    getStatus(): NavigationStatus;
    setEntityIndex(index: number): void
    getEntityIndex(): number;
    
    build(sc: RendererScene, materialContext: CommonMaterialContext, size: number): void;
    
    destroy(): void;
    updateTrans(fs32: Float32Array): void;
    updateBounds(): void;
}
export { IToyEntity };