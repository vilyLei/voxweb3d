
import Vector3D from "../../vox/math/Vector3D";
import { CubeRandomRange } from "../../vox/utils/RandomRange";
import RendererDeviece from "../../vox/render/RendererDeviece";
import RendererParam from "../../vox/scene/RendererParam";
import TextureProxy from "../../vox/texture/TextureProxy";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import RendererScene from "../../vox/scene/RendererScene";
import MouseEvent from "../../vox/event/MouseEvent";
import Stage3D from "../../vox/display/Stage3D";
import H5FontSystem from "../../vox/text/H5FontSys";

import DisplayEntity from "../../vox/entity/DisplayEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import BillboardFrame from "../../vox/entity/BillboardFrame";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";
import CameraTrack from "../../vox/view/CameraTrack";
import IRendererSpace from "../../vox/scene/IRendererSpace";
import SpherePOV from '../../voxocc/occlusion/SpherePOV';
import SpaceCullingMask from "../../vox/space/SpaceCullingMask";
import SpaceCullingor from '../../vox/scene/SpaceCullingor';

//import SpherePOV = SpherePOVT.voxocc.occlusion.SpherePOV;
//import SpaceCullingor = SpaceCullingorT.vox.scene.SpaceCullingor;

export namespace voxocc
{
export namespace demo
{
    export class DemoSphereOcclusion
    {
        constructor()
        {
        }
        
        private m_rscene:RendererScene = null;
        private m_texLoader:ImageTextureLoader;
        private m_camTrack:CameraTrack = null;
        private m_rspace:IRendererSpace = null;
        
        private m_profileInstance:ProfileInstance = new ProfileInstance();
        private m_sphOccObj:SpherePOV = new SpherePOV();
        //private m_sphOccObj:SphereGapPOV = new SphereGapPOV();
        private m_dispList:DisplayEntity[] = [];
        private m_frameList:BillboardFrame[] = [];
        initialize():void
        {
            console.log("DemoSphereOcclusion::initialize()......");
            if(this.m_rscene == null)
            {
                H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/assets/guangyun_H_0007.png");
                let tex3:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/flare_core_01.jpg");
                let tex4:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/flare_core_02.jpg");
                let tex5:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/a_02_c.jpg");
                tex0.mipmapEnabled = true;
                tex1.mipmapEnabled = true;
                tex2.mipmapEnabled = true;
                tex3.mipmapEnabled = true;
                tex4.mipmapEnabled = true;
                tex5.mipmapEnabled = true;
                
                let rparam:RendererParam = new RendererParam();
                rparam.setMatrix4AllocateSize(8192 * 4);
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.setRendererProcessParam(1,true,true);
                this.m_rspace = this.m_rscene.getSpace();
                this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
                                
                let stage3D:Stage3D = this.m_rscene.getStage3D() as Stage3D;
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseUpListener);
                stage3D.addEventListener(MouseEvent.MOUSE_WHEEL,this,this.mouseWheeelListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());
                //
                //  RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.BLEND);
                //  RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.ALWAYS);
                this.m_rscene.updateCamera();
                let i:number = 0;
                let total:number = 20;
                this.m_profileInstance = new ProfileInstance();
                this.m_profileInstance.initialize(this.m_rscene.getRenderer());

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);

                let cullingor:SpaceCullingor = new SpaceCullingor();
                cullingor.addPOVObject(this.m_sphOccObj);
                this.m_rspace.setSpaceCullingor(cullingor);

                let occPv:Vector3D = new Vector3D(0.0,0.0,0.0);
                this.m_sphOccObj.setCamPosition( this.m_rscene.getCamera().getPosition() );
                this.m_sphOccObj.setPosition(occPv);
                this.m_sphOccObj.updateOccData();
                this.m_sphOccObj.occRadius = 300.0;

                let circleOccFrame:BillboardFrame = new BillboardFrame();
                //circleOccFrame.color.setRGB3f(1.0,1.0,1.0);
                circleOccFrame.initializeCircle(this.m_sphOccObj.occRadius,20);
                circleOccFrame.setPosition(occPv);
                this.m_rscene.addEntity(circleOccFrame);

                
                let cubeRange:CubeRandomRange = new CubeRandomRange();
                cubeRange.min.setXYZ(-1500.0,-1500.0,-1500.0);
                cubeRange.max.setXYZ(1500.0,1500.0,1500.0);
                cubeRange.initialize();

                let pv:Vector3D = new Vector3D();
                let circleFrame:BillboardFrame = null;
                let srcBox:Box3DEntity = new Box3DEntity();
                srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                //srcBox = null;
                let scaleK:number = 0.3;
                
                let minV:Vector3D = new Vector3D(-100.0,-100.0,-100.0);
                let maxV:Vector3D = new Vector3D(100.0,100.0,100.0);
                let texList:TextureProxy[] = [tex1];
                let box:Box3DEntity = null;
                for(i = 0; i < total; ++i)
                {
                    box = new Box3DEntity();
                    if(srcBox != null)box.setMesh(srcBox.getMesh());
                    box.initialize(minV, maxV, texList);
                    if(total > 1)
                    {
                        box.setScaleXYZ(scaleK * (Math.random() + 0.8),scaleK * (Math.random() + 0.8),scaleK * (Math.random() + 0.8));
                        cubeRange.calc();
                        box.setPosition(cubeRange.value);
                        //box.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                    }
                    else
                    {
                        box.setXYZ(0.0,0.0,120.0);
                    }

                    box.spaceCullMask |= SpaceCullingMask.POV;
                    this.m_rscene.addEntity(box);
                    //this.m_sphOcclusion.addEntity(box);
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
        pv:Vector3D = new Vector3D();
        delayTime:number = 10;
        run():void
        {
            //console.log("##-- begin");

            this.m_rscene.setClearRGBColor3f(0.0, 0.1, 0.2);
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