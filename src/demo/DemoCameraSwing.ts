
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Stage3D from "../vox/display/Stage3D";
import RendererSubScene from '../vox/scene/RendererSubScene';
import RendererScene from "../vox/scene/RendererScene";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import ObjData3DEntity from "../vox/entity/ObjData3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import ColorRectImgButton from "../orthoui/button/ColorRectImgButton";
import BoundsButton from "../orthoui/button/BoundsButton";
import {CameraDragSwinger} from "../voxeditor/control/CameraDragSwinger";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";


export class DemoCameraSwing {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_uiscene: RendererSubScene = null;
    private m_texLoader: ImageTextureLoader;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_stage3D: Stage3D = null;
    private m_dragSwinger: CameraDragSwinger = new CameraDragSwinger();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    initialize(): void {
        console.log("DemoCameraSwing::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            this.m_statusDisp.initialize();

            let rparam: RendererParam = new RendererParam();
            rparam.setMatrix4AllocateSize(8192 * 4);
            rparam.setCamProject(45.0, 0.1, 3000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);

            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.enableMouseEvent(true);

            //this.m_dragSwinger.initialize(this.m_rscene.getStage3D(),this.m_rscene.getCamera());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_stage3D = this.m_rscene.getStage3D() as Stage3D;

            //this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN,this,this.mouseDownListener);
            //this.m_stage3D.addEventListener(MouseEvent.MOUSE_BG_DOWN,this,this.mouseDownListener);

            rparam = new RendererParam();
            rparam.cameraPerspectiveEnabled = false;
            rparam.setCamProject(45.0, 50.0, 6000.0);
            rparam.setCamPosition(0.0, 0.0, 1500.0);
            let subScene: RendererSubScene = null;
            subScene = this.m_rscene.createSubScene();
            subScene.initialize(rparam);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            let tex0 = this.m_texLoader.getTexByUrl("static/assets/default.jpg");
            let tex1 = this.m_texLoader.getTexByUrl("static/assets/broken_iron.jpg");
            let tex2 = this.m_texLoader.getTexByUrl("static/assets/warter_01.jpg");
            let tex3 = this.m_texLoader.getTexByUrl("static/assets/bt_reset_01.png");

            subScene.enableMouseEvent(false);
            this.m_uiscene = subScene;
            // left bottom align, is origin position.
            this.m_uiscene.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth, this.m_stage3D.stageHalfHeight, 1500.0);

            // mouse swing camera in the hot area.
            let viewHotArea: BoundsButton = new BoundsButton();
            viewHotArea.initializeBtn2D(this.m_stage3D.stageWidth, this.m_stage3D.stageHeight);
            this.m_uiscene.addEntity(viewHotArea);
            viewHotArea.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            viewHotArea.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener);
            viewHotArea.addEventListener(MouseEvent.MOUSE_WHEEL, this, this.mouseWheeelListener);

            let resetCameraBtn: ColorRectImgButton = new ColorRectImgButton();
            resetCameraBtn.flipVerticalUV = true;
            resetCameraBtn.outColor.setRGB3f(0.0, 1.0, 0.0);
            resetCameraBtn.overColor.setRGB3f(0.0, 1.0, 1.0);
            resetCameraBtn.downColor.setRGB3f(1.0, 0.0, 1.0);
            resetCameraBtn.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
            resetCameraBtn.initialize(0.0, 0.0, 64.0, 64.0, [tex3]);
            this.m_uiscene.addEntity(resetCameraBtn);
            resetCameraBtn.setXYZ(this.m_stage3D.stageWidth - 64.0, 0.0, 0.1);
            resetCameraBtn.addEventListener(MouseEvent.MOUSE_UP, this, this.resetCameraListener);

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            let i: number = 0;

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(600.0);
            this.m_rscene.addEntity(axis);

            let sphere: Sphere3DEntity = null;
            for (i = 0; i < 1; ++i) {
                sphere = new Sphere3DEntity();
                sphere.initialize(50.0, 15, 15, [tex1]);
                sphere.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
                this.m_rscene.addEntity(sphere);
            }
            let box: Box3DEntity = null;
            for (i = 0; i < 1; ++i) {
                box = new Box3DEntity();
                box.initialize(new Vector3D(-80.0, -50.0, -50.0), new Vector3D(80.0, 50.0, 50.0), [tex0]);
                //box.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                box.setXYZ(-300.0, 100.0, 0.0);
                this.m_rscene.addEntity(box);
            }
            let objUrl: string;
            objUrl = "static/assets/obj/env_03.obj";
            let objDisp: ObjData3DEntity = new ObjData3DEntity();
            objDisp.moduleScale = 10.0;
            objDisp.initializeByObjDataUrl(objUrl, [tex2]);
            this.m_rscene.addEntity(objDisp);
        }
    }

    private resetCameraListener(evt: any): void {
        this.m_rscene.getCamera().lookAtRH(new Vector3D(1500.0, 1500.0, 1500.0), new Vector3D(), new Vector3D(0.0, 1.0, 0.0));
        this.m_rscene.getCamera().setRotationXYZ(0.0, 0.0, 0.0);
    }
    private mouseDownListener(evt: any): void {
        console.log("mouseDownListener call, this.m_rscene: " + this.m_rscene.toString());
        //this.m_dragSwinger.enabled();
    }
    private mouseUpListener(evt: any): void {
        console.log("mouseUpListener call, this.m_rscene: " + this.m_rscene.toString());
        //this.m_dragSwinger.disable();
    }
    private mouseWheeelListener(evt: any): void {
        if (evt.wheelDeltaY < 0) {
            // zoom in
            this.m_rscene.getCamera().forward(-25.0);
        }
        else {
            // zoom out
            this.m_rscene.getCamera().forward(25.0);
        }
    }
    run(): void {
        this.m_statusDisp.update();

        //  this.m_dragSwinger.runWithYAxis();
        this.m_stageDragSwinger.runWithYAxis();
        // main renderer scene
        this.m_rscene.setClearRGBColor3f(0.0, 0.5, 0.0);

        this.m_rscene.run(true);

        if (this.m_uiscene != null) this.m_uiscene.run(true);

    }
}
export default DemoCameraSwing;