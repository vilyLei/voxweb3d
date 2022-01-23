/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { PointLight } from "./PointLight";
import { DirectionLight } from "./DirectionLight";
import { SpotLight } from "./SpotLight";

interface ILightModule {

    getPointLightsTotal(): number;
    getDirecLightsTotal(): number;
    getSpotLightsTotal(): number;
    getPointLightAt(i: number): PointLight;
    getDirectionLightAt(i: number): DirectionLight;
    getSpotLightAt(i: number): SpotLight;
    appendPointLight(): PointLight;
    appendDirectionLight(): DirectionLight;
    appendSpotLight(): SpotLight;

    update(): void

    destroy(): void
}

export { ILightModule };