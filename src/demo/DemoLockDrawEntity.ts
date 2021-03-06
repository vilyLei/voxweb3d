
import Vector3D from "../vox/math/Vector3D";
import Matrix4 from "../vox/math/Matrix4";
import Matrix4Pool from "../vox/math/Matrix4Pool";
import RendererDeviece from "../vox/render/RendererDeviece";
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Stage3D from "../vox/display/Stage3D";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";
import Billboard3DEntity from "../vox/entity/Billboard3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst} from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import * as EntityDispT from "./base/EntityDisp";
import PSColorMaterial from "./material/PSColorMaterial";

import EntityDispQueue = EntityDispT.demo.base.EntityDispQueue;

export namespace demo
{
    export class DemoLockDrawEntity
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_entitys:DisplayEntity[] = [];
        initialize():void
        {
            console.log("DemoLockDrawEntity::initialize()......");
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
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseUpListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.ALWAYS);
                
                let i:number = 0;
                
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_renderer.addEntity(axis);
                this.m_entitys.push(axis);

                let plane:Plane3DEntity = new Plane3DEntity();
                //plane.name = "plane";
                //plane.showDoubleFace();
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                this.m_renderer.addEntity(plane);
                this.m_entitys.push(plane);

                /*
                
                //plane.setRenderStateByName("ADD01");
                let srcBillboard:Billboard3DEntity = new Billboard3DEntity();
                srcBillboard.initialize(100.0,100.0, [tex2]);
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

                //return;
                //*/
                let srcBox:Box3DEntity = new Box3DEntity();
                srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                //srcBox = null;
                let box:Box3DEntity = null;
                for(i = 0; i < 2; ++i)
                {
                    box = new Box3DEntity();
                    box.name = "box_"+i;
                    if(srcBox != null)box.setMesh(srcBox.getMesh());
                    box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                    box.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    this.m_renderer.addEntity(box);
                    this.m_entitys.push(box);
                }
                for(i = 0; i < 1; ++i)
                {
                    let sphere:Sphere3DEntity = new Sphere3DEntity();
                    sphere.name = "sphere";
                    sphere.initialize(50.0,15,15,[tex1]);
                    sphere.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    this.m_renderer.addEntity(sphere);
                    this.m_entitys.push(sphere);
                }
                for(i = 0; i < 2; ++i)
                {
                    let cylinder:Cylinder3DEntity = new Cylinder3DEntity();
                    cylinder.name = "cylinder";
                    cylinder.initialize(30,80,15,[tex0]);
                    cylinder.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    this.m_renderer.addEntity(cylinder);
                    this.m_entitys.push(cylinder);
                }

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
        private m_lockMaterial:PSColorMaterial = new PSColorMaterial();
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
            let i:number = 0;
            let len:number = this.m_entitys.length;
            this.m_rcontext.unlockMaterial();
            this.m_rcontext.unlockRenderState();
            this.m_rcontext.useGlobalMaterial(this.m_entitys[0].getMaterial());
            this.m_renderer.drawEntityByLockMaterial(this.m_entitys[0]);
            //  this.m_rcontext.unlockMaterial();
            //  this.m_rcontext.unlockRenderState();
            //this.m_rcontext.useGlobalMaterial(this.m_entitys[1].getMaterial());
            this.m_rcontext.useGlobalMaterial(this.m_lockMaterial);
            for(i = 1; i < len; ++i)
            {
                this.m_renderer.drawEntityByLockMaterial(this.m_entitys[i]);
            }
            //this.m_renderer.run();

            this.m_rcontext.runEnd();            
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);;
            this.m_rcontext.updateCamera();
            
            //  //console.log("#---  end");
        }
    }
}