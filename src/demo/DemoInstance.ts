
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as Stage3DT from "../vox/display/Stage3D";
import * as CameraBaseT from "../vox/view/CameraBase";

import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as ImageTexResLoaderT from "../vox/texture/ImageTexResLoader";
import * as RendererSceneT from "../vox/scene/RendererScene";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import Stage3D = Stage3DT.vox.display.Stage3D;

import CameraBase = CameraBaseT.vox.view.CameraBase;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import ImageTexResLoader = ImageTexResLoaderT.vox.texture.ImageTexResLoader;
import RendererScene = RendererSceneT.vox.scene.RendererScene;

export namespace demo
{
    export class DemoInstance
    {
        constructor()
        {
        }
        protected m_rscene:RendererScene = null;
        protected m_rcontext:RendererInstanceContext = null;
        protected m_texLoader:ImageTexResLoader = new ImageTexResLoader();
        protected m_stage3D:Stage3D = null;
        protected m_camera:CameraBase = null;
        protected m_rparam:RendererParam = null;
        protected m_processTotal:number = 3;
        getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

                this.m_rparam = new RendererParam("glcanvas");
                this.m_rparam.setCamPosition(500.0,500.0,500.0);
                this.initializeSceneParam(this.m_rparam);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(this.m_rparam,this.m_processTotal);
                this.m_rscene.updateCamera();
                this.m_rcontext = this.m_rscene.getRendererContext();
                this.m_stage3D = this.m_rscene.getStage3D();
                this.m_camera = this.m_rscene.getCamera();

                this.initializeSceneObj();
            }
        }
        protected initializeSceneParam(param:RendererParam):void
        {

        }
        protected initializeSceneObj():void
        {
            
        }
        run():void
        {
            
        }
        
        runBegin():void
        {
            // 分帧加载
            this.m_texLoader.run();
            // render begin
            this.m_rscene.runBegin();
            // run logic program
            this.m_rscene.update();

        }
        runEnd():void
        {
            
            this.m_rscene.runEnd();
        }
    }
}