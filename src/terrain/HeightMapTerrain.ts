
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import { TextureConst } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import DataMesh from "../vox/mesh/DataMesh";
import QuadGridMeshGeometry from "../vox/mesh/QuadGridMeshGeometry";
import Vector3D from "../vox/math/Vector3D";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import TerrainMaterial from "./heightMap/material/TerrainMaterial";
import EnvLightData from "../light/base/EnvLightData";
import {MaterialPipeline} from "../vox/material/pipeline/MaterialPipeline";

export class HeightMapTerrain {

    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl, 0, false, false);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {

        console.log("HeightMapTerrain::initialize()......");

        if (this.m_rscene == null) {

            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_statusDisp.initialize();

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            //let axis: Axis3DEntity = new Axis3DEntity();
            //axis.initialize(300.0);
            //this.m_rscene.addEntity(axis);

            // add common 3d display entity
            let plane: Plane3DEntity = new Plane3DEntity();
            //plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            //this.m_rscene.addEntity(plane);
            
            let envData: EnvLightData = new EnvLightData( this.m_rscene.getRenderProxy() );
            envData.initialize();
            envData.setFogDensity(0.0008);
            envData.setFogColorRGB3f(1.0, 1.0, 1.0);

            let materialPipeline: MaterialPipeline = new MaterialPipeline();
            materialPipeline.addPipe( envData );
            
            let material: TerrainMaterial = new TerrainMaterial();
            material.setMaterialPipeline( materialPipeline );
            
            material.setTextureList( [
                this.getImageTexByUrl("static/assets/moss_04.jpg"),
                this.getImageTexByUrl("static/assets/color_02.jpg"),
                this.getImageTexByUrl("static/assets/heightMap05.jpg"),
                //this.getImageTexByUrl("static/assets/heightMap05.jpg")
                //this.getImageTexByUrl("static/assets/circleWave_disp.png")
            ] );
            
            material.setRGB3f(1.2,1.2,1.2);
            //material.setTextureList([this.getImageTexByUrl("static/assets/noise.jpg")]);
            material.initializeByCodeBuf(true);
            material.setDisplacementParams(60,0.1);

            let size: number = 500.0;
            let gridGeom: QuadGridMeshGeometry = new QuadGridMeshGeometry();
            gridGeom.normalEnabled = true;
            gridGeom.initializeXOZPlane(new Vector3D(-0.5 * size, 0, -0.5 * size), size,size, 256,256);
            //console.log("gridGeom: ", gridGeom);

            let dataMesh: DataMesh = new DataMesh();
            //dataMesh.wireframe = true;
            dataMesh.setBufSortFormat(material.getBufSortFormat());
            dataMesh.initializeFromGeometry(gridGeom);

            let entity: DisplayEntity = new DisplayEntity();
            entity.setMaterial(material);
            entity.setMesh(dataMesh);
            entity.setScaleXYZ(4.0,12.0,4.0);
            entity.setXYZ(0,-400,0);
            this.m_rscene.addEntity(entity);

            this.update();

        }
    }
    private mouseDown(evt: any): void {

    }

    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps
        this.m_statusDisp.render();
    }
    run(): void {

        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);
        this.m_statusDisp.update(false);

        this.m_rscene.run(true);

    }
}
export default HeightMapTerrain;