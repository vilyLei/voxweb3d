import IColor4 from "../../vox/material/IColor4";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import { IMaterialDecorator } from "../../vox/material/IMaterialDecorator";
import { IMaterial } from "../../vox/material/IMaterial";
import { Material } from "../../vox/material/Material";
import ShaderMaterial from "../../vox/material/mcase/ShaderMaterial";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IShaderMaterial from "../../vox/material/mcase/IShaderMaterial";

import { ICoRScene } from "../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

function createColor4(pr: number = 1.0, pg: number = 1.0, pb: number = 1.0, pa: number = 1.0): IColor4 {
	return CoRScene.createColor4(pr, pg, pb, pa);
}

function createDefaultMaterial(normalEnabled: boolean = false): IRenderMaterial {
	let m = new Default3DMaterial();
	m.normalEnabled = normalEnabled;
	return m;
}
function createShaderMaterial(shd_uniqueName: string): IShaderMaterial {
	return new ShaderMaterial(shd_uniqueName);
}
function createMaterial(dcr: IMaterialDecorator): IMaterial {
	let m = new Material();
	m.setDecorator(dcr);
	return m;
}
export {
	createColor4,
	createDefaultMaterial,
	createShaderMaterial,
	createMaterial
};
