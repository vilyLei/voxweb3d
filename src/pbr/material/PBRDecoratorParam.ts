/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderTexture from "../../vox/render/texture/IRenderTexture";

class PBRDecoratorFeature {

	specularEnvMapEnabled = true;
	diffuseMapEnabled = false;
	mirrorProjEnabled = false;
	indirectEnvMapEnabled = false;
	aoMapEnabled = false;
	scatterEnabled = false;

	specularEnvMap: IRenderTexture = null;
	diffuseMap: IRenderTexture = null;
	normalMap: IRenderTexture = null;
	mirrorMap: IRenderTexture = null;
	indirectEnvMap: IRenderTexture = null;
	parallaxMap: IRenderTexture = null;
	aoMap: IRenderTexture = null;
	roughnessMap: IRenderTexture = null;
	metalhnessMap: IRenderTexture = null;
	iorMap: IRenderTexture = null;
	armMap: IRenderTexture = null;
	constructor() {}
}
class PBRDecoratorTexture {

	specularEnvMap: IRenderTexture = null;
	diffuseMap: IRenderTexture = null;
	normalMap: IRenderTexture = null;
	mirrorMap: IRenderTexture = null;
	indirectEnvMap: IRenderTexture = null;
	parallaxMap: IRenderTexture = null;
	aoMap: IRenderTexture = null;
	roughnessMap: IRenderTexture = null;
	metalhnessMap: IRenderTexture = null;
	iorMap: IRenderTexture = null;
	armMap: IRenderTexture = null;
	constructor() {}
}
export default class PBRDecoratorParam {

	feature = new PBRDecoratorFeature();
	texture = new PBRDecoratorTexture();
	constructor() {}
}
