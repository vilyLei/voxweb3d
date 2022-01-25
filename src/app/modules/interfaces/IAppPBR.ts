
import IRendererScene from "../../../vox/scene/IRendererScene";
import { IMaterial } from "../../../vox/material/IMaterial";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

interface IAppPBR {
    initialize(rsecne: IRendererScene): void;
    createMaterial(vertUniformEnabled?: boolean): IMaterial;
    createSpecularTex( buffer: ArrayBuffer, hdrBrnEnabled?: boolean ): IRenderTexture;

}
export { IAppPBR }
