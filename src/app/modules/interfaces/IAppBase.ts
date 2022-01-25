
import IRendererScene from "../../../vox/scene/IRendererScene";
import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import { IMaterialContext } from "../../../materialLab/base/IMaterialContext";
import { IMaterial } from "../../../vox/material/IMaterial";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

interface IAppBase {
    initialize(rsecne: IRendererScene): void;
    createDefaultMaterial(normalEnabled?: boolean): IRenderMaterial;
    createMaterialContext(): IMaterialContext;
    createLambertMaterial(vertUniformEnabled?: boolean): IMaterial;
    createPBRMaterial(vertUniformEnabled?: boolean): IMaterial;
    createSpecularTex(hdrBrnEnabled: boolean, buffer: ArrayBuffer): IRenderTexture;

}
export {IAppBase};
