
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
////import * as TextureStoreT from "../vox/texture/TextureStore";
import {TextureConst,TextureFormat,TextureDataType,TextureTarget} from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import * as VSTextureMaterialT from "./material/VSTextureMaterial";

//import Vector3D = Vector3DT.vox.math.Vector3D;
//import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
//import RendererParam = RendererParamT.vox.scene.RendererParam;
//import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
//import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

//import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
//import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
//import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
//import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
//import TextureStore = TextureStoreT.vox.texture.TextureStore;
//import TextureConst = TextureConstT.vox.texture.TextureConst;
//import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
//import CameraTrack = CameraTrackT.vox.view.CameraTrack;
//import RendererScene = RendererSceneT.vox.scene.RendererScene;
import VSTextureMaterial = VSTextureMaterialT.demo.material.VSTextureMaterial;

export namespace demo
{
    export class DemoVSTexture
    {
        constructor()
        {
        }
        private m_rscene:RendererScene = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        
        private getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("DemoVSTexture::initialize()......");
            if(this.m_rcontext == null)
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
                this.m_rcontext = this.m_rscene.getRendererContext();
                
                this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().stageWidth - 10);

                
                let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
                //let tex1:TextureProxy = this.getImageTexByUrl("static/assets/caustics_02.jpg");
                //let tex1:TextureProxy = this.getImageTexByUrl("static/assets/green.jpg");
                let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
                
                
                let material:VSTextureMaterial = new VSTextureMaterial();
                // add common 3d display entity
                var plane:Plane3DEntity = new Plane3DEntity();
                plane.setMaterial(material);
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex1,tex0]);
                this.m_rscene.addEntity(plane);

                //  let axis:Axis3DEntity = new Axis3DEntity();
                //  axis.initialize(300.0);
                //  this.m_rscene.addEntity(axis);

                //  let box:Box3DEntity = new Box3DEntity();
                //  box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                //  this.m_rscene.addEntity(box);
                
            }
        }
        run():void
        {
            let pcontext:RendererInstanceContext = this.m_rcontext;
            // show fps status
            this.m_statusDisp.update();
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