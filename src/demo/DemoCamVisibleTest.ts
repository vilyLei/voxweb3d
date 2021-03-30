
import * as Vector3DT from "../vox/math/Vector3D";
import * as Matrix4T from "../vox/math/Matrix4";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RendererStateT from "../vox/render/RendererState";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RendererInstanceT from "../vox/scene/RendererInstance";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as Stage3DT from "../vox/display/Stage3D";
import * as H5FontSysT from "../vox/text/H5FontSys";

import * as DisplayEntityT from "../vox/entity/DisplayEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as Sphere3DEntityT from "../vox/entity/Sphere3DEntity";
import * as Cylinder3DEntityT from "../vox/entity/Cylinder3DEntity";
import * as Billboard3DEntityT from "../vox/entity/Billboard3DEntity";
import * as ScreenAlignPlaneEntityT from "../vox/entity/ScreenAlignPlaneEntity";
import * as ScreenFixedAlignPlaneEntityT from "../vox/entity/ScreenFixedAlignPlaneEntity";
import * as Rect2DEntityT from "../vox2d/entity/Rect2DEntity";
import * as Text2DEntityT from "../vox2d/text/Text2DEntity";
import * as ProfileInstanceT from "../voxprofile/entity/ProfileInstance";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as DisplayEntityContainerT from "../vox/entity/DisplayEntityContainer";
import * as EntityDispT from "./base/EntityDisp";
import * as Color4T from '../vox/material/Color4';

import Vector3D = Vector3DT.vox.math.Vector3D;
import Matrix4 = Matrix4T.vox.math.Matrix4;
import Matrix4Pool = Matrix4T.vox.math.Matrix4Pool;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import Stage3D = Stage3DT.vox.display.Stage3D;
import H5FontSystem = H5FontSysT.vox.text.H5FontSystem;

import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
import Cylinder3DEntity = Cylinder3DEntityT.vox.entity.Cylinder3DEntity;
import Billboard3DEntity = Billboard3DEntityT.vox.entity.Billboard3DEntity;
import ScreenAlignPlaneEntity = ScreenAlignPlaneEntityT.vox.entity.ScreenAlignPlaneEntity;
import ScreenFixedAlignPlaneEntity = ScreenFixedAlignPlaneEntityT.vox.entity.ScreenFixedAlignPlaneEntity;
import Rect2DEntity = Rect2DEntityT.vox2d.entity.Rect2DEntity;
import Text2DEntity = Text2DEntityT.vox2d.text.Text2DEntity;
import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import DisplayEntityContainer = DisplayEntityContainerT.vox.entity.DisplayEntityContainer;
//import EntityDisp = EntityDispT.demo.base.EntityDisp;
import Color4 = Color4T.vox.material.Color4;
import EntityDispQueue = EntityDispT.demo.base.EntityDispQueue;

export namespace demo
{
    export class DemoCamVisibleTest
    {
        constructor()
        {
        }
        
        private m_rscene:RendererScene = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_equeue:EntityDispQueue = new EntityDispQueue();
        private m_container:DisplayEntityContainer = null;
        private m_containerMain:DisplayEntityContainer = null;
        private m_followEntity:DisplayEntity = null;
        private m_rect2DDisp:Rect2DEntity = null;
        private m_timeoutEnabled:boolean = true;
        private m_intervalEnabled:boolean = false;
        private m_timeoutId:any = -1;
        private m_timeIntervalId:number = -1;

        
        private m_textFPSNS:Text2DEntity = null;
        private m_textFPS:Text2DEntity = null;
        private m_profileInstance:ProfileInstance = new ProfileInstance();
        initialize():void
        {
            console.log("DemoCamVisibleTest::initialize()......");
            if(this.m_rcontext == null)
            {
                H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,true,false);
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/guangyun_H_0007.png");
                let tex3:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/flare_core_01.jpg");
                let tex4:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/flare_core_02.jpg");
                let tex5:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/a_02_c.jpg");
                BillParticle.texs.push(tex2);
                BillParticle.texs.push(tex3);
                BillParticle.texs.push(tex4);
                BillParticle.texs.push(tex5);
                tex0.mipmapEnabled = true;
                tex1.mipmapEnabled = true;
                tex2.mipmapEnabled = true;
                tex3.mipmapEnabled = true;
                tex4.mipmapEnabled = true;
                tex5.mipmapEnabled = true;
                
                let rparam:RendererParam = new RendererParam();
                rparam.setMatrix4AllocateSize(8192 * 4);
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.setRendererProcessParam(1,true,true);
                this.m_rcontext = this.m_rscene.getRendererContext();
                BillParticle.renderer = this.m_rscene.getRenderer();
                let stage3D:Stage3D = this.m_rcontext.getStage3D() as Stage3D;
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseUpListener);
                stage3D.addEventListener(MouseEvent.MOUSE_WHEEL,this,this.mouseWheeelListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                
                let i:number = 0;
                let total:number = 10;

                //  let alignPlane:ScreenAlignPlaneEntity = new ScreenAlignPlaneEntity();
                //  alignPlane.initialize(-0.5,-0.5,1.0,1.0,[tex1]);
                //  this.m_rscene.addEntity(alignPlane);

                
                //  let alignFixedPlane:ScreenFixedAlignPlaneEntity = new ScreenFixedAlignPlaneEntity();
                //  alignFixedPlane.initialize(-0.5,-0.5,1.0,1.0,[tex1]);
                //  this.m_rscene.addEntity(alignFixedPlane);
                //  //Rect2DEntity
                //              let rect2DDisp:Rect2DEntity = new Rect2DEntity();
                //              rect2DDisp.initialize(0.0,0.0,120.0,160.0,[tex0]);
                //              rect2DDisp.setRotation(30.0);
                //              this.m_rscene.addEntity(rect2DDisp);
                //              this.m_rect2DDisp = rect2DDisp;
                
                //      rect2DDisp = new Rect2DEntity();
                //      rect2DDisp.initialize(0.0,0.0,120.0,160.0,[tex0]);
                //      rect2DDisp.setXY(100.0,80.0);
                //      //rect2DDisp.setRotation(30.0);
                //      this.m_rscene.addEntity(rect2DDisp);
                this.m_profileInstance = new ProfileInstance();
                this.m_profileInstance.initialize(this.m_rscene.getRenderer());

                let text2D:Text2DEntity = null;
                text2D = new Text2DEntity();
                text2D.initialize("我心永恒,ABCefg.H:");
                text2D.setXY(20.0,320.0);
                text2D.setRGB3f(0.0,0.0,0.0);
                text2D.setAlpha(0.5);
                //text2D.setScale(2.0);
                this.m_rscene.addEntity(text2D,1);
                
                let srcBox:Box3DEntity = new Box3DEntity();
                srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                //srcBox = null;
                let box:Box3DEntity = null;
                for(i = 0; i < total; ++i)
                {
                    box = new Box3DEntity();
                    if(srcBox != null)box.setMesh(srcBox.getMesh());
                    box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                    if(total > 1)box.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    //if(total > 1)box.setXYZ(Math.random() * 8000.0 - 4000.0,Math.random() * 8000.0 - 4000.0,Math.random() * 8000.0 - 4000.0);
                    this.m_rscene.addEntity(box);
                }
            }
        }
        private m_flagBoo:boolean = true;
        mouseWheeelListener(evt:any):void
        {
            //console.log("mouseWheeelListener call, evt.wheelDeltaY: "+evt.wheelDeltaY);
            if(evt.wheelDeltaY < 0)
            {
                // zoom in
                this.m_rscene.getCamera().forward(-125.0);
            }
            else
            {
                // zoom out
                this.m_rscene.getCamera().forward(125.0);
            }
        }
        mouseUpListener(evt:any):void
        {
            console.log("mouseUpListener call, this.m_rscene: "+this.m_rscene.toString());
            this.m_flagBoo = !this.m_flagBoo;
        }
        pv:Vector3D = new Vector3D();
        delayTime:number = 10;
        run():void
        {
            //  this.m_equeue.run();
            
            //console.log("##-- begin");
            this.m_rcontext.setClearRGBColor3f(0.1, 0.6, 0.1);
            //this.m_rcontext.setClearRGBAColor4f(0.0, 0.5, 0.0,0.0);
            this.m_rcontext.renderBegin();

            this.m_rscene.update();
            this.m_rscene.cullingTest();
            this.m_rscene.run();

            this.m_rscene.runEnd();
            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_rscene.updateCamera();
            if(this.m_containerMain != null)
            {
                this.m_container.setRotationY(this.m_container.getRotationY() + 1.0);
                //this.m_containerMain.setRotationY(this.m_containerMain.getRotationY() + 1.0);
                this.m_containerMain.setRotationZ(this.m_containerMain.getRotationZ() + 1.0);
                
                this.pv.setXYZ(200.0,10.0,150.0);
                this.m_container.localToGlobal(this.pv);
                this.m_followEntity.setPosition(this.pv);
                this.m_followEntity.update();
            }
            if(this.m_rect2DDisp != null)
            {
                this.m_rect2DDisp.setRotation(this.m_rect2DDisp.getRotation() + 1.0);
            }
            //  if(!this.m_timeoutEnabled)
            //  {
            //      this.parRun();
            //  }
            if(this.m_profileInstance != null)
            {
                this.m_profileInstance.run();
            }
        }
        //async parRun()
        parRun():void
        {
            if(this.m_flagBoo)
            {
                if(this.delayTime < 0)
                {
                    this.delayTime = 10;
                    let par:BillParticle = null;
                    if(this.m_containerMain != null)
                    {
                        this.pv.setXYZ(-200.0,10.0,-150.0);
                        this.m_container.localToGlobal(this.pv);
                        par = BillParticle.Create();
                        par.setPosition(this.pv);
                        par.awake();
                        this.pv.setXYZ(200.0,10.0,150.0);
                        this.m_container.localToGlobal(this.pv);
                        par = BillParticle.Create();
                        par.setPosition(this.pv);
                        par.awake();
                    }
                    let i:number = 0;
                    //let len:number = 80 + Math.round(Math.random() * 845);
                    let len:number = 10 + Math.round(Math.random() * 15);

                    for(; i < len; ++i)
                    {
                        this.pv.setXYZ(Math.random() * 800.0 - 400.0, Math.random() * 800.0 - 400.0,Math.random() * 800.0 - 400.0);
                        par = BillParticle.Create();
                        par.setPosition(this.pv);
                        par.awake();
                    }
                }
                else
                {
                    --this.delayTime;
                }
                BillParticle.Run();
            }
            if(this.m_timeoutEnabled && !this.m_intervalEnabled)
            {
                //console.log("setTimeout..."+this);
                if(this.m_timeoutId > -1)
                {
                    clearTimeout(this.m_timeoutId);
                }
                this.m_timeoutId = setTimeout(this.parRun.bind(this),25);
            }
        }
    }
    class BillParticle
    {
        private static s_pars:BillParticle[] = [];
        private static s_sleepPars:BillParticle[] = [];
        static texs:TextureProxy[] = [];        
        static renderer:RendererInstance = null;
        static srcBillboard:Billboard3DEntity = null;
        private m_tar:Billboard3DEntity = null;
        private m_isAlive:boolean = true;
        spdV0:Vector3D = new Vector3D();
        spdV1:Vector3D = new Vector3D();
        spdV2:Vector3D = new Vector3D();
        spdV:Vector3D = new Vector3D();
        pv:Vector3D = new Vector3D();
        brightness:number = 1.0;
        scale:number = 1.0;
        constructor(tar:Billboard3DEntity)
        {
            this.m_tar = tar;
        }
        awake():void
        {
            this.m_isAlive = true;
            this.brightness = 1.0;
            this.m_tar.setVisible(true);
            this.m_tar.setFadeFactor(this.brightness);
            this.spdV0.setXYZ(Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5);
            this.spdV1.setXYZ(Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5);
            this.spdV2.setXYZ(Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5);
            //this.spdV.setXYZ(Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5);
            this.m_tar.update();
        }
        setPosition(pv:Vector3D):void
        {
            this.m_tar.setPosition(pv);
        }
        update():void
        {
            if(this.m_isAlive)
            {
                if(this.brightness > 0.01)
                {
                    let k0:number = Math.sin(this.brightness * 3.14) * 1.1;
                    let k:number = 0.0;
                    k = 1.0 - k0;
                    let k1:number = k * k;
                    this.spdV.x = (this.spdV0.x * k - this.spdV1.x * k0) * 0.7 + k1 * this.spdV2.x;
                    this.spdV.y = (this.spdV0.y * k - this.spdV1.y * k0) * 0.7 + k1 * this.spdV2.y;
                    this.spdV.z = (this.spdV0.z * k - this.spdV1.z * k0) * 0.7 + k1 * this.spdV2.z;
                    this.m_tar.getPosition(this.pv);
                    this.spdV.scaleBy(k0);
                    this.pv.addBy(this.spdV);
                    //k = this.scale * this.brightness * this.spdV.getLength() * 0.5;
                    k = this.scale * this.spdV.getLength() * 0.5;
                    this.m_tar.setScaleXY(k,k);

                    this.m_tar.setPosition(this.pv);
                    this.m_tar.setFadeFactor(this.brightness);
                    this.m_tar.update();
                    this.brightness -= 0.002;
                    //this.spdV.y -= 0.001;
                }
                else
                {
                    this.m_isAlive = false;
                    this.m_tar.setVisible(false);
                }
            }
        }
        static Color:Color4 = new Color4();
        static Create():BillParticle
        {
            let par:BillParticle = null;
            if(BillParticle.s_sleepPars.length > 0)
            {
                par = BillParticle.s_sleepPars.pop();
                BillParticle.s_pars.push(par);
            }
            else
            {
                let billboard:Billboard3DEntity = new Billboard3DEntity();
                billboard.setMesh(BillParticle.srcBillboard.getMesh());
                billboard.toBrightnessBlend();
                billboard.setRenderStateByName("ADD02");
                billboard.initialize(100.0,100.0, [BillParticle.texs[Math.floor(Math.random() * (BillParticle.texs.length - 0.5))]]);
                BillParticle.renderer.addEntity(billboard,1);
                par = new BillParticle(billboard);
                BillParticle.s_pars.push(par);
            }
            par.scale = Math.random() * 0.5 + 0.5;

            //par.m_tar.setRGB3f(Math.random() * 1.1 + 0.5,Math.random() * 1.1 + 0.5,Math.random() * 1.1 + 0.5);
            //BillParticle.Color.randomRGB(1.0);
            //BillParticle.Color.normalize(1.5);
            par.m_tar.setRGB3f(Math.random() * 1.3 + 0.4,Math.random() * 1.3 + 0.4,Math.random() * 1.3 + 0.4);
            //par.m_tar.setRGB3f(BillParticle.Color.r,BillParticle.Color.g,BillParticle.Color.b);
            par.m_tar.setScaleXY(par.scale,par.scale);
            return par;
        }
        static Run():void
        {
            let pars:BillParticle[] = BillParticle.s_pars;
            let i:number = 0;
            let len:number = pars.length;
            
            for(; i < len; ++i)
            {
                pars[i].update();
                if(!pars[i].m_isAlive)
                {
                    BillParticle.s_sleepPars.push(pars[i]);
                    pars.splice(i,1);
                    --i;
                    --len;
                }
            }
        }

    }
}