
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as RendererStateT from "../vox/render/RendererState";

import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureStoreT from "../vox/texture/TextureStore";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as ImageTexResLoaderT from "../vox/texture/ImageTexResLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as BaseTextureMaterialT from "./material/base/BaseTextureMaterial";
import * as TwoPngTexMaterialT from "./material/base/TwoPngTexMaterial";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import RendererState = RendererStateT.vox.render.RendererState;

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import ImageTexResLoader = ImageTexResLoaderT.vox.texture.ImageTexResLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import BaseTextureMaterial = BaseTextureMaterialT.example.material.base.BaseTextureMaterial;
import TwoPngTexMaterial = TwoPngTexMaterialT.example.material.base.TwoPngTexMaterial;

export namespace example
{
    export class TwoTexture
    {
        constructor()
        {
        }
        private m_rscene:RendererScene = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTexResLoader = new ImageTexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = true;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("TwoTexture::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                
                let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.getImageTexByUrl("static/pics/127_witheEdge.png");
                tex2.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
                //tex2.magFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
                
                let rparam:RendererParam = new RendererParam();
                rparam.setAttriAntialias(true);
                rparam.setAttriAlpha(false);
                rparam.maxWebGLVersion = 1;
                rparam.setCamPosition(500.0,500.0,500.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();
                this.m_rcontext = this.m_rscene.getRendererContext();
                
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 10);

                /*
                let towMaterial:TwoPngTexMaterial = new TwoPngTexMaterial();
                var plane:Plane3DEntity = new Plane3DEntity();
                plane.setMaterial(towMaterial);
                plane.initializeXOZ(-150.0,-200.0,300.0,400.0,[tex1,tex2]);
                //plane.setScaleXYZ(0.2,0.2,0.2);
                this.m_rscene.addEntity(plane);
                //*/
                ///*
                // add common 3d display entity
                var plane:Plane3DEntity = new Plane3DEntity();
                plane.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
                plane.initializeXOZ(-150.0,-200.0,300.0,400.0,[tex1]);
                let material:any = plane.getMaterial();
                material.setRGB3f(0.2,0.2,0.2);
                plane.setXYZ(0,-10,0);
                //plane.setScaleXYZ(0.2,0.2,0.2);
                this.m_rscene.addEntity(plane);

                // add common 3d display entity
                plane = new Plane3DEntity();
                plane.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
                plane.initializeXOZ(-150.0,-200.0,300.0,400.0,[tex2]);
                //plane.setScaleXYZ(0.2,0.2,0.2);
                this.m_rscene.addEntity(plane,1);
                //*/
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);
                let box:Box3DEntity = new Box3DEntity();
                box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                this.m_rscene.addEntity(box);

            }
        }
        run():void
        {
            // show fps status
            this.m_statusDisp.update();
            // 分帧加载
            this.m_texLoader.run();

            this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);
            // render begin
            this.m_rscene.runBegin();

            // run logic program
            this.m_rscene.update();
            this.m_rscene.run();
            // render end
            this.m_rscene.runEnd();

            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}