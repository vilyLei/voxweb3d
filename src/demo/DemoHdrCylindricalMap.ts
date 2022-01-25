
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import TextureConst from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import HdrCylMapMaterial from "./material/HdrCylMapMaterial";
import Vector3D from "../vox/math/Vector3D";
import URLTool from "../vox/utils/URLTool";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import { RGBE,RGBEParser } from '../vox/assets/RGBEParser.js';
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import BinaryLoader from "../vox/assets/BinaryLoader";
import CylindricMapMaterial from "./material/CylindricMapMaterial";

export class DemoHdrCylindricalMap {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true,powerOf2Fix:boolean = false): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl,0,false, powerOf2Fix);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoHdrCylindricalMap::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            let purl: string = 'https://ko.hou.aliyuncs.com/vr/hghyDeJ2XzH3FAY.pto?reawe=5.fg';
            let fileSuffix: any = URLTool.GetURLFileSuffix(purl);
            console.log("fileSuffix: ", fileSuffix);

            let rparam: RendererParam = new RendererParam();
            rparam.maxWebGLVersion = 1;
            rparam.setAttriAntialias( true );
            //rparam.setCamPosition(800.0,800.0,800.0);
            rparam.setCamPosition(30.0, 100.0, 3800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_rcontext = this.m_rscene.getRendererContext();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            
            this.m_rscene.enableMouseEvent(true);
            
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());

            this.m_rscene.enableMouseEvent(true);
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);

            //this.initCommonTest();
            this.initHdrTest();
        }
    }
    
    private initCommonTest(): void {
        let posTex: TextureProxy = this.getImageTexByUrl("static/assets/hdr/night_free_Bg.jpg");
        //let posTex: TextureProxy = this.getImageTexByUrl("static/assets/hdr/orangeRoom.jpg");
        //let posTex: TextureProxy = this.getImageTexByUrl("static/assets/vrTest.jpg",true,true,true);
        //let posTex: TextureProxy = this.getImageTexByUrl("static/assets/redBullSolo.jpg",true,true,false);
        //posTex.setWrap(TextureConst.WRAP_CLAMP_TO_EDGE);
        posTex.minFilter = TextureConst.LINEAR;
        posTex.magFilter = TextureConst.LINEAR;
        //posTex.mipmapEnabled = true;
        let material: CylindricMapMaterial = new CylindricMapMaterial();
        let sph: Sphere3DEntity = new Sphere3DEntity();
        sph.setMaterial( material );

        let isShowFront: boolean = false;
        if(isShowFront) {
            sph.showFrontFace();
            material.showFront();
        } else {
            sph.showBackFace();
            material.showBack();
        }
        sph.initialize(800.0, 50, 50, [posTex]);
        this.m_rscene.addEntity(sph);
        
    }
    private initHdrTest(): void {
        
        let loader: BinaryLoader = new BinaryLoader();
        //loader.load("static/assets/hdr/night_free_Env_512x256.hdr", this);
        //loader.load("static/assets/hdr/cool_white.hdr", this);
        loader.load("static/assets/hdr/studio_lowContrast.hdr", this);
        //loader.load("static/assets/hdr/studioLight_gray.hdr", this);
        //loader.load("static/assets/hdr/memorial.hdr", this);
        //loader.load("static/assets/hdr/HDR_029_Sky_Cloudy_Env.hdr", this);
    }
    private m_hdrRGBEMaterial: HdrCylMapMaterial = null;
    private mouseDown(evt: any): void
    {
        if(this.m_hdrRGBEMaterial != null) {
            let exposure: number = evt.mouseX/200.0;
            this.m_hdrRGBEMaterial.setExposure( exposure );
        }
    }

    private createByteTexByBytes(bytes: Uint8Array, pw: number, ph: number): IRenderTexture {
        
        let posTex = this.m_rscene.textureBlock.createBytesTex(pw, ph);
        posTex.setWrap(TextureConst.WRAP_CLAMP_TO_EDGE);
        //posTex.mipmapEnabled = false;
        //posTex.minFilter = TextureConst.NEAREST;
        //posTex.magFilter = TextureConst.NEAREST;

        posTex.setDataFromBytes(bytes, 0, pw, ph, 0,0,false);
        return posTex;
    }
    loaded(buffer: ArrayBuffer, uuid: string): void {
        console.log("loaded... uuid: ", uuid,buffer.byteLength);


        let parser:RGBEParser = new RGBEParser();
        let rgbe:RGBE = parser.parse(buffer);
        console.log("parse finish, rgbeData: ",rgbe);

        let ftex = this.createByteTexByBytes(rgbe.data as Uint8Array, rgbe.width, rgbe.height);

        this.m_hdrRGBEMaterial = new HdrCylMapMaterial();
        let sph: Sphere3DEntity = new Sphere3DEntity();
        sph.setMaterial(this.m_hdrRGBEMaterial);
        sph.initialize(400.0, 20, 20, [ftex]);
        //sph.setXYZ(Math.random() * 700.0 - 350.0, Math.random() * 700.0 - 350.0, Math.random() * 700.0 - 350.0);
        this.m_rscene.addEntity(sph);
        this.update();            
    }
    loadError(status: number, uuid: string): void {

    }
    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps
        let pcontext: RendererInstanceContext = this.m_rcontext;
        this.m_statusDisp.statusInfo = "/" + pcontext.getTextureResTotal() + "/" + pcontext.getTextureAttachTotal();
        this.m_statusDisp.render();
    }
    private m_lookAt: Vector3D = new Vector3D();
    run(): void {
        this.m_statusDisp.update(false);

        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(this.m_lookAt, 30.0);
        
        this.m_rscene.run(true);

        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        this.m_profileInstance.run();
    }
}
export default DemoHdrCylindricalMap;