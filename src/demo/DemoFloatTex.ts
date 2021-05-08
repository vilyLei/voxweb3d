
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst} from "../vox/texture/TextureConst";
import FloatTextureProxy from "../vox/texture/FloatTextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import FloatTexMaterial from "./material/FloatTexMaterial";

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
            let fs:Float32Array = new Float32Array(texSize * texSize * 4);
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
                //rparam.maxWebGLVersion = 1;
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