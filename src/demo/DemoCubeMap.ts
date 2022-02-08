
import Vector3D from "../vox/math/Vector3D";
import MouseEvent from "../vox/event/MouseEvent";
import RendererDevice from "../vox/render/RendererDevice";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import { TextureBlock } from "../vox/texture/TextureBlock";
import CameraTrack from "../vox/view/CameraTrack";
import CubeMapMaterial from "../vox/material/mcase/CubeMapMaterial";
import FloatCubeTextureProxy from "../vox/texture/FloatCubeTextureProxy";

import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import BinaryLoader from "../vox/assets/BinaryLoader";
import DDSLoader from "../vox/assets/DDSLoader";
import BytesCubeTextureProxy from "../vox/texture/BytesCubeTextureProxy";
import RCExtension from "../vox/render/RCExtension";
import { IBytesCubeTexture } from "../vox/render/texture/IBytesCubeTexture";
import { IFloatCubeTexture } from "../vox/render/texture/IFloatCubeTexture";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import { UserInteraction } from "../vox/engine/UserInteraction";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";

///*
class TextureLoader {

    protected m_rscene: RendererScene = null;
    texture: IBytesCubeTexture | IFloatCubeTexture = null;
    constructor() {
    }

    loadTextureWithUrl(url: string, rscene: RendererScene): void {
        //let url: string = "static/bytes/spe.mdf";
        let loader: BinaryLoader = new BinaryLoader();
        loader.uuid = url;
        loader.load(url, this);
        this.m_rscene = rscene;

        this.texture = this.m_rscene.textureBlock.createFloatCubeTex(32, 32, false);
    }
    loaded(buffer: ArrayBuffer, uuid: string): void {
        //console.log("loaded... uuid: ", uuid, buffer.byteLength);
        this.parseTextureBuffer(buffer);
        this.m_rscene = null;
        this.texture = null;
    }
    loadError(status: number, uuid: string): void {
    }

    protected parseTextureBuffer(buffer: ArrayBuffer): void {
        let begin: number = 0;
        let width: number = 128;
        let height: number = 128;
        let size: number = width * height * 3;
        let fs32: Float32Array = new Float32Array(buffer);
        let subArr: Float32Array = null;
        let tex = this.texture as IFloatCubeTexture;
        tex.toRGBFormat();
        for (let i: number = 0, len: number = 6; i < len; ++i) {
            subArr = fs32.slice(begin, begin + size);
            console.log("width,height: ", width, height, ", subArr.length: ", subArr.length);
            tex.setDataFromBytesToFaceAt(i, subArr, width, height, 0);
            begin += size;
        }
    }
}

class SpecularTextureLoader extends TextureLoader {

    constructor() {
        super();
    }
    private crateFloatDataWithSize(pw: number, ph: number, pr: number, pg: number, pb: number): Float32Array {
        let total: number = pw * ph;
        let data: Float32Array = new Float32Array(total * 3);
        total *= 3;
        for (let i: number = 0; i < total;) {
            data[i] = pr;
            data[i + 1] = pg;
            data[i + 2] = pb;
            i += 3;
        }
        return data;
    }
    private crateBytesDataWithSize(pw: number, ph: number, pr: number, pg: number, pb: number): Uint8Array {
        let total: number = pw * ph;
        let data: Uint8Array = new Uint8Array(total * 4);
        total *= 4;
        for (let i: number = 0; i < total;) {
            data[i] = pr;
            data[i + 1] = pg;
            data[i + 2] = pb;
            data[i + 3] = 255;
            i += 4;
        }
        return data;
    }
    float32Enabled:boolean = false;
    protected parseTextureBuffer(buffer: ArrayBuffer): void {
        let begin: number = 0;
        let width: number = 128;
        let height: number = 128;

        let fs32: Float32Array = new Float32Array(buffer);
        let subArr: Float32Array = null;

        let tex = this.texture as IFloatCubeTexture;
        if(this.float32Enabled) {
            tex.toRGBFormatFloat32F();
        }
        else {
            tex.toRGBFormat();
        }
        tex.toRGBFormat();
        //tex.toRGBFormatFloat32F();
        tex.mipmapEnabled = false;
        if(RCExtension.OES_texture_float_linear != null || RendererDevice.IsWebGL2()) {
            tex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
            tex.magFilter = TextureConst.LINEAR;
        }
        else {
            tex.minFilter = TextureConst.NEAREST;
            tex.magFilter = TextureConst.NEAREST;
        }
        for (let j = 0; j < 8; j++) {
            for (let i = 0; i < 6; i++) {
                const size = width * height * 3;
                subArr = fs32.slice(begin, begin + size);
                tex.setDataFromBytesToFaceAt(i, subArr, width, height, j);
                //  let data: Float32Array = this.crateFloatDataWithSize(width, height, 1.0 - j/8.0, 1.0 - j/8.0, 1.0 - j/8.0);
                //  //data.fill(1.0 - j/8.0);
                //  tex.setDataFromBytesToFaceAt(i, data, width, height, j);
                begin += size;
            }
            width >>= 1;
            height >>= 1;
        }
    }
    createBytesCube(rscene: RendererScene): IBytesCubeTexture {

        let width: number = 128;
        let height: number = 128;
        let tex = rscene.textureBlock.createBytesCubeTex(width, height);
        tex.mipmapEnabled = false;
        tex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
        tex.magFilter = TextureConst.LINEAR;
        for (let j = 0; j < 8; j++) {
            for (let i = 0; i < 6; i++) {
                let r: number = Math.floor(255.0 * (1.0 - j / 8.0));
                let data: Uint8Array = this.crateBytesDataWithSize(width, height, r, r, r);
                tex.setDataFromBytesToFaceAt(i, data, width, height, j);
            }
            width >>= 1;
            height >>= 1;
        }
        return tex;
    }
}
//*/
export class DemoCubeMap {
    constructor() {
    }
    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_interaction: UserInteraction = new UserInteraction();
    initialize(): void {
        console.log("DemoCubeMap::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(900.0, 900.0, 900.0);
            rparam.setCamProject(45, 50.0, 10000.0)
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            
            this.m_interaction.initialize( this.m_rscene );
            this.m_interaction.cameraZoomController.syncLookAt = true;

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            //this.useDDSCubeTex();
            //this.useFloatDataCubeTex();
            this.useSixImageCubeTex();
            /*
            let tex0:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/default.jpg");
            var plane:Plane3DEntity = new Plane3DEntity();
            plane.name = "plane";
            plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
            this.m_rscene.addEntity(plane);
            
            //return;
            let axis:Axis3DEntity = new Axis3DEntity();
            axis.name = "axis";
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);
            //*/
        }
    }
    private useSixImageCubeTex(): void {
        let urls = [
            "static/assets/hw_morning/morning_ft.jpg",
            "static/assets/hw_morning/morning_bk.jpg",
            "static/assets/hw_morning/morning_up.jpg",
            "static/assets/hw_morning/morning_dn.jpg",
            "static/assets/hw_morning/morning_rt.jpg",
            "static/assets/hw_morning/morning_lf.jpg"
        ];
        urls = [
            "static/assets/env/shape/shape_ft.jpg",
            "static/assets/env/shape/shape_bk.jpg",
            "static/assets/env/shape/shape_up.jpg",
            "static/assets/env/shape/shape_dn.jpg",
            "static/assets/env/shape/shape_rt.jpg",
            "static/assets/env/shape/shape_lf.jpg"
        ];

        let cubeTex0: TextureProxy = this.m_texLoader.getCubeTexAndLoadImg("static/assets/cubeMap", urls);

        // this.createCubeBox( cubeTex0 );
        this.createSphere( cubeTex0 );
        
    }
    private useFloatDataCubeTex(): void {

        let envMapUrl: string = "static/bytes/spe.mdf";
        let loader: SpecularTextureLoader = new SpecularTextureLoader();
        loader.float32Enabled = true;
        loader.loadTextureWithUrl(envMapUrl, this.m_rscene);

        this.createCubeBox( loader.texture );
    }
    private useDDSCubeTex(): void {
        //let ddsUrl: string = "static/bytes/env_iem.dds";
        let ddsUrl: string = "static/bytes/env_pmrem.dds";
        //let ddsUrl: string = "static/bytes/forestIrradiance.dds";
        //let ddsUrl: string = "static/bytes/forestReflection.dds";

        let floatCubeTex = this.m_rscene.textureBlock.createFloatCubeTex(32, 32, false);
        floatCubeTex.mipmapEnabled = false;
        
        floatCubeTex.toRGBAFormat();
        if(RCExtension.OES_texture_float_linear != null || RendererDevice.IsWebGL2()) {
            floatCubeTex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
            floatCubeTex.magFilter = TextureConst.LINEAR;
        }
        else {
            floatCubeTex.minFilter = TextureConst.NEAREST;
            floatCubeTex.magFilter = TextureConst.NEAREST;
        }

        let loader: DDSLoader = new DDSLoader();
        loader.uuid = ddsUrl;
        loader.texture = floatCubeTex;
        loader.load(ddsUrl);

        this.createCubeBox( floatCubeTex );
        // this.createSphere( floatCubeTex );
    }
    private createCubeBox(cubeTex: IRenderTexture): void {

        cubeTex.mipmapEnabled = true;
        cubeTex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
        cubeTex.magFilter = TextureConst.LINEAR;
        let cubeMaterial: CubeMapMaterial = new CubeMapMaterial(true);
        cubeMaterial.setTextureLodLevel( 1.0 );
        //cubeMaterial.setTextureList
        let size: number = 500.0;
        size = 300.0;
        let box: Box3DEntity = new Box3DEntity();
        box.useGourandNormal();
        // box.showFrontFace();
        box.setMaterial(cubeMaterial);
        box.initialize(new Vector3D(-size, -size, -size), new Vector3D(size,size,size), [cubeTex]);
        this.m_rscene.addEntity(box);
    }
    private createSphere(cubeTex: IRenderTexture): void {

        cubeTex.mipmapEnabled = true;
        cubeTex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
        cubeTex.magFilter = TextureConst.LINEAR;
        let cubeMaterial: CubeMapMaterial = new CubeMapMaterial(true);
        cubeMaterial.setTextureLodLevel( 0.0 );
        //cubeMaterial.setTextureList
        let size: number = 200.0;
        
        let sph = new Sphere3DEntity();
        sph.showDoubleFace();
        // box.showFrontFace();
        sph.setMaterial(cubeMaterial);
        sph.initialize(size, 20,20, [cubeTex]);
        this.m_rscene.addEntity(sph);
    }
    private mouseDown(evt: any): void {
        let k: number = (evt.mouseX - 50.0) / 300.0;
    }
    run(): void {
        this.m_statusDisp.update();

        this.m_interaction.run();
        this.m_rscene.run();

        // this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
}

export default DemoCubeMap;