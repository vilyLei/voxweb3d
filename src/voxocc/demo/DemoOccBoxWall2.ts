
import * as Vector3DT from "../..//vox/math/Vector3D";
import * as RandomRangeT from "../../vox/utils/RandomRange";
import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as RenderConstT from "../../vox/render/RenderConst";
import * as RendererStateT from "../../vox/render/RendererState";
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
import * as IRendererSpaceT from "../../vox/scene/IRendererSpace";
import * as SpaceCullingorT from "../../vox/scene/SpaceCullingor";
import * as SpaceCullingMasKT from "../../vox/space/SpaceCullingMask";
import * as OccBoxWallT from "../../voxocc/demo/occwall/OccBoxWall";

import Vector3D = Vector3DT.vox.math.Vector3D;
import CubeRandomRange = RandomRangeT.vox.utils.CubeRandomRange;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
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
import IRendererSpace = IRendererSpaceT.vox.scene.IRendererSpace;
import SpaceCullingor = SpaceCullingorT.vox.scene.SpaceCullingor;
import SpaceCullingMasK = SpaceCullingMasKT.vox.space.SpaceCullingMasK;
import OccBoxWall = OccBoxWallT.voxocc.demo.occwall.OccBoxWall;

export namespace voxocc
{
export namespace demo
{
    export class DemoOccBoxWall2
    {
        constructor()
        {
        }
        
        private m_rscene:RendererScene = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        
        private m_profileInstance:ProfileInstance = new ProfileInstance();
        private m_dispList:DisplayEntity[] = [];
        private m_frameList:BillboardFrame[] = [];
        private m_occStatusList:number[] = [];
        private m_rspace:IRendererSpace = null;
        private m_texList:TextureProxy[] = [];
        initialize():void
        {
            console.log("DemoOccBoxWall2::initialize()......");
            if(this.m_rscene == null)
            {
                H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/metal_08.jpg");
                let tex3:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/flare_core_01.jpg");
                let tex4:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/flare_core_02.jpg");
                let tex5:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/moss_02.jpg");
                tex0.mipmapEnabled = true;
                tex1.mipmapEnabled = true;
                tex2.mipmapEnabled = true;
                tex3.mipmapEnabled = true;
                tex4.mipmapEnabled = true;
                tex5.mipmapEnabled = true;
                this.m_texList.push(tex0);
                this.m_texList.push(tex1);
                this.m_texList.push(tex2);
                this.m_texList.push(tex3);
                this.m_texList.push(tex4);
                this.m_texList.push(tex5);
                
                let rparam:RendererParam = new RendererParam();
                rparam.setMatrix4AllocateSize(8192 * 4);
                rparam.setCamProject(45.0,100.0,5000.0);
                rparam.setCamPosition(2000.0,1500.0,2000.0);
                
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.setRendererProcessParam(1,true,true);
                this.m_rspace = this.m_rscene.getSpace();
                                
                let stage3D:Stage3D = this.m_rscene.getStage3D() as Stage3D;
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseUpListener);
                stage3D.addEventListener(MouseEvent.MOUSE_WHEEL,this,this.mouseWheeelListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());
                
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                this.m_rscene.updateCamera();
                
                let cubeRange:CubeRandomRange = new CubeRandomRange();
                cubeRange.min.setXYZ(-600.0,-600.0,-1050.0);
                cubeRange.max.setXYZ(600.0,600.0,850.0);
                cubeRange.initialize();

                let cubeRange1:CubeRandomRange = new CubeRandomRange();
                cubeRange1.min.setXYZ(-700.0,-600.0,450.0);
                cubeRange1.max.setXYZ(700.0,600.0,300.0);
                cubeRange1.initialize();

                let cubeRange2:CubeRandomRange = new CubeRandomRange();
                cubeRange2.min.setXYZ(-700.0,-600.0,-950.0);
                cubeRange2.max.setXYZ(700.0,600.0,-800.0);
                cubeRange2.initialize();

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);

                let i:number = 0;
                let total:number = 1000;
                this.m_profileInstance = new ProfileInstance();
                this.m_profileInstance.initialize(this.m_rscene.getRenderer());

                let src_circleFrame = new BillboardFrame();
                src_circleFrame.initializeCircle(100.0,20);
                let pv:Vector3D = new Vector3D();
                let circleFrame:BillboardFrame = null;
                let srcBox:Box3DEntity = new Box3DEntity();
                srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex0]);
                let box:Box3DEntity = null;
                let scaleK:number = 0.2;
                let frameScaleK:number = 1.0;
                
                let minV:Vector3D = new Vector3D(-100.0,-100.0,-100.0);
                let maxV:Vector3D = new Vector3D(100.0,100.0,100.0);
                let texList:TextureProxy[] = [tex5];
                for(i = 0; i < total; ++i)
                {
                    box = new Box3DEntity();
                    if(srcBox != null)box.setMesh(srcBox.getMesh());
                    box.initialize(minV, maxV, texList);
                    if(total > 1)
                    {
                        box.setScaleXYZ((Math.random() + 0.8) * scaleK,(Math.random() + 0.8) * scaleK,(Math.random() + 0.8) * scaleK);
                        //let rand:number = Math.random();
                        //if(rand > 0.6)
                        //{
                        //    cubeRange2.calc();
                        //    box.setPosition(cubeRange2.value);
                        //}
                        //else if(rand > 0.3)
                        //{
                        //    cubeRange1.calc();
                        //    box.setPosition(cubeRange1.value);
                        //}
                        //else
                        //{
                            cubeRange.calc();
                            box.setPosition(cubeRange.value);
                        //}
                        //box.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
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
                    
                    box.getPosition(pv);
                    circleFrame = new BillboardFrame();
                    circleFrame.copyMeshFrom(src_circleFrame);
                    circleFrame.initializeCircle(box.getGlobalBounds().radius,20);
                    frameScaleK = box.getGlobalBounds().radius / 100.0;
                    circleFrame.setScaleXY(frameScaleK,frameScaleK);
                    circleFrame.setPosition(pv);
                    //this.m_rscene.addEntity(circleFrame);
                    this.m_frameList.push(circleFrame);
                }

                let cullingor:SpaceCullingor = new SpaceCullingor();
                this.m_rspace.setSpaceCullingor(cullingor);
                let gapList:number[] = null;
                let gapSizeList:number[] = null;
                
                let wall0:OccBoxWall = new OccBoxWall();
                wall0.initialize(this.m_rscene,cullingor,this.m_texList);
                gapList = [2,2];
                gapSizeList = [1,2];
                //  //gapList = [];
                wall0.createXOYWall(
                    new Vector3D(-400.0, -500.0, -800.0),new Vector3D(300.0,350.0,250.0)
                    , 4,6,gapList,gapSizeList,2,-1,-1
                    );

                let wall1:OccBoxWall = new OccBoxWall();
                wall1.initialize(this.m_rscene,cullingor,this.m_texList);
                gapList = [1,1];
                gapSizeList = [2,2];
                //  //gapList = [];
                wall1.createZOYWall(
                    new Vector3D(-300.0, -500.0, -500.0),new Vector3D(250.0,350.0,300.0)
                    , 4,5,gapList,gapSizeList,2,-1,-1
                    );
                //createZOYWall
                wall0 = new OccBoxWall();
                wall0.initialize(this.m_rscene,cullingor,this.m_texList);
                gapList = [2,2];
                gapSizeList = [1,2];
                //  //gapList = [];
                wall0.createXOYWall(
                    new Vector3D(-1500.0, -500.0, 1050.0),new Vector3D(300.0,350.0,250.0)
                    , 4,6,gapList,gapSizeList,2,-1,-1
                    );
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
            this.m_flagBoo = !this.m_flagBoo;
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
            if(this.m_flagBoo)this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_rscene.updateCamera();
            
            if(this.m_profileInstance != null)
            {
                this.m_profileInstance.run();
            }
        }
    }
}
}