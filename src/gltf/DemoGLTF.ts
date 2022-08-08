
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import { IRendererInstanceContext } from "../vox/scene/IRendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import TextureConst from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import Color4 from "../vox/material/Color4";

export class DemoGLTF {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_rcontext: IRendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_clearColor: Color4 = new Color4;
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoGLTF::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            let rparam: RendererParam = new RendererParam();
            rparam.setCamPosition(800.0,800.0,800.0);
            rparam.setAttriAntialias( true );
            rparam.setAttriStencil(true);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_rcontext = this.m_rscene.getRendererContext();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            
            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            let pwindow: any = window;
            let testKeyNS:string = "testKey";
            console.log("typeof(pwindow[testKeyNS]): ",typeof(pwindow[testKeyNS]));
            console.log("typeof(typeof(pwindow[testKeyNS])): ",typeof(typeof(pwindow[testKeyNS])));
            console.log("pwindow[testKeyNS] !== undefined: ",pwindow[testKeyNS] !== undefined);
            console.log("typeof(pwindow[testKeyNS]) !== undefined: ",typeof(pwindow[testKeyNS]) !== undefined);

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(500.0);
            this.m_rscene.addEntity(axis,1);

            this.update();
            //  let objStr = JSON.stringify(json);
            //  let obj = JSON.parse(json);
            //this.m_clearColor.setRGBUint24(0xc3dabb);
            this.m_clearColor.setRGBUint24(0x265d7e);
            //
            this.m_rscene.setClearColor(this.m_clearColor);
            
            this.initTest();
        }
    }
    private initTest(): void {

        let purl: string = "static/assets/gltf/sample01/sample01.gltf";

        const request = new XMLHttpRequest();
        request.open("GET", purl, true);
        request.responseType = "text";
        request.onload = () => {
            //reader.readAsArrayBuffer(request.response);
            //console.log("request.response: ",request.response);
            let gltf: any = JSON.parse( request.response );
            console.log( gltf );
        };
        request.send();
    }
    private mouseDown(evt: any): void {
        console.log("mouse down... ...");
    }
    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps

        this.m_statusDisp.render();
    }
    run(): void {

        this.m_statusDisp.update(false);
        
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(null, 30.0);

        this.m_rscene.run( true );
        this.m_profileInstance.run();
    }
}
export default DemoGLTF;