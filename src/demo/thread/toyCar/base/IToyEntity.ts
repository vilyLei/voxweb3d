/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererScene from "../../../../vox/scene/RendererScene";
import {TerrainPath} from "../terrain/TerrainPath";
import { EntityStatus } from "./EntityStatus";

interface IToyEntity {

    status: EntityStatus;
    path: TerrainPath;

    getEneityIndex(): number;
    setFS32Data(srcFS32: Float32Array, index: number): void;
    build(sc: RendererScene): void;
    
    setXYZ(px: number, py: number, pz: number): void;
    setRotationXYZ(prx: number, pry: number, prz: number): void;
    setParam(bodyScale: number, param1: number, param2: number): void;
    setWheelOffsetXYZ(px: number, py: number, pz: number): void;
    // wheel init rotation, spd, wheel body scale;
    setWheelRotSpeed(pr: number, wheelRotSpd: number, bodyScale: number): void;
    destroy(): void;
    isReadySearchPath(): boolean;
    updateTrans(fs32: Float32Array): void;
    searchedPath(vs: Uint16Array): void;
    stopAndWait(): void;
}
export { IToyEntity };