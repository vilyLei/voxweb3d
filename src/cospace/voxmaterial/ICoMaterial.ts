import IColor4 from "../../vox/material/IColor4";
import IShaderMaterial from "../../vox/material/mcase/IShaderMaterial";
import { IMaterialDecorator } from "../../vox/material/IMaterialDecorator";
import { IMaterial } from "../../vox/material/IMaterial";
import IRenderMaterial from "../../vox/render/IRenderMaterial";

interface ICoMaterial {

	createColor4(pr?: number, pg?: number, pb?: number, pa?: number): IColor4;
	/**
	 * build default 3d entity rendering material
	 * @param normalEnabled the default value is false
	 */
	createDefaultMaterial(normalEnabled?: boolean): IRenderMaterial;
	createShaderMaterial(shd_uniqueName: string): IShaderMaterial;
	createMaterial(dcr: IMaterialDecorator): IMaterial;
}
export { ICoMaterial };
