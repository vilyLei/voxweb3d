
import * as Vector3DT from "../vox/geom/Vector3";
import * as Matrix4T from "../vox/geom/Matrix4";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RendererStateT from "../vox/render/RendererState";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RendererInstanceT from "../vox/scene/RendererInstance";
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
import * as BoxFrame3DT from "../vox/entity/BoxFrame3D";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as DisplayEntityContainerT from "../vox/entity/DisplayEntityContainer";
import * as EntityDispT from "./base/EntityDisp";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import Matrix4 = Matrix4T.vox.geom.Matrix4;
import Matrix4Pool = Matrix4T.vox.geom.Matrix4Pool;
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
import Stage3D = Stage3DT.vox.display.Stage3D;

import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
import Cylinder3DEntity = Cylinder3DEntityT.vox.entity.Cylinder3DEntity;
import Billboard3DEntity = Billboard3DEntityT.vox.entity.Billboard3DEntity;
import BoxFrame3D = BoxFrame3DT.vox.entity.BoxFrame3D;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import DisplayEntityContainer = DisplayEntityContainerT.vox.entity.DisplayEntityContainer;
//import EntityDisp = EntityDispT.demo.base.EntityDisp;
import EntityDispQueue = EntityDispT.demo.base.EntityDispQueue;

export namespace demo
{
    export class DemoContainer
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_equeue:EntityDispQueue = new EntityDispQueue();
        private m_container:DisplayEntityContainer = null;
        private m_containerMain:DisplayEntityContainer = null;
        private m_followEntity:DisplayEntity = null;
        
        initialize():void
        {
            console.log("DemoContainer::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/guangyun_H_0007.png");
                BillParticle.texs.push(tex2);
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex2.mipmapEnabled = true;
                tex2.setWrap(TextureConst.WRAP_REPEAT);
                
                this.m_statusDisp.initialize("rstatus");
                let rparam:RendererParam = new RendererParam();
                rparam.setMatrix4AllocateSize(8192);
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam);
                this.m_renderer.appendProcess();
                this.m_rcontext = this.m_renderer.getRendererContext();
                BillParticle.renderer = this.m_renderer;
                let stage3D:Stage3D = this.m_rcontext.getStage3D();
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseUpListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                
                let scale:number = 1.0;
                let i:number = 0;

                ///*
                let plane:Plane3DEntity = new Plane3DEntity();
                plane.name = "plane";
                plane.showDoubleFace();
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);

                let container:DisplayEntityContainer = new DisplayEntityContainer();
                container.addEntity(plane);
                
                container.setXYZ(100.0,100.0,100.0);
                this.m_renderer.addEntity(plane);
                //plane.setRenderStateByName("ADD01");
                //container.update();
                let containerB:DisplayEntityContainer = new DisplayEntityContainer();
                containerB.addChild(container);
                this.m_container = container;
                this.m_containerMain = containerB;

                let axisEntity:Axis3DEntity = new Axis3DEntity();
                axisEntity.name = "axisEntity";
                axisEntity.initialize(30.0);
                //axisEntity.setXYZ(200.0,10.0,150.0);
                //container.addEntity(axisEntity);
                this.m_renderer.addEntity(axisEntity);
                this.m_followEntity = axisEntity;

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(300.0);
                axis.setXYZ(100.0,100.0,100.0);
                this.m_renderer.addEntity(axis);
                
                axis = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(600.0);
                this.m_renderer.addEntity(axis);
               
                let srcBillboard:Billboard3DEntity = new Billboard3DEntity();
                srcBillboard.initialize(100.0,100.0, [tex2]);
                BillParticle.srcBillboard = srcBillboard;
                let billboard:Billboard3DEntity = new Billboard3DEntity();

                for(; i < 0; ++i)
                {
                    billboard = new Billboard3DEntity();
                    billboard.setMesh(srcBillboard.getMesh());
                    billboard.setRenderStateByName("ADD01");
                    billboard.initialize(100.0,100.0, [tex2]);
                    billboard.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    billboard.setBrightness(Math.random());
                    this.m_renderer.addEntity(billboard);
                    this.m_equeue.addBillEntity(billboard,false);
                }

                billboard = new Billboard3DEntity();
                billboard.setMesh(srcBillboard.getMesh());
                billboard.setRenderStateByName("ADD02");
                billboard.initialize(100.0,100.0, [tex2]);
                billboard.setXYZ(200,10,150);
                container.addEntity(billboard);
                this.m_renderer.addEntity(billboard,1);
                billboard = new Billboard3DEntity();
                billboard.setMesh(srcBillboard.getMesh());
                billboard.setRenderStateByName("ADD02");
                billboard.initialize(100.0,100.0, [tex2]);
                billboard.setXYZ(-200,10,-150);
                container.addEntity(billboard);
                this.m_renderer.addEntity(billboard,1);
                //*/
                let cubeFrame:BoxFrame3D = null;

                let srcSphere:Sphere3DEntity = new Sphere3DEntity();
                srcSphere.initialize(50.0,15,15,[tex1]);
                //  this.m_renderer.addEntity(srcSphere);
                //  cubeFrame = new BoxFrame3D();
                //  cubeFrame.initialize(srcSphere.getLocalBounds().min, srcSphere.getLocalBounds().max);
                //  this.m_renderer.addEntity(cubeFrame);
                //
                let srcBox:Box3DEntity = new Box3DEntity();
                srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                srcBox.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                srcBox.setRotationXYZ(Math.random() * 360.0,Math.random() * 360.0,Math.random() * 360.0);
                this.m_renderer.addEntity(srcBox);
                /*
                //let pminV:Vector3D = srcBox.getLocalBounds().min;
                //let pmaxV:Vector3D = srcBox.getLocalBounds().max;
                cubeFrame = new BoxFrame3D();
                cubeFrame.initialize(srcBox.getParentBounds().min, srcBox.getParentBounds().max);
                this.m_renderer.addEntity(cubeFrame);

                let pminV:Vector3D = srcBox.getParentBounds().min;
                let pmaxV:Vector3D = srcBox.getParentBounds().max;
                console.log("pminV: "+pminV.toString());
                console.log("pmaxV: "+pmaxV.toString());
                let posarr = [
                    pminV.x,pminV.y,pminV.z,
                    pmaxV.x,pminV.y,pminV.z,
                    pminV.x,pminV.y,pmaxV.z,
                    pmaxV.x,pminV.y,pmaxV.z,

                    pminV.x,pmaxV.y,pminV.z,
                    pmaxV.x,pmaxV.y,pminV.z,
                    pminV.x,pmaxV.y,pmaxV.z,
                    pmaxV.x,pmaxV.y,pmaxV.z
                ];
                scale = 0.2;
                let j:number = 0;
                for(i = 0; i < 8; ++i)
                {
                    let sphere:Sphere3DEntity = new Sphere3DEntity();
                    sphere.name = "sphere";
                    sphere.setMesh( srcSphere.getMesh() );
                    sphere.initialize(50.0,15,15,[tex1]);
                    sphere.setScaleXYZ(scale,scale,scale);
                    sphere.setXYZ(posarr[j],posarr[j+1],posarr[j+2]);
                    this.m_renderer.addEntity(sphere);
                    j += 3;
                }
                */
                //  cubeFrame = new BoxFrame3D();
                //  cubeFrame.initialize(srcBox.getLocalBounds().min, srcBox.getLocalBounds().max);
                //  this.m_renderer.addEntity(cubeFrame);

                /*
                axis = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(50.0);
                axis.setXYZ(0,300.0,0);
                this.m_renderer.addEntity(axis);

                let box:Box3DEntity = null;
                for(i = 0; i < 2; ++i)
                {
                    box = new Box3DEntity();
                    box.name = "box_"+i;
                    box.setMesh(srcBox.getMesh());
                    box.initialize(null,null,[tex1]);
                    box.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    this.m_renderer.addEntity(box);
                }
                for(i = 0; i < 2; ++i)
                {
                    let sphere:Sphere3DEntity = new Sphere3DEntity();
                    sphere.name = "sphere";
                    sphere.setMesh( srcSphere.getMesh() );
                    sphere.initialize(50.0,15,15,[tex1]);
                    sphere.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    this.m_renderer.addEntity(sphere);
                }
                
                let axisB:Axis3DEntity = new Axis3DEntity();
                axisB.name = "axisB";
                axisB.initialize(50.0);
                axisB.setXYZ(-300.0,0.0,-300.0);
                this.m_renderer.addEntity(axisB);

                for(i = 0; i < 2; ++i)
                {
                    let cylinder:Cylinder3DEntity = new Cylinder3DEntity();
                    cylinder.name = "cylinder";
                    cylinder.initialize(30,80,15,[tex0]);
                    cylinder.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    this.m_renderer.addEntity(cylinder);
                }
                
                let axisC:Axis3DEntity = new Axis3DEntity();
                axisC.name = "axisC";
                axisC.initialize(50.0);
                axisC.setXYZ(300.0,0.0,300.0);
                this.m_renderer.addEntity(axisC);
                //*/

            }
        }
        private m_runFlag:number = 20;
        mouseUpListener(evt:any):void
        {
            console.log("mouseUpListener call, this.m_renderer: "+this.m_renderer.toString());
            this.m_runFlag = 1;
        }
        pv:Vector3D = new Vector3D();
        delayTime:number = 10;
        run():void
        {
            if(this.m_runFlag < 1)
            {
                //return;
            }
            //--this.m_runFlag;

            this.m_equeue.run();
            this.m_statusDisp.update();

            //console.log("##-- begin");
            this.m_rcontext.setClearRGBColor3f(0.0, 0.5, 0.0);
            //this.m_rcontext.setClearRGBAColor4f(0.0, 0.5, 0.0,0.0);
            this.m_rcontext.runBegin();

            this.m_renderer.update();
            this.m_renderer.run();

            this.m_rcontext.runEnd();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_rcontext.updateCamera();
            if(this.m_containerMain != null)
            {
                this.m_container.setRotationY(this.m_container.getRotationY() + 1.0);
                //this.m_containerMain.setRotationY(this.m_containerMain.getRotationY() + 1.0);
                this.m_containerMain.setRotationZ(this.m_containerMain.getRotationZ() + 1.0);
                this.m_containerMain.update();
                //this.m_container.update();
                //console.log("#---  end");
                this.pv.setXYZ(200.0,10.0,150.0);
                this.m_container.localToGlobal(this.pv);
                this.m_followEntity.setPosition(this.pv);
                this.m_followEntity.update();
                //this.m_container.globalToLocal(pv);
                //console.log(pv);
                if(this.delayTime < 0)
                {
                    this.delayTime = 10;
                    let par:BillParticle = null;
                    
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
    
                    let i:number = 0;
                    let len:number = Math.round(Math.random() * 15);
                    len = 0;
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
                    let k0:number = this.brightness;//Math.sin(this.brightness * 3.14) * 1.1;
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
                    this.brightness -= 0.003;
                    //this.spdV.y -= 0.001;
                }
                else
                {
                    this.m_isAlive = false;
                    this.m_tar.setVisible(false);
                }
            }
        }
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
                billboard.initialize(100.0,100.0, [BillParticle.texs[0]]);
                BillParticle.renderer.addEntity(billboard,1);
                par = new BillParticle(billboard);
                BillParticle.s_pars.push(par);
            }
            par.scale = Math.random() * 0.5 + 0.5;
            par.m_tar.setRGB3f(Math.random() * 1.1 + 0.5,Math.random() * 1.1 + 0.5,Math.random() * 1.1 + 0.5);
            par.m_tar.setScaleXY(par.scale,par.scale);
            return par;
        }
        static Run()
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