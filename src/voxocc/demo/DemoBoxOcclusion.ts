
import * as Vector3DT from "../../vox/geom/Vector3";
import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as RandomRangeT from "../../vox/utils/RandomRange";
import * as RenderConstT from "../../vox/render/RenderConst";
import * as RODrawStateT from "../../vox/render/RODrawState";
import * as RendererParamT from "../../vox/scene/RendererParam";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as TexResLoaderT from "../../vox/texture/TexResLoader";
import * as RendererSceneT from "../../vox/scene/RendererScene";
import * as MouseEventT from "../../vox/event/MouseEvent";
import * as Stage3DT from "../../vox/display/Stage3D";
import * as H5FontSysT from "../../vox/text/H5FontSys";

import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as Box3DEntityT from "../../vox/entity/Box3DEntity";
import * as BillboardFrameT from "../../vox/entity/BillboardFrame";
import * as ProfileInstanceT from "../../voxprofile/entity/ProfileInstance";
import * as CameraTrackT from "../../vox/view/CameraTrack";
import * as BoxFrame3DT from "../../vox/entity/BoxFrame3D";
import * as BrokenLine3DEntityT from "../../vox/entity/BrokenLine3DEntity";
import * as QuadHolePOVT from '../../voxocc/occlusion/QuadHolePOV';
import * as BoxPOVT from '../../voxocc/occlusion/BoxPOV';
import * as IRendererSpaceT from "../../vox/scene/IRendererSpace";
import * as SpaceCullingMasKT from '../../vox/scene/SpaceCullingMasK';
import * as SpaceCullingorT from '../../vox/scene/SpaceCullingor';

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import CubeRandomRange = RandomRangeT.vox.utils.CubeRandomRange;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RenderStateObject = RODrawStateT.vox.render.RenderStateObject;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import Stage3D = Stage3DT.vox.display.Stage3D;
import H5FontSystem = H5FontSysT.vox.text.H5FontSystem;

import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import BillboardFrame = BillboardFrameT.vox.entity.BillboardFrame;
import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import BoxFrame3D = BoxFrame3DT.vox.entity.BoxFrame3D;
import BrokenLine3DEntity = BrokenLine3DEntityT.vox.entity.BrokenLine3DEntity;
import QuadHolePOV = QuadHolePOVT.voxocc.occlusion.QuadHolePOV;
import BoxPOV = BoxPOVT.voxocc.occlusion.BoxPOV;
import IRendererSpace = IRendererSpaceT.vox.scene.IRendererSpace;
import SpaceCullingMasK = SpaceCullingMasKT.vox.scene.SpaceCullingMasK;
import SpaceCullingor = SpaceCullingorT.vox.scene.SpaceCullingor;

export namespace voxocc
{
export namespace demo
{
    export class DemoBoxOcclusion
    {
        constructor()
        {
        }
        
        private m_rscene:RendererScene = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        
        private m_profileInstance:ProfileInstance = new ProfileInstance();
        private m_boxOcc0:BoxPOV = new BoxPOV();
        private m_boxOcc1:BoxPOV = new BoxPOV();
        private m_quadHolePOV:QuadHolePOV = new QuadHolePOV();
        private m_dispList:DisplayEntity[] = [];
        private m_frameList:BillboardFrame[] = [];
        private m_occStatusList:number[] = [];
        private m_rspace:IRendererSpace = null;
        initialize():void
        {
            console.log("DemoBoxOcclusion::initialize()......");
            if(this.m_rscene == null)
            {
                H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getTexAndLoadImg("assets/guangyun_H_0007.png");
                let tex3:TextureProxy = this.m_texLoader.getTexAndLoadImg("assets/flare_core_01.jpg");
                let tex4:TextureProxy = this.m_texLoader.getTexAndLoadImg("assets/flare_core_02.jpg");
                let tex5:TextureProxy = this.m_texLoader.getTexAndLoadImg("assets/a_02_c.jpg");
                tex0.mipmapEnabled = true;
                tex1.mipmapEnabled = true;
                tex2.mipmapEnabled = true;
                tex3.mipmapEnabled = true;
                tex4.mipmapEnabled = true;
                tex5.mipmapEnabled = true;
                
                let rparam:RendererParam = new RendererParam("glcanvas");
                rparam.setMatrix4AllocateSize(8192 * 4);
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.setRendererProcessParam(1,true,true);
                //this.m_rcontext = this.m_rscene.getRendererContext();
                this.m_rspace = this.m_rscene.getSpace();
                let cullingor:SpaceCullingor = new SpaceCullingor();
                cullingor.addPOVObject(this.m_boxOcc0);
                cullingor.addPOVObject(this.m_boxOcc1);
                this.m_rspace.setSpaceCullingor(cullingor);
                
                let stage3D:Stage3D = this.m_rscene.getStage3D();
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseUpListener);
                stage3D.addEventListener(MouseEvent.MOUSE_WHEEL,this,this.mouseWheeelListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());
                
                RenderStateObject.Create("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RenderStateObject.Create("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                this.m_rscene.updateCamera();

                let pv:Vector3D = new Vector3D();
                let minVDis:number = -650.0;
                let maxVDis:number = 270.0;
                let boxMinV:Vector3D = new Vector3D(minVDis,minVDis,minVDis * 0.5);
                let boxMaxV:Vector3D = new Vector3D(maxVDis,maxVDis + 200,maxVDis * 0.5);
                this.m_boxOcc0.setCamPosition(this.m_rscene.getCamera().getPosition());
                this.m_boxOcc0.setParam(boxMinV,boxMaxV);
                this.m_boxOcc0.updateOccData();
                let boxFrame:BoxFrame3D = new BoxFrame3D();
                //boxFrame.initialize(boxMinV,boxMaxV);
                boxFrame.initializeByPosList8(this.m_boxOcc0.getPositionList());
                //boxFrame.setScaleXYZ(0.98, 0.98,0.98);
                this.m_rscene.addEntity(boxFrame);

                let posList:Vector3D[] = null;               
                this.m_quadHolePOV.setCamPosition( this.m_rscene.getCamera().getPosition() );
                //this.m_quadOccObj.setParam(posList[0],posList[1],posList[2],posList[3], posList[4],posList[5],posList[6],posList[7]);
                posList = this.m_quadHolePOV.setParamFromeBoxFaceZ(
                    new Vector3D(boxMinV.x + 200.0,boxMinV.y + 190.0,boxMinV.z)
                    ,new Vector3D(boxMaxV.x - 190.0,boxMaxV.y - 170.0,boxMaxV.z)
                    );
                this.m_quadHolePOV.updateOccData();
                this.m_boxOcc0.addSubPov(this.m_quadHolePOV);
                

                let dispLS:BrokenLine3DEntity = new BrokenLine3DEntity();
                dispLS.initializeQuad(posList[0],posList[1],posList[2],posList[3]);
                dispLS.setRGB3f(1.0,1.0,0.0);
                this.m_rscene.addEntity(dispLS);
                dispLS = new BrokenLine3DEntity();
                dispLS.initializeQuad(posList[4],posList[5],posList[6],posList[7]);
                dispLS.setRGB3f(0.0,1.0,1.0);
                this.m_rscene.addEntity(dispLS);


                minVDis = 300.0;
                maxVDis = 800.0;
                boxMinV.setXYZ(minVDis,minVDis,minVDis);
                boxMaxV.setXYZ(maxVDis,maxVDis,maxVDis);
                this.m_boxOcc1.setCamPosition(this.m_rscene.getCamera().getPosition());
                this.m_boxOcc1.setParam(boxMinV,boxMaxV);
                this.m_boxOcc1.getPositionAt(pv,0);
                pv.x += 150.0;
                this.m_boxOcc1.setPositionAt(pv,0);
                this.m_boxOcc1.getPositionAt(pv,1);
                pv.x += 150.0;
                this.m_boxOcc1.setPositionAt(pv,1);
                this.m_boxOcc1.updateOccData();
                boxFrame = new BoxFrame3D();
                boxFrame.initializeByPosList8(this.m_boxOcc1.getPositionList());
                //boxFrame.initialize(boxMinV,boxMaxV);
                //boxFrame.setScaleXYZ(0.98, 0.98,0.98);
                this.m_rscene.addEntity(boxFrame);

                let cubeRange:CubeRandomRange = new CubeRandomRange();
                cubeRange.min.setXYZ(-800.0,-400.0,-700.0);
                cubeRange.max.setXYZ(800.0,400.0,-100.0);
                cubeRange.initialize();

                let i:number = 0;
                let total:number = 180;
                this.m_profileInstance = new ProfileInstance();
                this.m_profileInstance.initialize(this.m_rscene.getRenderer());

                let src_circleFrame = new BillboardFrame();
                src_circleFrame.initializeCircle(100.0,20);
                let circleFrame:BillboardFrame = null;//new BillboardFrame();
                let srcBox:Box3DEntity = new Box3DEntity();
                srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                //srcBox = null;
                let box:Box3DEntity = null;
                let scaleK:number = 0.2;
                let frameScaleK:number = 1.0;
                for(i = 0; i < total; ++i)
                {
                    box = new Box3DEntity();
                    if(srcBox != null)box.setMesh(srcBox.getMesh());
                    box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                    if(total > 1)
                    {
                        box.setScaleXYZ((Math.random() + 0.8) * scaleK,(Math.random() + 0.8) * scaleK,(Math.random() + 0.8) * scaleK);
                        //box.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                        cubeRange.calc();
                        box.setPosition(cubeRange.value);
                    }
                    else
                    {
                        box.setXYZ(0.0,0.0,0.0);
                        //box.setXYZ(-324.0,252.0,-619.0);
                    }
                    
                    box.spaceCullMask |= SpaceCullingMasK.POV;
                    this.m_rscene.addEntity(box);
                    this.m_dispList.push(box);
                    this.m_occStatusList.push(0);
                    //this.m_boxOcc0.addEntity(box);
                    box.getPosition(pv);
                    circleFrame = new BillboardFrame();
                    circleFrame.copyMeshFrom(src_circleFrame);
                    circleFrame.initializeCircle(box.getGlobalBounds().radius,20);
                    frameScaleK = box.getGlobalBounds().radius / 100.0;
                    circleFrame.setScaleXY(frameScaleK,frameScaleK);
                    circleFrame.setPosition(pv);
                    this.m_rscene.addEntity(circleFrame);
                    this.m_frameList.push(circleFrame);
                    //this.m_boxOcc0.addEntityFrame( circleFrame );
                    
                }

            }
        }
        private m_flagBoo:boolean = true;
        mouseWheeelListener(evt:any):void
        {
            //console.log("mouseWheeelListener call, evt.wheelDeltaY: "+evt.wheelDeltaY);
            if(evt.wheelDeltaY < 0)
            {
                // zoom in
                ///this.m_rscene.getCamera().forward(-125.0);
            }
            else
            {
                // zoom out
                //this.m_rscene.getCamera().forward(125.0);
            }
        }
        mouseUpListener(evt:any):void
        {
            console.log("mouseUpListener call, this.m_rscene: "+this.m_rscene.toString());
            
        }
        showTestStatus():void
        {
            let i:number = 0;
            let len:number = this.m_dispList.length;
            for(; i < len; ++i)
            {
                //this.m_frameList[i].setRGB3f(1.0,1.0,1.0);
                if(this.m_dispList[i].drawEnabled)
                {
                    this.m_frameList[i].setRGB3f(1.0,1.0,1.0);
                }
                else
                {
                    this.m_frameList[i].setRGB3f(1.0,0.0,1.0);
                }
            }
        }
        run():void
        {
            //console.log("##-- begin");
            
            this.m_rscene.setClearRGBColor3f(0.0, 0.1, 0.1);
            this.m_rscene.runBegin();

            this.m_rscene.update();
            this.m_rscene.cullingTest();
            this.showTestStatus();

            this.m_rscene.run();
            this.m_rscene.runEnd();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_rscene.updateCamera();
            
            if(this.m_profileInstance != null)
            {
                this.m_profileInstance.run();
            }
        }
    }
}
}