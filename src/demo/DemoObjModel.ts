
import RendererDevice from "../vox/render/RendererDevice";
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst} from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import * as EntityDispT from "./base/EntityDisp";
import ObjData3DEntity from "../vox/entity/ObjData3DEntity";

import EntityDispQueue = EntityDispT.demo.base.EntityDispQueue;

export class DemoObjModel
{
    constructor(){}
    
    private m_rscene:RendererScene = null;
    private m_texLoader:ImageTextureLoader;
    private m_camTrack:CameraTrack = null;
    private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
    private m_equeue:EntityDispQueue = new EntityDispQueue();
    initialize():void
    {
        console.log("DemoObjModel::initialize()......");
        if(this.m_rscene == null)
        {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            let rparam:RendererParam = new RendererParam();
            rparam.setCamProject(45.0,0.1,3000.0);
            rparam.setCamPosition(1500.0,1500.0,1500.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam);
            //this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());
            
            
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            let tex0:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/default.jpg");
            let tex1:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/broken_iron.jpg");
            let tex2:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/guangyun_H_0007.png");
            let tex3:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/flare_core_02.jpg");
            
            this.m_statusDisp.initialize();
            RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.ALWAYS);
            
            let objUrl:string = "static/assets/obj/box01.obj";
            //objUrl = "static/assets/obj/building_001.obj";
            let objDisp:ObjData3DEntity = new ObjData3DEntity();
            objDisp.moduleScale = 10.0;//10.0 + Math.random() * 5.5;
            objDisp.setRotationXYZ(Math.random() * 360.0,Math.random() * 360.0,Math.random() * 360.0);
            objDisp.initializeByObjDataUrl(objUrl,[tex0]);
            //objDisp.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
            this.m_rscene.addEntity(objDisp);
        }
    }
    run():void
    {
        
        this.m_equeue.run();
        this.m_statusDisp.update();

        //console.log("##-- begin");
        this.m_rscene.setClearRGBColor3f(0.0, 0.5, 0.0);
        //this.m_rcontext.setClearRGBAColor4f(0.0, 0.5, 0.0,0.0);
        this.m_rscene.renderBegin();

        this.m_rscene.update();
        this.m_rscene.run();
        
        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        //  //console.log("#---  end");
    }
}
export default DemoObjModel;