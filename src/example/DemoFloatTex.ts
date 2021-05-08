
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import Color4 from "../vox/material/Color4";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import BytesTextureProxy from "../vox/texture/BytesTextureProxy";
import FloatTextureProxy from "../vox/texture/FloatTextureProxy";
import FloatCubeTextureProxy from "../vox/texture/FloatCubeTextureProxy";
////import * as TextureStoreT from "../vox/texture/TextureStore";
import {TextureConst,TextureFormat,TextureDataType,TextureTarget} from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import CubeMapMaterial from "../vox/material/mcase/CubeMapMaterial";

//import CubeMapMaterial = CubeMapMaterialT.vox.material.mcase.CubeMapMaterial;

export namespace demo
{
    export class DemoFloatTex
    {
        constructor()
        {
        }
        private m_rscene:RendererScene = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader;
        
        private m_texResLoader:ImageTextureLoader;
        private m_camTrack:CameraTrack = null;
        //private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        getTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        //CreateFloatCubeTex
        private CreateFloatCubeTex():TextureProxy
        {
            let tex:FloatCubeTextureProxy = this.m_rscene.textureBlock.createFloatCubeTex(16,16,true);
            let vs:Float32Array = new Float32Array(tex.getWidth() * tex.getHeight() * 4);
            
            let c:number = 0;
            let k:number = 0;
            for(let i:number = 0; i < tex.getHeight(); ++i)
            {
                for(let j:number = 0; j < tex.getWidth(); ++j)
                {
                    k = i * tex.getWidth() + j;
                    k *= 4;
                    c = (8.0 * i * j);
                    vs[k  ] = c;
                    vs[k+1] = c;
                    vs[k+2] = 1.0 - c;
                    vs[k+3] = c;
                }
            }

            tex.mipmapEnabled = true;
            tex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
            for(k = 0; k < 6; ++k)
            {
                tex.setDataFromBytesToFaceAt(k,vs,tex.getWidth(),tex.getHeight(),0);
            }
            return tex;
        }
        private createFloatTex():TextureProxy
        {
            let size:number = 64;
            //let tex:FloatTextureProxy = this.m_rscene.textureBlock.createHalfFloatTex2D(4,4,true);
            let tex:FloatTextureProxy = this.m_rscene.textureBlock.createFloatTex2D(size,size,true);
            //let vs:Float32Array = new Float32Array(tex.getWidth() * tex.getHeight() * 4);
            let vs:Float32Array = new Float32Array(tex.getWidth() * tex.getHeight() * 4);
            
            let c:number = 0;
            let k:number = 0;
            for(let i:number = 0; i < tex.getHeight(); ++i)
            {
                for(let j:number = 0; j < tex.getWidth(); ++j)
                {
                    k = i * tex.getWidth() + j;
                    k *= 4;
                    c = (2550 * Math.abs(Math.sin(100.0 * (i + j)))) / 255.0;
                    c -= Math.floor(c);
                    vs[k  ] = c;
                    vs[k+1] = Math.abs(Math.log(Math.sin(c * 93.0 + 2.0)));
                    vs[k+2] = 1.0 - c;
                    vs[k+3] = c;
                }
            }

            tex.mipmapEnabled = true;
            tex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
            tex.setDataFromBytes(vs,0);
            return tex;
        }
        
        private createBytesTex():TextureProxy
        {   
            let c:number = 0;
            let k:number = 0;
            let tex:BytesTextureProxy;
            let vs:Uint8Array;
            ///*
            tex = this.m_rscene.textureBlock.createBytesTex(4,4);
            vs = new Uint8Array(tex.getWidth() * tex.getHeight() * 4);

            for(let i:number = 0; i < tex.getHeight(); ++i)
            {
                for(let j:number = 0; j < tex.getWidth(); ++j)
                {
                    k = i * tex.getWidth() + j;
                    k *= 4;
                    c = 25 * i * j;
                    vs[k  ] = c;
                    vs[k+1] = c;
                    vs[k+2] = 255 - c;
                    vs[k+3] = c;
                }
            }
            tex.setDataFromBytes(vs,0);
            return tex;
            
        }
        initialize():void
        {
            console.log("DemoFloatTex::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
                let urls = [
                    "./static/tex/grass.jpg",
                    "./static/tex/grass.jpg",
                    "./static/tex/grass.jpg",
                    "./static/tex/grass.jpg",
                    "./static/tex/grass.jpg",
                    "./static/tex/grass.jpg"
                ];
                let cubeTex0:TextureProxy = this.m_texResLoader.getCubeTexAndLoadImg("cubeMap",urls);
                cubeTex0.mipmapEnabled = true;
                //cubeTex0.setWrap(TextureConst.WRAP_REPEAT);
                let tex0:TextureProxy = this.getTexByUrl("./static/tex/default.jpg");
                //let tex1:TextureProxy = this.getTexByUrl("./static/tex/grass.jpg");
                
                cubeTex0 = this.CreateFloatCubeTex();
                cubeTex0.mipmapEnabled = true;
                //this.m_statusDisp.initialize("rstatus");

                let rparam:RendererParam = new RendererParam();
                rparam.maxWebGLVersion = 2;
                rparam.setCamPosition(500.0,500.0,500.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();
                this.m_rcontext = this.m_rscene.getRendererContext();
                
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

                let floatTex:TextureProxy = null;
                let bytesTex:TextureProxy = null;
                ///*
                floatTex = this.createFloatTex();

                if(floatTex == null)bytesTex = this.createBytesTex();
                //tex = this.m_rscene.textureBlock.createRGBATex2D(8,8, new Color4(1.0,0.0,0.0,1.0));
                // add common 3d display entity
                var plane:Plane3DEntity = new Plane3DEntity();
                //plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                //plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[bytesTex]);
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[floatTex]);
                this.m_rscene.addEntity(plane);
                //*/
                /*
                let material:CubeMapMaterial = new CubeMapMaterial();
                material.setScale(755.0);
                let box:Box3DEntity = new Box3DEntity();
                box.name = "box";
                box.useGourandNormal();
                box.setMaterial(material);
                box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[cubeTex0]);
                this.m_rscene.addEntity(box);
                //*/
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
            //this.m_statusDisp.update();

            this.m_rscene.setClearRGBColor3f(0.0, 0.2, 0.0);
            // render begin
            this.m_rscene.runBegin();
            // run logic program
            this.m_rscene.update();
            this.m_rscene.run();
            this.m_rscene.runEnd();

            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}