
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as Color4T from "../vox/material/Color4";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RendererStateT from "../vox/render/RendererState";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as H5FontSysT from "../vox/text/H5FontSys";

import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as Sphere3DEntityT from "../vox/entity/Sphere3DEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as ProfileInstanceT from "../voxprofile/entity/ProfileInstance";
import * as CameraTrackT from "../vox/view/CameraTrack";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import Color4 = Color4T.vox.material.Color4;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import H5FontSystem = H5FontSysT.vox.text.H5FontSystem;

import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;


export namespace demo
{
    export class DemoScene
    {
        constructor()
        {
        }
        
        private m_rscene:RendererScene = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        
        private m_profileInstance:ProfileInstance = null;
        getImageTexByUrl(purl:string):TextureProxy
        {
            let tex:TextureProxy = this.m_texLoader.getTexAndLoadImg(purl);
            tex.mipmapEnabled = true;
            return tex;
        }
        initialize():void
        {
            console.log("DemoScene::initialize()......");
            if(this.m_rscene == null)
            {
                H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);
                RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
                
                let rparam:RendererParam = new RendererParam();
                rparam.setMatrix4AllocateSize(8192 * 4);
                rparam.setCamProject(45.0,10.1,5000.0);
                rparam.setCamPosition(2500.0,2500.0,2500.0);
                
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.setRendererProcessParam(1,true,true);
                this.m_rscene.updateCamera();

                this.m_rscene.getStage3D().addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(200.0);
                this.m_rscene.addEntity(axis);

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
                    this.m_rscene.addEntity(plane);
                    plane.mouseEnabled = true;
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
                    this.m_rscene.addEntity(box);

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
                    this.m_rscene.addEntity(sph);
                }
            }
        }
        private m_bgColor:Color4 = new Color4(0.0, 0.3, 0.1);
        mouseDownListener(evt:any):void
        {
            this.m_bgColor.setRGB3f(0.4 * Math.random(),0.4 * Math.random(),0.4 * Math.random());
        }
        run():void
        {
            this.m_rscene.setClearColor(this.m_bgColor);
            this.m_rscene.runBegin();

            this.m_rscene.update();
            this.m_rscene.run();

            this.m_rscene.runEnd();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);;
            
            if(this.m_profileInstance != null)
            {
                this.m_profileInstance.run();
            }
        }
    }
}