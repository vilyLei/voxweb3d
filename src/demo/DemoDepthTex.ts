
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import DepthTextureProxy from "../vox/texture/DepthTextureProxy";
import CameraTrack from "../vox/view/CameraTrack";
import MouseEvent from "../vox/event/MouseEvent";
import DemoInstance from "./DemoInstance";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";

import DepZColorMaterial from "../demo/material/DepZColorMaterial";

export class DemoDepthTex extends DemoInstance
{
    constructor()
    {
        super();
    }
    private m_depTex:DepthTextureProxy = null;
    private m_camTrack:CameraTrack = null;
    private m_statusDisp:RenderStatusDisplay = null;
    private m_profileInstance:ProfileInstance = new ProfileInstance();
    protected initializeSceneParam(param:RendererParam):void
    {
        this.m_processTotal = 4;
        param.maxWebGLVersion = 1;
        param.setMatrix4AllocateSize(4096 * 2);
        param.setCamPosition(500.0,500.0,500.0);
    }
    
    protected initializeSceneObj():void
    {
        console.log("DemoDepthTex::initialize()......");
        this.m_camTrack = new CameraTrack();
        this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

        RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
        RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
        //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
        this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);
        if(this.m_profileInstance != null)this.m_profileInstance.initialize(this.m_rscene.getRenderer());
        if(this.m_statusDisp != null)this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 180);

        let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
        
        this.m_depTex = this.m_rscene.textureBlock.getDepthTextureAt(0);

        let scale:number = 1.0;
        for(let i:number = 0; i < 50; ++i)
        {
            scale = 0.3 + 0.2 * Math.random();
            let box:Box3DEntity = new Box3DEntity();
            box.initialize(new Vector3D(-200,-200,-200),new Vector3D(200,200,200),[tex0]);
            box.setXYZ(1200 * Math.random() - 600.0,1200 * Math.random() - 600.0,600 * Math.random() - 600.0);
            box.setScaleXYZ(scale,scale,scale);
            this.m_rscene.addEntity(box);
        }

        let scrPlane:Plane3DEntity = new Plane3DEntity();
        let material:DepZColorMaterial = new DepZColorMaterial();
        material.setStageSize(this.m_rscene.getStage3D().stageWidth, this.m_rscene.getStage3D().stageHeight);
        scrPlane.setMaterial(material);
        scrPlane.initializeXOY(-1.0,-1.0,2.0,2.0,[this.m_rscene.textureBlock.getRTTTextureAt(0), this.m_depTex]);
        this.m_rscene.addEntity(scrPlane, 1);

    }
    private mouseDown(evt:any):void
    {
    }
    runBegin():void
    {
        if(this.m_statusDisp != null)this.m_statusDisp.update();
        this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
        super.runBegin();
    }
    run():void
    {
        // --------------------------------------------- rtt begin
        this.m_rcontext.setClearRGBColor3f(0.1, 0.0, 0.1);
        this.m_rcontext.synFBOSizeWithViewport();
        this.m_rcontext.setRenderToTexture(this.m_rscene.textureBlock.getRTTTextureAt(0), true, false, 0);
        // 这里用深度纹理获得绘制rtt texture 不需要管attachment index
        this.m_rcontext.setRenderToTexture(this.m_depTex, true, false, 1);
        this.m_rcontext.useFBO(true, true, false);
        // to be rendering in framebuffer
        this.m_rscene.runAt(0);
        // --------------------------------------------- rtt end
        this.m_rscene.setClearRGBColor3f(0.0, 3.0, 2.0);
        this.m_rscene.setRenderToBackBuffer();
        // to be rendering in backbuffer
        this.m_rscene.runAt(1);
        if(this.m_profileInstance != null)
        {
            this.m_profileInstance.run();
        }
    }
    runEnd():void
    {
        super.runEnd();
        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
}
export default DemoDepthTex;