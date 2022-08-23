import IColor4 from "../../vox/material/IColor4";
import { IMaterialDecorator } from "../../vox/material/IMaterialDecorator";
import { IMaterial } from "../../vox/material/IMaterial";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IDefault3DMaterial from "../../vox/material/mcase/IDefault3DMaterial";
import IShaderMaterial from "../../vox/material/mcase/IShaderMaterial";
import { IMaterialContext } from "../../materialLab/base/IMaterialContext";
import { CoMaterialContextParam } from "./ICoMaterial";

import { ICoRScene } from "../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

function createColor4(pr: number = 1.0, pg: number = 1.0, pb: number = 1.0, pa: number = 1.0): IColor4 {
	return CoRScene.createColor4(pr, pg, pb, pa);
}

function createDefaultMaterial(normalEnabled: boolean = false): IDefault3DMaterial {
	return CoRScene.createDefaultMaterial(normalEnabled);
}
function createShaderMaterial(shd_uniqueName: string): IShaderMaterial {
	return CoRScene.createShaderMaterial(shd_uniqueName);
}
function createMaterial(dcr: IMaterialDecorator): IMaterial {
	return CoRScene.createMaterial(dcr);
}


function creatMaterialContextParam(): CoMaterialContextParam {
	return CoRScene.creatMaterialContextParam();
}
function createMaterialContext(): IMaterialContext {
	return CoRScene.createMaterialContext();
}

export {
	createColor4,
	createDefaultMaterial,
	createShaderMaterial,
	createMaterial,
	creatMaterialContextParam,
	createMaterialContext
};
