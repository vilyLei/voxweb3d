
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import LambertLightMaterial from "../vox/material/mcase/LambertLightMaterial";
import { MaterialContextParam, DebugMaterialContext } from "../materialLab/base/DebugMaterialContext";

export class DemoAdsLight {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_materialCtx: DebugMaterialContext = new DebugMaterialContext();

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        return this.m_texLoader.getTexByUrl(purl,wrapRepeat,mipmapEnabled);
    }
    initialize(): void {
        console.log("DemoAdsLight::initialize()......");
        if (this.m_rscene == null) {

            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            let rparam: RendererParam = new RendererParam();
            rparam.maxWebGLVersion = 2;
            rparam.setCamPosition(800.0, 800.0, 800.0);
            rparam.setAttriAntialias(true);
            rparam.setAttriStencil(true);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam);
            this.m_rscene.updateCamera();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_rscene.enableMouseEvent(true);
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            let mcParam: MaterialContextParam = new MaterialContextParam();
            mcParam.pointLightsTotal = 2;
            mcParam.directionLightsTotal = 1;
            mcParam.spotLightsTotal = 2;
            mcParam.vsmEnabled = false;
            
            this.m_materialCtx.initialize( this.m_rscene, mcParam);
            
            this.m_materialCtx.lightModule.update();
            //  let axis: Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(500.0);
            //  this.m_rscene.addEntity(axis);

            let material: LambertLightMaterial = new LambertLightMaterial();
            this.useMaps(material, "lava_03");
            // add common 3d display entity
            let plane: Plane3DEntity = new Plane3DEntity();
            plane.setMaterial(material);
            plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0);
            this.m_rscene.addEntity(plane);

            let sph: Sphere3DEntity = new Sphere3DEntity();
            sph.setMaterial(material);
            sph.initialize(200.0, 20, 20);
            sph.setXYZ(Math.random() * 600.0 - 300.0, Math.random() * 600.0 - 300.0, Math.random() * 600.0 - 300.0);
            this.m_rscene.addEntity(sph);
            this.update();

        }
    }
    
    private useMaps(material: LambertLightMaterial, ns: string, normalMapEnabled: boolean = true, displacementMap: boolean = false, shadowReceiveEnabled: boolean = false, aoMapEnabled: boolean = false, parallaxMapEnabled: boolean = false): void {
        
        material.setMaterialPipeline( this.m_materialCtx.pipeline );

        if(material.diffuseMap == null)material.diffuseMap =           this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_COLOR.png");
        material.specularMap =          this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_SPEC.png");
        if(normalMapEnabled) {
            material.normalMap =        this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_NRM.png");
        }
        if(aoMapEnabled) {
            material.aoMap =            this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_OCC.png");
        }
        if(displacementMap) {
            if(material.vertUniform != null) {
                material.vertUniform.displacementMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_DISP.png");
            }
        }
        if(parallaxMapEnabled) {
            material.parallaxMap =  this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_DISP.png");
        }
        if(shadowReceiveEnabled) {
            material.shadowMap =        this.m_materialCtx.vsmModule.getShadowMap();
        }
    }
    private mouseDown(evt: any): void {
        console.log("mouse down... ...");
    }

    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps

        this.m_statusDisp.render();
    }

    run(): void {
        this.m_statusDisp.update(false);


        this.m_stageDragSwinger.runWithYAxis();

        this.m_rscene.run(true);

        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);

        //this.m_profileInstance.run();
    }
}
export default DemoAdsLight;