
import Vector3D from "../vox/math/Vector3D";
import MathConst from "../vox/math/MathConst";
import RendererDevice from "../vox/render/RendererDevice";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Stage3D from "../vox/display/Stage3D";
import CameraBase from "../vox/view/CameraBase";

import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";

import FrustrumFrame3DEntity from "../vox/entity/FrustrumFrame3DEntity";
import { UserInteraction } from "../vox/engine/UserInteraction";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
export class DemoFrustrum {
    constructor() {
    }
    private m_rscene: RendererScene = null;
    private m_rcontext: RendererInstanceContext = null;
    //private m_texBlock:TextureBlock;
    private m_texLoader: ImageTextureLoader;
    private m_camTrack: CameraTrack = null;

    // private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    // private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_interaction: UserInteraction = new UserInteraction();
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_tarDisp: Sphere3DEntity = null;
    initialize(): void {
        console.log("DemoFrustrum::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            let rparam: RendererParam = new RendererParam();
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_rcontext = this.m_rscene.getRendererContext() as any;
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            this.m_interaction.initialize( this.m_rscene );
            // this.m_rscene.enableMouseEvent(true);
            // this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            // this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            // this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_statusDisp.initialize();
            // this.m_camTrack = new CameraTrack();
            // this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            let tex1 = this.m_texLoader.getTexByUrl("static/assets/default.jpg");
            let plane: Plane3DEntity = new Plane3DEntity();
            plane.initializeXOZSquare(1200.0, [tex1]);
            this.m_rscene.addEntity( plane );

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.name = "axis";
            axis.initialize(300.0);
            axis.setXYZ(100.0, 0.0, 100.0);
            this.m_rscene.addEntity(axis);

            let camera0: CameraBase = new CameraBase();
            camera0.lookAtRH(new Vector3D(-500.0, 500.0, 500.0), new Vector3D(0.0, 0.0, 0.0), new Vector3D(0.0, 1.0, 0.0));
            camera0.perspectiveRH(MathConst.DegreeToRadian(45.0), 600.0 / 500.0, 150.1, 600.0);
            camera0.update();

            let viewWidth: number = 500.0;
            let viewHeight: number = 300.0;
            let camPos: Vector3D = new Vector3D(1, 700, 1);
            let near: number = 100.0;
            let far: number = 500.0;
            camera0 = new CameraBase();
            camera0.lookAtRH(camPos, Vector3D.ZERO, Vector3D.Z_AXIS);
            camera0.orthoRH(near, far, -0.5 * viewHeight, 0.5 * viewHeight, -0.5 * viewWidth, 0.5 * viewWidth);
            camera0.setViewXY(0, 0);
            camera0.setViewSize(viewWidth, viewHeight);
            camera0.update();

            /*
            let pvs:Vector3D[] = camera0.getWordFrustumVtxArr();
            // far plane
            let fruLine:DashedLine3DEntity = new DashedLine3DEntity();
            fruLine.initializeBySegmentLines([pvs[0],pvs[1],pvs[1],pvs[2],pvs[2],pvs[3],pvs[3],pvs[0]]);
            fruLine.setRGB3f(1.0,0.0,1.0);
            this.m_rscene.addEntity(fruLine);
            // near plane
            fruLine = new DashedLine3DEntity();
            fruLine.initializeBySegmentLines([pvs[4],pvs[5],pvs[5],pvs[6],pvs[6],pvs[7],pvs[7],pvs[4]]);
            fruLine.setRGB3f(0.0,0.5,1.0);
            this.m_rscene.addEntity(fruLine);
            // side plane
            fruLine = new DashedLine3DEntity();
            fruLine.initializeBySegmentLines([pvs[0],pvs[4],pvs[1],pvs[5],pvs[2],pvs[6],pvs[3],pvs[7]]);
            fruLine.setRGB3f(0.0,0.9,0.0);
            this.m_rscene.addEntity(fruLine);
            //*/
            let frustrum: FrustrumFrame3DEntity = new FrustrumFrame3DEntity();
            frustrum.initiazlize(camera0);
            this.m_rscene.addEntity(frustrum);

            this.m_tarDisp = new Sphere3DEntity();
            this.m_tarDisp.initialize(50.0, 30, 30, [tex1]);
            this.m_tarDisp.setXYZ(0.0, 0.0, 0.0);
            this.m_rscene.addEntity(this.m_tarDisp);
        }
    }
    mouseDownListener(evt: any): void {
    }
    run(): void {
        this.m_statusDisp.update();
        this.m_interaction.run();

        this.m_rscene.run();
        /*
        this.m_rcontext.renderBegin();

        this.m_renderer.update();
        this.m_renderer.run();

        this.m_rcontext.runEnd();
        this.m_camTrack.rotationOffsetAngleWorldY(0.2);
        this.m_rcontext.updateCamera();
        */
        // this.m_camTrack.rotationOffsetAngleWorldY(0.2);

    }
}
export default DemoFrustrum;
