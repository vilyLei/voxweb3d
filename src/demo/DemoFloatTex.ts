
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

import FloatTexMaterial from "./material/FloatTexMaterial";
import HDRRGBETexMaterial from "./material/HDRRGBETexMaterial";
import ILoaderListerner from "../vox/assets/ILoaderListerner";
import BinaryLoader from "../vox/assets/BinaryLoader";

import { RGBE,RGBEParser } from '../vox/assets/RGBEParser.js';
import BytesTextureProxy from "../vox/texture/BytesTextureProxy";
import MouseEvent from "../vox/event/MouseEvent";
export class DemoFloatTex implements ILoaderListerner {
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
        posTex.minFilter = TextureConst.NEAREST;
        posTex.magFilter = TextureConst.NEAREST;
        
        let fs: Float32Array = new Float32Array(texSize * texSize * 4);
        fs.fill(1.0);
        for (let r: number = 0; r < texSize; ++r) {
            for (let c: number = 0; c < texSize; ++c) {
                let k: number = (r * texSize + c) * 4;
                //fs[k + 0] = 50.0;
                fs[k + 1] = r/texSize;
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
        console.log("DemoFloatTex::initialize()......");
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

            this.m_statusDisp.initialize("rstatus", this.m_rscene.getStage3D().stageWidth - 10);

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(500.0);
            this.m_rscene.addEntity(axis);

            this.initFloatTexEntity();
            //this.initHdrRGBEFloatTexEntity();
            //this.initHdrFloatTexEntity();
        }
    }
    private initFloatTexEntity(): void {

        let tex: TextureProxy = this.createFloatTex();
        let material: FloatTexMaterial = new FloatTexMaterial();
        material.setTextureList([tex]);
        
        var plane: Plane3DEntity = new Plane3DEntity();
        plane.setMaterial(material);
        
        plane.initializeXOZ(0.0, 0.0, 200.0, 150.0, [tex]);
        this.m_rscene.addEntity(plane);
    }
    private initHdrRGBEFloatTexEntity(): void {
        
        let loader: BinaryLoader = new BinaryLoader();
        loader.uuid = "rgbe_hdr";
        loader.load("static/assets/hdr/night_free_Env_512x256.hdr", this);
    }
    private initHdrFloatTexEntity(): void {
        
        let loader: BinaryLoader = new BinaryLoader();
        loader.uuid = "float_hdr";
        loader.load("static/assets/hdr/floatHdr.hdr", this);
    }
    private m_hdrRGBEMaterial: HDRRGBETexMaterial = null;
    private mouseDown(evt: any): void
    {
        if(this.m_hdrRGBEMaterial != null) {
            let exposure: number = evt.mouseX/200.0;
            this.m_hdrRGBEMaterial.setExposure( exposure );
        }
    }
    loaded(buffer: ArrayBuffer, uuid: string): void {
        console.log("loaded... uuid: ", uuid,buffer.byteLength);

        if(uuid == "rgbe_hdr") {
            this.initRGBE(buffer);
        }
        else if(uuid == "float_hdr") {
            this.initFloat(buffer);
        }
    }
    private initRGBE(buffer: ArrayBuffer): void {

        let parser:RGBEParser = new RGBEParser();
        let rgbe:RGBE = parser.parse(buffer);
        console.log("parse rgbeData: ",rgbe);

        let ftex:TextureProxy = this.createByteTexByBytes(rgbe.data as Uint8Array, rgbe.width, rgbe.height);

        this.m_hdrRGBEMaterial = new HDRRGBETexMaterial();
        this.m_hdrRGBEMaterial.setTextureList([ftex]);
        // add common 3d display entity
        var plane: Plane3DEntity = new Plane3DEntity();
        plane.setMaterial(this.m_hdrRGBEMaterial);
        plane.initializeXOZ(0.0, 0.0, 200.0, 150.0, [ftex]);
        this.m_rscene.addEntity(plane);
    }
    private initFloat(buffer: ArrayBuffer): void {

        let tex: TextureProxy = this.createFloatTex();
        let material: FloatTexMaterial = new FloatTexMaterial();
        material.setTextureList([tex]);
        
        var plane: Plane3DEntity = new Plane3DEntity();
        plane.setMaterial(material);
        
        plane.initializeXOZ(0.0, 0.0, 200.0, 150.0, [tex]);
        this.m_rscene.addEntity(plane);
    }
    loadError(status: number, uuid: string): void {

    }
    run(): void {
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(null, 30.0);
        // show fps status
        this.m_statusDisp.update();

        this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);
        this.m_rscene.run( true);
        
        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
}
export default DemoFloatTex;