
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
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";
import CameraTrack from "../../vox/view/CameraTrack";

//import Vector3D = Vector3DT.vox.math.Vector3D;
//import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
//import Color4 = Color4T.vox.material.Color4;
//import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
//import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
//import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
//import RendererState = RendererStateT.vox.render.RendererState;
//import RendererParam = RendererParamT.vox.scene.RendererParam;
//import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
//import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
//import RendererScene = RendererSceneT.vox.scene.RendererScene;
//import MouseEvent = MouseEventT.vox.event.MouseEvent;
//import H5FontSystem = H5FontSysT.vox.text.H5FontSystem;

//import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
//import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
//import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
//import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
//import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
//import CameraTrack = CameraTrackT.vox.view.CameraTrack;

export namespace advancedDemo
{
    export namespace base
    {
        export class DemoRTT
        {
            constructor()
            {
            }

            private m_rc:RendererScene = null;
            private m_texLoader:ImageTextureLoader = null;
            private m_camTrack:CameraTrack = null;
            private m_rct:RendererInstanceContext = null;
            private m_profileInstance:ProfileInstance = null;
            getImageTexByUrl(purl:string):TextureProxy
            {
                let tex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
                tex.mipmapEnabled = true;
                return tex;
            }
            initialize():void
            {
                console.log("DemoRTT::initialize()......");
                if(this.m_rc == null)
                {
                    H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);
                    RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
                    let tex0:TextureProxy = this.getImageTexByUrl("default.jpg");
                    let tex1:TextureProxy = this.getImageTexByUrl("broken_iron.jpg");

                    let rparam:RendererParam = new RendererParam();
                    rparam.setMatrix4AllocateSize(8192 * 4);
                    rparam.setCamProject(45.0,0.1,5000.0);
                    rparam.setCamPosition(2500.0,2500.0,2500.0);

                    this.m_rc = new RendererScene();
                    this.m_rc.initialize(rparam,3);
                    this.m_rc.setRendererProcessParam(1,true,true);
                    this.m_rc.updateCamera();
                    this.m_rct = this.m_rc.getRendererContext();

                    this.m_texLoader = new ImageTextureLoader( this.m_rc.textureBlock );

                    this.m_rc.getStage3D().addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener,true,true);
                    RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                    RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);


                    this.m_camTrack = new CameraTrack();
                    this.m_camTrack.bindCamera(this.m_rc.getCamera());

                    let axis:Axis3DEntity = new Axis3DEntity();
                    axis.initialize(200.0);
                    this.m_rc.addEntity(axis);

                    let i:number = 0;
                    let total:number = 0;
                    let scaleK:number = 1.0;
                    let plane:Plane3DEntity = null;
                    for(i = 0; i < 5; ++i)
                    {
                        plane = new Plane3DEntity();
                        plane.name = "plane_"+i;
                        plane.showDoubleFace();
                        plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                        plane.setXYZ(Math.random() * 3000.0 - 1500.0,Math.random() * 3000.0 - 1500.0,Math.random() * 2000.0 - 1000.0);
                        this.m_rc.addEntity(plane);
                    }

                    let srcBox:Box3DEntity = new Box3DEntity();
                    srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                    total = 5;
                    let box:Box3DEntity = null;
                    for(i = 0; i < total; ++i)
                    {
                        box = new Box3DEntity();
                        box.name = "box_"+i;
                        if(srcBox != null)box.setMesh(srcBox.getMesh());
                        box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
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
                        this.m_rc.addEntity(box);

                    }
                    let sph:Sphere3DEntity = null;
                    total = 5;
                    for(i = 0; i < total; ++i)
                    {
                        sph = new Sphere3DEntity();
                        sph.name = "sphere_"+i;
                        sph.initialize(100,20,20,[tex1]);
                        if(total > 1)
                        {
                            sph.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                        }
                        else
                        {
                            sph.setXYZ(150.0,0.0,0.0);
                        }
                        this.m_rc.addEntity(sph);
                    }
                    let rttTexBox:Box3DEntity = new Box3DEntity();
                    rttTexBox.initialize(new Vector3D(-500.0,-500.0,-500.0),new Vector3D(500.0,500.0,500.0),[this.m_rc.textureBlock.getRTTTextureAt(0)]);
                    this.m_rc.addEntity(rttTexBox,1);

                    
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
                //this.m_rct
                this.m_rc.update();

                // --------------------------------------------- rtt begin
                this.m_rc.setClearRGBColor3f(0.1, 0.0, 0.1);
                this.m_rct.synFBOSizeWithViewport();
                this.m_rct.setRenderToTexture(this.m_rc.textureBlock.getRTTTextureAt(0), false, false, 0);
                this.m_rct.useFBO(true, false, false);
                this.m_rc.runAt(0);
                // --------------------------------------------- rtt end
                this.m_rc.setClearRGBColor3f(this.m_bgColor.r,this.m_bgColor.g,this.m_bgColor.b);
                this.m_rc.setRenderToBackBuffer();
                this.m_rc.runAt(1);


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