
import Vector3D from "../../vox/math/Vector3D";
import RendererDeviece from "../../vox/render/RendererDeviece";
import Color4 from "../../vox/material/Color4";
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../../vox/render/RenderConst";
import RendererState from "../../vox/render/RendererState";
import RendererParam from "../../vox/scene/RendererParam";
import TextureProxy from "../../vox/texture/TextureProxy";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import RendererInstanceContext from "../../vox/scene/RendererInstanceContext";
import RendererScene from "../../vox/scene/RendererScene";
import MouseEvent from "../../vox/event/MouseEvent";
import H5FontSystem from "../../vox/text/H5FontSys";

import Box3DEntity from "../../vox/entity/Box3DEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import Billboard3DEntity from "../../vox/entity/Billboard3DEntity";
import ScreenAlignPlaneEntity from "../../vox/entity/ScreenAlignPlaneEntity";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";
import CameraTrack from "../../vox/view/CameraTrack";


export namespace advancedDemo
{
    export namespace base
    {
        export class DemoRTTBlend
        {
            constructor(){}
            private m_rc:RendererScene = null;
            private m_texLoader:ImageTextureLoader;
            private m_camTrack:CameraTrack = null;
            private m_rct:RendererInstanceContext = null;
            private m_profileInstance:ProfileInstance = null;
            private m_bill0:Billboard3DEntity = null;
            private m_bill1:Billboard3DEntity = null;
            getImageTexByUrl(pns:string):TextureProxy
            {
                let tex:TextureProxy = this.m_texLoader.getImageTexByUrl("static/voxgl/assets/"+pns);
                tex.mipmapEnabled = true;
                return tex;
            }
            initialize():void
            {
                console.log("DemoRTTBlend::initialize()......");
                if(this.m_rc == null)
                {
                    H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);
                    RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
                    let tex0:TextureProxy = this.getImageTexByUrl("default.jpg");
                    let tex1:TextureProxy = this.getImageTexByUrl("broken_iron.jpg");
                    //let tex2:TextureProxy = this.getImageTexByUrl("flare_core_03.jpg");
                    let tex2:TextureProxy = this.getImageTexByUrl("cloud01.png");

                    let rparam:RendererParam = new RendererParam();
                    rparam.setMatrix4AllocateSize(8192 * 4);
                    rparam.setCamProject(45.0,0.1,5000.0);
                    rparam.setCamPosition(2500.0,2500.0,2500.0);

                    this.m_rc = new RendererScene();
                    this.m_rc.initialize(rparam,6);
                    this.m_rc.setRendererProcessParam(1,true,true);
                    this.m_rc.updateCamera();
                    this.m_rct = this.m_rc.getRendererContext();

                    this.m_rc.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                    RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                    //RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                    RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.TRANSPARENT,DepthTestMode.RENDER_ALWAYS);


                    this.m_camTrack = new CameraTrack();
                    this.m_camTrack.bindCamera(this.m_rc.getCamera());

                    let axis:Axis3DEntity = new Axis3DEntity();
                    axis.initialize(200.0);
                    this.m_rc.addEntity(axis);

                    let bill:Billboard3DEntity;

                    bill = new Billboard3DEntity();
                    bill.initialize(900.0,900.0,[tex2]);
                    bill.setRenderStateByName("ADD02");
                    bill.setRGB3f(0.3,0.0,0.0);
                    bill.setXYZ(-300.0,0.0,0.0);
                    this.m_rc.addEntity(bill,0);
                    this.m_bill0 = bill;
                    
                    bill = new Billboard3DEntity();
                    bill.initialize(900.0,900.0,[tex2]);
                    bill.setRenderStateByName("ADD02");
                    bill.setRGB3f(0.0,0.0,0.3);
                    bill.setXYZ(300.0,0.0,0.0);
                    this.m_rc.addEntity(bill,1);
                    this.m_bill1 = bill;

                    //  let size:number = 700.0;
                    //  let rttTexBox:Box3DEntity = new Box3DEntity();
                    //  rttTexBox.initialize(new Vector3D(-size,-size,-size),new Vector3D(size,size,size),[this.m_rc.textureBlock.getRTTTextureAt(3)]);
                    //  this.m_rc.addEntity(rttTexBox,3);
                    let scrP:ScreenAlignPlaneEntity = new ScreenAlignPlaneEntity();
                    //scrP.setRenderState(RendererState.BACK_NORMAL_ALWAYS_STATE);
                    scrP.setRenderStateByName("ADD02");//this.m_rc.textureBlock.g
                    scrP.initialize(-1.0,-1.0,2.0,2.0,[this.m_rc.textureBlock.getRTTTextureAt(3)]);
                    this.m_rc.addEntity(scrP,3);

                    let dstP0:ScreenAlignPlaneEntity = new ScreenAlignPlaneEntity();
                    dstP0.setRenderStateByName("ADD02");
                    dstP0.initialize(-1.0,-1.0,2.0,2.0,[this.m_rc.textureBlock.getRTTTextureAt(0)]);
                    this.m_rc.addEntity(dstP0,4);
                    let dstP1:ScreenAlignPlaneEntity = new ScreenAlignPlaneEntity();
                    dstP1.setRenderStateByName("ADD02");
                    dstP1.initialize(-1.0,-1.0,2.0,2.0,[this.m_rc.textureBlock.getRTTTextureAt(1)]);
                    this.m_rc.addEntity(dstP1,4);

                    this.m_profileInstance = new ProfileInstance();
                    this.m_profileInstance.initialize(this.m_rc.getRenderer());
                }
            }
            private m_bgColor:Color4 = new Color4(0.0, 0.3, 0.1);
            mouseDownListener(evt:any):void
            {
                this.m_bgColor.setRGB3f(0.4 * Math.random(),0.4 * Math.random(),0.4 * Math.random());
            }
            
            run():void
            {
                //this.m_rc.setClearRGBColor3f(this.m_bgColor.r,this.m_bgColor.g,this.m_bgColor.b);
                this.m_rc.runBegin();
                this.m_rc.update();

                // --------------------------------------------- rtt begin
                this.m_rc.setClearRGBAColor4f(0.0, 0.0, 0.0,0.0);
                //
                this.m_rct.synFBOSizeWithViewport();
                this.m_rc.runAt(0);
                this.m_rc.runAt(1);
                
                //  this.m_rct.setRenderToTexture(this.m_rc.textureBlock.getRTTTextureAt(3), true, false, 0);
                //  this.m_rct.useFBO(true, true, false);
                //  this.m_rc.runAt(0);
                //  this.m_rc.runAt(1);

                this.m_bill0.setXYZ(-300.0,0.0,0.0);
                this.m_bill0.update();
                this.m_bill1.setXYZ(300.0,0.0,0.0);
                this.m_bill1.update();

                //  this.m_rct.setRenderToTexture(this.m_rc.textureBlock.getRTTTextureAt(0), true, false, 0);
                //  this.m_rct.useFBO(true, true, false);
                //  this.m_rc.runAt(0);
                //  this.m_rct.setRenderToTexture(this.m_rc.textureBlock.getRTTTextureAt(1), true, false, 0);
                //  this.m_rct.useFBO(true, true, false);
                //  this.m_rc.runAt(1);
                ///*
                let total:number = 10;// + Math.round(Math.random() * 20);
                for(let i:number = 0; i < total; ++i)
                {
                    this.m_bill0.setXYZ(-300.0,0.0,i * 60.0);
                    this.m_bill0.update();
                    this.m_bill1.setXYZ(300.0,0.0,i * 60.0);
                    this.m_bill1.update();
                    this.m_rct.setRenderToTexture(this.m_rc.textureBlock.getRTTTextureAt(0), true, false, 0);
                    this.m_rct.useFBO(true, true, false);
                    this.m_rc.runAt(0);
                    this.m_rct.setRenderToTexture(this.m_rc.textureBlock.getRTTTextureAt(1), true, false, 0);
                    this.m_rct.useFBO(true, true, false);
                    this.m_rc.runAt(1);
                    
                    this.m_rct.setRenderToTexture(this.m_rc.textureBlock.getRTTTextureAt(3), true, false, 0);
                    this.m_rct.useFBO(i < 1, false, false);
                    this.m_rc.runAt(4);
                    this.m_rc.runAt(5);
                }
                //*/
                // --------------------------------------------- rtt end
                //this.m_rc.setClearRGBColor3f(this.m_bgColor.r,this.m_bgColor.g,this.m_bgColor.b);
                this.m_rc.setClearRGBAColor4f(1.0, 1.0, 1.0,1.0);
                this.m_rc.setRenderToBackBuffer();
                this.m_rc.runAt(3);
                this.m_rc.runEnd();
                this.m_camTrack.rotationOffsetAngleWorldY(-0.2);

                if(this.m_profileInstance != null)
                {
                    this.m_profileInstance.run();
                }
            }
        }
    }
}