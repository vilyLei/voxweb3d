
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import Color4 from "../vox/material/Color4";
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import {TextureConst,TextureFormat,TextureDataType,TextureTarget} from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import MouseEvent from "../vox/event/MouseEvent";
import H5FontSystem from "../vox/text/H5FontSys";

import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import CameraTrack from "../vox/view/CameraTrack";

//import Vector3D = Vector3DT.vox.math.Vector3D;
//import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
//import Color4 = Color4T.vox.material.Color4;
//import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
//import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
//import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
//import RendererState = RendererStateT.vox.render.RendererState;
//import RendererParam = RendererParamT.vox.scene.RendererParam;
//import TextureConst = TextureConstT.vox.texture.TextureConst;
//import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
//import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
//import RendererScene = RendererSceneT.vox.scene.RendererScene;
//import MouseEvent = MouseEventT.vox.event.MouseEvent;
//import H5FontSystem = H5FontSysT.vox.text.H5FontSystem;

//import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
//import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
//import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
//import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
//import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
//import CameraTrack = CameraTrackT.vox.view.CameraTrack;


export namespace demo
{
    export class DemoScene
    {
        constructor(){}
        
        private m_rscene:RendererScene = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        
        private m_profileInstance:ProfileInstance = new ProfileInstance();
        private getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("DemoScene::initialize()......");
            if(this.m_rscene == null)
            {
                H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);
                RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                let rparam:RendererParam = new RendererParam();
                rparam.setMatrix4AllocateSize(8192 * 4);
                rparam.setCamProject(45.0,10.1,5000.0);
                rparam.setCamPosition(2500.0,2500.0,2500.0);
                
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.setRendererProcessParam(1,true,true);
                this.m_rscene.updateCamera();

                this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );
                this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                
                this.m_profileInstance.initialize(this.m_rscene.getRenderer());
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());
                
                let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
                
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

            this.m_rscene.run();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);;
            
            if(this.m_profileInstance != null)
            {
                this.m_profileInstance.run();
            }
        }
    }
}