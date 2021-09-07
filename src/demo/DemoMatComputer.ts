
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererState from "../vox/render/RendererState";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import ScreenFixedAlignPlaneEntity from "../vox/entity/ScreenFixedAlignPlaneEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";

import CameraTrack from "../vox/view/CameraTrack";
import MouseEvent from "../vox/event/MouseEvent";
import DemoInstance from "./DemoInstance";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import ThreadSystem from "../thread/ThreadSystem";
import {MatComputerTask} from "../demo/thread/MatComputerTask";
import LambertDirecLightMaterial from "../vox/material/mcase/LambertDirecLightMaterial";
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

        RendererDevice.SHADERCODE_TRACE_ENABLED = false;
        RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
        //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
        this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);
        this.m_profileInstance.initialize(this.m_rscene.getRenderer());
        this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 180);

        let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
        
        // add common 3d display entity
        var plane:Plane3DEntity = new Plane3DEntity();
        plane.setMaterial(this.m_material);
        plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
        this.m_rscene.addEntity(plane,2);

        let axis:Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity(axis);

        this.thr_test();
    }
    private m_dispTotal:number = 0;
    private m_srcBox:Box3DEntity = null;
    private m_matTasks:MatComputerTask[] = [];
    private m_unitAmount:number = 1024 * 6;
    private m_texnsList:string[] = [
        "fruit_01.jpg"
        ,"moss_05.jpg"
        ,"metal_02.jpg"
        ,"fruit_01.jpg"
        ,"moss_05.jpg"
        ,"metal_02.jpg"
    ];
    private m_material: LambertDirecLightMaterial = new LambertDirecLightMaterial();
    private buildTask():void
    {
        let texnsI:number = this.m_matTasks.length;
        texnsI = Math.floor(this.m_texnsList.length * 10 * Math.random() - 0.1) % this.m_texnsList.length;
        let tex1:TextureProxy = this.getImageTexByUrl("static/assets/"+this.m_texnsList[texnsI]);
        let total:number = this.m_unitAmount;
        let matTask:MatComputerTask = new MatComputerTask();
        matTask.initialize(total);
        this.m_matTasks.push(matTask);
        console.log("matTasks.length: "+this.m_matTasks.length);
        
        let materialBox:Box3DEntity = new Box3DEntity();
        materialBox.setMaterial(this.m_material);
        materialBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
        
        if(this.m_srcBox == null)
        {
            this.m_srcBox = new Box3DEntity();
            this.m_srcBox.setMaterial( new LambertDirecLightMaterial() );
            this.m_srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
        }
        let box:Box3DEntity;
        total = matTask.setCurrTotal(total);
        this.m_dispTotal += total;
        let i:number = 0;
        for(; i < total; ++i)
        {
            box = new Box3DEntity();
            box.copyMeshFrom(this.m_srcBox);
            box.copyMaterialFrom(materialBox);
            this.m_rscene.addEntity(box);
            matTask.setMatAt(box.getTransform().getMatrix(),i);
        }
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
        ThreadSystem.InitTaskByURL("static/thread/ThreadMatComputer.js",0);
        ThreadSystem.Initsialize(3);
        this.testTask();
    }
    
    private mouseDown(evt:any):void
    {
        let fps: number = this.m_statusDisp.getFPS();

        if(this.m_profileInstance != null)
        {
            fps = this.m_profileInstance.getFPS();
        }
        
        if(fps <= 20) {
            alert("FPS too low.");
            return;
        }
        if(this.m_downFlag < 20 && fps > 20)
        {
            if(this.m_dispTotal < 22000)
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
        this.m_statusDisp.update();
        this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
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