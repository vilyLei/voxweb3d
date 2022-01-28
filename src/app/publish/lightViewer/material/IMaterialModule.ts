import IRenderMaterial from "../../../../vox/render/IRenderMaterial";
import IRendererScene from "../../../../vox/scene/IRendererScene";
import { MaterialPipeType } from "../../../../vox/material/pipeline/MaterialPipeType";
import { IEnvLightModule } from "../../../../light/base/IEnvLightModule";
import { IMaterialPipeline } from "../../../../vox/material/pipeline/IMaterialPipeline";
import { IAppEngine } from "../../../modules/interfaces/IAppEngine";
import { IAppBase } from "../../../modules/interfaces/IAppBase";
import Vector3D from "../../../../vox/math/Vector3D";
import { IMaterialContext } from "../../../../materialLab/base/IMaterialContext";
import { IMaterial } from "../../../../vox/material/IMaterial";
import Color4 from "../../../../vox/material/Color4";
import IRenderEntity from "../../../../vox/render/IRenderEntity";
import IObjGeomDataParser from "../../../../vox/mesh/obj/IObjGeomDataParser";
import { IDataMesh } from "../../../../vox/mesh/IDataMesh";
import { IAppLambert } from "../../../modules/interfaces/IAppLambert";
import BinaryLoader from "../../../../vox/assets/BinaryLoader"
import { ShaderCodeUUID } from "../../../../vox/material/ShaderCodeUUID";

export default interface IMaterialModule {

    preload(): void;
    active(rscene: IRendererScene, materialCtx: IMaterialContext): void;
    /**
     * 
     * @param materialCtx 
     * @param ns 
     * @param normalMapEnabled the default value is true
     * @param displacementMap  the default value is true
     * @param shadowReceiveEnabled  the default value is false
     * @param aoMapEnabled  the default value is true
     */
    // preload(materialCtx: IMaterialContext, ns: string, normalMapEnabled?: boolean, displacementMap?: boolean, shadowReceiveEnabled?: boolean, aoMapEnabled?: boolean): void;
    createMaterial(): IMaterial;
    getUUID(): ShaderCodeUUID;
    isEnabled(): boolean;
}