
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import Axis3DEntity from "../vox/entity/Axis3DEntity";

import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import MouseEvent from "../vox/event/MouseEvent";
import KeyboardEvent from "../vox/event/KeyboardEvent";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";

import CameraDragController from "../voxeditor/control/CameraDragController";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import Vector3D from "../vox/math/Vector3D";
import FrustrumFrame3DEntity from "../vox/entity/FrustrumFrame3DEntity";
import CameraBase from "../vox/view/CameraBase";
import { RHCameraView } from "../vox/view/RHCameraView";
import MathConst from "../vox/math/MathConst";
import { PathMotionAction } from "./scene/PathMotionAction";
import CameraViewRay from "../vox/view/CameraViewRay";
import DisplayEntity from "../vox/entity/DisplayEntity";
import BinaryLoader from "../vox/assets/BinaryLoader";
import { RoadPathData, RoadFile } from "../app/slickRoad/io/RoadFile";
import TextureProxy from "../vox/texture/TextureProxy";
import DataMesh from "../vox/mesh/DataMesh";


import RoadMaterial from "../app/slickRoad/material/RoadMaterial";
import TerrainMaterial from "../terrain/heightMap/material/TerrainMaterial";
import EnvLightData from "../light/base/EnvLightData";
import { MaterialPipeline } from "../vox/material/pipeline/MaterialPipeline";
import QuadGridMeshGeometry from "../vox/mesh/QuadGridMeshGeometry";

import Pipe3DEntity from "../vox/entity/Pipe3DEntity";

import { SceneDataLoader } from "../app/slickRoad/view/SceneDataLoader";
import { ViewerTexSystem } from "../app/slickRoad/view/ViewerTexSystem";
import { VRDEntityBuilder } from "../app/slickRoad/view/VRDEntityBuilder";
import { RoadSceneData, RoadSegment, RoadSegmentMesh, RoadModel } from "../app/slickRoad/io/RoadSceneFileParser";
import Line3DEntity from "../vox/entity/Line3DEntity";
import MaterialBase from "../vox/material/MaterialBase";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";

export class DemoCameraWalkRoad {
    constructor() { }
    private m_rscene: RendererScene = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_texLoader: ImageTextureLoader = null;
    private m_runType: number = 0;
    private m_stageDragCtrl: CameraDragController = new CameraDragController();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_viewRay: CameraViewRay = new CameraViewRay();

    private m_scDataLoader: SceneDataLoader = new SceneDataLoader();
    private m_entityManager: VRDEntityBuilder = new VRDEntityBuilder();
    // private m_texSystem: ViewerTexSystem = new ViewerTexSystem();

    initialize(): void {
        console.log("DemoCameraWalkRoad::initialize()......");
        if (this.m_rscene == null) {
            //DivLog.SetDebugEnabled( true );
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamPosition(1800.0, 1800.0, 1800.0);
            rparam.setCamProject(45, 20.0, 9000.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());
            this.m_statusDisp.initialize();
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_rscene.addEventListener(KeyboardEvent.KEY_DOWN, this, this.keyDown);

            this.m_viewRay.bindCameraAndStage(this.m_rscene.getCamera(), this.m_rscene.getStage3D());
            this.m_viewRay.setPlaneParam(new Vector3D(0.0, 1.0, 0.0), 0.0);
            //this.m_rscene.getRenderProxy().setFrontFaceFlipped(true);
            ///*
            //  let axis:Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(300.0);
            //  this.m_rscene.addEntity(axis);


            //*/
            /*
            let box:Box3DEntity = new Box3DEntity();
            box.initializeCube(200.0,[this.m_texLoader.getTexByUrl("static/assets/default.jpg")]);
            this.m_rscene.addEntity(box,1);
            //*/

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragCtrl.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_cameraZoomController.setLookAtCtrlEnabled(false);

            this.update();

            this.initMaterialSystem();

            this.initTerrain();
            this.loadSceneData();
        }
    }

    private loadSceneDataBURL(url: string): void {
        this.m_scDataLoader.load(url, (roadData: RoadSceneData): void => {
            this.createRoadDisplay(roadData);
        })
    }
    private loadSceneData(): void {
        //this.loadSceneDataBURL("static/assets/scene/vrdScene_02.vrd");
        //this.loadSceneDataBURL("static/assets/scene/vrdScene_hightway.vrd");
        this.loadSceneDataBURL("static/assets/scene/vrdTerrainRoad_02.vrd");
    }
    private createRoadDisplay(roadData: RoadSceneData): void {

        let roadList: RoadModel[] = roadData.roadList;
        if (roadList != null) {

            let road: RoadModel;
            for (let i: number = 0; i < roadList.length; ++i) {
                road = roadList[i];
                if (road.segmentList != null && road.segmentList.length > 0) {
                    this.createRoadEntities(road);
                }
                else {
                    this.createRoadCurveLine(road);
                }
            }
            this.initCamera();
            this.initPathAct(roadList[0].curvePosList);
        }
    }
    private createRoadCurveLine(road: RoadModel): void {

        let pls = new Line3DEntity();
        pls.dynColorEnabled = true;
        pls.initializeByPosList(road.curvePosList);
        this.m_rscene.addEntity(pls);
    }

    private createRoadEntities(road: RoadModel): void {

        let entities: DisplayEntity[] = this.m_entityManager.createRoadEntities(
            road,
            (total: number): MaterialBase[] => {
                //return this.getLambertMaterials(total);
                //return this.getDefaultMaterials(total);
                return this.getRoadMaterials(total);
            });
        for (let k: number = 0; k < entities.length; ++k) {
            this.m_rscene.addEntity(entities[k]);
        }
    }

    private getDefaultMaterials(total: number): MaterialBase[] {
        let texNSList: string[] = [
            "static/assets/roadSurface04.jpg",
            "static/assets/brick_d.jpg"
            ];
        let materials: Default3DMaterial[] = [new Default3DMaterial(), new Default3DMaterial()];
        for (let k: number = 0; k < materials.length; ++k) {
            materials[k].setTextureList([this.getImageTexByUrl(texNSList[k])]);
            materials[k].initializeByCodeBuf(true);
        }
        return materials;
    }
    private getRoadMaterials(total: number): MaterialBase[] {

        let texNSList: string[] = [
            "static/assets/roadSurface04.jpg",
            "static/assets/brick_d.jpg"
            ];
        let materials: RoadMaterial[] = new Array(total);
        for (let k: number = 0; k < materials.length; ++k) {
            materials[k] = new RoadMaterial();
            materials[k].setMaterialPipeline(this.m_materialPipeline);
            materials[k].setTextureList([this.getImageTexByUrl(texNSList[k]), this.getImageTexByUrl("static/assets/color_02.jpg")]);
            materials[k].initializeByCodeBuf(true);
        }
        return materials;
    }
    private getImageTexByUrl(url: string): TextureProxy {
        return this.m_texLoader.getTexByUrl(url);
    }
    private m_materialPipeline: MaterialPipeline = new MaterialPipeline();
    private initMaterialSystem(): void {

        let envData: EnvLightData = new EnvLightData( this.m_rscene.getRenderProxy().uniformContext );
        envData.initialize();
        envData.setFogDensity(0.003);
        envData.setFogColorRGB3f(1.0, 1.0, 1.0);
        envData.setFogAreaSize(2000.0, 2000.0);
        envData.setFogAreaOffset(-1000.0, -1000.0);

        this.m_materialPipeline.addPipe(envData);
    }
    private initTerrain(): void {

        let material: TerrainMaterial = new TerrainMaterial();
        material.fogEnabled = true;
        material.setMaterialPipeline(this.m_materialPipeline);

        material.setTextureList([
            this.getImageTexByUrl("static/assets/moss_04.jpg"),
            this.getImageTexByUrl("static/assets/color_02.jpg"),
            this.getImageTexByUrl("static/assets/heightMap05.jpg")
        ]);
        material.setRGB3f(1.2, 1.2, 1.2);
        material.initializeByCodeBuf(true);
        material.setDisplacementParams(60, 0.1);

        let size: number = 500.0;
        let gridGeom: QuadGridMeshGeometry = new QuadGridMeshGeometry();
        gridGeom.normalEnabled = true;
        gridGeom.initializeXOZPlane(new Vector3D(-0.5 * size, 0, -0.5 * size), size, size, 256, 256);
        //console.log("gridGeom: ", gridGeom);

        let dataMesh: DataMesh = new DataMesh();
        //dataMesh.wireframe = true;
        dataMesh.setBufSortFormat(material.getBufSortFormat());
        dataMesh.initializeFromGeometry(gridGeom);

        let entity: DisplayEntity = new DisplayEntity();
        entity.setMaterial(material);
        entity.setMesh(dataMesh);
        entity.setScaleXYZ(4.0, 12.0, 4.0);
        entity.setXYZ(0.0, -400.0, 0.0);
        this.m_rscene.addEntity(entity);

        let material2: RoadMaterial = new RoadMaterial();
        material2.setMaterialPipeline(this.m_materialPipeline);
        material2.setTextureList([
            this.getImageTexByUrl("static/assets/color_02.jpg"),
            this.getImageTexByUrl("static/assets/color_02.jpg")
        ]);
        material2.initializeByCodeBuf(true);
        // 四周的边界几何体
        let pipe: Pipe3DEntity = new Pipe3DEntity();
        //pipe.wireframe = true;
        pipe.setMaterial(material2);
        pipe.setRotationXYZ(0, 45, 0);
        pipe.showDoubleFace();
        pipe.initialize(1400.0, 1200.0, 4, 1);
        this.m_rscene.addEntity(pipe);
    }

    private initCamera(): void {

        let pos: Vector3D = new Vector3D(-500, 300, 0);

        let camView: RHCameraView = new RHCameraView();
        camView.setPosition(pos);
        camView.update();
        this.m_camView = camView;
        let camera2: CameraBase = new CameraBase();
        camera2.setViewMatrix(camView.getViewMatrix());
        camera2.perspectiveRH(MathConst.DegreeToRadian(45), 800 / 600, 80, 500);
        camera2.update();

        let frustumFrame2: FrustrumFrame3DEntity = new FrustrumFrame3DEntity();
        frustumFrame2.initiazlize(camera2);
        this.m_rscene.addEntity(frustumFrame2);

        this.m_cameraTarget = camera2;
        this.m_camFrame = frustumFrame2;
        this.m_camView.setCamera(this.m_cameraTarget);
    }
    private m_slideFlag: boolean = false;
    //
    private m_camView: RHCameraView = null;
    private m_cameraTarget: CameraBase = null;
    private m_camFrame: FrustrumFrame3DEntity = null;
    private m_pathRole: DisplayEntity = null;
    private m_moveAction: PathMotionAction = new PathMotionAction();
    private initPathAct(posList: Vector3D[] = null): void {

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initializeCross(70.0, new Vector3D(30, 0, 0));
        this.m_rscene.addEntity(axis);
        this.m_pathRole = axis;
        //  this.m_camView.setCamera( this.m_rscene.getCamera() );
        console.log("XXX posList.length: ",posList.length);
        //this.m_moveAction.useCameraFollower();
        this.m_moveAction.cameraFollower.setCameraView(this.m_camView);
        this.m_moveAction.bindTarget(this.m_pathRole);
        this.m_moveAction.setPathPosList(posList, true);
    }
    private m_temV: Vector3D = new Vector3D();
    private m_tem2V: Vector3D = new Vector3D();
    private m_camTypeFlag: boolean = true;
    private switchCamera(): void {
        if (this.m_camView != null) {
            if (this.m_camTypeFlag) {
                this.m_camView.setCamera(this.m_rscene.getCamera());
            }
            else {
                this.m_camView.setCamera(this.m_cameraTarget);
            }
            this.m_camTypeFlag = !this.m_camTypeFlag;
        }
    }
    private mouseDown(evt: any): void {
        this.switchCamera();

        this.m_viewRay.intersectPlane();
        let pv: Vector3D = this.m_viewRay.position;

    }
    private keyDown(evt: any): void {
        this.m_slideFlag = !this.m_slideFlag;
        if (this.m_slideFlag) {
            this.m_stageDragCtrl.enableSlide();
        }
        else {
            this.m_stageDragCtrl.enableSwing();
        }
    }

    private m_timeoutId: any = -1;

    private update(): void {

        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 30);// 20 fps

        this.m_stageDragCtrl.runWithYAxis();
        this.m_cameraZoomController.run(null, 30.0);
        this.m_statusDisp.render();
    }

    private m_pv: Vector3D = new Vector3D();

    run(): void {
        this.m_statusDisp.update(false);
        if (this.m_camFrame != null) {
            this.m_moveAction.run();
            this.m_camFrame.updateFrame(this.m_camView.getCamera());
            this.m_camFrame.updateMeshToGpu();
        }
        this.m_rscene.run();
    }
}

export default DemoCameraWalkRoad;