
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererStateT from "../vox/render/RendererState";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";

import * as ScreenFixedAlignPlaneEntityT from "../vox/entity/ScreenFixedAlignPlaneEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureStoreT from "../vox/texture/TextureStore";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as DemoInstanceT from "./DemoInstance";
import * as ProfileInstanceT from "../voxprofile/entity/ProfileInstance";
import * as ThreadSystemT from "../thread/ThreadSystem";
import * as MatComputerTaskT from "../demo/thread/MatComputerTask";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererState = RendererStateT.vox.render.RendererState;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

import ScreenFixedAlignPlaneEntity = ScreenFixedAlignPlaneEntityT.vox.entity.ScreenFixedAlignPlaneEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import DemoInstance = DemoInstanceT.demo.DemoInstance;
import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
import ThreadSystem = ThreadSystemT.thread.ThreadSystem;
import MatComputerTask = MatComputerTaskT.demo.thread.MatComputerTask;


export namespace demo
{
    export class DemoMatComputer extends DemoInstance
    {
        constructor()
        {
            super();
        }
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_profileInstance:ProfileInstance = new ProfileInstance();
        protected initializeSceneParam(param:RendererParam):void
        {
            this.m_processTotal = 4;
            param.maxWebGLVersion = 1;
            param.setMatrix4AllocateSize(4096 * 12);
            param.setCamPosition(500.0,500.0,500.0);
        }
        
        protected initializeSceneObj():void
        {
            console.log("DemoMatComputer::initialize()......");
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            this.m_rscene.getStage3D().addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);
            this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 180);

            let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
            
            // add common 3d display entity
            var plane:Plane3DEntity = new Plane3DEntity();
            plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
            this.m_rscene.addEntity(plane,2);

            let axis:Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);

            console.log("------------------------------------------------------------------");
            console.log("------------------------------------------------------------------");
            this.thr_test();
        }
        private m_dispTotal:number = 0;
        private m_srcBox:Box3DEntity = null;
        private m_matTasks:MatComputerTask[] = [];
        private m_unitAmount:number = 1024;
        private buildTask():void
        {
            let total:number = this.m_unitAmount;
            let matTask:MatComputerTask = new MatComputerTask();
            matTask.initialize(total);
            this.m_matTasks.push(matTask);
            
            let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
            
            if(this.m_srcBox == null)
            {
                this.m_srcBox = new Box3DEntity();
                this.m_srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
            }
            let box:Box3DEntity;
            total = matTask.setCurrTotal(total);
            this.m_dispTotal = total;
            let i:number = 0;
            for(; i < total; ++i)
            {
                box = new Box3DEntity();
                box.copyMeshFrom(this.m_srcBox);
                box.copyMaterialFrom(this.m_srcBox);
                this.m_rscene.addEntity(box);
                matTask.setMatAt(box.getTransform().getMatrix(),i);
            }
        }
        private updateTask():void
        {
            if(this.m_dispTotal > 0)
            {
                let matTask:MatComputerTask = null;
                let list:MatComputerTask[] = this.m_matTasks;
                let len:number = list.length;
                let total:number = this.m_dispTotal;
                for(let i:number = 0; i < len; ++i)
                {
                    matTask = list[i];
                    if(matTask.isSendEnabled())
                    {
                        if(this.m_dispTotal > 0)
                        {
                            total = this.m_dispTotal;
                            total = matTask.setCurrTotal(total);
                            //console.log("### total: "+total);
                            matTask.setIndex(0);
                            matTask.updateParam();
                            matTask.sendData();
                        }
                    }
                    else
                    {
                        //console.log("matTask "+i+" is busy now.");
                    }
                }
            }
        }
        private thr_test():void
        {
            this.buildTask();

            // 注意: m_codeStr 代码中描述的 getTaskClass() 返回值 要和 TestNumberAddTask 中的 getTaskClass() 返回值 要相等

            ThreadSystem.InitTaskByURL("static/thread/ThreadMatComputer",0);
            ThreadSystem.Initsialize(3);
        }
        
        private m_flag:number = 0;
        private m_downFlag:number = 0;
        private testTask():void
        {
            this.m_flag ++;
            this.updateTask();
            
        }
        private mouseDown(evt:any):void
        {
            if(this.m_downFlag < 20)
            {
                this.buildTask();
            }
            this.m_downFlag++;
            //console.log("mouse down evt: ",evt);
            this.testTask();
        }
        runBegin():void
        {
            this.m_statusDisp.update();
            this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
            //this.m_rscene.setClearUint24Color(0x003300,1.0);
            if(this.m_flag > 0)
            {
                this.testTask();
            }
            super.runBegin();
        }
        run():void
        {
            this.m_rscene.run();
            if(this.m_profileInstance != null)
            {
                this.m_profileInstance.run();
            }
            ThreadSystem.Run();
        }
        runEnd():void
        {
            super.runEnd();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}