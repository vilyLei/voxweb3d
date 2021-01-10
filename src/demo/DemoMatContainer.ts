
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as Matrix4ContainerT from "../vox/geom/Matrix4Container";
import * as RendererStateT from "../vox/render/RendererState";

import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureStoreT from "../vox/texture/TextureStore";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as DemoInstanceT from "./DemoInstance";
import * as ProfileInstanceT from "../voxprofile/entity/ProfileInstance";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import Matrix4Container = Matrix4ContainerT.vox.geom.Matrix4Container;
import RendererState = RendererStateT.vox.render.RendererState;

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import DemoInstance = DemoInstanceT.demo.DemoInstance;
import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;

export namespace demo
{
    export class DemoMatContainer extends DemoInstance
    {
        constructor()
        {
            super();
        }
        private m_camTrack:CameraTrack = null;
        private m_profileInstance:ProfileInstance = new ProfileInstance();

        private m_matContainer:Matrix4Container = null;
        private m_matBox0:Matrix4Container = null;
        private m_matBox1:Matrix4Container = null;
        private m_matBoxParent0:Matrix4Container = null;
        private m_matBoxParent1:Matrix4Container = null;
        private m_box0:Box3DEntity = null;
        private m_box1:Box3DEntity = null;
        private m_box2:Box3DEntity = null;
        private m_box3:Box3DEntity = null;
        private m_bodyBox:Box3DEntity = null;
        protected initializeSceneParam(param:RendererParam):void
        {
            this.m_processTotal = 4;
            param.maxWebGLVersion = 1;
            param.setMatrix4AllocateSize(4096 * 1);
            param.setCamPosition(700.0,700.0,700.0);
        }
        
        private m_texnsList:string[] = [
            "fruit_01.jpg"
            ,"moss_05.jpg"
            ,"metal_02.jpg"
            ,"fruit_01.jpg"
            ,"moss_05.jpg"
            ,"metal_02.jpg"
        ];
        protected initializeSceneObj():void
        {
            console.log("DemoMatContainer::initialize()......");
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            this.m_rscene.getStage3D().addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);
            if(this.m_profileInstance != null)this.m_profileInstance.initialize(this.m_rscene.getRenderer());

            let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            
            // add common 3d display entity
            //  var plane:Plane3DEntity = new Plane3DEntity();
            //  plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
            //  this.m_rscene.addEntity(plane,2);
            let axis:Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);

            console.log("------------------------------------------------------------------");

            this.runDisp2();
        }
        private m_rotY:number = 0;
        private m_rotX0:number = Math.random() * 100.0;
        private m_rotX1:number = Math.random() * 100.0;
        private m_rotY0:number = 0;
        private m_rotY1:number = 0;
        private m_flag:number = 0;
        private m_downFlag:number = 0;
        private mouseDown(evt:any):void
        {
            console.log(">>> mouse down evt: ",evt);
            this.runDisp2();
        }
        private runDisp():void
        {
            if(this.m_matContainer == null)
            {
                this.m_matContainer = new Matrix4Container();
                this.m_matBoxParent0 = new Matrix4Container();
                this.m_matBoxParent1 = new Matrix4Container();
                this.m_matBox0 = new Matrix4Container();
                this.m_matBox1 = new Matrix4Container();
                
                this.m_matBoxParent0.setXYZ(-250.0,0.0,0.0);
                this.m_matBoxParent1.setXYZ(250.0,0.0,0.0);

                this.m_matContainer.addChild(this.m_matBoxParent0);
                this.m_matContainer.addChild(this.m_matBoxParent1);

                this.m_matBoxParent0.addChild(this.m_matBox0);
                this.m_matBoxParent1.addChild(this.m_matBox1);

                let texnsI:number = 0;
                texnsI = Math.floor(100 * Math.random() - 0.1) % this.m_texnsList.length;
                let tex1:TextureProxy = this.getImageTexByUrl("static/assets/"+this.m_texnsList[texnsI]);
                let box:Box3DEntity;
                box = new Box3DEntity();
                box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                this.m_rscene.addEntity(box);
                this.m_box0 = box;

                box = new Box3DEntity();
                box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                this.m_rscene.addEntity(box);
                this.m_box1 = box;
            }
            else
            {
                this.m_rotY += 0.1;
                this.m_rotX0 += 0.2;
                this.m_rotX1 += 0.3;
                this.m_rotY0 += 0.2;
                this.m_rotY1 += 0.2;
                this.m_matBox0.setRotationXYZ(this.m_rotX0,this.m_rotY0,0.0);
                this.m_matBox1.setRotationXYZ(this.m_rotX1,this.m_rotY1,0.0);
                this.m_matContainer.setRotationY(this.m_rotY);
                this.m_matContainer.update();
                this.m_matBox0.copyMatrixTo(this.m_box0.getTransform().getMatrix());
                this.m_matBox1.copyMatrixTo(this.m_box1.getTransform().getMatrix());
            }
        }
        
        private m_body:Matrix4Container = null;
        private m_part0:Matrix4Container = null;
        private m_part1:Matrix4Container = null;
        private m_tarA0:Matrix4Container = null;
        private m_tarA1:Matrix4Container = null;
        private m_tarB0:Matrix4Container = null;
        private m_tarB1:Matrix4Container = null;
        private m_offsetV:Vector3D = new Vector3D(80.0,-30,100);
        private runDisp2():void
        {
            if(this.m_body == null)
            {
                
                let texnsI:number = 0;
                texnsI = Math.floor(100 * Math.random() - 0.1) % this.m_texnsList.length;
                let tex1:TextureProxy = this.getImageTexByUrl("static/assets/"+this.m_texnsList[texnsI]);
                let box:Box3DEntity = new Box3DEntity();

                box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                this.m_rscene.addEntity(box);
                this.m_box0 = box;
                box = new Box3DEntity();
                box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                this.m_rscene.addEntity(box);
                this.m_box1 = box;

                box = new Box3DEntity();
                box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                this.m_rscene.addEntity(box);
                this.m_box2 = box;
                box = new Box3DEntity();
                box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                this.m_rscene.addEntity(box);
                this.m_box3 = box;

                texnsI = Math.floor(100 * Math.random() - 0.1) % this.m_texnsList.length;
                tex1 = this.getImageTexByUrl("static/assets/"+this.m_texnsList[texnsI]);
                box = new Box3DEntity();
                box.initialize(new Vector3D(-130.0,-50.0,-100.0),new Vector3D(130.0,50.0,100.0),[tex1]);
                this.m_rscene.addEntity(box);
                this.m_bodyBox = box;
                let scale:number = 0.3;
                //          this.m_box0.setScaleXYZ(scale,scale,scale);
                //          this.m_box1.setScaleXYZ(scale,scale,scale);
                //          this.m_box2.setScaleXYZ(scale,scale,scale);
                //          this.m_box3.setScaleXYZ(scale,scale,scale);

                this.m_body = new Matrix4Container();

                this.m_part0 = new Matrix4Container();
                this.m_part1 = new Matrix4Container();

                this.m_part0.setXYZ(this.m_offsetV.x,this.m_offsetV.y,0.0);
                this.m_part1.setXYZ(-this.m_offsetV.x,this.m_offsetV.y,0.0);
                this.m_body.addChild(this.m_part0);
                this.m_body.addChild(this.m_part1);

                this.m_tarA0 = new Matrix4Container();
                this.m_tarA1 = new Matrix4Container();

                this.m_tarA0.setZ(this.m_offsetV.z);
                this.m_tarA1.setZ(-this.m_offsetV.z);

                this.m_part0.addChild(this.m_tarA0);
                this.m_part0.addChild(this.m_tarA1);
                
                this.m_tarB0 = new Matrix4Container();
                this.m_tarB1 = new Matrix4Container();                
                this.m_tarB0.setZ(this.m_offsetV.z);
                this.m_tarB1.setZ(-this.m_offsetV.z);

                this.m_part1.addChild(this.m_tarB0);
                this.m_part1.addChild(this.m_tarB1);

                this.m_tarA0.setScaleXYZ(scale,scale,scale);
                this.m_tarA1.setScaleXYZ(scale,scale,scale);
                this.m_tarB0.setScaleXYZ(scale,scale,scale);
                this.m_tarB1.setScaleXYZ(scale,scale,scale);

                this.m_body.setXYZ(100,0.0,-200);
                this.m_body.setRotationXYZ(0.0,70.0,0.0);
                this.m_body.update();
            }
            else
            {
                
                this.m_rotX0 += 0.2;
                //this.m_rotX1 += 0.3;
                this.m_part0.setRotationZ(this.m_rotX0);
                this.m_part1.setRotationZ(this.m_rotX0);
                this.m_body.update();
                this.m_body.copyMatrixTo(this.m_bodyBox.getTransform().getMatrix());
                this.m_bodyBox
                this.m_tarA0.copyMatrixTo(this.m_box0.getTransform().getMatrix());
                this.m_tarA1.copyMatrixTo(this.m_box1.getTransform().getMatrix());

                this.m_tarB0.copyMatrixTo(this.m_box2.getTransform().getMatrix());
                this.m_tarB1.copyMatrixTo(this.m_box3.getTransform().getMatrix());
            }
        }
        runBegin():void
        {
            //this.runDisp();
            this.runDisp2();
            
            this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
            
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
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}