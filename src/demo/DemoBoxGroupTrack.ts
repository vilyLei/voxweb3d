
import * as Vector3DT from "../vox/math/Vector3D";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";

import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Line3DEntityT from "../vox/entity/Line3DEntity";
import * as DashedLine3DEntityT from "../vox/entity/DashedLine3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as BoxGropTrackT from "../voxanimate/primitive/BoxGropTrack";

import Vector3D = Vector3DT.vox.math.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import DashedLine3DEntity = DashedLine3DEntityT.vox.entity.DashedLine3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import BoxGropTrack = BoxGropTrackT.voxanimate.primtive.BoxGropTrack;

export namespace demo
{
    export class DemoBoxGroupTrack
    {
        constructor()
        {
        }
        private m_rscene:RendererScene = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_boxTrack:BoxGropTrack = new BoxGropTrack();
        private getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
                
        
        initialize():void
        {
            console.log("DemoBoxGroupTrack::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

                let rparam:RendererParam = new RendererParam();
                rparam.maxWebGLVersion = 1;
                rparam.setCamPosition(500.0,500.0,500.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();
                
                this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().stageWidth - 10);

                let tex0:TextureProxy = this.getImageTexByUrl("static/assets/metal_02.jpg");
                let tex1:TextureProxy = this.getImageTexByUrl("static/assets/green.jpg");
                
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(310);
                this.m_rscene.addEntity(axis);
                this.m_boxTrack.setTrackScaleXYZ(0.2,0.2,0.2);
                this.m_boxTrack.initialize(this.m_rscene.textureBlock,0.5,[tex0]);
                //this.m_boxTrack.setScale(2.2);
                this.m_rscene.addEntity(this.m_boxTrack.animator);
                
                
                let curveLine:DashedLine3DEntity = new DashedLine3DEntity();
                curveLine.initializeByPosition(this.m_boxTrack.getTrackPosList());
                this.m_rscene.addEntity(curveLine);
            }
        }
        run():void
        {
            this.m_boxTrack.moveDistanceOffset(-1.0);

            this.m_texLoader.run();
            
            // show fps status
            this.m_statusDisp.update();
            // 分帧加载
            this.m_texLoader.run();
            
            this.m_rscene.run();
            
            // render end
            this.m_rscene.runEnd();

            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}