
import RSEntityFlag from '../vox/scene/RSEntityFlag';
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Stage3D from "../vox/display/Stage3D";

import DisplayEntity from "../vox/entity/DisplayEntity";
import PureEntity from "../vox/entity/PureEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import DisplayEntityContainer from "../vox/entity/DisplayEntityContainer";
import { EntityDispQueue } from "./base/EntityDispQueue";

export class DemoContainerTransform {
    constructor() {
    }
    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_equeue: EntityDispQueue = new EntityDispQueue();
    private m_container: DisplayEntityContainer = null;
    private m_containerMain: DisplayEntityContainer = null;
    private m_followEntity: DisplayEntity = null;
    private m_targetEntity: DisplayEntity = null;

    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoContainerTransform::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setMatrix4AllocateSize(8192 * 4);
            rparam.setCamProject(45.0, 10.0, 3000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);

            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.setRendererProcessParam(1, true, true);
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            let stage3D: Stage3D = this.m_rscene.getStage3D() as Stage3D;
            stage3D.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_statusDisp.initialize();

            RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);

            this.m_container = new DisplayEntityContainer();
            this.m_container.setXYZ(100.0, 100.0, 100.0);
            this.createPlane();

            this.m_containerMain = new DisplayEntityContainer();
            this.m_containerMain.addChild(this.m_container);
            // this.m_rscene.addContainer(this.m_containerMain);
            this.m_rscene.addEntity(this.m_containerMain);

            let axisEntity: Axis3DEntity = new Axis3DEntity();
            axisEntity.initialize(30.0);
            this.m_rscene.addEntity(axisEntity, 0, false);
            this.m_followEntity = axisEntity;

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            axis.setXYZ(100.0, 100.0, 100.0);
            this.m_rscene.addEntity(axis);

            axis = new Axis3DEntity();
            axis.initialize(600.0);
            this.m_rscene.addEntity(axis);
            //this.createLargeEntitys(10000 * 50);
        }
    }
    private createPlane(): void {

        let plane: Plane3DEntity = new Plane3DEntity();
        plane.uuid = "plane001";
        plane.showDoubleFace();
        plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [this.getImageTexByUrl("static/assets/default.jpg")]);
        this.m_container.addEntity(plane);
        this.m_targetEntity = plane;
    }
    private m_elist: DisplayEntity[] = [];
    private createLargeEntitys(total: number): void {
        let src_axis = new Axis3DEntity();
        src_axis.initialize(600.0);
        let entity: DisplayEntity = null;
        for (let i = 0; i < total; i++) {
            let axis = new Axis3DEntity();
            axis.copyMeshFrom(src_axis);
            axis.copyMaterialFrom(src_axis);
            axis.initialize(600.0);
            entity = axis;
            this.m_elist.push(entity);
        }
    }
    private m_flag0 = true;
    containerTest(): void {
        if (this.m_flag0) {
            // this.m_rscene.remeoveContainer(this.m_containerMain);
            this.m_rscene.removeEntity(this.m_containerMain);
        }else {
            // this.m_rscene.addContainer(this.m_containerMain);
            this.m_rscene.addEntity(this.m_containerMain);
        }
        this.m_flag0 = !this.m_flag0;
        // this.m_containerMain.setVisible(this.m_flag0);
    }
    mouseDownListener(evt: any): void {
        console.log("XXXXX mouseDownListener() ...");
        this.containerTest();
        return;
        if (this.m_targetEntity != null) {
            let destroyEnabled = true;
            console.log("this.m_targetEntity.isFree(): ", this.m_targetEntity.isFree(), ", destroyEnabled: ", destroyEnabled);
            if (destroyEnabled) {
                this.m_container.removeEntity(this.m_targetEntity);
                this.m_targetEntity.destroy();
                this.m_targetEntity = null;
            }
            else {
                if (this.m_targetEntity.isFree()) {
                    this.m_container.addEntity(this.m_targetEntity);
                }
                else {
                    this.m_container.removeEntity(this.m_targetEntity);
                }
            }
        }
        else {
            this.createPlane();
        }
    }
    position: Vector3D = new Vector3D();
    delayTime: number = 10;
    run(): void {
        this.m_equeue.run();

        this.m_rscene.setClearRGBColor3f(0.1, 0.1, 0.1);

        this.m_rscene.run();
        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);

        if (this.m_containerMain != null) {
            this.m_container.setRotationY(this.m_container.getRotationY() + 1.0);
            this.m_containerMain.setRotationZ(this.m_containerMain.getRotationZ() + 1.0);

            this.position.setXYZ(200.0, 10.0, 150.0);
            this.m_container.localToGlobal(this.position);
            this.m_followEntity.setPosition(this.position);
            this.m_followEntity.update();
        }

        const st = this.m_rscene.getRenderProxy().status;
        this.m_statusDisp.statusInfo = "/" + st.drawCallTimes;
        this.m_statusDisp.update();
    }

}
export default DemoContainerTransform;