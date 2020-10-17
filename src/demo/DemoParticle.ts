
import * as Vector3DT from "../vox/geom/Vector3";
import * as Matrix4T from "../vox/geom/Matrix4";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RODrawStateT from "../vox/render/RODrawState";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RendererInstanceT from "../vox/scene/RendererInstance";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as Stage3DT from "../vox/display/Stage3D";

import * as DisplayEntityT from "../vox/entity/DisplayEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as Sphere3DEntityT from "../vox/entity/Sphere3DEntity";
import * as Cylinder3DEntityT from "../vox/entity/Cylinder3DEntity";
import * as Billboard3DEntityT from "../vox/entity/Billboard3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as DisplayEntityContainerT from "../vox/entity/DisplayEntityContainer";
import * as EntityDispT from "./base/EntityDisp";
import * as Color4T from '../vox/material/Color4';

import Vector3D = Vector3DT.vox.geom.Vector3D;
import Matrix4 = Matrix4T.vox.geom.Matrix4;
import Matrix4Pool = Matrix4T.vox.geom.Matrix4Pool;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RenderStateObject = RODrawStateT.vox.render.RenderStateObject;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import Stage3D = Stage3DT.vox.display.Stage3D;

import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
import Cylinder3DEntity = Cylinder3DEntityT.vox.entity.Cylinder3DEntity;
import Billboard3DEntity = Billboard3DEntityT.vox.entity.Billboard3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import DisplayEntityContainer = DisplayEntityContainerT.vox.entity.DisplayEntityContainer;
//import EntityDisp = EntityDispT.demo.base.EntityDisp;
import Color4 = Color4T.vox.material.Color4;
import EntityDispQueue = EntityDispT.demo.base.EntityDispQueue;

export namespace demo
{
    export class DemoParticle
    {
        constructor()
        {
        }
        //private m_renderer:RendererInstance = null;
        private m_rscene:RendererScene = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_equeue:EntityDispQueue = new EntityDispQueue();
        private m_container:DisplayEntityContainer = null;
        private m_containerMain:DisplayEntityContainer = null;
        private m_followEntity:DisplayEntity = null;
        private m_timeoutEnabled:boolean = true;
        private m_intervalEnabled:boolean = false;
        private m_timeoutId:any = -1;
        private m_timeIntervalId:any = -1;
        initialize():void
        {
            console.log("DemoParticle::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getTexAndLoadImg("assets/guangyun_H_0007.png");
                let tex3:TextureProxy = this.m_texLoader.getTexAndLoadImg("assets/flare_core_01.jpg");
                let tex4:TextureProxy = this.m_texLoader.getTexAndLoadImg("assets/flare_core_02.jpg");
                let tex5:TextureProxy = this.m_texLoader.getTexAndLoadImg("assets/a_02_c.jpg");
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
                
                this.m_statusDisp.initialize("rstatus");
                let rparam:RendererParam = new RendererParam("glcanvas");
                rparam.setMatrix4AllocateSize(8192 * 4);
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                //rparam.setCamPosition(100.0,100.0,100.0);
                //  this.m_renderer = new RendererInstance();
                //  this.m_renderer.initialize(rparam);
                //  this.m_renderer.appendProcess(true,true);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.setRendererProcessParam(1,true,true);
                this.m_rcontext = this.m_rscene.getRendererContext();
                BillParticle.renderer = this.m_rscene.getRenderer();//this.m_renderer;
                let stage3D:Stage3D = this.m_rcontext.getStage3D();
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseUpListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                
                RenderStateObject.Create("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RenderStateObject.Create("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                
                let plane:Plane3DEntity = new Plane3DEntity();
                plane.name = "plane";
                plane.showDoubleFace();
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);

                let container:DisplayEntityContainer = null;
                ///*
                container = new DisplayEntityContainer();
                container.addEntity(plane);
                console.log(">>>>>>>>>>>>>>>>>>>>>>");
                container.setXYZ(100.0,100.0,100.0);
                this.m_rscene.addEntity(plane);
                //plane.setRenderStateByName("ADD01");
                //container.update();
                let containerB:DisplayEntityContainer = new DisplayEntityContainer();
                containerB.addChild(container);
                this.m_container = container;
                this.m_containerMain = containerB;
                this.m_rscene.addContainer(this.m_containerMain);
                //*/

                let axisEntity:Axis3DEntity = new Axis3DEntity();
                axisEntity.name = "axisEntity";
                axisEntity.initialize(30.0);
                //axisEntity.setXYZ(200.0,10.0,150.0);
                //container.addEntity(axisEntity);
                this.m_rscene.addEntity(axisEntity);
                this.m_followEntity = axisEntity;

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(300.0);
                axis.setXYZ(100.0,100.0,100.0);
                this.m_rscene.addEntity(axis);
                
                axis = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(600.0);
                this.m_rscene.addEntity(axis);
               
                let srcBillboard:Billboard3DEntity = new Billboard3DEntity();
                srcBillboard.initialize(100.0,100.0, [tex2]);
                BillParticle.srcBillboard = srcBillboard;
                let billboard:Billboard3DEntity = new Billboard3DEntity();
                let i:number = 0;
                for(; i < 0; ++i)
                {
                    billboard = new Billboard3DEntity();
                    billboard.setMesh(srcBillboard.getMesh());
                    billboard.setRenderStateByName("ADD01");
                    billboard.initialize(100.0,100.0, [tex2]);
                    billboard.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    billboard.setBrightness(Math.random());
                    this.m_rscene.addEntity(billboard);
                    this.m_equeue.addBillEntity(billboard,false);
                }
                
                if(container != null)
                {
                    billboard = new Billboard3DEntity();
                    billboard.setMesh(srcBillboard.getMesh());
                    billboard.setRenderStateByName("ADD02");
                    billboard.initialize(100.0,100.0, [tex2]);
                    billboard.setXYZ(200,10,150);
                    //container.addEntity(billboard);
                    this.m_rscene.addEntity(billboard,1);
                    billboard = new Billboard3DEntity();
                    billboard.setMesh(srcBillboard.getMesh());
                    billboard.setRenderStateByName("ADD02");
                    billboard.initialize(100.0,100.0, [tex2]);
                    billboard.setXYZ(-200,10,-150);
                    //container.addEntity(billboard);
                    this.m_rscene.addEntity(billboard,1);
                }
                if(this.m_timeoutEnabled)
                {
                    if(this.m_intervalEnabled)
                    {
                        this.m_timeIntervalId = setInterval(this.parRun.bind(this),25);
                    }
                    else
                    {
                        this.parRun();
                    }
                }
            }
        }
        private m_flagBoo:boolean = true;
        mouseUpListener(evt:any):void
        {
            console.log("mouseUpListener call, this.m_rscene: "+this.m_rscene.toString());
            this.m_flagBoo = !this.m_flagBoo;
        }
        pv:Vector3D = new Vector3D();
        delayTime:number = 10;
        run():void
        {
            this.m_equeue.run();
            //this.m_statusDisp.statusInfo = "/" + RenderStateObject.Rstate.drawcallTimes;
            this.m_statusDisp.update();

            //console.log("##-- begin");
            this.m_rcontext.setClearRGBColor3f(0.1, 0.1, 0.1);
            //this.m_rcontext.setClearRGBAColor4f(0.0, 0.5, 0.0,0.0);
            this.m_rcontext.runBegin();

            this.m_rscene.update();
            this.m_rscene.run();

            this.m_rscene.runEnd();
            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_rscene.updateCamera();
            //this.m_rscene.cullingTest();
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
            
            if(!this.m_timeoutEnabled)
            {
                this.parRun();
            }
        }
        
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
            this.m_tar.setBrightness(this.brightness);
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
                    this.m_tar.setBrightness(this.brightness);
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