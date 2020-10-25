
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as Color4T from "../vox/material/Color4";

import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as BytesTextureProxyT from "../vox/texture/BytesTextureProxy";
import * as BytesCubeTextureProxyT from "../vox/texture/BytesCubeTextureProxy";
import * as FloatTextureProxyT from "../vox/texture/FloatTextureProxy";
import * as FloatCubeTextureProxyT from "../vox/texture/FloatCubeTextureProxy";
import * as TextureStoreT from "../vox/texture/TextureStore";
import * as ImageTexResLoaderT from "../vox/texture/ImageTexResLoader";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as CubeMapMaterialT from "../vox/material/mcase/CubeMapMaterial";
import * as BytesDataLoaderT from "../example/data/BytesDataLoader";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import Color4 = Color4T.vox.material.Color4;

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import BytesTextureProxy = BytesTextureProxyT.vox.texture.BytesTextureProxy;
import BytesCubeTextureProxy = BytesCubeTextureProxyT.vox.texture.BytesCubeTextureProxy;
import FloatTextureProxy = FloatTextureProxyT.vox.texture.FloatTextureProxy;
import FloatCubeTextureProxy = FloatCubeTextureProxyT.vox.texture.FloatCubeTextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;
import ImageTexResLoader = ImageTexResLoaderT.vox.texture.ImageTexResLoader;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import CubeMapMaterial = CubeMapMaterialT.vox.material.mcase.CubeMapMaterial;
import BytesDataLoader = BytesDataLoaderT.example.data.BytesDataLoader;


export namespace demo
{
    export class DemoFloatTex2
    {
        constructor()
        {
        }
        private m_rscene:RendererScene = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTexResLoader = new ImageTexResLoader();
        
        private m_texResLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        //private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_dataLoader:BytesDataLoader = new BytesDataLoader();
        private m_loaders:any[] = [];
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
            let tex:FloatCubeTextureProxy = TextureStore.CreateFloatCubeTex(16,16,true);
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
                tex.uploadFromBytesCubeFaceAt(k,vs,tex.getWidth(),tex.getHeight(),0);
            }
            return tex;
        }
        private createFloatTex():TextureProxy
        {
            let size:number = 64;
            //let tex:FloatTextureProxy = TextureStore.CreateHalfFloatTex2D(4,4,true);
            let tex:FloatTextureProxy = TextureStore.CreateFloatTex2D(size,size,true);
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

            //tex.dataType = TextureDataType.FLOAT;
            //tex.internalFormat = TextureFormat.RGBA;
            //tex.srcFormat = TextureFormat.RGBA;
            //tex.mipmapEnabled = true;
            //tex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
            tex.minFilter = TextureConst.LINEAR;
            tex.magFilter = TextureConst.LINEAR;
            tex.uploadFromBytes(vs,0);
            return tex;
        }
        
        private createBytesTex():TextureProxy
        {   
            let c:number = 0;
            let k:number = 0;
            let tex:BytesTextureProxy;
            let vs:Uint8Array;
            ///*
            console.log("create bytes tex...");
            tex = TextureStore.CreateBytesTex(4,4);
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
                    vs[k+3] = 255;
                }
            }
            tex.uploadFromBytes(vs,0);
            //tex.mipmapEnabled = true;
            return tex;
            
        }

        
        private createBytesTex2():TextureProxy
        {   
            let c:number = 0;
            let k:number = 0;
            let tex:BytesTextureProxy;
            let vs:Uint8Array;
            ///*
            console.log("create bytes tex...");
            tex = TextureStore.CreateBytesTex(4,4);
            vs = new Uint8Array(tex.getWidth() * tex.getHeight() * 4);

            for(let i:number = 0; i < tex.getHeight(); ++i)
            {
                for(let j:number = 0; j < tex.getWidth(); ++j)
                {
                    k = i * tex.getWidth() + j;
                    k *= 4;
                    c = 25 * i * j;
                    vs[k  ] = c;
                    vs[k+1] = 255 - c;
                    vs[k+2] = c;
                    vs[k+3] = 255;
                }
            }
            tex.uploadFromBytes(vs,0);
            //tex.mipmapEnabled = true;
            return tex;
            
        }
        
        private createRGBBytesTex():TextureProxy
        {   
            let c:number = 0;
            let k:number = 0;
            let tex:BytesTextureProxy;
            let vs:Uint8Array;
            ///*
            tex = TextureStore.CreateBytesTex(4,4);
            tex.srcFormat = TextureFormat.RGB;
            tex.internalFormat = TextureFormat.RGB;
            vs = new Uint8Array(tex.getWidth() * tex.getHeight() * 3);

            for(let i:number = 0; i < tex.getHeight(); ++i)
            {
                for(let j:number = 0; j < tex.getWidth(); ++j)
                {
                    k = i * tex.getWidth() + j;
                    k *= 3;
                    c = 25 * i * j;
                    vs[k  ] = 255 - c;
                    vs[k+1] = c;
                    vs[k+2] = c;
                }
            }
            tex.uploadFromBytes(vs,0);
            //tex.mipmapEnabled = true;
            return tex;
            
        }
        
        private createRGBFloatTex():TextureProxy
        {
            let size:number = 4;
            //let tex:FloatTextureProxy = TextureStore.CreateHalfFloatTex2D(4,4,true);
            let tex:FloatTextureProxy = TextureStore.CreateFloatTex2D(size,size,true);
            tex.srcFormat = TextureFormat.RGB;
            tex.internalFormat = TextureFormat.RGB16F;
            tex.minFilter = TextureConst.NEAREST;
            tex.magFilter = TextureConst.NEAREST;
            //let vs:Float32Array = new Float32Array(tex.getWidth() * tex.getHeight() * 4);
            let vs:Float32Array = new Float32Array(tex.getWidth() * tex.getHeight() * 3);
            
            let c:number = 0;
            let k:number = 0;
            for(let i:number = 0; i < tex.getHeight(); ++i)
            {
                for(let j:number = 0; j < tex.getWidth(); ++j)
                {
                    k = i * tex.getWidth() + j;
                    k *= 3;
                    c = (2550 * Math.abs(Math.sin(100.0 * (i + j)))) / 255.0;
                    c -= Math.floor(c);
                    vs[k  ] = c;
                    vs[k+1] = Math.abs(Math.log(Math.sin(c * 93.0 + 2.0)));
                    vs[k+2] = 1.0 - c;
                    //vs[k+3] = c;
                }
            }

            tex.mipmapEnabled = true;
            tex.minFilter = TextureConst.LINEAR;
            //tex.minFilter = TextureConst.LINEAR;

            //tex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;// 会报这个错误 WebGL warning: drawElementsInstanced: TEXTURE_2D at unit 0 is incomplete: Bad mipmap dimension or format.
            //tex.minFilter = TextureConst.LINEAR_MIPMAP_NEAREST;
            //tex.minFilter = TextureConst.NEAREST_MIPMAP_LINEAR;
            //tex.minFilter = TextureConst.NEAREST_MIPMAP_NEAREST;
            //tex.minFilter = TextureConst.NEAREST;
            //tex.magFilter = TextureConst.LINEAR_MIPMAP_NEAREST;
            tex.magFilter = TextureConst.LINEAR;
            tex.uploadFromBytes(vs,0);
            return tex;
        }
        initialize():void
        {

            console.log("DemoFloatTex2::initialize()......"+Math.pow(1.9,1.0/20.2));
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
                
                //  cubeTex0 = this.CreateFloatCubeTex();
                //  cubeTex0.mipmapEnabled = true;
                //this.m_statusDisp.initialize("rstatus");

                let rparam:RendererParam = new RendererParam("glcanvas");
                rparam.maxWebGLVersion = 1;
                rparam.setCamProject(45,10.0,7000.0);
                rparam.setCamPosition(900.0,900.0,900.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();
                this.m_rcontext = this.m_rscene.getRendererContext();
                
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

                let floatTex:TextureProxy = null;
                let bytesTex:TextureProxy = null;
                ///*
                //floatTex = this.createFloatTex();
                //floatTex = this.createRGBFloatTex();

                //if(floatTex == null)bytesTex = this.createBytesTex();
                if(floatTex == null)bytesTex = this.createRGBBytesTex();
                //tex = TextureStore.CreateRGBATex2D(8,8, new Color4(1.0,0.0,0.0,1.0));
                // add common 3d display entity
                var plane:Plane3DEntity = new Plane3DEntity();
                //plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                //plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[bytesTex]);
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[floatTex!=null?floatTex:bytesTex]);
                //plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[floatTex]);
                

                //let purl:string = "static/bytes/Ints.bin";
                let purl:string = "static/bytes/s.bin";
                this.m_dataLoader.loadArraybuffer(purl);
                //this.m_loaders.push(this.m_dataLoader);
                //*/
                ///*
                bytesTex = this.createBytesTex2();
                //bytesTex = this.createBytesTex();
                let material:CubeMapMaterial = new CubeMapMaterial();
                //material.setScale(755.0);
                let box:Box3DEntity = new Box3DEntity();
                box.name = "box";
                box.useGourandNormal();
                //box.setMaterial(material);
                //box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[cubeTex0]);
                box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[bytesTex]);
                this.m_rscene.addEntity(box);

                this.m_rscene.addEntity(plane);
                //*/
                //  let axis:Axis3DEntity = new Axis3DEntity();
                //  axis.initialize(300.0);
                //  this.m_rscene.addEntity(axis);

                //  let box:Box3DEntity = new Box3DEntity();
                //  box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                //  this.m_rscene.addEntity(box);
                

            }
        }
        //CreateBytesCubeTex
        private parseUint8Data(dataBuf:any):void
        {
            let begin:number = 0;
            let width:number = 128;
            let height:number = 128;
            let size:number = width * height * 3;
            let fs32:Uint8Array = new Uint8Array(dataBuf);
            let subArr:Uint8Array = null;

            console.log("parseUint8Data....fs32.length: "+fs32.length);
            let tex:BytesTextureProxy;
            tex = TextureStore.CreateBytesTex(width,height);
            tex.srcFormat = TextureFormat.RGB;
            tex.internalFormat = TextureFormat.RGB;
            for(let i:number = 0,len:number=1; i < len; ++i)
            {
                subArr = fs32.slice(begin, begin + size);
            }
            tex.uploadFromBytes(subArr);
            var plane:Plane3DEntity = new Plane3DEntity();
            plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex]);
            plane.setXYZ(0.0,100.0,0.0);
            this.m_rscene.addEntity(plane);
        }
        
        private parseUint8DataToCube(dataBuf:any):void
        {
            let begin:number = 0;
            let width:number = 128;
            let height:number = 128;
            let size:number = width * height * 3;
            let fs32:Uint8Array = new Uint8Array(dataBuf);
            let subArr:Uint8Array = null;

            console.log("parseUint8DataToCube....fs32.length: "+fs32.length);
            let tex:BytesCubeTextureProxy;
            tex = TextureStore.CreateBytesCubeTex(width,height);
            tex.srcFormat = TextureFormat.RGB;
            tex.internalFormat = TextureFormat.RGB;
            tex.mipmapEnabled = true;
            for(let i:number = 0,len:number=6; i < len; ++i)
            {
                subArr = fs32.slice(begin, begin + size);
                tex.uploadFromBytesCubeFaceAt(i,subArr,width,height,0);
            }
            let material:CubeMapMaterial = new CubeMapMaterial();
            //material.setScale(1.0);
            let box:Box3DEntity = new Box3DEntity();
            box.name = "box";
            box.useGourandNormal();
            box.setMaterial(material);
            box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex]);
            this.m_rscene.addEntity(box);
        }
        private parseF32DataToCube(dataBuf:any):void
        {
            let begin:number = 0;
            let width:number = 128;
            let height:number = 128;
            let size:number = width * height * 3;
            let fs32:Float32Array = new Float32Array(dataBuf);
            let subArr:Float32Array = null;

            console.log("parseUint8DataToCube....fs32.length: "+fs32.length);
            let tex:FloatCubeTextureProxy;
            tex = TextureStore.CreateFloatCubeTex(width,height);
            tex.srcFormat = TextureFormat.RGB;
            tex.internalFormat = TextureFormat.RGB16F;
            
            tex.minFilter = TextureConst.LINEAR;
            tex.magFilter = TextureConst.LINEAR;
            tex.mipmapEnabled = true;
            for(let i:number = 0,len:number=6; i < len; ++i)
            {
                subArr = fs32.slice(begin, begin + size);
                tex.uploadFromBytesCubeFaceAt(i,subArr,width,height,0);
            }
            let material:CubeMapMaterial = new CubeMapMaterial();
            //material.setScale(1.0);
            let box:Box3DEntity = new Box3DEntity();
            box.name = "box";
            box.useGourandNormal();
            box.setMaterial(material);
            box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex]);
            this.m_rscene.addEntity(box);
        }
        private updateLoaders():void
        {
            if(this.m_loaders.length > 0)
            {
                let loader:any;
                for(let i:number = 0,len:number=this.m_loaders.length; i < len; ++i)
                {
                    loader = this.m_loaders[i];
                    if(loader.getData() != null)
                    {
                        this.m_loaders.splice(i,1);
                        i--;
                        len--;
                        //this.parseUint8Data(loader.getData());
                        //this.parseUint8DataToCube(loader.getData());
                        this.parseF32DataToCube(loader.getData());
                    }
                }
            }
        }
        run():void
        {
            let pcontext:RendererInstanceContext = this.m_rcontext;
            // show fps status
            //this.m_statusDisp.update();
            // 分帧加载
            this.m_texLoader.run();
            this.updateLoaders();

            this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);
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