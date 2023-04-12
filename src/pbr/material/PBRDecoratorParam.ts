/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderTexture from "../../vox/render/texture/IRenderTexture";

export default class PBRDecoratorParam {
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
