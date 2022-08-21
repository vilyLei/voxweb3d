import IColor4 from "../../vox/material/IColor4";
import IShaderMaterial from "../../vox/material/mcase/IShaderMaterial";
import { IMaterialDecorator } from "../../vox/material/IMaterialDecorator";
import { IMaterial } from "../../vox/material/IMaterial";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import { IMaterialContext } from "../../materialLab/base/IMaterialContext";


interface CoMaterialContextParam {

    pointLightsTotal: number;
    directionLightsTotal: number;
    spotLightsTotal: number;
    vsmFboIndex: number;
    vsmEnabled: boolean;
    loadAllShaderCode: boolean;
    shaderCodeBinary: boolean;
    shaderLibVersion: string;
    shaderFileNickname: boolean;

    lambertMaterialEnabled: boolean;
    pbrMaterialEnabled: boolean;
    /**
     * 生产 二进制 glsl代码文件
     */
    buildBinaryFile: boolean;

}

interface ICoMaterial {

	createColor4(pr?: number, pg?: number, pb?: number, pa?: number): IColor4;
	/**
	 * build default 3d entity rendering material
	 * @param normalEnabled the default value is false
	 */
	createDefaultMaterial(normalEnabled?: boolean): IRenderMaterial;
	createShaderMaterial(shd_uniqueName: string): IShaderMaterial;
	createMaterial(dcr: IMaterialDecorator): IMaterial;

    creatMaterialContextParam(): CoMaterialContextParam;
    createMaterialContext(): IMaterialContext;
}
export { CoMaterialContextParam, ICoMaterial };
