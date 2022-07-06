import RendererDevice from "../../../vox/render/RendererDevice";
import RendererParam from "../../../vox/scene/RendererParam";
import Vector3D from "../../../vox/math/Vector3D";
import RenderStatusDisplay from "../../../vox/scene/RenderStatusDisplay";
import RendererScene from "../../../vox/scene/RendererScene";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { UserInteraction } from "../../../vox/engine/UserInteraction";

import Matrix4 from "../../../vox/math/Matrix4";
import { IAppEngine } from "../interfaces/IAppEngine";
import { IMaterialContext } from "../../../materialLab/base/IMaterialContext";

class Instance implements IAppEngine {

    private m_rscene: IRendererScene = null;
    private m_statusDisp: RenderStatusDisplay = null;
    private m_timeoutId: any = -1;
    private m_timerDelay: number = 50;
    private m_materialCtx: IMaterialContext = null;

    readonly interaction: UserInteraction = new UserInteraction();
    constructor() { }
    
    setMaterialContext(materialCtx: IMaterialContext): void {
        this.m_materialCtx = materialCtx;
    }
    setSyncLookEnabled(enabled: boolean): void {
        this.interaction.cameraZoomController.syncLookAt = enabled;
    }
    addEntity(entity: IRenderEntity, processIndex: number = 0): void {
        if (this.m_rscene != null) {
            this.m_rscene.addEntity(entity, processIndex);
        }
    }
    removeEntity(entity: IRenderEntity): void {
        if (this.m_rscene != null) {
            this.m_rscene.removeEntity( entity );
        }
    }
    getRendererScene(): IRendererScene {
        return this.m_rscene;
    }

    createRendererScene(): IRendererScene {
        return new RendererScene();
    }
    initialize(debug: boolean = false, rparam: RendererParam = null, timeerDelay: number = 50, renderStatus: boolean = true): void {

        console.log("VoxAppInstance::initialize()......");
        if (this.m_rscene == null) {

            this.m_timerDelay = timeerDelay;

            RendererDevice.SHADERCODE_TRACE_ENABLED = debug;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            console.log("XXX RendererDevice.SHADERCODE_TRACE_ENABLED: ", RendererDevice.SHADERCODE_TRACE_ENABLED);
            if (rparam == null) {
                rparam = new RendererParam();
                // rparam.maxWebGLVersion = 1;
                rparam.setPolygonOffsetEanbled(false);
                rparam.setAttriAlpha(false);
                rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
                rparam.setCamProject(45.0, 30.0, 9000.0);
                rparam.setCamPosition(1800.0, 1800.0, 1800.0);
            }

            let rscene = new RendererScene();
            rscene.initialize(rparam, 7);
            this.m_rscene = rscene;
            this.interaction.initialize(this.m_rscene);

            if (renderStatus) {
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
        this.m_timeoutId = setTimeout(this.update.bind(this), this.m_timerDelay);
        if (this.m_statusDisp != null) this.m_statusDisp.render();
    }
    run(): void {
        if (this.m_statusDisp != null) this.m_statusDisp.update(false);
        if (this.m_rscene != null) {
            if(this.m_materialCtx != null) {
                this.m_materialCtx.run();
            }
            this.interaction.run();
            this.m_rscene.run(true);
        }
    }
}
export { RendererDevice, Instance, Vector3D, Matrix4, RendererParam, RendererScene }
//*/