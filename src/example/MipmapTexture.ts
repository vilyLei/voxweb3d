
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureProxy from "../vox/texture/ImageTextureProxy";
import BytesTextureProxy from "../vox/texture/BytesTextureProxy";
import FloatTextureProxy from "../vox/texture/FloatTextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import ImageTool from "../vox/texture/ImageTool";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import MouseEvent from "../vox/event/MouseEvent";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import H5FontSystem from "../vox/text/H5FontSys";
import IRenderTexture from "../vox/render/texture/IRenderTexture";


export namespace example {
    export class MipmapTexture {
        constructor() {
        }
        private m_rscene: RendererScene = null;
        private m_rcontext: RendererInstanceContext = null;
        private m_texLoader: ImageTextureLoader;
        private m_camTrack: CameraTrack = null;
        private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
        private m_targetTex: ImageTextureProxy = null;
        private m_targetBytesTex: BytesTextureProxy = null;
        private m_profileInstance: ProfileInstance = new ProfileInstance();
        getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
            let ptex = this.m_rscene.textureBlock.createImageTex2D(64, 64, false);
            ptex.mipmapEnabled = true;
            if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
            let img: any = new Image();
            img.onload = function (params: any) {
                let mips: any[] = ImageTool.CreateJpgImageMipmaps(img);
                for (let i: number = 0, len: number = mips.length; i < len; ++i) {
                    ptex.setDataFromImage(mips[i], i, 0, 0, false);
                }
            }
            img.src = purl;
            return ptex;
        }
        getBytesTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
            let ptex = this.m_rscene.textureBlock.createBytesTex(64, 64);
            ptex.mipmapEnabled = true;
            if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
            let img: any = new Image();
            img.onload = function (params: any) {
                let mips: any[] = ImageTool.CreateJpgBytesMipmaps(img);
                let obj: any = null;
                for (let i: number = 0, len: number = mips.length; i < len; ++i) {
                    obj = mips[i];
                    ptex.setDataFromBytes(obj.data, i, obj.width, obj.height, 0,0,false);
                }

            }
            img.src = purl;
            return ptex;
        }

        private createFloatTex(): IRenderTexture {
            let size: number = 64;
            //let tex:FloatTextureProxy = this.m_rscene.textureBlock.createHalfFloatTex2D(4,4,true);
            let tex = this.m_rscene.textureBlock.createFloatTex2D(size, size, true);
            //let vs:Float32Array = new Float32Array(tex.getWidth() * tex.getHeight() * 4);
            let vs: Float32Array = new Float32Array(tex.getWidth() * tex.getHeight() * 4);

            let c: number = 0;
            let k: number = 0;
            for (let i: number = 0; i < tex.getHeight(); ++i) {
                for (let j: number = 0; j < tex.getWidth(); ++j) {
                    k = i * tex.getWidth() + j;
                    k *= 4;
                    c = (2550 * Math.abs(Math.sin(100.0 * (i + j)))) / 255.0;
                    c -= Math.floor(c);
                    vs[k] = c;
                    vs[k + 1] = Math.abs(Math.log(Math.sin(c * 93.0 + 2.0)));
                    vs[k + 2] = 1.0 - c;
                    vs[k + 3] = c;
                }
            }
            tex.minFilter = TextureConst.LINEAR;
            tex.magFilter = TextureConst.LINEAR;
            tex.setDataFromBytes(vs, 0, tex.getWidth(), tex.getHeight(), 0,0,false);
            return tex;
        }
        initialize(): void {
            console.log("MipmapTexture::initialize()......");
            if (this.m_rcontext == null) {

                RendererDevice.SHADERCODE_TRACE_ENABLED = true;
                let tex1: IRenderTexture;
                H5FontSystem.GetInstance().initialize("fontTex", 18, 512, 512, false, false);
                //let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
                //tex1 = this.getImageTexByUrl("static/assets/broken_iron.jpg");
                //      tex1 = this.getBytesTexByUrl("static/assets/broken_iron.jpg");
                //      this.m_targetBytesTex = tex1 as BytesTextureProxy;
                //let tex1:TextureProxy = this.getImageTexByUrl("static/assets/yanj.jpg");
                //  let tex2:TextureProxy = this.getImageTexByUrl("static/pics/127_witheEdge.png");
                //  tex2.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
                //tex2.magFilter = TextureConst.LINEAR_MIPMAP_LINEAR;

                tex1 = this.createFloatTex();
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;
                tex1.magFilter = TextureConst.LINEAR;
                //tex1.minFilter = TextureConst.LINEAR;
                tex1.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
                this.m_targetTex = tex1 as ImageTextureProxy;

                let rparam: RendererParam = new RendererParam();
                rparam.setAttriAntialias(true);
                rparam.setAttriAlpha(false);
                rparam.maxWebGLVersion = 1;
                rparam.setCamPosition(500.0, 500.0, 500.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam, 3);
                this.m_rscene.updateCamera();
                this.m_rcontext = this.m_rscene.getRendererContext();

                this.m_profileInstance.initialize(this.m_rscene.getRenderer());

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

                this.m_statusDisp.initialize();
                this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);

                // add common 3d display entity
                var plane: Plane3DEntity = new Plane3DEntity();
                //plane.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
                plane.initializeXOZ(-150.0, -200.0, 300.0, 400.0, [tex1]);
                this.m_rscene.addEntity(plane);


                plane = new Plane3DEntity();
                //plane.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
                plane.initializeXOZ(-60.0, -60.0, 60.0, 120.0, [tex1]);
                this.m_rscene.addEntity(plane);

                plane.setXYZ(0.0, 0.0, 300);

            }
        }
        private m_flag: number = 0;
        private m_px: number = 80;
        private m_py: number = 120;
        mouseDownListener(evt: any): void {
            console.log("Mouse down.");
            //this.m_targetTex
            let selfT: MipmapTexture = this;
            
            let bytetex: BytesTextureProxy = this.m_targetBytesTex;
            let img: any = new Image();
            img.onload = function (params: any) {
                //      ptex.setDataFromImage(img);
                //  let mips:any[] = ImageTool.CreateJpgImageMipmaps(img);
                //  console.log("BBBBBB 111 mips: ",mips);
                //  let px:number = 0;
                //  let py:number = 0;
                //  for(let i:number = 0,len:number = mips.length; i < len; ++i)
                //  {
                //      ptex.setDataFromImage(mips[i],i,px,py);
                //      px += 10;
                //      py += 10;
                //  }
                bytetex.setDataFromBytes(ImageTool.CreateJpgBytesImg(img), 1, img.width, img.height);
            }//testFT4            
            img.src = "static/assets/yanj.jpg";
            return;
            let ptex: ImageTextureProxy = selfT.m_targetTex;
            /*
            img.onload = function(params:any)
            {
                //      ptex.setDataFromImage(img);
                let mips:any[] = ImageTool.CreateJpgImageMipmaps(img);
                console.log("BBBBBB 111 mips: ",mips);
                let px:number = 0;
                let py:number = 0;
                for(let i:number = 0,len:number = mips.length; i < len; ++i)
                {
                    ptex.setDataFromImage(mips[i],i,px,py);
                    px += 10;
                    py += 10;
                }
            }//testFT4
            //img.src = "static/assets/testFT4.jpg";
            img.src = "static/assets/yanj.jpg";
            //*/
            ///*
            //let img:any = new Image();
            if (this.m_flag == 0) {
                img.onload = function (params: any) {
                    selfT.m_targetTex.setDataFromImage(img, 1);
                }
                //img.src = "static/assets/broken_iron.jpg";
                img.src = "static/assets/yanj.jpg";
            }
            else if (this.m_flag == 1) {
                img.onload = function (params: any) {
                    selfT.m_targetTex.setDataFromImage(img, 0, selfT.m_px, selfT.m_py);
                }
                img.src = "static/assets/partile_tex_001.jpg";
            }
            else if (this.m_flag == 2) {
                img.onload = function (params: any) {
                    selfT.m_targetTex.setDataFromImage(img, 0, 0, 0);
                }
                img.src = "static/assets/broken_iron.jpg";
                this.m_flag = -1;
            }
            this.m_flag++;
            //*/
        }
        run(): void {
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
            if (this.m_profileInstance != null) {
                this.m_profileInstance.run();
            }
        }
    }
}