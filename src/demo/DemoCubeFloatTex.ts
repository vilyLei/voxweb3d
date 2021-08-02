
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import TextureProxy from "../vox/texture/TextureProxy";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import { TextureConst } from "../vox/texture/TextureConst";
import FloatTextureProxy from "../vox/texture/FloatTextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import ILoaderListerner from "../vox/assets/ILoaderListerner";
import BinaryLoader from "../vox/assets/BinaryLoader";

import BytesTextureProxy from "../vox/texture/BytesTextureProxy";
import MouseEvent from "../vox/event/MouseEvent";
import FloatCubeMapMaterial from "../vox/material/mcase/FloatCubeMapMaterial";
import Box3DEntity from "../vox/entity/Box3DEntity";
import FloatCubeTextureProxy from "../vox/texture/FloatCubeTextureProxy";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";

export class DemoCubeFloatTex implements ILoaderListerner {
    constructor() { }
    private m_rscene: RendererScene = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    private createFloatTex(): FloatTextureProxy {
        let texSize: number = 32;
        let posTex: FloatTextureProxy = this.m_rscene.textureBlock.createFloatTex2D(texSize, texSize);
        posTex.setWrap(TextureConst.WRAP_CLAMP_TO_EDGE);
        posTex.mipmapEnabled = true;
        //posTex.minFilter = TextureConst.NEAREST;
        //posTex.magFilter = TextureConst.NEAREST;
        //posTex.
        let fs: Float32Array = new Float32Array(texSize * texSize * 4);
        fs.fill(1.0);
        for (let r: number = 0; r < texSize; ++r) {
            for (let c: number = 0; c < texSize; ++c) {
                let k: number = (r * texSize + c) * 4;
                //fs[k + 0] = 50.0;
                fs[k + 1] = 0.0;
                //fs[k + 2] = 0.0;
            }
        }
        posTex.setDataFromBytes(fs, 0, texSize, texSize);
        return posTex;
    }

    private createFloatTexByBytes(fs: Float32Array, pw: number, ph: number): FloatTextureProxy {

        let posTex: FloatTextureProxy = this.m_rscene.textureBlock.createFloatTex2D(pw, ph);
        posTex.setWrap(TextureConst.WRAP_CLAMP_TO_EDGE);
        //posTex.mipmapEnabled = false;
        posTex.minFilter = TextureConst.NEAREST;
        posTex.magFilter = TextureConst.NEAREST;

        posTex.setDataFromBytes(fs, 0, pw, ph);
        return posTex;
    }
    private createByteTexByBytes(bytes: Uint8Array, pw: number, ph: number): BytesTextureProxy {

        let posTex: BytesTextureProxy = this.m_rscene.textureBlock.createBytesTex(pw, ph);
        posTex.setWrap(TextureConst.WRAP_CLAMP_TO_EDGE);
        //posTex.mipmapEnabled = false;
        posTex.minFilter = TextureConst.NEAREST;
        posTex.magFilter = TextureConst.NEAREST;

        posTex.setDataFromBytes(bytes, 0, pw, ph);
        return posTex;
    }
    initialize(): void {
        console.log("DemoCubeFloatTex::initialize()......");
        if (this.m_rcontext == null) {
            RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(500.0, 500.0, 500.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_rcontext = this.m_rscene.getRendererContext();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_rscene.enableMouseEvent(true);
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            this.m_statusDisp.initialize("rstatus", this.m_rscene.getStage3D().viewWidth - 180);

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(500.0);
            this.m_rscene.addEntity(axis);

            this.initFloatCube();
        }
    }
    private initFloatCube(): void {
        let url: string = "static/bytes/d.bin";
        let loader: BinaryLoader = new BinaryLoader();
        loader.uuid = url;
        loader.load(url, this);
    }
    private m_targetMaterial: FloatCubeMapMaterial = null;
    private mouseDown(evt: any): void {
        if (this.m_targetMaterial != null) {
            let exposure: number = Math.max(evt.mouseX - 20, 0.0) / 200.0;
            this.m_targetMaterial.setExposure(exposure);
        }
    }
    loaded(buffer: ArrayBuffer, uuid: string): void {
        console.log("loaded... uuid: ", uuid, buffer.byteLength);
        if(uuid == "static/bytes/d.bin") {
            this.parseDCubeMap(buffer);
        }
        else if(uuid == "static/bytes/spe.mdf") {
            this.parseSCubeMap(buffer);
        }
    }
    loadError(status: number, uuid: string): void {

    }
    
    private parseDCubeMap(buffer: ArrayBuffer): void {
        let begin: number = 0;
        let width: number = 128;
        let height: number = 128;
        let size: number = width * height * 3;
        let fs32: Float32Array = new Float32Array(buffer);
        let subArr: Float32Array = null;

        let tex: FloatCubeTextureProxy;
        tex = this.m_rscene.textureBlock.createFloatCubeTex(width, height);
        tex.toRGBFormat();
        //tex.toRGBFormatHalfFloat();
        //tex.mipmapEnabled = false;
        for (let i: number = 0, len: number = 6; i < len; ++i) {
            subArr = fs32.slice(begin, begin + size);
            console.log("width,height: ", width, height, ", subArr.length: ", subArr.length);
            tex.setDataFromBytesToFaceAt(i, subArr, width, height, 0);
            begin += size;
        }
        let material: FloatCubeMapMaterial = new FloatCubeMapMaterial();
        this.m_targetMaterial = material;
        let box: Box3DEntity = new Box3DEntity();
        
        box.useGourandNormal();
        box.setMaterial(material);
        box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex]);
        this.m_rscene.addEntity(box);
    }
    private parseSCubeMap(buffer: ArrayBuffer): void {
        let begin: number = 0;
        let width: number = 128;
        let height: number = 128;
        let size: number = width * height * 3;
        let fs32: Float32Array = new Float32Array(buffer);
        let subArr: Float32Array = null;

        let tex: FloatCubeTextureProxy;
        tex = this.m_rscene.textureBlock.createFloatCubeTex(width, height);
        tex.toRGBFormat();
        tex.mipmapEnabled = false;
        //let begin:number = 0;
        for (let j = 0; j < 9; j++) {
            for (let i = 0; i < 6; i++) {
                const size = width * height * 3;
                subArr = fs32.slice(begin, begin + size);
                tex.setDataFromBytesToFaceAt(i, subArr, width, height, j);
                begin += size;
            }
            width >>= 1;
            height >>= 1;
        }

        let material: FloatCubeMapMaterial = new FloatCubeMapMaterial();
        this.m_targetMaterial = material;

        //  let box: Box3DEntity = new Box3DEntity();        
        //  box.useGourandNormal();
        //  box.setMaterial(material);
        //  box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex]);
        //  this.m_rscene.addEntity(box);

        
        let sph: Sphere3DEntity = new Sphere3DEntity();
        sph.setMaterial(material);
        sph.initialize(100.0,30,30, [tex]);
        this.m_rscene.addEntity(sph);
    }
    run(): void {
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(null, 30.0);
        // show fps status
        this.m_statusDisp.update();
        if(this.m_targetMaterial != null) {
            let pv: Vector3D = this.m_rscene.getCamera().getPosition();
            this.m_targetMaterial.setcamPos(pv.x,pv.y,pv.z);
        }
        this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);
        this.m_rscene.run(true);

        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
}
export default DemoCubeFloatTex;