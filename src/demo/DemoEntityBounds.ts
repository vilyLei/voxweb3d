import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import BoxFrame3D from "../vox/entity/BoxFrame3D";
import TextureProxy from "../vox/texture/TextureProxy";
import { TextureConst, TextureFormat, TextureDataType, TextureTarget } from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import DisplayEntityContainer from "../vox/entity/DisplayEntityContainer";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import MouseEvt3DDispatcher from "../vox/event/MouseEvt3DDispatcher";
import OcclusionPostOutline from "../renderingtoy/mcase/outline/OcclusionPostOutline";

export class DemoEntityBounds {
    constructor() {
    }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_postOutline: OcclusionPostOutline = new OcclusionPostOutline();

    private m_followEntity: DisplayEntity = null;
    private m_texList: TextureProxy[] = [];
    initTex(): void {
        let i: number = 0;

        let urls: string[] = [
            "static/assets/default.jpg"
            , "static/assets/broken_iron.jpg"
            , "static/assets/guangyun_H_0007.png"
        ];
        for (; i < urls.length; ++i) {
            this.m_texList.push(this.m_texLoader.getImageTexByUrl(urls[i]));
            this.m_texList[i].mipmapEnabled = true;
            this.m_texList[i].setWrap(TextureConst.WRAP_REPEAT);
        }
    }
    initialize(): void {
        console.log("DemoEntityBounds::initialize()......");
        if (this.m_rscene == null) {

            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.SetWebBodyColor();

            let scale: number = 1.0;
            let i: number = 0;

            let rparam: RendererParam = new RendererParam();
            rparam.setAttriAntialias(true);
            rparam.setCamProject(45.0, 0.1, 6000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam);

            
            this.m_postOutline.initialize(this.m_rscene, 1, [0]);
            this.m_postOutline.setFBOSizeScaleRatio(0.5);
            this.m_postOutline.setRGB3f(0.0,2.0,0.0);
            this.m_postOutline.setOutlineDensity(2.5);
            this.m_postOutline.setOcclusionDensity(0.2);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener);
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());
            
            this.m_statusDisp.initialize();

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            this.initTex();
            
            let axis: Axis3DEntity = new Axis3DEntity();
            axis.name = "followAxis";
            axis.initialize(50.0);
            axis.setXYZ(0, 300.0, 0);
            this.m_rscene.addEntity(axis);
            this.m_followEntity = axis;
            this.initEntityBoundsTest();
            this.initContainerBoundsTest();
            this.m_rscene.setClearRGBColor3f(0.0, 0.5, 0.0);
        }
    }
    private mouseOverTargetListener(evt: any): void {
        if(evt.target != null) {
            let targets: DisplayEntity[];
            let container: DisplayEntityContainer;
            if(evt.target != evt.currentTarget) {
                container = evt.target as DisplayEntityContainer;
                targets = container.getEntities();
                this.m_postOutline.setRGB3f(0.0, 1.0, 0.0);
            }
            else {
                let entity: DisplayEntity = evt.target as DisplayEntity;
                
                if(entity.__$getParent() != null) {
                    container = entity.__$getParent() as DisplayEntityContainer;
                    targets = container.getEntities();
                    this.m_postOutline.setRGB3f(1.5, 0.0, 0.0);
                }
                else {
                    targets = [ entity ];
                    this.m_postOutline.setRGB3f(1.0, 1.0, 0.0);
                }
            }
            this.m_postOutline.setTargetList( targets );
        }
    }
    private mouseOutTargetListener(evt: any): void {
        //console.log("mouseOutTargetListener mouse out...");
        this.m_postOutline.setTargetList( null );
    }
    private useEntityEvtDispatcher(entity: DisplayEntity, frameBoo: boolean = false): void {

        let dispatcher: MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
        dispatcher.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverTargetListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutTargetListener);
        entity.setEvtDispatcher(dispatcher);
        entity.mouseEnabled = true;

    }
    private useContainerEvtDispatcher(entity: DisplayEntityContainer, frameBoo: boolean = false): void {

        let dispatcher: MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
        dispatcher.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverTargetListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutTargetListener);
        entity.setEvtDispatcher(dispatcher);
        entity.mouseEnabled = true;

    }
    private m_stageMouseDown: boolean = false;
    private m_autoRotation: number = 100;
    mouseDownListener(evt: any): void {
        this.m_autoRotation = 100;
        this.m_stageMouseDown = true;
    }
    mouseUpListener(evt: any): void {
        this.m_stageMouseDown = false;
    }
    private updateCameraCtrl(): void {        
        if (!this.m_stageMouseDown) {
            this.m_autoRotation--;
        }
        if (this.m_autoRotation > 0) {
            this.m_stageDragSwinger.runWithYAxis();
        }
        else {
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);
    }
    pv: Vector3D = new Vector3D();
    delayTime: number = 10;

    run(): void {

        this.m_statusDisp.update();
        
        this.updateCameraCtrl();

        this.runEntityBoundsTest();
        this.runContainerBoundsTest();
        
        //this.m_rscene.run();
        this.m_rscene.runBegin();
        this.m_rscene.run(true);
        this.m_postOutline.drawBegin();
        this.m_postOutline.draw();
        this.m_postOutline.drawEnd();
        this.m_rscene.runEnd();
    }
    private m_targetContFrame: BoxFrame3D = null;
    private m_targetContMainFrame: BoxFrame3D = null;
    private m_containerFrame: BoxFrame3D = null;
    private m_targetEntity0: DisplayEntity = null;
    private m_targetEntity0Frame: BoxFrame3D = null;
    private m_targetEntity2: DisplayEntity = null;
    private m_targetEntity2Frame: BoxFrame3D = null;
    private m_targetEntity1: DisplayEntity = null;
    private m_container: DisplayEntityContainer = null;
    private m_topContainer: DisplayEntityContainer = null;
    private m_mainContainer: DisplayEntityContainer = null;
    private m_scale: number = 1.0;
    private m_scaleTime: number = Math.random();
    private m_followBCEntitys: DisplayEntity[] = [];
    runContainerBoundsTest(): void {
        if (this.m_targetContFrame != null) {
            this.m_targetEntity0.getTransform().setRotationY(this.m_targetEntity0.getTransform().getRotationY() + 0.2);
            this.m_targetEntity0.getTransform().setRotationZ(this.m_targetEntity0.getTransform().getRotationZ() - 0.2);
            this.m_targetEntity2.getTransform().setRotationZ(this.m_targetEntity2.getTransform().getRotationZ() - 0.2);
            this.m_targetEntity2.getTransform().setRotationX(this.m_targetEntity2.getTransform().getRotationX() - 0.2);
            //this.m_targetEntity2.update();
            //  this.m_targetEntity1.getTransform().setRotationX(this.m_targetEntity1.getTransform().getRotationX() + 1.0);
            //  this.m_targetEntity1.getTransform().setRotationZ(this.m_targetEntity1.getTransform().getRotationZ() - 1.0);
            //  this.m_targetEntity1.update();
            this.m_scaleTime += 0.02;
            this.m_scale = (Math.cos(this.m_scaleTime)) * 0.5 + 1.0;
            //this.m_container.setScaleY(this.m_scale);
            this.m_container.setRotationZ(this.m_container.getRotationZ() + 0.2);
            this.m_container.setRotationZ(this.m_container.getRotationZ() + 0.2);
            //this.m_container.update();
            //this.m_topContainer.update();
            //this.m_mainContainer.update();

            this.m_targetEntity0Frame.updateFrameByAABB(this.m_targetEntity0.getGlobalBounds());
            this.m_targetEntity0Frame.updateMeshToGpu();
            this.m_targetContMainFrame.updateFrameByAABB(this.m_mainContainer.getGlobalBounds());
            this.m_targetContMainFrame.updateMeshToGpu();
            this.m_targetContFrame.updateFrameByAABB(this.m_topContainer.getGlobalBounds());
            this.m_targetContFrame.updateMeshToGpu();

            let pminV: Vector3D = this.m_topContainer.getGlobalBounds().min;
            let pmaxV: Vector3D = this.m_topContainer.getGlobalBounds().max;
            //console.log("pminV: "+pminV.toString());
            //console.log("pmaxV: "+pmaxV.toString());
            let posarr: number[] = [
                pminV.x, pminV.y, pminV.z,
                pmaxV.x, pminV.y, pminV.z,
                pminV.x, pminV.y, pmaxV.z,
                pmaxV.x, pminV.y, pmaxV.z,

                pminV.x, pmaxV.y, pminV.z,
                pmaxV.x, pmaxV.y, pminV.z,
                pminV.x, pmaxV.y, pmaxV.z,
                pmaxV.x, pmaxV.y, pmaxV.z
            ];
            let i: number = 0;
            let j: number = 0;
            for (i = 0; i < 8; ++i) {
                this.m_followBCEntitys[i].setXYZ(posarr[j], posarr[j + 1], posarr[j + 2]);
                this.m_followBCEntitys[i].update();
                j += 3;
            }

            this.pv.setXYZ(100.0, 100.0, 100.0);
            this.m_targetEntity0.getTransform().localToGlobal(this.pv);
            this.m_followEntity.setPosition(this.pv);
            this.m_followEntity.update();
        }
    }
    initContainerBoundsTest(): void {
        let srcSphere: Sphere3DEntity = new Sphere3DEntity();
        srcSphere.initialize(50.0, 15, 15, [this.m_texList[0]]);
        let scale: number = 0.2;
        this.m_container = new DisplayEntityContainer();
        this.m_topContainer = new DisplayEntityContainer();
        this.m_mainContainer = new DisplayEntityContainer();

        this.m_rscene.addContainer(this.m_mainContainer);

        let srcBox: Box3DEntity = new Box3DEntity();
        srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [this.m_texList[0]]);

        let box0: Box3DEntity = new Box3DEntity();
        box0.mouseEnabled = true;
        box0.setMesh(srcBox.getMesh());
        box0.initialize(null, null, [this.m_texList[0]]);
        let box1: Box3DEntity = new Box3DEntity();
        box1.mouseEnabled = true;
        box1.setMesh(srcBox.getMesh());
        box1.initialize(null, null, [this.m_texList[1]]);
        let box2: Box3DEntity = new Box3DEntity();
        box2.mouseEnabled = true;
        box2.setMesh(srcBox.getMesh());
        box2.initialize(null, null, [this.m_texList[2]]);
        this.useEntityEvtDispatcher( box2 );

        //
        box0.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 100.0 - 500.0, Math.random() * 100.0 - 500.0);
        box0.setRotationXYZ(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
        box0.setScaleXYZ(Math.random() + 0.5, Math.random() + 0.5, Math.random() + 0.5);
        this.m_targetEntity0 = box0;
        this.m_container.addEntity(this.m_targetEntity0);
        this.m_rscene.addEntity(this.m_targetEntity0);

        this.m_targetEntity2 = box2;
        this.m_mainContainer.name = "main";
        this.m_mainContainer.addEntity(this.m_targetEntity2);
        this.m_rscene.addEntity(this.m_targetEntity2);

        box1.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 100.0 - 500.0, Math.random() * 100.0 - 500.0);
        box1.setRotationXYZ(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
        box1.setScaleXYZ(Math.random() + 0.5, Math.random() + 0.5, Math.random() + 0.5);
        this.m_targetEntity1 = box1;
        this.m_container.addEntity(this.m_targetEntity1);

        this.m_scale = (Math.cos(this.m_scaleTime)) * 0.5 + 1.0;
        this.m_container.setXYZ(-300.0, 10.0, 100.0);
        this.m_topContainer.addChild(this.m_container);
        this.m_mainContainer.addChild(this.m_topContainer);
        //this.m_container.setScaleY(this.m_scale);
        this.m_container.update();
        this.useContainerEvtDispatcher( this.m_container );

        let cubeFrame: BoxFrame3D = new BoxFrame3D();
        cubeFrame.initialize(this.m_topContainer.getGlobalBounds().min, this.m_topContainer.getGlobalBounds().max);
        this.m_rscene.addEntity(cubeFrame);
        this.m_targetContFrame = cubeFrame;

        this.m_targetContMainFrame = new BoxFrame3D();
        this.m_targetContMainFrame.color.setRGB3f(1.0, 0.0, 1.0);
        this.m_targetContMainFrame.initialize(this.m_mainContainer.getGlobalBounds().min, this.m_mainContainer.getGlobalBounds().max);
        this.m_rscene.addEntity(this.m_targetContMainFrame);


        this.m_targetEntity0Frame = new BoxFrame3D();
        this.m_targetEntity0Frame.initialize(this.m_targetEntity0.getGlobalBounds().min, this.m_targetEntity0.getGlobalBounds().max);
        this.m_rscene.addEntity(this.m_targetEntity0Frame);

        let pminV: Vector3D = this.m_topContainer.getGlobalBounds().min;
        let pmaxV: Vector3D = this.m_topContainer.getGlobalBounds().max;
        //console.log("pminV: "+pminV.toString());
        //console.log("pmaxV: "+pmaxV.toString());
        let posarr: number[] = [
            pminV.x, pminV.y, pminV.z,
            pmaxV.x, pminV.y, pminV.z,
            pminV.x, pminV.y, pmaxV.z,
            pmaxV.x, pminV.y, pmaxV.z,
            pminV.x, pmaxV.y, pminV.z,
            pmaxV.x, pmaxV.y, pminV.z,
            pminV.x, pmaxV.y, pmaxV.z,
            pmaxV.x, pmaxV.y, pmaxV.z
        ];
        let i: number = 0;
        let j: number = 0;
        for (i = 0; i < 8; ++i) {
            let sphere: Sphere3DEntity = new Sphere3DEntity();
            sphere.setMesh(srcSphere.getMesh());
            sphere.initialize(50.0, 15, 15, [this.m_texList[0]]);
            sphere.setScaleXYZ(scale, scale, scale);
            sphere.setXYZ(posarr[j], posarr[j + 1], posarr[j + 2]);
            this.m_rscene.addEntity(sphere);
            j += 3;
            this.m_followBCEntitys.push(sphere);
        }
    }
    private m_targetFrame: BoxFrame3D = null;
    private m_targetEntity: DisplayEntity = null;
    private m_followEntitys: DisplayEntity[] = [];
    runEntityBoundsTest(): void {
        if (this.m_targetFrame != null) {
            if (this.m_targetEntity.getVisible()) {
                this.m_targetEntity.getTransform().setRotationY(this.m_targetEntity.getTransform().getRotationY() + 1.0);
                this.m_targetEntity.getTransform().setRotationZ(this.m_targetEntity.getTransform().getRotationZ() - 1.0);
                this.m_targetEntity.update();
            }

            this.m_targetFrame.updateFrameByAABB(this.m_targetEntity.getGlobalBounds());
            this.m_targetFrame.updateMeshToGpu();
            let pminV: Vector3D = this.m_targetEntity.getGlobalBounds().min;
            let pmaxV: Vector3D = this.m_targetEntity.getGlobalBounds().max;
            //console.log("pminV: "+pminV.toString());
            //console.log("pmaxV: "+pmaxV.toString());
            let posarr: number[] = [
                pminV.x, pminV.y, pminV.z,
                pmaxV.x, pminV.y, pminV.z,
                pminV.x, pminV.y, pmaxV.z,
                pmaxV.x, pminV.y, pmaxV.z,

                pminV.x, pmaxV.y, pminV.z,
                pmaxV.x, pmaxV.y, pminV.z,
                pminV.x, pmaxV.y, pmaxV.z,
                pmaxV.x, pmaxV.y, pmaxV.z
            ];
            let i: number = 0;
            let j: number = 0;
            for (i = 0; i < 8; ++i) {
                this.m_followEntitys[i].setXYZ(posarr[j], posarr[j + 1], posarr[j + 2]);
                this.m_followEntitys[i].update();
                j += 3;
            }
        }
    }
    initEntityBoundsTest(): void {

        let srcSphere: Sphere3DEntity = new Sphere3DEntity();
        srcSphere.initialize(50.0, 15, 15, [this.m_texList[0]]);
        let srcBox: Box3DEntity = new Box3DEntity();
        srcBox.mouseEnabled = true;
        srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [this.m_texList[0]]);

        srcBox.setXYZ(Math.random() * 2000.0 - 1000.0, Math.random() * 2000.0 - 1000.0, Math.random() * 2000.0 - 1000.0);
        srcBox.setRotationXYZ(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
        srcBox.setScaleXYZ(Math.random() + 0.5, Math.random() + 0.5, Math.random() + 0.5);
        this.m_rscene.addEntity(srcBox);
        this.useEntityEvtDispatcher(srcBox);

        this.m_targetEntity = srcBox;
        let cubeFrame: BoxFrame3D = new BoxFrame3D();
        cubeFrame.initialize(srcBox.getGlobalBounds().min, srcBox.getGlobalBounds().max);
        this.m_targetFrame = cubeFrame;
        this.m_rscene.addEntity(this.m_targetFrame);

        let pminV: Vector3D = srcBox.getGlobalBounds().min;
        let pmaxV: Vector3D = srcBox.getGlobalBounds().max;
        //console.log("pminV: "+pminV.toString());
        //console.log("pmaxV: "+pmaxV.toString());
        let posarr: number[] = [
            pminV.x, pminV.y, pminV.z,
            pmaxV.x, pminV.y, pminV.z,
            pminV.x, pminV.y, pmaxV.z,
            pmaxV.x, pminV.y, pmaxV.z,
            pminV.x, pmaxV.y, pminV.z,
            pmaxV.x, pmaxV.y, pminV.z,
            pminV.x, pmaxV.y, pmaxV.z,
            pmaxV.x, pmaxV.y, pmaxV.z
        ];
        let scale: number = 0.2;
        let i: number = 0;
        let j: number = 0;
        for (i = 0; i < 8; ++i) {
            let sphere: Sphere3DEntity = new Sphere3DEntity();
            sphere.setMesh(srcSphere.getMesh());
            sphere.initialize(50.0, 15, 15, [this.m_texList[0]]);
            sphere.setScaleXYZ(scale, scale, scale);
            sphere.setXYZ(posarr[j], posarr[j + 1], posarr[j + 2]);
            this.m_rscene.addEntity(sphere);
            j += 3;
            this.m_followEntitys.push(sphere);
        }
    }
}

export default DemoEntityBounds;