
import * as Vector3DT from "../..//vox/math/Vector3D";
import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as Color4T from "../../vox/material/Color4";
import * as RenderConstT from "../../vox/render/RenderConst";
import * as RendererStateT from "../../vox/render/RendererState";
import * as RendererParamT from "../../vox/scene/RendererParam";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as TextureStoreT from "../../vox/texture/TextureStore";
import * as TexResLoaderT from "../../vox/texture/TexResLoader";
import * as RendererInstanceContextT from "../../vox/scene/RendererInstanceContext";
import * as RendererSceneT from "../../vox/scene/RendererScene";
import * as MouseEventT from "../../vox/event/MouseEvent";
import * as H5FontSysT from "../../vox/text/H5FontSys";

import * as Box3DEntityT from "../../vox/entity/Box3DEntity";
import * as Sphere3DEntityT from "../../vox/entity/Sphere3DEntity";
import * as Plane3DEntityT from "../../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../../vox/entity/Axis3DEntity";
import * as Billboard3DEntityT from "../../vox/entity/Billboard3DEntity";
import * as ScreenAlignPlaneEntityT from "../../vox/entity/ScreenAlignPlaneEntity";
import * as ProfileInstanceT from "../../voxprofile/entity/ProfileInstance";
import * as CameraTrackT from "../../vox/view/CameraTrack";

import Vector3D = Vector3DT.vox.math.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import Color4 = Color4T.vox.material.Color4;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import H5FontSystem = H5FontSysT.vox.text.H5FontSystem;

import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Billboard3DEntity = Billboard3DEntityT.vox.entity.Billboard3DEntity;
import ScreenAlignPlaneEntity = ScreenAlignPlaneEntityT.vox.entity.ScreenAlignPlaneEntity;
import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;

export namespace advancedDemo
{
    export namespace base
    {
        export class DemoRTTBlend
        {
            constructor()
            {
            }
            private m_rc:RendererScene = null;
            private m_texLoader:TexResLoader = new TexResLoader();
            private m_camTrack:CameraTrack = null;
            private m_rct:RendererInstanceContext = null;
            private m_profileInstance:ProfileInstance = null;
            private m_bill0:Billboard3DEntity = null;
            private m_bill1:Billboard3DEntity = null;
            getImageTexByUrl(pns:string):TextureProxy
            {
                let tex:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/voxgl/assets/"+pns);
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
                    //  rttTexBox.initialize(new Vector3D(-size,-size,-size),new Vector3D(size,size,size),[TextureStore.GetRTTTextureAt(3)]);
                    //  this.m_rc.addEntity(rttTexBox,3);
                    let scrP:ScreenAlignPlaneEntity = new ScreenAlignPlaneEntity();
                    //scrP.setRenderState(RendererState.BACK_NORMAL_ALWAYS_STATE);
                    scrP.setRenderStateByName("ADD02");
                    scrP.initialize(-1.0,-1.0,2.0,2.0,[TextureStore.GetRTTTextureAt(3)]);
                    this.m_rc.addEntity(scrP,3);

                    let dstP0:ScreenAlignPlaneEntity = new ScreenAlignPlaneEntity();
                    dstP0.setRenderStateByName("ADD02");
                    dstP0.initialize(-1.0,-1.0,2.0,2.0,[TextureStore.GetRTTTextureAt(0)]);
                    this.m_rc.addEntity(dstP0,4);
                    let dstP1:ScreenAlignPlaneEntity = new ScreenAlignPlaneEntity();
                    dstP1.setRenderStateByName("ADD02");
                    dstP1.initialize(-1.0,-1.0,2.0,2.0,[TextureStore.GetRTTTextureAt(1)]);
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
                
                //  this.m_rct.setRenderToTexture(TextureStore.GetRTTTextureAt(3), true, false, 0);
                //  this.m_rct.useFBO(true, true, false);
                //  this.m_rc.runAt(0);
                //  this.m_rc.runAt(1);

                this.m_bill0.setXYZ(-300.0,0.0,0.0);
                this.m_bill0.update();
                this.m_bill1.setXYZ(300.0,0.0,0.0);
                this.m_bill1.update();

                //  this.m_rct.setRenderToTexture(TextureStore.GetRTTTextureAt(0), true, false, 0);
                //  this.m_rct.useFBO(true, true, false);
                //  this.m_rc.runAt(0);
                //  this.m_rct.setRenderToTexture(TextureStore.GetRTTTextureAt(1), true, false, 0);
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
                    this.m_rct.setRenderToTexture(TextureStore.GetRTTTextureAt(0), true, false, 0);
                    this.m_rct.useFBO(true, true, false);
                    this.m_rc.runAt(0);
                    this.m_rct.setRenderToTexture(TextureStore.GetRTTTextureAt(1), true, false, 0);
                    this.m_rct.useFBO(true, true, false);
                    this.m_rc.runAt(1);
                    
                    this.m_rct.setRenderToTexture(TextureStore.GetRTTTextureAt(3), true, false, 0);
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