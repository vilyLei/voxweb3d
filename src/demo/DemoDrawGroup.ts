
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import CameraTrack from "../vox/view/CameraTrack";
import MouseEvent from "../vox/event/MouseEvent";
import {StableArrayNode,StableArray} from "../vox/utils/StableArray";
import {SortNodeLinkerNode,SortNodeLinker} from "../vox/utils/SortNodeLinker";
import DemoInstance from "./DemoInstance";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";

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

            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);
            if(this.m_profileInstance != null)this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            if(this.m_statusDisp != null)this.m_statusDisp.initialize("rstatus",this.m_rscene.getRenderer().getViewWidth() - 180);

            let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            
            // add common 3d display entity
            var plane:Plane3DEntity = new Plane3DEntity();
            plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
            this.m_rscene.addEntity(plane,0);

            let srcPlane:Plane3DEntity = plane;
            
            //for(let i:number = 0; i < 20000; ++i)
            for(let i:number = 0; i < 0; ++i)
            {
                // 这样的操作只有一个 object matrix4 要更新到gpu所以相当于之后drawcall, 就会性能好
                // 共享一个transform uniform
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
            plane.getDisplay().createPartGroup(2);
            plane.getDisplay().setDrawPartAt(0, 0,3);
            plane.getDisplay().setDrawPartAt(1, 3,3);

            //  let axis:Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(300.0);
            //  this.m_rscene.addEntity(axis);

            console.log("------------------------------------------------------------------");
            this.testSortLinker();
            //this.testStableArray();
        }
        private testSortLinker():void
        {
            
            let sortLinker:SortNodeLinker = new SortNodeLinker();
            console.log("-----------------------------testSortLinker-------------------------------------");
            let k:number = 0;
            let pnodes:SortNodeLinkerNode[] = [];
            //sortLinker.initialize(4);
            for(; k < 50; k++)
            {
                let node:SortNodeLinkerNode = new SortNodeLinkerNode();
                node.uid = -1;
                node.value = Math.round(Math.random() * 1000 - 500);
                sortLinker.addNode(node);
                pnodes.push(node);
            }
            //sortLinker.showInfo();
            
            console.log("----------------------time a--------------------------------------------");
            let dt:number = Date.now();
            sortLinker.sort();
            dt = Date.now() - dt;
            console.log("dt:",dt);
            console.log("----------------------time b--------------------------------------------");
            sortLinker.showInfo();
            //return;
            //console.log("------------------------------------------------------------------");
            console.log("----------------------------g 0--------------------------------------");
            for(k = 0; k < 58; k++)
            {
                sortLinker.removeNode(pnodes[Math.round(pnodes.length * Math.random() - 0.5)]);
                //stableArr.removeNode(pnodes[k]);
            }
            sortLinker.showInfo();
            console.log("----------------------------g 1--------------------------------------");
            sortLinker.sort();
            sortLinker.showInfo();

            console.log("----------------------------g 2--------------------------------------");
            this.showSortLinker(sortLinker);
            this.showSortLinker(sortLinker);
        }
        
        private showSortLinker(sortLinker:SortNodeLinker):void
        {
            let info:string = "";
			let node:SortNodeLinkerNode = sortLinker.getBegin();
            info += "("+node.value+","+node.uid+"),";
            node = sortLinker.getNext();
            while(node != null)
            {
                info += "("+node.value+","+node.uid+"),";
                node = sortLinker.getNext();
            }
            console.log("XXX showSortLinker info: \n",info);
        }
        private showStableArray(sortLinker:StableArray):void
        {
            let info:string = "";
			let node:StableArrayNode = sortLinker.getBegin();
            info += "("+node.value+","+node.uid+"),";
            node = sortLinker.getNext();
            while(node != null)
            {
                info += "("+node.value+","+node.uid+"),";
                node = sortLinker.getNext();
            }
            console.log("XXX showStableArray info: \n",info);
        }
        private testStableArray():void
        {
            console.log("-----------------------------testStableArray-------------------------------------");
            let k:number = 0;
            let pnodes:StableArrayNode[] = [];
            let stableArr:StableArray = new StableArray();
            stableArr.initialize(4);
            for(; k < 10; k++)
            {
                let node:StableArrayNode = new StableArrayNode();
                node.uid = -1;
                node.value = Math.round(Math.random() * 1000 - 500);
                stableArr.addNode(node);
                pnodes.push(node);
            }
            //stableArr.showInfo();
            console.log("----------------------time a--------------------------------------------");
            let dt:number = Date.now();
            stableArr.sort();
            dt = Date.now() - dt;
            console.log("dt:",dt);
            console.log("----------------------time b--------------------------------------------");
            stableArr.showInfo();
            //
            console.log("------------------------------------------------------------------");
            stableArr.adjustSize();
            stableArr.showInfo();
            console.log("----------------------------g 0--------------------------------------");
            for(k = 0; k < 8; k++)
            {
                stableArr.removeNode(pnodes[Math.round(pnodes.length * Math.random() - 0.5)]);
                //stableArr.removeNode(pnodes[k]);
            }
            stableArr.removeNode(pnodes[pnodes.length - 1]);
            stableArr.showInfo();
            console.log("----------------------------g 1--------------------------------------");
            //stableArr.adjustSize();
            stableArr.sort();
            stableArr.showInfo();

            console.log("----------------------------g 2--------------------------------------");
            this.showStableArray(stableArr);
            this.showStableArray(stableArr);
        }
        private mouseDown(evt:any):void
        {
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
        }
        runEnd():void
        {
            super.runEnd();
            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}