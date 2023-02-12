
import IRendererScene from "../../../vox/scene/IRendererScene";
import { IMaterial } from "../../../vox/material/IMaterial";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

interface IPBREffectInstance {
    initialize(rsecne: IRendererScene): void;
	createTexture(hdrBrnEnabled: boolean): IRenderTexture;
    createMaterial(vertUniformEnabled?: boolean): IMaterial;
    /**
     * @param buffer
     * @param hdrBrnEnabled the default value is true
     * @param texture the default value is null
     */
    createSpecularTex( buffer: ArrayBuffer, hdrBrnEnabled?: boolean, texture?: IRenderTexture ): IRenderTexture;
    destroy(): void;

}

interface IPBREffect {
    create(): IPBREffectInstance;
}
export { IPBREffectInstance, IPBREffect }
