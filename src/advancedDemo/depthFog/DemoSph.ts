
import * as Vector3DT from "../../vox/geom/Vector3";
import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as Color4T from "../../vox/material/Color4";
import * as RenderConstT from "../../vox/render/RenderConst";
import * as RendererStateT from "../../vox/render/RendererState";
import * as RendererParamT from "../../vox/scene/RendererParam";
import * as TextureConstT from "../../vox/texture/TextureConst";
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
import * as ProfileInstanceT from "../../voxprofile/entity/ProfileInstance";
import * as CameraTrackT from "../../vox/view/CameraTrack";
import * as GetSphDepthMaterialT from "../../advancedDemo/depthFog/material/GetSphDepthMaterial";
import * as FogSphShowMaterialT from "../../advancedDemo/depthFog/material/FogSphShowMaterial";
import * as BoxSpaceMotionerT from "../../voxmotion/primtive/BoxSpaceMotioner";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import Color4 = Color4T.vox.material.Color4;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
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
import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import GetSphDepthMaterial = GetSphDepthMaterialT.advancedDemo.depthFog.material.GetSphDepthMaterial;
import FogSphShowMaterial = FogSphShowMaterialT.advancedDemo.depthFog.material.FogSphShowMaterial;
import BoxSpaceMotioner = BoxSpaceMotionerT.voxmotion.primitive.BoxSpaceMotioner;

export namespace advancedDemo
{
    export namespace depthFog
    {
        export class DemoSph
        {
            constructor()
            {
            }

            private m_rc:RendererScene = null;
            private m_rct:RendererInstanceContext = null;
            private m_texLoader:TexResLoader = new TexResLoader();
            private m_camTrack:CameraTrack = null;
            private m_profileInstance:ProfileInstance = null;
            getImageTexByUrl(pns:string):TextureProxy
            {
                let tex:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/voxgl/assets/"+pns);
                tex.mipmapEnabled = true;
                return tex;
            }

            private m_dstPlane:Plane3DEntity = null;
            private m_texs:TextureProxy[] = [null,null,null,null];
            private getTextureAt(index:number):TextureProxy
	        {
                if(this.m_texs[index] != null)
                {
                    return this.m_texs[index];
                }
                switch(index)
                {
                    case 0:
                        this.m_texs[index] = TextureStore.CreateTex2D(this.m_rct.getViewportWidth(), this.m_rct.getViewportHeight());
                        this.m_texs[index].internalFormat = TextureFormat.RGBA16F;
                        this.m_texs[index].srcFormat = TextureFormat.RGBA;
                        this.m_texs[index].dataType = TextureDataType.FLOAT;
                        this.m_texs[index].magFilter = TextureConst.NEAREST;
                        return this.m_texs[index];
                    break;

                    case 1:
                        
                        this.m_texs[index] = TextureStore.CreateTex2D(this.m_rct.getViewportWidth(), this.m_rct.getViewportHeight());
                        this.m_texs[index].internalFormat = TextureFormat.RGBA;
                        this.m_texs[index].srcFormat = TextureFormat.RGBA;
                        this.m_texs[index].magFilter = TextureConst.NEAREST;
                        return this.m_texs[index];
                        //  this.m_texs[index] = TextureStore.CreateTex2D(this.m_rct.getViewportWidth(), this.m_rct.getViewportHeight());
                        //  this.m_texs[index].internalFormat = TextureFormat.RGBA16F;
                        //  this.m_texs[index].srcFormat = TextureFormat.RGBA;
                        //  this.m_texs[index].dataType = TextureDataType.FLOAT;
                        //  this.m_texs[index].magFilter = TextureConst.NEAREST;
                        //  return this.m_texs[index];
                    break;

                    case 2:
                        this.m_texs[index] = TextureStore.CreateTex2D(this.m_rct.getViewportWidth(), this.m_rct.getViewportHeight());
                        //  this.m_texs[index].internalFormat = TextureFormat.RGBA;
                        //  this.m_texs[index].srcFormat = TextureFormat.RGBA;
                        //  this.m_texs[index].magFilter = TextureConst.NEAREST;
                        this.m_texs[index].internalFormat = TextureFormat.RGBA16F;
                        this.m_texs[index].srcFormat = TextureFormat.RGBA;
                        this.m_texs[index].dataType = TextureDataType.FLOAT;
                        this.m_texs[index].magFilter = TextureConst.NEAREST;
                        return this.m_texs[index];
                    break;
                    case 3:
                        this.m_texs[index] = TextureStore.CreateTex2D(this.m_rct.getViewportWidth(), this.m_rct.getViewportHeight());
                        this.m_texs[index].internalFormat = TextureFormat.RGBA;
                        this.m_texs[index].srcFormat = TextureFormat.RGBA;
                        this.m_texs[index].magFilter = TextureConst.NEAREST;
                        return this.m_texs[index];
                    break;
                    default:
                        break;
                }
                return null;
            }
            private m_entityRSCIndex:number = 0;
            private m_entityBGIndex:number = 1;
            private m_dstPlaneIndex:number = 2;
            private m_getDepthM:GetSphDepthMaterial = new GetSphDepthMaterial();
            private m_motioners:BoxSpaceMotioner[] = [];
            private runmotion():void
            {
                let i:number = 0;
                let len:number = this.m_motioners.length;
                for(; i < len; ++i)
                {
                    this.m_motioners[i].update();
                }
            }
            initialize():void
            {
                // 基于球形区域的模拟体积雾计算
                console.log("DemoSph::initialize()......");
                if(this.m_rc == null)
                {
                    H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);
                    RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                    let tex0:TextureProxy = this.getImageTexByUrl("moss_04.jpg");
                    let tex1:TextureProxy = this.getImageTexByUrl("metal_08.jpg");

                    let rparam:RendererParam = new RendererParam();
                    rparam.setMatrix4AllocateSize(8192 * 4);
                    rparam.setCamProject(45.0,0.1,5000.0);
                    rparam.setCamPosition(2500.0,2500.0,2500.0);

                    this.m_rc = new RendererScene();
                    this.m_rc.initialize(rparam,5);
                    this.m_rc.setRendererProcessParam(1,true,true);
                    this.m_rc.updateCamera();
                    this.m_rct = this.m_rc.getRendererContext();

                    this.m_rc.getStage3D().addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                    RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                    RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);


                    this.m_camTrack = new CameraTrack();
                    this.m_camTrack.bindCamera(this.m_rc.getCamera());

                    let axis:Axis3DEntity = new Axis3DEntity();
                    axis.initialize(200.0);
                    this.m_rc.addEntity(axis, this.m_entityRSCIndex);

                    let i:number = 0;
                    let total:number = 0;
                    let scaleK:number = 1.0;
                    let motioner:BoxSpaceMotioner = null;
                    let srcBox:Box3DEntity = new Box3DEntity();
                    srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex0]);
                    total = 5;
                    let box:Box3DEntity = null;
                    for(i = 0; i < total; ++i)
                    {
                        box = new Box3DEntity();
                        if(srcBox != null)box.setMesh(srcBox.getMesh());
                        box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex0]);
                        if(total > 1)
                        {
                            box.setScaleXYZ((Math.random() + 0.8) * scaleK,(Math.random() + 0.8) * scaleK,(Math.random() + 0.8) * scaleK);
                            box.setRotationXYZ(Math.random() * 500.0,Math.random() * 500.0,Math.random() * 500.0);
                            box.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                        }
                        else
                        {
                            box.setXYZ(-150.0,0.0,0.0);
                        }
                        this.m_rc.addEntity(box, this.m_entityRSCIndex);
                        motioner = new BoxSpaceMotioner();
                        motioner.setTarget(box);
                        this.m_motioners.push(motioner);
                    }
                    let sph:Sphere3DEntity = null;
                    total = 5;
                    for(i = 0; i < total; ++i)
                    {
                        sph = new Sphere3DEntity();
                        sph.name = "sphere_"+i;
                        sph.initialize(100,20,20,[tex0]);
                        if(total > 1)
                        {
                            sph.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                        }
                        else
                        {
                            sph.setXYZ(150.0,0.0,0.0);
                        }
                        this.m_rc.addEntity(sph,this.m_entityRSCIndex);
                        motioner = new BoxSpaceMotioner();
                        motioner.setTarget(sph);
                        this.m_motioners.push(motioner);
                    }
                    
                    let size:number = 2300.0;
                    let bgBox:Box3DEntity = new Box3DEntity();
                    bgBox.showBackFace();
                    bgBox.initialize(new Vector3D(-size,-size,-size),new Vector3D(size,size,size),[tex1]);
                    this.m_rc.addEntity(bgBox,this.m_entityBGIndex);

                    let fogShowM:FogSphShowMaterial = new FogSphShowMaterial();
                    this.m_dstPlane = new Plane3DEntity();
                    this.m_dstPlane.setMaterial(fogShowM);
                    this.m_dstPlane.initialize(-1.0,-1.0,2.0,2.0,[this.getTextureAt(0),this.getTextureAt(1)]);
                    this.m_rc.addEntity(this.m_dstPlane,this.m_dstPlaneIndex);
                }
            }
            private m_bgColor:Color4 = new Color4(0.0, 0.0, 0.0,1.0);
            mouseDownListener(evt:any):void
            {
                //this.m_bgColor.setRGB3f(0.4 * Math.random(),0.4 * Math.random(),0.4 * Math.random());
            }
            
            run():void
            {
                // logic run
                this.runmotion();
                //this.m_rc.setClearRGBColor3f(this.m_bgColor.r,this.m_bgColor.g,this.m_bgColor.b);
                this.m_rc.runBegin();

                this.m_rc.update();

                //this.m_rct.setClearDepth(1.0);
                this.m_rct.synFBOSizeWithViewport();
                // 绘制所有受雾效果影响的场景可渲染对象,记录对应的坐标和深度信息
                this.m_rc.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);
                this.m_rct.setRenderToTexture(this.getTextureAt(0), true, false, 0);
                this.m_rct.useFBO(true, true, false);
                this.m_rct.useGlobalMaterial(this.m_getDepthM);
                //this.m_rct.useGlobalRenderState();
                this.m_rc.runAt(this.m_entityRSCIndex);
                // 正常绘制场景中大背景
                this.m_rc.runAt(this.m_entityBGIndex);

                // 正常绘制所有的场景中的物体的color
                this.m_rct.setRenderToTexture(this.getTextureAt(1), true, false, 0);
                this.m_rct.useFBO(true, true, false);
                this.m_rct.unlockMaterial();
                this.m_rct.unlockRenderState();
                this.m_rc.runAt(this.m_entityRSCIndex);
                // 正常绘制场景中大背景
                this.m_rc.runAt(this.m_entityBGIndex);

                this.m_rc.setClearRGBAColor4f(this.m_bgColor.r,this.m_bgColor.g,this.m_bgColor.b,1.0);
                this.m_rc.setRenderToBackBuffer();
                // 绘制最终输出图像的平面
                this.m_rc.runAt(this.m_dstPlaneIndex);
                //
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