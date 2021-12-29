import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import Vector3D from "../vox/math/Vector3D";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import RendererScene from "../vox/scene/RendererScene";
import {SceneModule} from "../app/robot/scene/SceneModule";

import { UserInteraction } from "../vox/engine/UserInteraction";

import { CommonMaterialContext } from "../materialLab/base/CommonMaterialContext";
import { IShaderLibListener, MaterialContextParam,DebugMaterialContext } from "../materialLab/base/DebugMaterialContext";
import { DirectionLight } from "../light/base/DirectionLight";

export class RbtDrama implements IShaderLibListener{
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    private m_interaction: UserInteraction = new UserInteraction();

    private m_scene: SceneModule = new SceneModule();
    
    // private m_materialCtx: CommonMaterialContext = new CommonMaterialContext();
    private m_materialCtx: DebugMaterialContext = new DebugMaterialContext();

    shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {
        console.log("shaderLibLoadComplete(), loadingTotal, loadedTotal: ",loadingTotal, loadedTotal);
        this.initScene();
    }
    private initMaterialCtx(): void {

        let mcParam: MaterialContextParam = new MaterialContextParam();
        mcParam.pointLightsTotal = 0;
        mcParam.directionLightsTotal = 1;
        mcParam.spotLightsTotal = 0;
        mcParam.pbrMaterialEnabled = false;
        //mcParam.vsmEnabled = false;
        mcParam.loadAllShaderCode = true;
        mcParam.shaderCodeBinary = true;
        this.m_materialCtx.addShaderLibListener( this );
        this.m_materialCtx.initialize( this.m_rscene, mcParam );

        let lightModule = this.m_materialCtx.lightModule;
        let direcLight: DirectionLight = lightModule.getDirectionLightAt(0);
        direcLight.direction.setXYZ(-0.5,-0.5,0.5);
        
        // let pointLight: PointLight = this.m_materialCtx.lightModule.getPointLightAt(0);
        // pointLight.position.setXYZ(0.0, 150.0, -50.0);
        // pointLight.color.setRGB3f(1.0, 1.0, 1.0);
        // pointLight.attenuationFactor1 = 0.00001;
        // pointLight.attenuationFactor2 = 0.000001;
        
        this.m_materialCtx.lightModule.update();
    }
    
    initialize(): void {
        console.log("RbtDrama::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setAttriAlpha(false);
            rparam.setAttriAntialias(true);
            rparam.setMatrix4AllocateSize(4096 * 8)
            rparam.setCamProject(45.0, 30.0, 9000.0);
            //rparam.setCamPosition(10.0,1800.0,10.0);
            //rparam.setCamPosition(3500.0,3500.0,3500.0);
            //rparam.setCamPosition(1200.0,1200.0,1200.0);
            rparam.setCamPosition(1800.0, 1800.0, 1800.0);
            //rparam.setCamPosition(2800.0,2800.0,2800.0);
            //rparam.setCamPosition(800.0,800.0,800.0);
            //rparam.setCamPosition(1200.0,1200.0,0.0);
            //rparam.setCamPosition(0.0,200.0,1200.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();

            this.m_interaction.initialize(this.m_rscene);

            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            //this.initScene();
            this.initMaterialCtx();
            this.update();
        }
    }
    initScene(): void {

        this.m_scene.initialize(this.m_rscene, this.m_materialCtx);
    }

    private mouseDown(evt: any): void {
        this.m_interaction.viewRay.intersectPlane();
        let pv: Vector3D = this.m_interaction.viewRay.position;
    }

    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps

        this.m_scene.run();
    }
    run(): void {
        this.m_statusDisp.update();

        this.m_interaction.run();

        this.m_rscene.run();
    }
}
export default RbtDrama;