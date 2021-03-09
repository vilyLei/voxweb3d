
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as DisplayEntityT from "../vox/entity/DisplayEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as ImageTextureProxyT from "../vox/texture/ImageTextureProxy";

import * as MouseEventT from "../vox/event/MouseEvent";
import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as ProfileInstanceT from "../voxprofile/entity/ProfileInstance";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import ImageTextureProxy = ImageTextureProxyT.vox.texture.ImageTextureProxy;

import MouseEvent = MouseEventT.vox.event.MouseEvent;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;

export namespace demo
{
    export class DemoTexUpdate
    {
        constructor(){}

        private m_rscene:RendererScene = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_profileInstance:ProfileInstance = new ProfileInstance();
        private m_targets:DisplayEntity[] = [];

        private getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("DemoTexUpdate::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
                
                let rparam:RendererParam = new RendererParam();
                rparam.setCamPosition(800.0,800.0,800.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();
                this.m_rcontext = this.m_rscene.getRendererContext();
                this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );
                
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                this.m_profileInstance.initialize(this.m_rscene.getRenderer());
                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 200);

                this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);
                
                // add common 3d display entity
                let plane:Plane3DEntity = new Plane3DEntity();
                plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
                this.m_rscene.addEntity(plane);
                this.m_targets.push(plane);
                //this.m_disp = plane
            }
        }
        //private m_disp:DisplayEntity = null;
        private updateTex():void
        {
            let rscene:RendererScene = this.m_rscene;
            let entityList:DisplayEntity[] = this.m_targets;
            let img:HTMLImageElement = new Image();
            img.onload = function(evt:any):void
            {
                console.log("loaded img, and update tex res.");
                let tex:ImageTextureProxy = rscene.textureBlock.createImageTex2D(img.width, img.height);
                tex.setDataFromImage(img);
                entityList[0].setTextureList([tex]);
                entityList[0].updateMaterialToGpu(rscene.getRenderProxy());
            }
            //img.src = "static/assets/yanj.jpg";
            img.src = "static/assets/metal_02.jpg";
        }
        private updateTexData():void
        {
            let rscene:RendererScene = this.m_rscene;
            let entityList:DisplayEntity[] = this.m_targets;
            let img:HTMLImageElement = new Image();
            img.onload = function(evt:any):void
            {
                console.log("loaded img, and update tex res.");
                let tex:ImageTextureProxy = entityList[0].getMaterial().getTextureAt(0) as ImageTextureProxy;

                tex.setDataFromImage(img);
                let defaultUpdate:boolean = true;
                if(defaultUpdate)
                {
                    tex.updateDataToGpu();
                }
                else
                {
                    tex.updateDataToGpu(rscene.getRenderProxy(),true);
                }
            }
            //img.src = "static/assets/yanj.jpg";
            img.src = "static/assets/metal_02.jpg";
        }
        private mouseDown(evt:any):void
        {
            if(this.m_targets != null && this.m_targets.length > 0)
            {
                let testFlag:boolean = false;
                if(testFlag)
                {
                    this.updateTexData();
                }
                else
                {
                    this.updateTex();
                }
            }
        }
        run():void
        {
            let pcontext:RendererInstanceContext = this.m_rcontext;
            
            // show fps status
            this.m_statusDisp.statusInfo = "/"+pcontext.getTextureResTotal()+"/"+pcontext.getTextureAttachTotal();
            this.m_statusDisp.update();
            this.m_texLoader.run();

            //this.m_rscene.drawEntity(this.m_disp);
            this.m_rscene.run();

            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_profileInstance.run();
        }
    }
}