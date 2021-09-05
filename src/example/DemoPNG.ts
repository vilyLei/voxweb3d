
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Color4 from "../vox/material/Color4";
import RendererState from "../vox/render/RendererState";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import BytesTextureProxy from "../vox/texture/BytesTextureProxy";
////import * as TextureStoreT from "../vox/texture/TextureStore";
import {TextureConst,TextureFormat,TextureDataType,TextureTarget} from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import * as TwoPngTexMaterialT from "./material/base/TwoPngTexMaterial";

//import Vector3D = Vector3DT.vox.math.Vector3D;
//import RendererDevice = RendererDeviceT.vox.render.RendererDevice;
//import RendererParam = RendererParamT.vox.scene.RendererParam;
//import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
//import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

//import Color4 = Color4T.vox.material.Color4;
//import RendererState = RendererStateT.vox.render.RendererState;
//import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
//import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
//import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
//import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
//import BytesTextureProxy = BytesTextureProxyT.vox.texture.BytesTextureProxy;
//import TextureStore = TextureStoreT.vox.texture.TextureStore;
//import TextureConst = TextureConstT.vox.texture.TextureConst;
//import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
//import CameraTrack = CameraTrackT.vox.view.CameraTrack;
//import RendererScene = RendererSceneT.vox.scene.RendererScene;
import TwoPngTexMateria = TwoPngTexMaterialT.example.material.base.TwoPngTexMaterial;

export namespace example
{
    export class DemoPNG
    {
        constructor()
        {
        }
        private m_rscene:RendererScene = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_bgColor:Color4 = new Color4();
        //private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        getTexByUrl(purl:string,offsetTexEnabled:boolean = false,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl,0,offsetTexEnabled);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        getOffsetTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageOffsetTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }

        getBytesTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):BytesTextureProxy
        {
            let ptex:BytesTextureProxy = this.m_texLoader.getBytesTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        
        getNoPreAlphaBytesTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):BytesTextureProxy
        {
            let ptex:BytesTextureProxy = this.m_texLoader.getBytesNoPremultipliedAlphaTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("DemoPNG::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDevice.SHADERCODE_TRACE_ENABLED = true;

                
                let rparam:RendererParam = new RendererParam();
                //rparam.maxWebGLVersion = 1;
                rparam.setCamPosition(0.0,200.0,0.0);
                rparam.setCamUpDirect(0.0,0.0,-1.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();
                this.m_rcontext = this.m_rscene.getRendererContext();

                this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

                this.m_bgColor.setRGB3Bytes(192,192,192);
                //  let tex0:TextureProxy = this.getTexByUrl("./static/tex/default.jpg");
                ///let tex1:TextureProxy = this.getTexByUrl("./static/tex/grass.jpg");
                //let tex2:TextureProxy = this.getTexByUrl("./static/pics/girls_type-04-init_power2.png");
                //let tex3:TextureProxy = this.getTexByUrl("./static/pics/square_01.png");
                //let tex3:TextureProxy = this.getTexByUrl("./static/pics/cloth_03.jpg");
                //let tex4:TextureProxy = this.getTexByUrl("./static/pics/girls_type-04-init.png");
                //let tex4:TextureProxy = this.getTexByUrl("./static/pics/girls_type-04-init_power2.png");

                //  let tex4:TextureProxy = this.getTexByUrl("./static/pics/girls_type-04-init_custom2.png",true);
                //  let tex4Offset:TextureProxy = this.getOffsetTexByUrl("./static/pics/girls_type-04-init_custom2.png");

                //  let tex4:TextureProxy = this.getTexByUrl("./static/pics/girls_type-04-init.png",true);
                //  let tex4Offset:TextureProxy = this.getOffsetTexByUrl("./static/pics/girls_type-04-init.png");
                //let tex4:TextureProxy = this.getBytesTexByUrl("./static/pics/girls_type-04-init_custom2.png");
                //let tex4:TextureProxy = this.getTexByUrl("./static/pics/girls_type-04-init_custom2_down.png");
                //tex4.minFilter = TextureConst.LINEAR;
                //  tex4.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;

                //  let tex4A:TextureProxy = this.getTexByUrl("./static/pics/girls_type-04-init-copy.png");
                //  tex4A.minFilter = TextureConst.LINEAR;
                //let tex4NoPreAlpha:TextureProxy = this.getTexByUrl("./static/pics/girls_type-04-init.png");
                /*
                let tex4NoPreAlpha:TextureProxy = this.getNoPreAlphaBytesTexByUrl("./static/pics/girls_type-04-init.png");
                //let tex4NoPreAlpha:TextureProxy = this.getNoPreAlphaBytesTexByUrl("./static/pics/girls_type-04-init_custom2.png");
                tex4NoPreAlpha.minFilter = TextureConst.NEAREST;//LINEAR_MIPMAP_LINEAR;
                tex4NoPreAlpha.magFilter = TextureConst.NEAREST;
                tex4NoPreAlpha.mipmapEnabled = true;
                //tex4NoPreAlpha.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
                //let tex4:TextureProxy = this.getTexByUrl("https://style3d.oss-cn-hangzhou.aliyuncs.com/website/Company/3ed051ae-52f9-4c3a-8a53-22860bab4e3e/resource/decal/textures/xhr_20200924173122_6832_Among_the_stars_slogan_mystic_halloween_astronomy_girls_type-04/Among_the_stars_slogan_mystic_halloween_astronomy_girls_type-04.png");
                
                //tex4.minFilter = TextureConst.NEAREST_MIPMAP_LINEAR;
                //let tex5:TextureProxy = this.getTexByUrl("./static/pics/rectBorder_01.png");
                */
                let colorTex:TextureProxy = this.m_rscene.textureBlock.createRGBATex2D(128,128,new Color4(1.0,1.0,1.0,1.0));
                colorTex.mipmapEnabled = true;
                //this.m_statusDisp.initialize("rstatus");
                let material:TwoPngTexMateria = new TwoPngTexMateria();
                // add common 3d display entity
                var plane:Plane3DEntity = new Plane3DEntity();
                //plane.setMaterial(material);
                //plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                plane.initializeXOZ(-400.0,-300.0,800.0,500.0,[colorTex]);
                //this.m_rscene.addEntity(plane);

                let texA:TextureProxy = this.m_texLoader.getTexByUrl("static/test/Image_96.jpg");
                let texB:TextureProxy = this.m_texLoader.getTexByUrl("static/test/img_96_mask.png");
                texA.minFilter = TextureConst.NEAREST;
                texA.magFilter = TextureConst.NEAREST;
                texB.minFilter = TextureConst.NEAREST;
                texB.magFilter = TextureConst.NEAREST;
                let scale = 1.2;
                material = new TwoPngTexMateria();
                //material.setTextureList([tex4]);
                plane = new Plane3DEntity();
                plane.setMaterial(material);
                //plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                //plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex2]);
                //plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex1,tex4]);
                //plane.initializeXOZ(-150.0,-150.0,300.0,300.0,[tex3,tex4]);
                //plane.initializeXOZ(-150.0,-150.0,300.0,300.0,[colorTex,tex4]);
                //plane.initializeXOZ(-150.0,-150.0,300.0,300.0,[colorTex,tex4NoPreAlpha]);
                plane.initializeXOZ(-150.0,-150.0,300.0,300.0,[
                    texA,
                    texB
                ]);
                plane.setScaleXYZ(scale,scale,scale);
                //plane.initializeXOZ(-80.0,-80.0,160,160.0,[colorTex,tex4NoPreAlpha]);
                //plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex4]);
                //plane.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
                //plane.setXYZ(100.0,12.0,100.0);
                this.m_rscene.addEntity(plane,1);
                plane.setXYZ(0.0,0.0,80.0);
                plane.toTransparentBlend();
                /*
                material = new TwoPngTexMateria();
                plane = new Plane3DEntity();
                plane.setMaterial(material);
                plane.initializeXOZ(-150.0,-150.0,300.0,300.0,[colorTex,tex4A]);
                plane.setXYZ(-100.0,10.0,-100.0);
                this.m_rscene.addEntity(plane,1);
                //*/

                //  let axis:Axis3DEntity = new Axis3DEntity();
                //  axis.initialize(300.0);
                //  this.m_rscene.addEntity(axis);
                /*
                let img:any = new Image();
                img.src = "./static/pics/rectBorder_01.png";
                img.onload = function(evt:any)
                {
                    var canvas:any = document.createElement('canvas');
                    document.body.appendChild(canvas);
                    canvas.width = 256;
                    canvas.height = 256;
                    canvas.style.visibility = "hidden";
                    //canvas.style.backgroundColor = "#338899";//transparent
                    canvas.style.backgroundColor = "transparent";//transparent
                    canvas.style.left = '0px';
                    canvas.style.top = '0px';
                    canvas.style.position = 'absolute';
                    let ctx2d = canvas.getContext("2d");
                    ctx2d.drawImage(img, 0, 0, img.width,img.height,0,0,256,256);
                }
                //*/
            }
        }
        run():void
        {
            let pcontext:RendererInstanceContext = this.m_rcontext;
            // show fps status
            //this.m_statusDisp.update();

            this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);
            //this.m_rscene.setClearColor(this.m_bgColor);
            // render begin
            this.m_rscene.runBegin();
            // run logic program
            this.m_rscene.update();
            this.m_rscene.run();
            
            // render end
            //this.m_rscene.runEnd();

            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}