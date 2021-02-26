
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as Color4T from "../vox/material/Color4";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";

import * as RendererStateT from "../vox/render/RendererState";
import * as DisplayEntityT from "../vox/entity/DisplayEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";

import * as MouseEventT from "../vox/event/MouseEvent";
import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import Color4 = Color4T.vox.material.Color4;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

import RendererState = RendererStateT.vox.render.RendererState;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;

import MouseEvent = MouseEventT.vox.event.MouseEvent;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;

export namespace demo
{
    /**
     * This example: move rendering runtime displayEntity to different renderer process
     */
    export class DemoSwapProcess
    {
        constructor()
        {
        }

        private m_rscene:RendererScene = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();

        private m_targets:DisplayEntity[] = [];
        getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("DemoSwapProcess::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
                
                let rparam:RendererParam = new RendererParam();
                //rparam.maxWebGLVersion = 1;
                rparam.setCamPosition(800.0,800.0,800.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();
                this.m_rcontext = this.m_rscene.getRendererContext();
                
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 200);

                this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );
                
                this.m_rscene.getStage3D().addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);

                let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.getImageTexByUrl("static/assets/yanj.jpg");
                let tex2:TextureProxy = this.getImageTexByUrl("static/assets/yanj.jpg");
                let tex3:TextureProxy = this.m_rscene.textureBlock.createRGBATex2D(16,16,new Color4(1.0,0.0,1.0));
                
                let plane:Plane3DEntity = new Plane3DEntity();
                plane.initializeXOZ(-200.0,-200.0,400.0,400.0,[tex0]);
                this.m_rscene.addEntity(plane,1);
                
                plane = new Plane3DEntity();
                plane.initializeXOZ(-200.0,-200.0,400.0,400.0,[tex1]);
                plane.setXYZ(80,-1,80);
                this.m_rscene.addEntity(plane, 0);
                plane.setRenderState(RendererState.BACK_ADD_ALWAYS_STATE);
                this.m_targets.push(plane);
                
            }
        }
        private m_isChanged:boolean = true;
        private mouseDown(evt:any):void
        {
            if(this.m_targets != null && this.m_targets.length > 0)
            {
                // move rendering runtime displayEntity to different renderer process
                if(this.m_isChanged)
                {
                    this.m_rscene.moveEntityTo(this.m_targets[0],2);
                }
                else
                {
                    this.m_rscene.moveEntityTo(this.m_targets[0],0);
                }
                this.m_isChanged = !this.m_isChanged;
            }
        }
        run():void
        {
            let pcontext:RendererInstanceContext = this.m_rcontext;
            
            // show fps status
            this.m_statusDisp.statusInfo = "/"+pcontext.getTextureResTotal()+"/"+pcontext.getTextureAttachTotal();
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