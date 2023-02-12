/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IMaterialPipe } from "../../vox/material/pipeline/IMaterialPipe";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

interface IEnvLightModule extends IMaterialPipe{

    initialize(): void;
    setEnvAmbientMap(tex: IRenderTexture): void;

    setAmbientColorRGB3f(pr: number, pg: number, pb: number): void;
    setFogColorRGB3f(pr: number, pg: number, pb: number): void;
    setFogDensity(density: number): void;
    setFogNear(near: number): void;
    setFogFar(far: number): void;
    setFogAreaOffset(px: number, pz: number): void;
    setFogAreaSize(width: number, height: number): void;

    setEnvAmbientLightAreaOffset(px: number, pz: number): void;
    setEnvAmbientLightAreaSize(width: number, height: number): void;

    update(): void;
    destroy(): void;
}

export { IEnvLightModule }