import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererState from "../vox/render/RendererState";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import PureEntity from "../vox/entity/PureEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";

import CameraTrack from "../vox/view/CameraTrack";
import MouseEvent from "../vox/event/MouseEvent";
import DemoInstance from "./DemoInstance";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import ThreadSystem from "../thread/ThreadSystem";
import {UserInteraction} from "../vox/engine/UserInteraction";

import { ToyCarScene } from "./thread/toyCar/scene/ToyCarScene";

import LambertLightMaterial from "../vox/material/mcase/LambertLightMaterial";
import { MaterialPipeType } from "../vox/material/pipeline/MaterialPipeType";
import { IShaderLibListener, CommonMaterialContext, MaterialContextParam } from "../materialLab/base/CommonMaterialContext";
import { PointLight } from "../light/base/PointLight";
import { DirectionLight } from "../light/base/DirectionLight";

export class DemoToyCarThread extends DemoInstance implements IShaderLibListener{
    constructor() {
        super();
    }
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = null;
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_userInteraction: UserInteraction = new UserInteraction();
    
    private m_materialCtx: CommonMaterialContext = new CommonMaterialContext();

    private m_toyCarScene: ToyCarScene = new ToyCarScene();

    protected initializeSceneParam(param: RendererParam): void {
        this.m_processTotal = 4;
        // param.maxWebGLVersion = 1;
        param.setCamProject(45.0, 80.0, 3500.0);
        param.setMatrix4AllocateSize(4096 * 4);
        param.setCamPosition(500.0, 500.0, 500.0);
    }

    protected initializeSceneObj(): void {
        console.log("DemoToyCarThread::initialize()......");
        this.m_camTrack = new CameraTrack();
        this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

        RendererDevice.SHADERCODE_TRACE_ENABLED = false;
        RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
        //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
        this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
        if (this.m_profileInstance != null) this.m_profileInstance.initialize(this.m_rscene.getRenderer());
        if (this.m_statusDisp != null) this.m_statusDisp.initialize();
        
        this.m_userInteraction.initialize( this.m_rscene );

        
        this.update();
        //this.initScene();
        this.initMaterialCtx();
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
        this.m_materialCtx.initialize( this.m_rscene, mcParam );

        let lightModule = this.m_materialCtx.lightModule;
        let direcLight: DirectionLight = lightModule.getDirectionLightAt(0);
        direcLight.direction.setXYZ(-0.5,-0.5,0.5);
        
        this.m_materialCtx.addShaderLibListener( this );
        
        // let pointLight: PointLight = this.m_materialCtx.lightModule.getPointLightAt(0);
        // pointLight.position.setXYZ(0.0, 150.0, -50.0);
        // pointLight.color.setRGB3f(1.0, 1.0, 1.0);
        // pointLight.attenuationFactor1 = 0.00001;
        // pointLight.attenuationFactor2 = 0.000001;
                
        this.m_materialCtx.lightModule.update();
    }
    
    private applyMaterial(material: LambertLightMaterial, ns: string, normalMapEnabled: boolean = true, displacementMap: boolean = false, shadowReceiveEnabled: boolean = false, aoMapEnabled: boolean = false): void {
        
        material.setMaterialPipeline( this.m_materialCtx.pipeline );

        material.diffuseMap =           this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_COLOR.png");
        material.specularMap =          this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_SPEC.png");
        if(normalMapEnabled) {
            material.normalMap =        this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_NRM.png");
        }
        if(aoMapEnabled) {
            material.aoMap =            this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_OCC.png");
        }
        if(displacementMap) {
            material.displacementMap =  this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_DISP.png");
        }
        if(shadowReceiveEnabled && this.m_materialCtx.vsmModule != null) {
            material.shadowMap =        this.m_materialCtx.vsmModule.getShadowMap();
        }
    }
    loadedShaderCode(loadingTotal: number, loadedTotal: number): void {
        console.log("loadedShaderCode(), loadingTotal, loadedTotal: ",loadingTotal, loadedTotal);
        this.initScene();
    }
    private initScene(): void {

        // let axis: Axis3DEntity = new Axis3DEntity();
        // axis.initialize(300.0);
        // axis.setXYZ(0, 30, 0);
        // this.m_rscene.addEntity(axis);

        this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
        this.m_toyCarScene.initialize(this.m_rscene, this.m_materialCtx);

        // let material: LambertLightMaterial = this.m_materialCtx.createLambertLightMaterial();
        // material.fogEnabled = false;
        // material.diffuseMap = tex0;
        // let box: Box3DEntity = new Box3DEntity();
        // box.setMaterial( material );
        // box.initializeCube(100, [tex0]);
        // this.m_rscene.addEntity( box );
    }
    private m_downFlag: number = 0;
    private mouseDown(evt: any): void {
        this.m_downFlag++;
        this.m_userInteraction.viewRay.intersectPlane();
        let pv: Vector3D = this.m_userInteraction.viewRay.position;
        this.m_toyCarScene.testDose( pv );
    }
    private m_timeoutId: any = -1;
    private update(): void {
        
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 30);// 20 fps
        
        this.m_toyCarScene.run();
        this.m_toyCarScene.updateThread();
    }
    runBegin(): void {
        
        this.m_userInteraction.run();
        
        if (this.m_statusDisp != null) this.m_statusDisp.update();
        
    }
    run(): void {

        ThreadSystem.Run();

        this.m_rscene.run();

        if (this.m_profileInstance != null) {
            this.m_profileInstance.run();
        }
    }
    runEnd(): void {
    }
}
export default DemoToyCarThread;