
import * as Vector3DT from "../vox/math/Vector3D";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";

import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Line3DEntityT from "../vox/entity/Line3DEntity";
import * as DashedLine3DEntityT from "../vox/entity/DashedLine3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureStoreT from "../vox/texture/TextureStore";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as FloatTextureProxyT from "../vox/texture/FloatTextureProxy";
import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as VSTexturePosMaterialT from "./material/VSTexturePosMaterial";
import * as FloatTexMaterialT from "./material/FloatTexMaterial";
import * as PathTrackT from "../voxnav/path/PathTrack";

import Vector3D = Vector3DT.vox.math.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Line3DEntity = Line3DEntityT.vox.entity.Line3DEntity;
import DashedLine3DEntity = DashedLine3DEntityT.vox.entity.DashedLine3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import FloatTextureProxy = FloatTextureProxyT.vox.texture.FloatTextureProxy;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import VSTexturePosMaterial = VSTexturePosMaterialT.demo.material.VSTexturePosMaterial;
import FloatTexMaterial = FloatTexMaterialT.demo.material.FloatTexMaterial;
import PathTrack = PathTrackT.voxnav.path.PathTrack;

export namespace demo
{
    export class DemoFloatTex
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
        private m_posTex:FloatTextureProxy = null;
        private m_texSize:number = 16;
        private m_texData:Float32Array = null;
        private cratePosTex():void
        {
            
            //let texWidth:number = 16 * 16;
            let texSize:number = this.m_texSize;
            let posTex:FloatTextureProxy = this.m_rscene.textureBlock.createFloatTex2D(texSize,texSize);
            posTex.setWrap(TextureConst.WRAP_CLAMP_TO_EDGE);
            posTex.mipmapEnabled = false;
            posTex.minFilter = TextureConst.NEAREST;
            posTex.magFilter = TextureConst.NEAREST;
            //posTex.
            let fs:Float32Array = new Float32Array(texSize * texSize * 4);
            for(let r:number = 0; r < texSize; ++r)
            {
                for(let c:number = 0; c < texSize; ++c)
                {
                }
            }
            posTex.setDataFromBytes(fs,0,texSize,texSize);
            this.m_posTex = posTex;
            this.m_texData = fs;
        }
        setPosAt(i:number, pos:Vector3D):void
        {
            let r:number = Math.floor(i/this.m_texSize);
            let c:number = i - r * this.m_texSize;

            i *= 4;
            this.m_texData[i] = pos.x;
            this.m_texData[i+1] = pos.y;
            this.m_texData[i+2] = pos.z;
        }
        showData():void
        {
            console.log(this.m_texData);
        }
        private createFloatTex():FloatTextureProxy
        {
            let texSize:number = 32;
            let posTex:FloatTextureProxy = this.m_rscene.textureBlock.createFloatTex2D(texSize,texSize);
            posTex.setWrap(TextureConst.WRAP_CLAMP_TO_EDGE);
            //posTex.mipmapEnabled = false;
            posTex.minFilter = TextureConst.NEAREST;
            posTex.magFilter = TextureConst.NEAREST;
            //posTex.
            let fs:Float32Array = new Float32Array(texSize * texSize * 2);
            fs.fill(1.0);
            for(let r:number = 0; r < texSize; ++r)
            {
                for(let c:number = 0; c < texSize; ++c)
                {
                    let k:number = (r * texSize + c) * 4;
                    //fs[k + 0] = 50.0;
                    fs[k + 1] = 0.0;
                    //fs[k + 2] = 0.0;
                }
            }
            posTex.setDataFromBytes(fs,0,texSize,texSize);
            return posTex;
        }
        initialize():void
        {
            console.log("DemoFloatTex::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

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
                let ftex:TextureProxy = this.createFloatTex();
                let material:FloatTexMaterial = new FloatTexMaterial();
                material.setTextureList([ftex]);
                // add common 3d display entity
                var plane:Plane3DEntity = new Plane3DEntity();
                plane.setMaterial(material);
                //plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex1,tex0]);
                //plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[this.m_posTex,tex0]);
                plane.initializeXOZ(0.0,0.0,200.0,150.0,[ftex]);
                this.m_rscene.addEntity(plane);
                return;
                //  //let tex1:TextureProxy = this.getImageTexByUrl("static/assets/caustics_02.jpg");
                //  let tex1:TextureProxy = this.getImageTexByUrl("static/assets/green.jpg");
                //  //let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");

                let curvePosList:Vector3D[] = [
                    new Vector3D(100.0,0.0,40.0),
                    new Vector3D(70.0,0.0,60.0),
                    new Vector3D(-70.0,0.0,60.0),
                    new Vector3D(-100.0,0.0,40.0),
                    
                    new Vector3D(-100.0,0.0,-40.0),
                    new Vector3D(-70.0,0.0,-60.0),
                    new Vector3D(70.0,0.0,-60.0),
                    new Vector3D(100.0,0.0,-40.0),
                    
                    new Vector3D(100.0,0.0,40.0)
                ];
                let curveLine:DashedLine3DEntity = new DashedLine3DEntity();
                curveLine.initializeByPosition(curvePosList);
                this.m_rscene.addEntity(curveLine);

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(310);
                this.m_rscene.addEntity(axis);


                let pos0:Vector3D = new Vector3D(100.0,0.0,0.0);
                let pos1:Vector3D = new Vector3D(150.0,0.0,0.0);
                let pos17:Vector3D = new Vector3D(200.0,50.0,0.0);
                axis = new Axis3DEntity();
                axis.initialize(80);
                axis.setPosition( pos17 );
                this.m_rscene.addEntity(axis);
                /*
                this.cratePosTex();
                this.setPosAt(0,pos0);
                this.setPosAt(1,pos1);
                this.setPosAt(17,pos17);
                this.showData();
                let material:VSTexturePosMaterial = new VSTexturePosMaterial();
                material.setTexSize(this.m_texSize);
                material.setPosAt(17);
                // add common 3d display entity
                var plane:Plane3DEntity = new Plane3DEntity();
                plane.setMaterial(material);
                //plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex1,tex0]);
                //plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[this.m_posTex,tex0]);
                plane.initializeXOZ(0.0,0.0,200.0,150.0,[this.m_posTex,tex0]);
                this.m_rscene.addEntity(plane);

                //  let axis:Axis3DEntity = new Axis3DEntity();
                //  axis.initialize(300.0);
                //  this.m_rscene.addEntity(axis);

                //  let box:Box3DEntity = new Box3DEntity();
                //  box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                //  this.m_rscene.addEntity(box);
                ///*/
                
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