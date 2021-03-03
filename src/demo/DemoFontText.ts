
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RendererStateT from "../vox/render/RendererState";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RendererInstanceT from "../vox/scene/RendererInstance";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as Stage3DT from "../vox/display/Stage3D";

import * as TextureConstT from "../vox/texture/TextureConst";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as H5FontSysT from "../vox/text/H5FontSys";

import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as TextBillboard3DEntityT from "../vox/text/TextBillboard3DEntity";
import * as TextureBlockT from "../vox/texture/TextureBlock";
import * as TexResLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as EntityDispT from "./base/EntityDisp";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import Stage3D = Stage3DT.vox.display.Stage3D;
import H5FontSystem = H5FontSysT.vox.text.H5FontSystem;

import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import TextBillboard3DEntity = TextBillboard3DEntityT.vox.text.TextBillboard3DEntity;
import TextureBlock = TextureBlockT.vox.texture.TextureBlock;
import ImageTextureLoader = TexResLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import EntityDispQueue = EntityDispT.demo.base.EntityDispQueue;

export namespace demo
{
    export class DemoFontText
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_texBlock:TextureBlock;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_equeue:EntityDispQueue = new EntityDispQueue();
        
        private m_fpsTextBill:TextBillboard3DEntity = null;
        private m_textBill:TextBillboard3DEntity = null;
        private getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("DemoFontText::initialize()......");
            if(this.m_rcontext == null)
            {

                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                
                this.m_statusDisp.initialize("rstatus");
                let rparam:RendererParam = new RendererParam();
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(500.0,500.0,500.0);
                this.m_renderer = new RendererInstance();
                let stage3D:Stage3D = new Stage3D(this.m_renderer.getRCUid(),document);
                this.m_renderer.__$setStage3D(stage3D);
                this.m_renderer.initialize(rparam);
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                this.m_rcontext = this.m_renderer.getRendererContext();

                H5FontSystem.GetInstance().setRenderProxy(this.m_renderer.getRenderProxy());
                H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,true,true);

                this.m_texBlock = new TextureBlock();
                this.m_texBlock.setRenderer( this.m_renderer );
                this.m_texLoader = new ImageTextureLoader(this.m_texBlock);
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);


                let paxis:Axis3DEntity = new Axis3DEntity();
                paxis.initialize(300.0);
                this.m_renderer.addEntity(paxis,0);
                
                let textBill:TextBillboard3DEntity = new TextBillboard3DEntity();
                //textBill.alignLeftCenter();
                textBill.alignCenter();
                textBill.initialize("嗨");
                textBill.setXYZ(Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0);
                textBill.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
                this.m_renderer.addEntity(textBill,1);
                this.m_textBill = textBill;
                
                textBill = new TextBillboard3DEntity();
                textBill.initialize("哇塞");
                textBill.setXYZ(Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0);
                this.m_renderer.addEntity(textBill);

                this.m_fpsTextBill = new TextBillboard3DEntity();
                this.m_fpsTextBill.initialize(this.m_statusDisp.getFPSStr());
                this.m_fpsTextBill.setRGB3f(Math.random() + 0.1,Math.random() + 0.1,Math.random() + 0.1);
                //this.m_fpsTextBill.setRGB3f(0.0,1.0,1.0);
                this.m_fpsTextBill.setXYZ(Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0);
                this.m_renderer.addEntity(this.m_fpsTextBill); 
                this.m_fpsTextBill.__$setRenderProxy(this.m_renderer.getRenderProxy());              

            }
        }
        mouseDownListener(evt:any):void
        {
            this.m_textBill.setText("事情要做好"+"."+Math.round(Math.random() * 100));
            this.m_textBill.updateMeshToGpu(this.m_renderer.getRenderProxy());
            this.m_textBill.update();
        }
        private m_delayTime:number = 40;
        run():void
        {
            if(this.m_delayTime < 0)
            {
                if(this.m_fpsTextBill != null)
                {
                    this.m_fpsTextBill.setRGB3f(Math.random() + 0.1,Math.random() + 0.1,Math.random() + 0.1);
                    this.m_fpsTextBill.setText(this.m_statusDisp.getFPSStr() + "."+Math.round(Math.random() * 100));
                    this.m_fpsTextBill.updateMeshToGpu();
                    this.m_fpsTextBill.update();
                }
                this.m_delayTime = 40.0;
            }
            this.m_delayTime --;
            
            this.m_equeue.run();
            this.m_statusDisp.update();

            this.m_rcontext.setClearRGBColor3f(0.0, 0.5, 0.0);
            this.m_rcontext.renderBegin();

            this.m_renderer.update();
            this.m_renderer.run();

            this.m_rcontext.runEnd();            
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_rcontext.updateCamera();            
        }
    }
}