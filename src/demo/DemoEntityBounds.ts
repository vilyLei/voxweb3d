
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Stage3D from "../vox/display/Stage3D";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import BoxFrame3D from "../vox/entity/BoxFrame3D";
import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst,TextureFormat,TextureDataType,TextureTarget} from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import DisplayEntityContainer from "../vox/entity/DisplayEntityContainer";
import * as EntityDispT from "./base/EntityDisp";

//import Vector3D = Vector3DT.vox.math.Vector3D;
//import RendererDevice = RendererDeviceT.vox.render.RendererDevice;
//import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
//import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
//import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
//import RendererState = RendererStateT.vox.render.RendererState;
//import RendererParam = RendererParamT.vox.scene.RendererParam;
//import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
//import RendererScene = RendererSceneT.vox.scene.RendererScene;
//import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
//import MouseEvent = MouseEventT.vox.event.MouseEvent;
//import Stage3D = Stage3DT.vox.display.Stage3D;

//import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
//import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
//import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
//import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
//import BoxFrame3D = BoxFrame3DT.vox.entity.BoxFrame3D;
//import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
//import TextureConst = TextureConstT.vox.texture.TextureConst;
//import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
//import CameraTrack = CameraTrackT.vox.view.CameraTrack;
//import DisplayEntityContainer = DisplayEntityContainerT.vox.entity.DisplayEntityContainer;

import EntityDispQueue = EntityDispT.demo.base.EntityDispQueue;

export namespace demo
{
    export class DemoEntityBounds
    {
        constructor()
        {
        }

        private m_rscene:RendererScene = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_equeue:EntityDispQueue = new EntityDispQueue();
        
        private m_followEntity:DisplayEntity = null;
        private m_texList:TextureProxy[] = [];
        initTex():void
        {
            let i:number = 0;
            
            let urls:string[] = [
                "static/assets/default.jpg"
                , "static/assets/broken_iron.jpg"
                , "static/assets/guangyun_H_0007.png"
            ];
            for(; i < urls.length; ++i)
            {
                this.m_texList.push( this.m_texLoader.getImageTexByUrl(urls[i]) );
                this.m_texList[i].mipmapEnabled = true;
                this.m_texList[i].setWrap(TextureConst.WRAP_REPEAT);
            }
        }
        initialize():void
        {
            console.log("DemoEntityBounds::initialize()......");
            if(this.m_rcontext == null)
            {
                this.initTex();
                RendererDevice.SHADERCODE_TRACE_ENABLED = true;
                
                let scale:number = 1.0;
                let i:number = 0;

                this.m_statusDisp.initialize();

                let rparam:RendererParam = new RendererParam();
                rparam.setMatrix4AllocateSize(8192);
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam);

                //this.m_renderer = this.m_rscene.getRenderer();
                this.m_rcontext = this.m_rscene.getRendererContext();
                let stage3D:Stage3D = this.m_rscene.getStage3D() as Stage3D;
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseUpListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.ALWAYS);
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.name = "followAxis";
                axis.initialize(50.0);
                axis.setXYZ(0,300.0,0);
                this.m_rscene.addEntity(axis);
                this.m_followEntity = axis;
                this.initEntityBoundsTest();
                this.initContainerBoundsTest();
            }
        }
        mouseUpListener(evt:any):void
        {
        }
        pv:Vector3D = new Vector3D();
        delayTime:number = 10;
        run():void
        {
            this.m_statusDisp.update();
            // logic run
            this.m_equeue.run();
            this.runEntityBoundsTest();
            this.runContainerBoundsTest();
            
            this.m_rscene.setClearRGBColor3f(0.0, 0.5, 0.0);
            this.m_rscene.runBegin();

            this.m_rscene.update();
            this.m_rscene.run();

            this.m_rscene.runEnd();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_rscene.updateCamera();
        }
        private m_targetContFrame:BoxFrame3D = null;
        private m_targetContMainFrame:BoxFrame3D = null;
        private m_containerFrame:BoxFrame3D = null;
        private m_targetEntity0:DisplayEntity = null;
        private m_targetEntity0Frame:BoxFrame3D = null;
        private m_targetEntity2:DisplayEntity = null;
        private m_targetEntity2Frame:BoxFrame3D = null;
        private m_targetEntity1:DisplayEntity = null;
        private m_container:DisplayEntityContainer = null;
        private m_topContainer:DisplayEntityContainer = null;
        private m_mainContainer:DisplayEntityContainer = null;
        private m_scale:number = 1.0;
        private m_scaleTime:number = Math.random();
        private m_followBCEntitys:DisplayEntity[] = [];
        runContainerBoundsTest():void
        {
            if(this.m_targetContFrame != null)
            {
                this.m_targetEntity0.getTransform().setRotationY(this.m_targetEntity0.getTransform().getRotationY() + 0.5);
                this.m_targetEntity0.getTransform().setRotationZ(this.m_targetEntity0.getTransform().getRotationZ() - 0.5);
                this.m_targetEntity2.getTransform().setRotationZ(this.m_targetEntity2.getTransform().getRotationZ() - 0.5);
                this.m_targetEntity2.getTransform().setRotationX(this.m_targetEntity2.getTransform().getRotationX() - 0.5);
                //this.m_targetEntity2.update();
                //  this.m_targetEntity1.getTransform().setRotationX(this.m_targetEntity1.getTransform().getRotationX() + 1.0);
                //  this.m_targetEntity1.getTransform().setRotationZ(this.m_targetEntity1.getTransform().getRotationZ() - 1.0);
                //  this.m_targetEntity1.update();
                this.m_scaleTime += 0.02;
                this.m_scale = (Math.cos(this.m_scaleTime)) * 0.5 + 1.0;
                //this.m_container.setScaleY(this.m_scale);
                this.m_container.setRotationZ(this.m_container.getRotationZ() + 1.0);
                this.m_container.setRotationZ(this.m_container.getRotationZ() + 1.0);
                //this.m_container.update();
                //this.m_topContainer.update();
                //this.m_mainContainer.update();

                this.m_targetEntity0Frame.updateFrameByAABB(this.m_targetEntity0.getGlobalBounds());
                this.m_targetContMainFrame.updateFrameByAABB(this.m_mainContainer.getGlobalBounds());
                this.m_targetContFrame.updateFrameByAABB(this.m_topContainer.getGlobalBounds());
                let pminV:Vector3D = this.m_topContainer.getGlobalBounds().min;
                let pmaxV:Vector3D = this.m_topContainer.getGlobalBounds().max;
                //console.log("pminV: "+pminV.toString());
                //console.log("pmaxV: "+pmaxV.toString());
                let posarr:number[] = [
                    pminV.x,pminV.y,pminV.z,
                    pmaxV.x,pminV.y,pminV.z,
                    pminV.x,pminV.y,pmaxV.z,
                    pmaxV.x,pminV.y,pmaxV.z,

                    pminV.x,pmaxV.y,pminV.z,
                    pmaxV.x,pmaxV.y,pminV.z,
                    pminV.x,pmaxV.y,pmaxV.z,
                    pmaxV.x,pmaxV.y,pmaxV.z
                ];
                let i:number = 0;
                let j:number = 0;
                for(i = 0; i < 8; ++i)
                {
                    this.m_followBCEntitys[i].setXYZ(posarr[j],posarr[j+1],posarr[j+2]);
                    this.m_followBCEntitys[i].update();
                    j+=3;
                }
                //this.m_followEntity
                this.pv.setXYZ(100.0,100.0,100.0);
                this.m_targetEntity0.getTransform().localToGlobal(this.pv);
                this.m_followEntity.setPosition(this.pv);
                this.m_followEntity.update();
            }
        }
        initContainerBoundsTest():void
        {
            let srcSphere:Sphere3DEntity = new Sphere3DEntity();
            srcSphere.initialize(50.0,15,15,[this.m_texList[0]]);
            let scale:number = 0.2;
            this.m_container = new DisplayEntityContainer();
            this.m_topContainer = new DisplayEntityContainer();
            this.m_mainContainer = new DisplayEntityContainer();

            this.m_rscene.addContainer(this.m_mainContainer);

            let srcBox:Box3DEntity = new Box3DEntity();
            srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[this.m_texList[0]]);

            let box0:Box3DEntity = new Box3DEntity();
            box0.mouseEnabled = true;
            box0.setMesh(srcBox.getMesh());
            box0.initialize(null,null,[this.m_texList[0]]);
            let box1:Box3DEntity = new Box3DEntity();
            box1.mouseEnabled = true;
            box1.setMesh(srcBox.getMesh());
            box1.initialize(null,null,[this.m_texList[1]]);
            let box2:Box3DEntity = new Box3DEntity();
            box2.mouseEnabled = true;
            box2.setMesh(srcBox.getMesh());
            box2.initialize(null,null,[this.m_texList[2]]);

            //
            box0.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 100.0 - 500.0,Math.random() * 100.0 - 500.0);
            box0.setRotationXYZ(Math.random() * 360.0,Math.random() * 360.0,Math.random() * 360.0);
            box0.setScaleXYZ(Math.random() + 0.5,Math.random() + 0.5,Math.random() + 0.5);
            this.m_targetEntity0 = box0;
            this.m_container.addEntity(this.m_targetEntity0);
            this.m_rscene.addEntity(this.m_targetEntity0);
            
            this.m_targetEntity2 = box2;
            this.m_mainContainer.name = "main";
            this.m_mainContainer.addEntity(this.m_targetEntity2);
            this.m_rscene.addEntity(this.m_targetEntity2);

            box1.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 100.0 - 500.0,Math.random() * 100.0 - 500.0);
            box1.setRotationXYZ(Math.random() * 360.0,Math.random() * 360.0,Math.random() * 360.0);
            box1.setScaleXYZ(Math.random() + 0.5,Math.random() + 0.5,Math.random() + 0.5);
            this.m_targetEntity1 = box1;
            this.m_container.addEntity(this.m_targetEntity1);

            this.m_scale = (Math.cos(this.m_scaleTime)) * 0.5 + 1.0;
            this.m_container.setXYZ(-300.0,10.0,100.0);
            this.m_topContainer.addChild(this.m_container);
            this.m_mainContainer.addChild(this.m_topContainer);
            //this.m_container.setScaleY(this.m_scale);
            this.m_container.update();

            let cubeFrame:BoxFrame3D = new BoxFrame3D();
            cubeFrame.initialize(this.m_topContainer.getGlobalBounds().min, this.m_topContainer.getGlobalBounds().max);
            this.m_rscene.addEntity(cubeFrame);
            this.m_targetContFrame = cubeFrame;

            this.m_targetContMainFrame = new BoxFrame3D();
            this.m_targetContMainFrame.color.setRGB3f(1.0,0.0,1.0);
            this.m_targetContMainFrame.initialize(this.m_mainContainer.getGlobalBounds().min, this.m_mainContainer.getGlobalBounds().max);
            this.m_rscene.addEntity(this.m_targetContMainFrame);

            
            this.m_targetEntity0Frame = new BoxFrame3D();
            this.m_targetEntity0Frame.initialize(this.m_targetEntity0.getGlobalBounds().min, this.m_targetEntity0.getGlobalBounds().max);
            this.m_rscene.addEntity(this.m_targetEntity0Frame);

            let pminV:Vector3D = this.m_topContainer.getGlobalBounds().min;
            let pmaxV:Vector3D = this.m_topContainer.getGlobalBounds().max;
            //console.log("pminV: "+pminV.toString());
            //console.log("pmaxV: "+pmaxV.toString());
            let posarr:number[] = [
                pminV.x,pminV.y,pminV.z,
                pmaxV.x,pminV.y,pminV.z,
                pminV.x,pminV.y,pmaxV.z,
                pmaxV.x,pminV.y,pmaxV.z,
                pminV.x,pmaxV.y,pminV.z,
                pmaxV.x,pmaxV.y,pminV.z,
                pminV.x,pmaxV.y,pmaxV.z,
                pmaxV.x,pmaxV.y,pmaxV.z
            ];
            let i:number = 0;
            let j:number = 0;
            for(i = 0; i < 8; ++i)
            {
                let sphere:Sphere3DEntity = new Sphere3DEntity();
                sphere.setMesh( srcSphere.getMesh() );
                sphere.initialize(50.0,15,15,[this.m_texList[0]]);
                sphere.setScaleXYZ(scale,scale,scale);
                sphere.setXYZ(posarr[j],posarr[j+1],posarr[j+2]);
                this.m_rscene.addEntity(sphere);
                j += 3;
                this.m_followBCEntitys.push( sphere );
            }
        }
        private m_targetFrame:BoxFrame3D = null;
        private m_targetEntity:DisplayEntity = null;
        private m_followEntitys:DisplayEntity[] = [];
        runEntityBoundsTest():void
        {
            if(this.m_targetFrame != null)
            {
                if(this.m_targetEntity.getVisible())
                {
                    this.m_targetEntity.getTransform().setRotationY(this.m_targetEntity.getTransform().getRotationY() + 1.0);
                    this.m_targetEntity.getTransform().setRotationZ(this.m_targetEntity.getTransform().getRotationZ() - 1.0);
                    this.m_targetEntity.update();
                }

                this.m_targetFrame.updateFrameByAABB(this.m_targetEntity.getGlobalBounds());

                let pminV:Vector3D = this.m_targetEntity.getGlobalBounds().min;
                let pmaxV:Vector3D = this.m_targetEntity.getGlobalBounds().max;
                //console.log("pminV: "+pminV.toString());
                //console.log("pmaxV: "+pmaxV.toString());
                let posarr:number[] = [
                    pminV.x,pminV.y,pminV.z,
                    pmaxV.x,pminV.y,pminV.z,
                    pminV.x,pminV.y,pmaxV.z,
                    pmaxV.x,pminV.y,pmaxV.z,

                    pminV.x,pmaxV.y,pminV.z,
                    pmaxV.x,pmaxV.y,pminV.z,
                    pminV.x,pmaxV.y,pmaxV.z,
                    pmaxV.x,pmaxV.y,pmaxV.z
                ];
                let i:number = 0;
                let j:number = 0;
                for(i = 0; i < 8; ++i)
                {
                    this.m_followEntitys[i].setXYZ(posarr[j],posarr[j+1],posarr[j+2]);
                    this.m_followEntitys[i].update();
                    j+=3;
                }
            }
        }
        initEntityBoundsTest():void
        {
            
            let srcSphere:Sphere3DEntity = new Sphere3DEntity();
            srcSphere.initialize(50.0,15,15,[this.m_texList[0]]);
            let srcBox:Box3DEntity = new Box3DEntity();
            srcBox.mouseEnabled = true;
            srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[this.m_texList[0]]);

            srcBox.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
            srcBox.setRotationXYZ(Math.random() * 360.0,Math.random() * 360.0,Math.random() * 360.0);
            srcBox.setScaleXYZ(Math.random() + 0.5,Math.random() + 0.5,Math.random() + 0.5);
            this.m_rscene.addEntity(srcBox);

            this.m_targetEntity = srcBox;
            let cubeFrame:BoxFrame3D = new BoxFrame3D();
            cubeFrame.initialize(srcBox.getGlobalBounds().min, srcBox.getGlobalBounds().max);
            this.m_targetFrame = cubeFrame;
            this.m_rscene.addEntity(this.m_targetFrame);
                
            let pminV:Vector3D = srcBox.getGlobalBounds().min;
            let pmaxV:Vector3D = srcBox.getGlobalBounds().max;
            //console.log("pminV: "+pminV.toString());
            //console.log("pmaxV: "+pmaxV.toString());
            let posarr:number[] = [
                pminV.x,pminV.y,pminV.z,
                pmaxV.x,pminV.y,pminV.z,
                pminV.x,pminV.y,pmaxV.z,
                pmaxV.x,pminV.y,pmaxV.z,
                pminV.x,pmaxV.y,pminV.z,
                pmaxV.x,pmaxV.y,pminV.z,
                pminV.x,pmaxV.y,pmaxV.z,
                pmaxV.x,pmaxV.y,pmaxV.z
            ];
            let scale:number = 0.2;
            let i:number = 0;
            let j:number = 0;
            for(i = 0; i < 8; ++i)
            {
                let sphere:Sphere3DEntity = new Sphere3DEntity();
                sphere.setMesh( srcSphere.getMesh() );
                sphere.initialize(50.0,15,15,[this.m_texList[0]]);
                sphere.setScaleXYZ(scale,scale,scale);
                sphere.setXYZ(posarr[j],posarr[j+1],posarr[j+2]);
                this.m_rscene.addEntity(sphere);
                j += 3;
                this.m_followEntitys.push( sphere );
            }
        }
    }
}