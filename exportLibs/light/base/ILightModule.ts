/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IPointLight } from "./IPointLight";
import { IDirectionLight } from "./IDirectionLight";
import { ISpotLight } from "./ISpotLight";
import { IMaterialPipe } from "../../vox/material/pipeline/IMaterialPipe";

interface ILightModule extends IMaterialPipe {

    getPointLightsTotal(): number;
    getDirecLightsTotal(): number;
    getSpotLightsTotal(): number;
    getPointLightAt(i: number): IPointLight;
    getDirectionLightAt(i: number): IDirectionLight;
    getSpotLightAt(i: number): ISpotLight;
    appendPointLight(): IPointLight;
    appendDirectionLight(): IDirectionLight;
    appendSpotLight(): ISpotLight;
    showInfo(): void;

    update(): void

    destroy(): void
}

export { ILightModule };
