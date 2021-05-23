
import RendererDeviece from "../vox/render/RendererDeviece";
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import Stage3D from "../vox/display/Stage3D";

import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst,TextureFormat,TextureDataType,TextureTarget} from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import * as EntityDispT from "./base/EntityDisp";
import ObjData3DEntity from "../vox/entity/ObjData3DEntity";

//import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
//import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
//import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
//import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
//import RendererState = RendererStateT.vox.render.RendererState;
//import RendererParam = RendererParamT.vox.scene.RendererParam;
//import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
//import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
//import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
//import Stage3D = Stage3DT.vox.display.Stage3D;

//import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
//import TextureConst = TextureConstT.vox.texture.TextureConst;
//import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
//import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import EntityDispQueue = EntityDispT.demo.base.EntityDispQueue;
//import ObjData3DEntity = ObjData3DEntityT.vox.entity.ObjData3DEntity;

export namespace demo
{
    export class DemoObjModel
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_equeue:EntityDispQueue = new EntityDispQueue();
        initialize():void
        {
            console.log("DemoObjModel::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/guangyun_H_0007.png");
                let tex3:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/flare_core_02.jpg");
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex2.mipmapEnabled = true;
                tex2.setWrap(TextureConst.WRAP_REPEAT);
                tex3.mipmapEnabled = true;
                
                this.m_statusDisp.initialize("rstatus");
                let rparam:RendererParam = new RendererParam();
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam);
                this.m_rcontext = this.m_renderer.getRendererContext();
                let stage3D:Stage3D = this.m_rcontext.getStage3D() as Stage3D;
                //stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.ALWAYS);
                
                let objUrl:string = "static/assets/obj/box01.obj";
                objUrl = "static/assets/obj/building_001.obj";
                let objDisp:ObjData3DEntity = new ObjData3DEntity();
                objDisp.moduleScale = 10.0;//10.0 + Math.random() * 5.5;
                objDisp.setRotationXYZ(Math.random() * 360.0,Math.random() * 360.0,Math.random() * 360.0);
                objDisp.initializeByObjDataUrl(objUrl,[tex0]);
                //objDisp.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
                this.m_renderer.addEntity(objDisp);
            }
        }
        run():void
        {
           
            this.m_equeue.run();
            this.m_statusDisp.update();

            //console.log("##-- begin");
            this.m_rcontext.setClearRGBColor3f(0.0, 0.5, 0.0);
            //this.m_rcontext.setClearRGBAColor4f(0.0, 0.5, 0.0,0.0);
            this.m_rcontext.renderBegin();

            this.m_renderer.update();
            this.m_renderer.run();

            this.m_rcontext.runEnd();            
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);;
            this.m_rcontext.updateCamera();
            
            //  //console.log("#---  end");
        }
    }
}