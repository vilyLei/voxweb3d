import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import Stage3D from "../vox/display/Stage3D";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import DivLog from "../vox/utils/DivLog";
import MouseEvent from "../vox/event/MouseEvent";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import Color4 from "../vox/material/Color4";
import VBuf4Material from "./material/VBuf4Material";
import VBuf1Material from "./material/VBuf1Material";
import VBuf2Material from "./material/VBuf2Material";
import VBuf3Material from "./material/VBuf3Material";
import VBuf2AMaterial from "./material/VBuf2AMaterial";
import DataMesh from "../vox/mesh/DataMesh";
import ImageTextureProxy from "../vox/texture/ImageTextureProxy";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
export class DemoSharedVBuf {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    getImageTexByUrl(purl: string): TextureProxy {
        return this.m_texLoader.getImageTexByUrl(purl);
    }

    private initEvent(): void {

        let stage3D: Stage3D = this.m_rscene.getStage3D() as Stage3D;
        stage3D.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
        stage3D.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener);
        stage3D.addEventListener(MouseEvent.MOUSE_MOVE, this, this.mouseMoveListener);

        // stage3D.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.test_bgmouseDownListener);
        // stage3D.addEventListener(MouseEvent.MOUSE_BG_UP, this, this.test_bgmouseUpListener);
    }
    mouseDownListener(evt: any): void {
        // console.log("mouseDown...");
    }
    mouseUpListener(evt: any): void {
        // console.log("mouseUP...");
    }
    mouseMoveListener(evt: any): void {
        //console.log("mouseDown...");
        //this.m_rscene.setClearRGBColor3f(Math.random(), 0, Math.random());
    }

    private m_clearColor = new Color4(0.1, 0.2, 0.1, 1.0);
    private m_tex: IRenderTexture = null;
    initialize(): void {

        console.log("DemoSharedVBuf::initialize()......");
        console.log("XXXXXX: ", (4096 * 4096) / 3);

        if (this.m_rscene == null) {
            //H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);

            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            DivLog.SetDebugEnabled(false);

            let rparam = new RendererParam();
            // rparam.maxWebGLVersion = 1;
            rparam.setCamProject(45, 0.1, 6000.0);
            rparam.setCamPosition(1100.0, 1100.0, 1100.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_tex = this.getImageTexByUrl("static/assets/broken_iron.jpg");

            this.m_rscene.enableMouseEvent(true);
            // this.m_rscene.enableMouseEvent(false);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
        }
    }
    private m_initing = true;
    private initialize2(): void {

        // console.log("DemoSharedVBuf::initialize()......");
        // console.log("XXXXXX: ", (4096 * 4096) / 3);

        if ( this.m_tex.isDataEnough() && this.m_initing ) {

            this.m_initing = false;
            //H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);
            let tex1 = this.m_tex;
            console.log("##################### ############ A ############ ###################");
            
            let cvs = new Float32Array(72);
            let len = 72;
            for(let i = 0; i < len;) {
                cvs[i++] = 1.0;
                cvs[i++] = 0.0;
                cvs[i++] = 0.5;
            }
            let ivs = new Uint16Array([3, 2, 1, 3, 1, 0, 6, 7, 4, 6, 4, 5, 11, 10, 9, 11, 9, 8, 15, 14, 13, 15, 13, 12, 18, 19, 16, 18, 16, 17, 22, 23, 20, 22, 20, 21]);
            let nvs = new Float32Array([0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
            let vs = new Float32Array([1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, 1, -1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]);
            
            for(let i = 0; i < vs.length; ++i) {
                vs[i] *= 60;
            }
            let uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1]);
            
            let mesh = new DataMesh();
            mesh.vbWholeDataEnabled = false;
            mesh.setVS(vs);
            mesh.setUVS(uvs);
            mesh.setNVS(nvs);
            mesh.setCVS(cvs);
            mesh.setIVS(ivs);

            let materialPurple = new VBuf4Material();
            materialPurple.initializeByCodeBuf(true);
            mesh.setBufSortFormat(materialPurple.getBufSortFormat());
            mesh.initialize();

            let boxPurple = new Box3DEntity();
            boxPurple.vbWholeDataEnabled = false;
            boxPurple.normalEnabled = true;
            boxPurple.vtxColor = new Color4(1.0,0.0,0.5);
            boxPurple.setMaterial( materialPurple );
            boxPurple.setMesh(mesh);
            boxPurple.initialize(new Vector3D(-60.0, -60.0, -60.0), new Vector3D(60.0, 60.0, 60.0), [tex1]);
            boxPurple.setXYZ(-500, 0, 0);
            this.m_rscene.addEntity(boxPurple);

            mesh = boxPurple.getMesh() as any;
            // console.log("mesh: ",pmesh);
            /*

            let mateiralRed = new VBuf1Material();
            mateiralRed.initializeByCodeBuf(false);
            mateiralRed.setRGB3f(1.0,0.0,0.0);
            let boxRed = new DisplayEntity();
            boxRed.setMaterial(mateiralRed);
            boxRed.setMesh(mesh);
            boxRed.setXYZ(-200, 0, 0);
            this.m_rscene.addEntity(boxRed);

            let mateiralGreen = new VBuf2Material();
            mateiralGreen.initializeByCodeBuf(true);
            mateiralGreen.setTextureList( [tex1] );
            mateiralGreen.setRGB3f(0.2,1.0,0.2);
            let boxGreen = new DisplayEntity();
            boxGreen.setMaterial(mateiralGreen);
            boxGreen.setMesh(mesh);
            boxGreen.setXYZ(100, 0, 0);
            this.m_rscene.addEntity(boxGreen);

            
            let mateiralYellow = new VBuf3Material();
            mateiralYellow.initializeByCodeBuf(true);
            mateiralYellow.setTextureList( [tex1] );
            mateiralYellow.setRGB3f(1.0,1.0,0.2);
            let boxYellow = new DisplayEntity();
            boxYellow.setMaterial(mateiralYellow);
            boxYellow.setMesh(mesh);
            boxYellow.setXYZ(400, 0, 0);
            this.m_rscene.addEntity(boxYellow);

            //*/
            console.log("##################### ############ B ############ ###################");

            let mateiralWhite = new VBuf2AMaterial();
            mateiralWhite.initializeByCodeBuf(false);
            mateiralWhite.setRGB3f(1.0,1.0,1.0);
            let boxWhite = new DisplayEntity();
            boxWhite.setMaterial(mateiralWhite);
            boxWhite.setMesh(mesh);
            boxWhite.setXYZ(-500, 0, 200);
            this.m_rscene.addEntity(boxWhite);


            this.initEvent();
            this.m_rscene.setClearColor(this.m_clearColor);
        }
    }
    run(): void {

        if(this.m_rscene != null) {
            this.initialize2();

            this.m_stageDragSwinger.runWithYAxis();
            this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);
    
            this.m_rscene.run(true);

        }
    }
}
export default DemoSharedVBuf;
