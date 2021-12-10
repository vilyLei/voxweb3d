/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererScene from "../../../../vox/scene/RendererScene";

interface IToyEntity {

    setFS32Data(srcFS32: Float32Array, index: number): void;
    build(sc: RendererScene): void;
    
    setPosXYZ(px: number, py: number, pz: number): void;
    setRotationXYZ(prx: number, pry: number, prz: number): void;
    setParam(bodyScale: number, param1: number, param2: number): void;
    setWheelOffsetXYZ(px: number, py: number, pz: number): void;
    // wheel init rotation, spd, wheel body scale;
    setWheelRotSpeed(pr: number, wheelRotSpd: number, bodyScale: number): void;
    destroy(): void;
    
    updateTrans(fs32: Float32Array, index: number): void;
}
export { IToyEntity };