
import IRendererScene from "../../../vox/scene/IRendererScene";
import { IMaterial } from "../../../vox/material/IMaterial";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

interface IAppPBR {
    initialize(rsecne: IRendererScene): void;
    createMaterial(vertUniformEnabled?: boolean): IMaterial;
    /**
     * @param buffer 
     * @param hdrBrnEnabled the default value is true
     * @param texture the default value is null
     */
    createSpecularTex( buffer: ArrayBuffer, hdrBrnEnabled?: boolean, texture?: IRenderTexture ): IRenderTexture;

}
export { IAppPBR }
