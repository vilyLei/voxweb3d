/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import IRendererScene from "../../../vox/scene/IRendererScene";
import { ILightModule } from "../../../light/base/ILightModule";
import { LightModule } from "../../../light/base/LightModule";
import { PointLight } from "../../../light/base/PointLight";
import { DirectionLight } from "../../../light/base/DirectionLight";
import { SpotLight } from "../../../light/base/SpotLight";

function createLightModule(rsecne: IRendererScene): ILightModule {
	let ctx = rsecne.getRenderProxy().uniformContext;
	return new LightModule(ctx);
}
export { PointLight, SpotLight, DirectionLight, LightModule, createLightModule };
