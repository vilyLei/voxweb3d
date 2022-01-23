import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import Vector3D from "../vox/math/Vector3D";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import RendererScene from "../vox/scene/RendererScene";
import EngineBase from "../vox/engine/EngineBase";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import IRenderEntity from "../vox/render/IRenderEntity";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import { TextureConst } from "../vox/texture/TextureConst";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import RendererState from "../vox/render/RendererState";
import IRendererScene from "../vox/scene/IRendererScene";
import { RenderableMaterialBlock } from "../vox/scene/block/RenderableMaterialBlock";
import { RenderableEntityBlock } from "../vox/scene/block/RenderableEntityBlock";
import { UserInteraction } from "../vox/engine/UserInteraction";

import { IShadowVSMModule } from "../shadow/vsm/base/IShadowVSMModule";
import ShadowVSMModule from "../shadow/vsm/base/ShadowVSMModule";

import Matrix4 from "../vox/math/Matrix4";
import IRenderMaterial from "../vox/render/IRenderMaterial";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";

import { IVoxAppEngine } from "./modules/interfaces/IVoxAppEngine";
import { IVoxAppBase } from "./modules/interfaces/IVoxAppBase";

import { ILightModule } from "../light/base/ILightModule";
import { LightModule } from "../light/base/LightModule";
import EnvLightData from "../light/base/EnvLightData";
//
/*
class VoxAppEnvLightData {
    constructor() {

    }
    createEnvLightData(rsecne: IRendererScene): EnvLightData {
        let ctx = rsecne.getRenderProxy().uniformContext;
        return new EnvLightData(ctx);
    }
}
export { EnvLightData, VoxAppEnvLightData };
//*/

// /*
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
/*
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
// var pwin: any = window;
// pwin["VoxAppBase"] = Instance;
// export {VoxAppBase, Axis3DEntity, Box3DEntity, Sphere3DEntity};
export { Instance };
//*/

/*
class Instance implements IVoxAppEngine {

    private m_rscene: IRendererScene = null;
    private m_statusDisp: RenderStatusDisplay = null;
    private m_timeoutId: any = -1;
    private m_timeDelay: number = 50;
    private m_texLoader: ImageTextureLoader = null;
    
    readonly interaction: UserInteraction = new UserInteraction();
    constructor() { }

    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
        if(this.m_texLoader != null) {
            return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled);
        }
        return null;
    }
    addEntity(entity: IRenderEntity, processIndex: number = 0): void {
        if (this.m_rscene != null) {
            this.m_rscene.addEntity(entity, processIndex, true);
        }
    }
    getRendererScene(): IRendererScene {
        return this.m_rscene;
    }
    
    createRendererScene(): IRendererScene {
        return new RendererScene();
    }
    initialize(rparam: RendererParam = null, timeerDelay: number = 50, renderStatus: boolean = true): void {
        console.log("VoxAppInstance::initialize()......");
        if (this.m_rscene == null) {

            this.m_timeDelay = timeerDelay;
            
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            if(rparam == null) rparam = new RendererParam();
            // rparam.maxWebGLVersion = 1;
            rparam.setPolygonOffsetEanbled(false);
            rparam.setAttriAlpha(false);
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamProject(45.0, 30.0, 9000.0);
            rparam.setCamPosition(1800.0, 1800.0, 1800.0);

            let rscene = new RendererScene();
            rscene.initialize(rparam, 7, );
            this.m_rscene = rscene;
            this.interaction.initialize(this.m_rscene);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            if(renderStatus) {
                this.m_statusDisp = new RenderStatusDisplay();
                this.m_statusDisp.initialize();
            }

            this.update();
        }
    }
    private update(): void {

        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), this.m_timeDelay);
        if(this.m_statusDisp != null) this.m_statusDisp.render();
    }
    run(): void {
        if(this.m_statusDisp != null) this.m_statusDisp.update(false);
        if(this.m_rscene != null) {
            this.interaction.run();
            this.m_rscene.run(true);
        }
    }
}
// var pwin: any = window;
// pwin["Instance"] = Instance;
// export default VoxAppInstance;
// export {RendererDevice, VoxAppInstance, Vector3D, Axis3DEntity, Box3DEntity, Sphere3DEntity, RendererParam, RendererScene}
export {RendererDevice, Instance, Vector3D, Matrix4, RendererParam, RendererScene}
//*/

/*
// export class VoxAppInstance {
class VoxAppInstance {

    private m_rscene: RendererScene = null;
    private m_engine: EngineBase = null;
    private m_statusDisp: RenderStatusDisplay = null;
    private m_timeoutId: any = -1;
    private m_timeDelay: number = 50;
    private m_texLoader: ImageTextureLoader = null;
    constructor() { }

    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
        if(this.m_texLoader != null) {
            let ptex: IRenderTexture = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        return null;
    }
    addEntity(entity: IRenderEntity, processIndex: number = 0): void {
        if (this.m_rscene != null) {
            this.m_rscene.addEntity(entity, processIndex);
        }
    }
    getRendererScene(): RendererScene {
        return this.m_rscene;
    }
    createRendererScene(): RendererScene {
        return new RendererScene();
    }
    getEngine(): EngineBase {
        return this.m_engine;
    }
    initialize(rparam: RendererParam = null, timeerDelay: number = 50, renderStatus: boolean = true): void {
        console.log("VoxAppInstance::initialize()......");
        if (this.m_rscene == null) {

            this.m_timeDelay = timeerDelay;
            
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            if(rparam == null) rparam = new RendererParam();
            // rparam.maxWebGLVersion = 1;
            rparam.setPolygonOffsetEanbled(false);
            rparam.setAttriAlpha(false);
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamProject(45.0, 30.0, 9000.0);
            rparam.setCamPosition(1800.0, 1800.0, 1800.0);

            // this.m_rscene = new RendererScene();
            // this.m_rscene.initialize(rparam, 7);

            this.m_engine = new EngineBase();
            this.m_engine.initialize(rparam, 7);
            this.m_engine.setProcessIdListAt(0, [0,1,2,4,5,6]);
            this.m_rscene = this.m_engine.rscene;

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            if(renderStatus) {
                this.m_statusDisp = new RenderStatusDisplay();
                this.m_statusDisp.initialize();
            }

            this.update();
        }
    }
    private update(): void {

        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), this.m_timeDelay);
        if(this.m_statusDisp != null) this.m_statusDisp.update(true);
    }
    run(): void {
        if (this.m_engine != null) {
            if(this.m_statusDisp != null) this.m_statusDisp.update(false);
            this.m_engine.run();
        }
        // if(this.m_rscene != null) {
        //     this.m_rscene.run();
        // }
    }
}

// export default VoxAppInstance;
// export {RendererDevice, VoxAppInstance, Vector3D, Axis3DEntity, Box3DEntity, Sphere3DEntity, RendererParam, RendererScene}
export {RendererDevice, VoxAppInstance, Vector3D, Matrix4, RendererParam, RendererScene}
//*/