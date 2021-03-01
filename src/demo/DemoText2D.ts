
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TextureProxyT from "../vox/texture/TextureProxy";

import * as MouseEventT from "../vox/event/MouseEvent";
import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as H5FontSysT from "../vox/text/H5FontSys";
import * as Text2DEntityT from "../vox2d/text/Text2DEntity";
import * as ProfileInstanceT from "../voxprofile/entity/ProfileInstance";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;

import MouseEvent = MouseEventT.vox.event.MouseEvent;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import H5FontSystem = H5FontSysT.vox.text.H5FontSystem;
import Text2DEntity = Text2DEntityT.vox2d.text.Text2DEntity;
import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;

export namespace demo
{
    export class DemoText2D
    {
        constructor(){}

        private m_rscene:RendererScene = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();

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
            console.log("DemoText2D::initialize()......");
            if(this.m_rcontext == null)
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
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

                H5FontSystem.GetInstance().setRenderProxy(this.m_rscene.getRenderProxy());
                H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,true,true);

                if(this.m_profileInstance != null)this.m_profileInstance.initialize(this.m_rscene.getRenderer());
                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 200);

                this.m_rscene.getStage3D().addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);

                let text2D:Text2DEntity = null;
                text2D = new Text2DEntity();
                text2D.initialize("2d text test");
                text2D.setXY(200.0,300.0);
                this.m_rscene.addEntity(text2D);
                
            }
        }
        private mouseDown(evt:any):void
        {
        }
        run():void
        {
            let pcontext:RendererInstanceContext = this.m_rcontext;
            
            // show fps status
            this.m_statusDisp.statusInfo = "/"+pcontext.getTextureResTotal()+"/"+pcontext.getTextureAttachTotal();
            this.m_statusDisp.update();
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

            if(this.m_profileInstance != null)
            {
                this.m_profileInstance.run();
            }
        }
    }
}