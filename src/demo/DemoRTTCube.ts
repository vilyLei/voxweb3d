
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import FrustrumFrame3DEntity from "../vox/entity/FrustrumFrame3DEntity";
import ScreenAlignPlaneEntity from "../vox/entity/ScreenAlignPlaneEntity";
import { TextureConst } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import FBOInstance from "../vox/scene/FBOInstance";
import CameraBase from "../vox/view/CameraBase";
import MathConst from "../vox/math/MathConst";
import CubeRTTScene from "./base/CubeRTTScene";
import CubeMapMaterial from "../vox/material/mcase/CubeMapMaterial";

export class DemoRTTCube {
    constructor() { }

    private m_rscene: RendererScene = null;
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
        console.log("DemoRTTCube::initialize()......");
        if (this.m_rscene == null) {
            RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize("rstatus", this.m_rscene.getStage3D().viewWidth - 200);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            //  let axis: Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(300.0);
            //  this.m_rscene.addEntity(axis);

            // add common 3d display entity
            //      let plane:Plane3DEntity = new Plane3DEntity();
            //      plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            //      this.m_rscene.addEntity(plane);
            //      this.m_targets.push(plane);
            //      //this.m_disp = plane

            this.initSceneObjs();
            this.initCubeRTT();

            this.update();
        }
    }

    private m_cubeRTTSC: CubeRTTScene = new CubeRTTScene();

    private m_projType: number = 0;
    private m_fboIns: FBOInstance = null;
    private m_rttCamera:CameraBase = null;
    private m_targetBox: Box3DEntity;
    private initSceneObjs(): void {
        
        let box: Box3DEntity;

        let dis: number = 600.0;
        let posList: Vector3D[] = [
            new Vector3D(dis, 0.0, 0.0),
            new Vector3D(-dis, 0.0, 0.0),

            new Vector3D(0.0, dis, 0.0),
            new Vector3D(0.0, -dis, 0.0),
            
            new Vector3D(0.0, 0.0, dis),
            new Vector3D(0.0, 0.0, -dis),
            
        ];
        for(let i: number = 0; i < posList.length; ++i) {

            box = new Box3DEntity();
            box.uvPartsNumber = 6;
            box.initializeCube(100.0, [this.getImageTexByUrl("static/assets/sixParts.jpg")]);
            box.setScaleXYZ(2.0, 2.0, 2.0);
            //box.setXYZ(0.0, 170.0, 0.0);
            box.setPosition( posList[i] );
            this.m_rscene.addEntity(box, 0);
        }

        
        this.m_cubeRTTSC.initialize(this.m_rscene, 512.0, 512.0);

        let urls = [
            "static/assets/hw_morning/morning_ft.jpg",
            "static/assets/hw_morning/morning_bk.jpg",
            "static/assets/hw_morning/morning_up.jpg",
            "static/assets/hw_morning/morning_dn.jpg",
            "static/assets/hw_morning/morning_rt.jpg",
            "static/assets/hw_morning/morning_lf.jpg"
        ];

        let cubeTex0: TextureProxy = this.m_texLoader.getCubeTexAndLoadImg("static/assets/cubeMap", urls);

        box = new Box3DEntity();
        box.useGourandNormal();
        box.setMaterial(new CubeMapMaterial());

        //  box.initializeCube(100.0, [this.getImageTexByUrl("static/assets/default.jpg")]);
        box.initializeCube(100.0, [ this.m_cubeRTTSC.getCubeTexture() ]);
        //box.initializeCube(100.0, [ cubeTex0 ]);
        box.setScaleXYZ(2.0, 2.0, 2.0);
        //box.setXYZ(0.0, 170.0, 0.0);
        this.m_rscene.addEntity(box, 0);
        this.m_targetBox = box;

        this.m_cubeRTTSC.setDispEntity(this.m_targetBox);
    }
    private initCubeRTT(): void {

        this.m_projType = 0;

    }
    private m_flag: boolean = true;
    private mouseDown(evt: any): void {

        this.m_flag = true;
    }
    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 40);// 20 fps

        this.m_statusDisp.render();

    }
    run(): void {
        //  if(this.m_flag) {
        //      this.m_flag = false;
        //  }
        //  else {
        //      return;
        //  }

        this.m_statusDisp.update(false);
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        if(this.m_projType == 1) {

            this.m_rscene.run(true);
        }
        else {
            this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
            //this.m_rscene.useCamera(this.m_rttCamera);
            this.m_rscene.runBegin();
            this.m_rscene.update(false);
            
            // --------------------------------------------- fbo run begin
            //this.m_fboIns.run();
            this.m_cubeRTTSC.run();
            // --------------------------------------------- fbo run end
            
            this.m_rscene.setRenderToBackBuffer();
            this.m_rscene.useMainCamera();

            this.m_rscene.runAt(0);
            this.m_rscene.runAt(1);
            
            this.m_rscene.runEnd();
        }

    }
}
export default DemoRTTCube;