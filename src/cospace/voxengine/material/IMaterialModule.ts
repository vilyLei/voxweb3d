
import IRendererScene from "../../../vox/scene/IRendererScene";
import { IMaterialContext } from "../../../materialLab/base/IMaterialContext";
import { IMaterial } from "../../../vox/material/IMaterial";

export default interface IMaterialModule {

    preload(callback?: () => void): void;
    active(rscene: IRendererScene, materialCtx: IMaterialContext, shadowEnabled: boolean): void;
    /**
     *
     * @param materialCtx
     * @param ns
     * @param normalMapEnabled the default value is true
     * @param displacementMap  the default value is true
     * @param shadowReceiveEnabled  the default value is false
     * @param aoMapEnabled  the default value is true
     */
    createMaterial(shadowReceiveEnabled?:boolean, materialParam?: any): IMaterial;
    getUUID(): string;
    isEnabled(): boolean;
}
