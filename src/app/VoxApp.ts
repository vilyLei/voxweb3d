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
import TextureProxy from "../vox/texture/TextureProxy";
import { TextureConst } from "../vox/texture/TextureConst";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import RendererState from "../vox/render/RendererState";
// export class VoxAppInstance {
class VoxAppInstance {

    private m_rscene: RendererScene = null;
    private m_engine: EngineBase = null;
    private m_statusDisp: RenderStatusDisplay = null;
    private m_timeoutId: any = -1;
    private m_timeerDelay: number = 50;
    private m_texLoader: ImageTextureLoader = null;
    constructor() { }

    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        if(this.m_texLoader != null) {
            let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
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
    getEngine(): EngineBase {
        return this.m_engine;
    }
    initialize(rparam: RendererParam = null, timeerDelay: number = 50, renderStatus: boolean = true): void {
        console.log("this::initialize()......");
        if (this.m_rscene == null) {

            this.m_timeerDelay = timeerDelay;
            
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
        this.m_timeoutId = setTimeout(this.update.bind(this), this.m_timeerDelay);
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
export {RendererDevice, VoxAppInstance, Vector3D, Axis3DEntity, Box3DEntity, Sphere3DEntity, RendererState, RendererParam, RendererScene};
// export {RendererDevice, VoxAppInstance, Vector3D, RendererState, RendererParam, RendererScene};