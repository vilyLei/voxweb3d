
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererStateT from "../vox/render/RendererState";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";

import * as PureEntityT from "../vox/entity/PureEntity";
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
import * as MatTransTaskT from "../demo/thread/MatTransTask";
import * as MatCarTaskT from "../demo/thread/MatCarTask";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererState = RendererStateT.vox.render.RendererState;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

import PureEntity = PureEntityT.vox.entity.PureEntity;
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
import MatTransTask = MatTransTaskT.demo.thread.MatTransTask;
import MatCarTask = MatCarTaskT.demo.thread.MatCarTask;


export namespace demo
{
    export class DemoDrawGroup extends DemoInstance
    {
        constructor()
        {
            super();
        }
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = null;
        //private m_profileInstance:ProfileInstance = null;//new ProfileInstance();
        private m_profileInstance:ProfileInstance = new ProfileInstance();
        protected initializeSceneParam(param:RendererParam):void
        {
            this.m_processTotal = 4;
            param.maxWebGLVersion = 1;
            param.setMatrix4AllocateSize(4096 * 8);
            param.setCamPosition(500.0,500.0,500.0);
        }
        
        protected initializeSceneObj():void
        {
            console.log("DemoDrawGroup::initialize()......");
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            this.m_rscene.getStage3D().addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);
            if(this.m_profileInstance != null)this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            if(this.m_statusDisp != null)this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 180);

            let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            
            // add common 3d display entity
            var plane:Plane3DEntity = new Plane3DEntity();
            plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
            this.m_rscene.addEntity(plane,0);

            let srcPlane:Plane3DEntity = plane;
            
            //for(let i:number = 0; i < 20000; ++i)
            for(let i:number = 0; i < 200; ++i)
            {
                // 这样的操作只有一个 object matrix4 要更新到gpu所以相当于之后drawcall, 就会性能好
                plane = new Plane3DEntity(plane.getTransform());
                // 这样的操作会有20000个 object matrix4 要更新到gpu所以性能差了比上述方法差了一半
                //plane = new Plane3DEntity();
                plane.copyMeshFrom(srcPlane);
                plane.copyMaterialFrom(srcPlane);
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                //plane.setXYZ(i * 30.0,0.0,i * 30.0);
                this.m_rscene.addEntity(plane,0);
            }
            //plane.setIvsParam(3,3);
            //console.log("plane.getDisplay(): "+(plane.getDisplay())+", "+plane.getDisplay().getPartGroup());
            //  plane.getDisplay().createPartGroup(2);
            //  plane.getDisplay().setDrawPartAt(0, 0,3);
            //  plane.getDisplay().setDrawPartAt(1, 3,3);

            //  let axis:Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(300.0);
            //  this.m_rscene.addEntity(axis);

            console.log("------------------------------------------------------------------");
            console.log("------------------------------------------------------------------");
        }
        private m_dispTotal:number = 0;
        private m_matTasks:MatCarTask[] = [];
        private m_unitAmount:number = 1;
        
        private m_flag:number = 0;
        private m_downFlag:number = 0;
        
        private mouseDown(evt:any):void
        {
            this.m_downFlag++;
        }
        runBegin():void
        {
            if(this.m_statusDisp != null)this.m_statusDisp.update();
            this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
            //this.m_rscene.setClearUint24Color(0x003300,1.0);
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