
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import { TextureConst } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import BinaryLoader from "../vox/assets/BinaryLoader";

export class DemoFileSystem {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoFileSystem::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
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

            //  this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            //  this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(500.0);
            this.m_rscene.addEntity(axis,1);

            this.update();

            var pdiv: any = document.createElement('div');
            pdiv.width = 128;
            pdiv.height = 64;
            pdiv.style.backgroundColor = "#77aa88";
            pdiv.style.left = '0px';
            pdiv.style.top = '156px';
            pdiv.style.position = 'absolute';
            pdiv.style["pointer-events"] = "none";
            document.body.appendChild(pdiv);
            pdiv.innerHTML = "点击下载";

            this.initExampleLoad();
        }
    }
    
    private initExampleLoad(): void {

        let loader: BinaryLoader = new BinaryLoader();
        loader.load("static/bytes/example.bin", this);
    }
    private mouseDown(evt: any): void {
        console.log("mouse down... ...");
        //this.downloadTxtFile();
        this.downloadBinFile2();
    }
    private downloadBinFile2(): void {
        var downloadBlob: any, downloadURL: any;

        downloadBlob = function(data:any, fileName: string, mimeType: any) {
        var blob: Blob, url:string;
        blob = new Blob([data], {
            type: mimeType
        });
        url = window.URL.createObjectURL(blob);
        downloadURL(url, fileName);
        setTimeout(function() {
            return window.URL.revokeObjectURL(url);
        }, 1000);
        };

        downloadURL = function(data: any, fileName: string): void {
            var a: any;
            a = document.createElement('a');
            a.href = data;
            a.download = fileName;
            document.body.appendChild(a);
            a.style = 'display: none';
            a.click();
            a.remove();
        }

        var samplerData = new Int8Array(128);
        for(let i:number = 0; i < samplerData.length; ++i) {
            samplerData[i] = i;
        }
        downloadBlob(samplerData, 'example.bin', 'application/octet-stream');
    }
    private downloadBinFile1(): void {
        var samplerData = new Int8Array(128);
        for(let i:number = 0; i < 128; ++i) {
            samplerData[i] = i;
        }
        //var samplerData = "Hello, boy.";

        var saveByteArray = (function () {
            var a:any = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            return function (data: any, name: any) {
                //{type: "text/plain"}
                //var blob = new Blob(data, {type: "octet/stream"}),
                var blob = new Blob(data, {type: "application/octet-stream"}),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = name;
                a.click();
                window.URL.revokeObjectURL(url);
            };
        }());
        
        saveByteArray([samplerData], 'example.bytes');
    }
    loaded(buffer: ArrayBuffer, uuid: string): void {
        console.log("loaded... uuid: ", uuid,buffer.byteLength);
        console.log("loaded buffer: ", buffer);           
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

        this.m_statusDisp.render();
    }
    run(): void {

        this.m_statusDisp.update(false);
        
        //  this.m_stageDragSwinger.runWithYAxis();
        //  this.m_cameraZoomController.run(null, 30.0);

        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);

        this.m_rscene.run( true );
        //this.m_profileInstance.run();

    }
}
export default DemoFileSystem;