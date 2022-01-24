import RendererDevice from "../../../vox/render/RendererDevice";
import RendererParam from "../../../vox/scene/RendererParam";
import Vector3D from "../../../vox/math/Vector3D";
import RenderStatusDisplay from "../../../vox/scene/RenderStatusDisplay";
import MouseEvent from "../../../vox/event/MouseEvent";
import RendererScene from "../../../vox/scene/RendererScene";
import EngineBase from "../../../vox/engine/EngineBase";
import Axis3DEntity from "../../../vox/entity/Axis3DEntity";
import Box3DEntity from "../../../vox/entity/Box3DEntity";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { TextureConst } from "../../../vox/texture/TextureConst";
import Sphere3DEntity from "../../../vox/entity/Sphere3DEntity";
import RendererState from "../../../vox/render/RendererState";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { RenderableMaterialBlock } from "../../../vox/scene/block/RenderableMaterialBlock";
import { RenderableEntityBlock } from "../../../vox/scene/block/RenderableEntityBlock";
import { UserInteraction } from "../../../vox/engine/UserInteraction";

import { IShadowVSMModule } from "../../../shadow/vsm/base/IShadowVSMModule";
import ShadowVSMModule from "../../../shadow/vsm/base/ShadowVSMModule";

import Matrix4 from "../../../vox/math/Matrix4";
import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";

import { IVoxAppEngine } from "../interfaces/IVoxAppEngine";
import { IVoxAppBase } from "../interfaces/IVoxAppBase";

import { ILightModule } from "../../../light/base/ILightModule";
import { LightModule } from "../../../light/base/LightModule";

import { IEnvLightModule } from "../../../light/base/IEnvLightModule";
import EnvLightModule from "../../../light/base/EnvLightModule";
//
/*
class Instance {
    constructor() {
    }
    createEnvLightModule(rsecne: IRendererScene): IEnvLightModule {
        let ctx = rsecne.getRenderProxy().uniformContext;
        return new EnvLightModule(ctx);
    }
}
export { EnvLightModule, Instance };
//*/

/*
class Instance {
    constructor() {
    }
    createLightModule(rsecne: IRendererScene): ILightModule {
        let ctx = rsecne.getRenderProxy().uniformContext;
        return new LightModule(ctx);
    }
}
export { LightModule, Instance };
//*/
/*
class VoxAppShadow {
    constructor() {

    }
    createVSMShadow(vsmFboIndex: number): IShadowVSMModule {
        return new ShadowVSMModule(vsmFboIndex);
    }
}
export { ShadowVSMModule, VoxAppShadow };
//*/

class Instance implements IVoxAppBase {
    constructor() {

    }
    initialize(rsecne: IRendererScene): void {

        let rscene = rsecne;
        let materialBlock = new RenderableMaterialBlock();
        materialBlock.initialize();
        rscene.materialBlock = materialBlock;
        let entityBlock = new RenderableEntityBlock();
        entityBlock.initialize();
        rscene.entityBlock = entityBlock;
    }
    createDefaultMaterial(): IRenderMaterial {
        return new Default3DMaterial();
    }

}

// export {VoxAppBase, Axis3DEntity, Box3DEntity, Sphere3DEntity};
export { Instance }
