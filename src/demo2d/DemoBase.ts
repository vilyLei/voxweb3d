
import * as Vector3DT from "..//vox/math/Vector3D";
import * as Matrix4T from "../vox/math/Matrix4";
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
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";

import Vector3D = Vector3DT.vox.math.Vector3D;
import Matrix4 = Matrix4T.vox.math.Matrix4;
import Matrix4Pool = Matrix4T.vox.math.Matrix4Pool;
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
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;

export namespace demo2d
{
    export class DemoBase
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_followEntity:DisplayEntity = null;
        initialize():void
        {
            console.log("demo2d.DemoBase::initialize()......(2D)");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/guangyun_H_0007.png");
                let tex3:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/flare_core_02.jpg");
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
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseUpListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                
                let plane:Plane3DEntity = new Plane3DEntity();
                plane.name = "plane";
                plane.showDoubleFace();
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);

                console.log(">>>>>>>>>>>>>>>>>>>>>>");
                this.m_renderer.addEntity(plane);
                this.m_followEntity = plane;
                //plane.setRenderStateByName("ADD01");
                
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(300.0);
                axis.setXYZ(100.0,0.0,100.0);
                this.m_renderer.addEntity(axis);
                return;
                let srcBillboard:Billboard3DEntity = new Billboard3DEntity();
                srcBillboard.initialize(100.0,100.0, [tex2]);
                
                let i:number = 0;
                for(i = 0; i < 2; ++i)
                {
                    let billboard:Billboard3DEntity = new Billboard3DEntity();
                    billboard.copyMeshFrom(srcBillboard);
                    billboard.name = "billboard";
                    billboard.setRenderStateByName("ADD01");
                    billboard.initialize(100.0,100.0, [tex2]);
                    //billboard.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    billboard.setXYZ(Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0);
                    billboard.setBrightness(Math.random());
                    this.m_renderer.addEntity(billboard);
                }
                
                for(i = 0; i < 2; ++i)
                {
                    let billboard:Billboard3DEntity = new Billboard3DEntity();
                    billboard.copyMeshFrom(srcBillboard);
                    billboard.name = "billboard";
                    billboard.setRenderStateByName("ADD01");
                    billboard.initialize(100.0,100.0, [tex3]);
                    //billboard.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    billboard.setXYZ(Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0);
                    billboard.setBrightness(Math.random());
                    this.m_renderer.addEntity(billboard);
                }

                return;
                ///*
                
                axis = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(600.0);
                this.m_renderer.addEntity(axis);
                axis = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(50.0);
                axis.setXYZ(0,300.0,0);
                this.m_renderer.addEntity(axis);

                let srcBox:Box3DEntity = new Box3DEntity();
                srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
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
            //  this.m_runFlag = 1;
            //  if(this.m_followEntity.isRenderEnabled())
            //  {
            //      this.m_renderer.removeEntity(this.m_followEntity);
            //  }
            //  else
            //  {
            //      this.m_renderer.addEntity(this.m_followEntity);
            //  }
            this.m_renderer.showInfoAt(0);
        }
        run():void
        {
            if(this.m_runFlag < 1)
            {
                //return;
            }
            //--this.m_runFlag;

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