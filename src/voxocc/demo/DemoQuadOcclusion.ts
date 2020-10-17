
import * as Vector3DT from "../../vox/geom/Vector3";
import * as RandomRangeT from "../../vox/utils/RandomRange";
import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as RendererParamT from "../../vox/scene/RendererParam";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as TexResLoaderT from "../../vox/texture/TexResLoader";
import * as RendererSceneT from "../../vox/scene/RendererScene";
import * as MouseEventT from "../../vox/event/MouseEvent";
import * as Stage3DT from "../../vox/display/Stage3D";
import * as H5FontSysT from "../../vox/text/H5FontSys";

import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as Axis3DEntityT from "../../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../../vox/entity/Box3DEntity";
import * as BillboardFrameT from "../../vox/entity/BillboardFrame";
import * as ProfileInstanceT from "../../voxprofile/entity/ProfileInstance";
import * as CameraTrackT from "../../vox/view/CameraTrack";
import * as BrokenLine3DEntityT from "../../vox/entity/BrokenLine3DEntity";
import * as QuadPOVT from '../../voxocc/occlusion/QuadPOV';
import * as QuadGapPOVT from '../../voxocc/occlusion/QuadGapPOV';
import * as IRendererSpaceT from "../../vox/scene/IRendererSpace";
import * as SpaceCullingMasKT from '../../vox/scene/SpaceCullingMasK';
import * as SpaceCullingorT from '../../vox/scene/SpaceCullingor';

import Vector3D = Vector3DT.vox.geom.Vector3D;
import CubeRandomRange = RandomRangeT.vox.utils.CubeRandomRange;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import Stage3D = Stage3DT.vox.display.Stage3D;
import H5FontSystem = H5FontSysT.vox.text.H5FontSystem;

import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import BillboardFrame = BillboardFrameT.vox.entity.BillboardFrame;
import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import BrokenLine3DEntity = BrokenLine3DEntityT.vox.entity.BrokenLine3DEntity;
import QuadPOV = QuadPOVT.voxocc.occlusion.QuadPOV;
import QuadGapPOV = QuadGapPOVT.voxocc.occlusion.QuadGapPOV;
import IRendererSpace = IRendererSpaceT.vox.scene.IRendererSpace;
import SpaceCullingMasK = SpaceCullingMasKT.vox.scene.SpaceCullingMasK;
import SpaceCullingor = SpaceCullingorT.vox.scene.SpaceCullingor;

export namespace voxocc
{
export namespace demo
{
    export class DemoQuadOcclusion
    {
        constructor()
        {
        }
        
        private m_rscene:RendererScene = null;
        //private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        
        private m_profileInstance:ProfileInstance = new ProfileInstance();
        private m_quadOccObj:QuadPOV = new QuadPOV();
        private m_quadOccObj0:QuadGapPOV = new QuadGapPOV();
        private m_quadOccObj1:QuadGapPOV = new QuadGapPOV();
        private m_dispList:DisplayEntity[] = [];
        private m_frameList:BillboardFrame[] = [];
        private m_rspace:IRendererSpace = null;
        initialize():void
        {
            console.log("DemoQuadOcclusion::initialize()......");
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
                
                let stage3D:Stage3D = this.m_rscene.getStage3D();
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseUpListener);
                stage3D.addEventListener(MouseEvent.MOUSE_WHEEL,this,this.mouseWheeelListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());
                //
                //  RenderStateObject.Create("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                //  RenderStateObject.Create("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                this.m_rscene.updateCamera();
                let i:number = 0;
                this.m_profileInstance = new ProfileInstance();
                this.m_profileInstance.initialize(this.m_rscene.getRenderer());
                //
                let offsetPV:Vector3D = new Vector3D();
                let tx:number = 600.0;
                let tz:number = -1500.0;
                
                tz = -100.0;
                let posList:Vector3D[] = [
                    new Vector3D(-tx + offsetPV.x,600.0 + offsetPV.y,tz + offsetPV.z)
                    , new Vector3D(tx + offsetPV.x,600.0 + offsetPV.y,tz + offsetPV.z)
                    , new Vector3D(tx + offsetPV.x,-600.0 + offsetPV.y,tz + offsetPV.z)
                    , new Vector3D(-tx + offsetPV.x,-600.0 + offsetPV.y,tz + offsetPV.z)];
                
                this.m_quadOccObj.setCamPosition( this.m_rscene.getCamera().getPosition() );
                this.m_quadOccObj.setParam(posList[0],posList[1],posList[2],posList[3]);
                this.m_quadOccObj.updateOccData();

                let dispLS:BrokenLine3DEntity = new BrokenLine3DEntity();
                dispLS.initializeQuad(posList[0],posList[1],posList[2],posList[3]);
                dispLS.setRGB3f(1.0,1.0,0.0);
                this.m_rscene.addEntity(dispLS);
                
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);

                offsetPV.x = 250.0;
                tx = 150.0;
                posList = [
                    new Vector3D(-tx + offsetPV.x,150.0 + offsetPV.y,tz + offsetPV.z)
                    , new Vector3D(tx + offsetPV.x,150.0 + offsetPV.y,tz + offsetPV.z)
                    , new Vector3D(tx + offsetPV.x,-150.0 + offsetPV.y,tz + offsetPV.z)
                    , new Vector3D(-tx + offsetPV.x,-150.0 + offsetPV.y,tz + offsetPV.z)];
                
                this.m_quadOccObj0.setCamPosition( this.m_rscene.getCamera().getPosition() );
                this.m_quadOccObj0.setParam(posList[0],posList[1],posList[2],posList[3]);
                this.m_quadOccObj0.updateOccData();
                this.m_quadOccObj.addSubPov(this.m_quadOccObj0);
                dispLS = new BrokenLine3DEntity();
                dispLS.initializeQuad(posList[0],posList[1],posList[2],posList[3]);
                dispLS.setRGB3f(0.0,1.0,0.0);
                this.m_rscene.addEntity(dispLS);

                offsetPV.x = -350.0;
                offsetPV.y = 50.0;
                tx = 150.0;
                posList = [
                    new Vector3D(-tx + offsetPV.x,150.0 + offsetPV.y,tz + offsetPV.z)
                    , new Vector3D(tx + offsetPV.x,150.0 + offsetPV.y,tz + offsetPV.z)
                    , new Vector3D(tx + offsetPV.x,-150.0 + offsetPV.y,tz + offsetPV.z)
                    , new Vector3D(-tx + offsetPV.x,-150.0 + offsetPV.y,tz + offsetPV.z)];
                
                this.m_quadOccObj1.setCamPosition( this.m_rscene.getCamera().getPosition() );
                this.m_quadOccObj1.setParam(posList[0],posList[1],posList[2],posList[3]);
                this.m_quadOccObj1.updateOccData();
                this.m_quadOccObj.addSubPov(this.m_quadOccObj1);
                dispLS = new BrokenLine3DEntity();
                dispLS.initializeQuad(posList[0],posList[1],posList[2],posList[3]);
                dispLS.setRGB3f(0.0,1.0,0.0);
                this.m_rscene.addEntity(dispLS);

                let cullingor:SpaceCullingor = new SpaceCullingor();
                cullingor.addPOVObject(this.m_quadOccObj);
                this.m_rspace.setSpaceCullingor(cullingor);
                
                let occ_circleFrame:BillboardFrame = new BillboardFrame();
                occ_circleFrame.initializeCircle(this.m_quadOccObj.getOccRadius(),20);
                occ_circleFrame.setPosition(this.m_quadOccObj.getOccCenter());
                this.m_rscene.addEntity(occ_circleFrame);
                
                axis = new Axis3DEntity();
                axis.initialize(30.0);
                axis.setPosition(posList[0]);
                this.m_rscene.addEntity(axis);
                axis = new Axis3DEntity();
                axis.initialize(80.0);
                axis.setPosition(posList[1]);
                this.m_rscene.addEntity(axis);
                let cubeRange:CubeRandomRange = new CubeRandomRange();
                cubeRange.min.setXYZ(-400.0,-400.0,-400.0);
                cubeRange.max.setXYZ(400.0,400.0,-200.0);
                cubeRange.initialize();
                //return;
                let pv:Vector3D = new Vector3D();
                let circleFrame:BillboardFrame = null;//new BillboardFrame();
                let srcBox:Box3DEntity = new Box3DEntity();
                srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                //srcBox = null;
                let total:number = 80;
                let sk:number = 0.15;
                let box:Box3DEntity = null;
                let minV:Vector3D = new Vector3D(-100.0,-100.0,-100.0);
                let maxV:Vector3D = new Vector3D(100.0,100.0,100.0);
                let texList:TextureProxy[] = [tex1];
                for(i = 0; i < total; ++i)
                {
                    box = new Box3DEntity();
                    if(srcBox != null)box.setMesh(srcBox.getMesh());
                    box.initialize(minV, maxV, texList);
                    if(total > 1)
                    {
                        box.setScaleXYZ((Math.random() * 1.5 + 0.8) * sk,(Math.random() * 1.5 + 0.8) * sk,(Math.random() * 1.5 + 0.8) * sk);
                        cubeRange.calc();
                        box.setPosition(cubeRange.value);
                        //console.log("cubeRange.value: "+cubeRange.value);
                        //box.setXYZ(Math.random() * 4000.0 - 2000.0,Math.random() * 4000.0 - 2000.0,Math.random() * 4000.0 - 2000.0);
                    }
                    else
                    {
                        box.setXYZ(-500.0,-200.0,-500.0);
                    }
                    box.spaceCullMask |= SpaceCullingMasK.POV;
                    this.m_rscene.addEntity(box);
                    this.m_dispList.push(box);
                    
                    box.getPosition(pv);
                    circleFrame = new BillboardFrame();
                    circleFrame.initializeCircle(box.getGlobalBounds().radius,20);
                    circleFrame.setPosition(pv);
                    this.m_rscene.addEntity(circleFrame);
                    this.m_frameList.push(circleFrame);
                    
                }
            }
        }
        
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
            //this.m_flagBoo = !this.m_flagBoo;
            //this.m_quadOccObj.mouseUp();
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