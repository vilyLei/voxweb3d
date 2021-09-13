
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererState from "../vox/render/RendererState";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import PureEntity from "../vox/entity/PureEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
////import * as TextureStoreT from "../vox/texture/TextureStore";
import CameraTrack from "../vox/view/CameraTrack";
import MouseEvent from "../vox/event/MouseEvent";
import DemoInstance from "./DemoInstance";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import ThreadSystem from "../thread/ThreadSystem";
import {MatComputerTask} from "../demo/thread/MatComputerTask";



export namespace demo
{
    export class DemoThreadConcurrent extends DemoInstance
    {
        constructor()
        {
            super();
        }
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = null;//new RenderStatusDisplay();
        //private m_profileInstance:ProfileInstance = null;//new ProfileInstance();
        private m_profileInstance:ProfileInstance = new ProfileInstance();
        protected initializeSceneParam(param:RendererParam):void
        {
            this.m_processTotal = 4;
            param.maxWebGLVersion = 1;
            param.setMatrix4AllocateSize(4096 * 16);
            param.setCamPosition(500.0,500.0,500.0);
        }
        
        protected initializeSceneObj():void
        {
            console.log("DemoThreadConcurrent::initialize()......");
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);
            if(this.m_profileInstance != null)this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            if(this.m_statusDisp != null)this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 180);

            let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            
            // add common 3d display entity
            //  var plane:Plane3DEntity = new Plane3DEntity();
            //  plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
            //  this.m_rscene.addEntity(plane,2);
            //  let axis:Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(300.0);
            //  this.m_rscene.addEntity(axis);

            console.log("------------------------------------------------------------------");
            console.log("------------------------------------------------------------------");
            this.thr_test();
        }
        private m_dispTotal:number = 0;
        private m_srcBox:Box3DEntity = null;
        private m_matTasks:MatComputerTask[] = [];
        private m_unitAmount:number = 1024 * 4;
        private m_texnsList:string[] = [
            "fruit_01.jpg"
            ,"moss_05.jpg"
            ,"metal_02.jpg"
            ,"fruit_01.jpg"
            ,"moss_05.jpg"
            ,"metal_02.jpg"
        ];
        private buildTask():void
        {
            let texnsI:number = this.m_matTasks.length;
            //texnsI = texnsI % this.m_texnsList.length;
            texnsI = Math.floor(this.m_texnsList.length * 10 * Math.random() - 0.1) % this.m_texnsList.length;
            //if(texnsI >= this.m_texnsList.length)
            //{
            //    texnsI = this.m_texnsList.length - 1;
            //}
            let tex1:TextureProxy = this.getImageTexByUrl("static/assets/"+this.m_texnsList[texnsI]);
            let total:number = this.m_unitAmount;
            let matTask:MatComputerTask = new MatComputerTask();
            matTask.initialize(total);
            this.m_matTasks.push(matTask);
            console.log("matTasks.length: "+this.m_matTasks.length);
            
            let materialBox:Box3DEntity = new Box3DEntity();
            materialBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
            let material:any = materialBox.getMaterial();
            material.setRGB3f(Math.random() + 0.4,Math.random() + 0.4,Math.random() + 0.4);
            //metal_08.jpg
            if(this.m_srcBox == null)
            {
                this.m_srcBox = new Box3DEntity();
                this.m_srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
            }
            total = matTask.setCurrTotal(total);
            this.m_dispTotal += total;
            let i:number = 0;
            ///*
            let box:PureEntity;
            console.log("create some concurrent render entities.");
            for(; i < total; ++i)
            {
                box = new PureEntity();
                box.copyMeshFrom(this.m_srcBox);
                box.copyMaterialFrom(materialBox);
                this.m_rscene.addEntity(box);
                matTask.setMatAt(box.getMatrix(),i);
            }
            //*/
            
            /*
            let box:Box3DEntity;
            console.log("create some concurrent render entities.");
            for(; i < total; ++i)
            {
                box = new Box3DEntity();
                box.copyMeshFrom(this.m_srcBox);
                box.copyMaterialFrom(materialBox);
                this.m_rscene.addEntity(box);
                matTask.setMatAt(box.getMatrix(),i);
            }
            //*/
        }
        private updateTask():void
        {
            if(this.m_dispTotal > 0)
            {
                let list:MatComputerTask[] = this.m_matTasks;
                let len:number = list.length;
                for(let i:number = 0; i < len; ++i)
                {
                    list[i].updateAndSendParam();
                }
            }
        }
        private m_flag:number = 0;
        private m_downFlag:number = 0;
        private testTask():void
        {
            this.m_flag ++;
            this.updateTask();
        }
        private thr_test():void
        {
            this.buildTask();

            // 注意: m_codeStr 代码中描述的 getTaskClass() 返回值 要和 TestNumberAddTask 中的 getTaskClass() 返回值 要相等
            ThreadSystem.InitTaskByURL("static/thread/ThreadMatComputer",0);
            ThreadSystem.Initialize(6);
            this.testTask();
        }
        
        private mouseDown(evt:any):void
        {
            //if(this.m_downFlag < 20 && this.m_matTasks.length < 3)
            if(this.m_downFlag < 20)
            {
                if(this.m_dispTotal < 52000)
                {
                    this.buildTask();
                }
            }
            this.m_downFlag++;
            //console.log("mouse down evt: ",evt);
            this.testTask();
        }
        runBegin():void
        {
            if(this.m_statusDisp != null)this.m_statusDisp.update();
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
            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}