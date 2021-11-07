import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import Axis3DEntity from "../vox/entity/Axis3DEntity";

import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import MouseEvent from "../vox/event/MouseEvent";
import RendererScene from "../vox/scene/RendererScene";
import Vector3D from "../vox/math/Vector3D";
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

export class DemoCameraRoaming {
    constructor() { }
    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_runType: number = 0;
    private m_viewRay: CameraViewRay = new CameraViewRay();
    initialize(): void {
        console.log("DemoCameraRoaming::initialize()......");
        if (this.m_rscene == null) {
            //DivLog.SetDebugEnabled( true );
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //playerDiv
            let divBody = document.getElementById("playerDiv") as HTMLDivElement;
            let rparam: RendererParam = new RendererParam(divBody);
            
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamPosition(1800.0, 1800.0, 1800.0);
            rparam.setCamProject(45, 20.0, 9000.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            this.m_viewRay.bindCameraAndStage(this.m_rscene.getCamera(), this.m_rscene.getStage3D());
            this.m_viewRay.setPlaneParam(new Vector3D(0.0, 1.0, 0.0), 0.0);
            
            this.initTerrain();
            this.loadRoadData();

        }
    }

    private getImageTexByUrl(url: string): TextureProxy {
        return this.m_texLoader.getTexByUrl(url);
    }
    private m_materialPipeline: MaterialPipeline = new MaterialPipeline();
    private initTerrain(): void {

        let envData: EnvLightData = new EnvLightData();
        envData.initialize();
        envData.setFogDensity(0.003);
        envData.setFogColorRGB3f(1.0, 1.0, 1.0);
        envData.setFogAreaSize(2000.0, 2000.0);
        envData.setFogAreaOffset(-1000.0, -1000.0);

        this.m_materialPipeline.addPipe(envData);

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

        let pipe: Pipe3DEntity = new Pipe3DEntity();
        //pipe.wireframe = true;
        pipe.setMaterial(material2);
        pipe.setRotationXYZ(0, 45, 0);
        pipe.showDoubleFace();
        pipe.initialize(1400.0, 1200.0, 4, 1);
        this.m_rscene.addEntity(pipe);
    }

    private m_roadData: RoadPathData = null;
    private loadRoadData(): void {

        let loader: BinaryLoader = new BinaryLoader();
        loader.uuid = "road_vrd";
        loader.load("static/assets/scene/pathData_03.vrd", this);
    }

    loaded(buffer: ArrayBuffer, uuid: string): void {
        console.log("loaded the road data.");
        let roadFile: RoadFile = new RoadFile();
        this.m_roadData = roadFile.parsePathDataFromFileBuffer(new Uint8Array(buffer));
        console.log("roadData: ", this.m_roadData);

        this.initCamera();
        this.initPathAct(this.m_roadData.pathPosList);
        this.switchCamera();
    }
    loadError(status: number, uuid: string): void {

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


        this.m_cameraTarget = camera2;
        this.m_camView.setCamera(this.m_cameraTarget);
    }
    
    private m_camView: RHCameraView = null;
    private m_cameraTarget: CameraBase = null;
    private m_pathRole: DisplayEntity = null;
    private m_moveAction: PathMotionAction = new PathMotionAction();
    private initPathAct(posList: Vector3D[] = null): void {

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initializeCross(70.0, new Vector3D(30, 0, 0));
        this.m_rscene.addEntity(axis);
        axis.setVisible( false );
        this.m_pathRole = axis;

        //  this.m_camView.setCamera( this.m_rscene.getCamera() );

        this.m_moveAction.cameraFollower.setCameraView(this.m_camView);
        this.m_moveAction.bindTarget(this.m_pathRole);
        this.m_moveAction.setPathPosList(posList, true);
    }
    
    private m_camTypeFlag: boolean = true;
    private switchCamera(): void {
        if (this.m_camView != null) {
            console.log("this.m_camTypeFlag: ",this.m_camTypeFlag);
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
        //this.switchCamera();
    }
    run(): void {
        this.m_moveAction.run();
        this.m_rscene.run();
    }
}

export default DemoCameraRoaming;