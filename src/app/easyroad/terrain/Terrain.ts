import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import EngineBase from "../../../vox/engine/EngineBase";

import DisplayEntity from "../../../vox/entity/DisplayEntity";
import DataMesh from "../../../vox/mesh/DataMesh";
import QuadGridMeshGeometry from "../../../vox/mesh/QuadGridMeshGeometry";
import Vector3D from "../../../vox/math/Vector3D";
import TextureProxy from "../../../vox/texture/TextureProxy";

//  import TerrainMaterial from "../material/TerrainMaterial";

import TerrainMaterial from "../../../terrain/heightMap/material/TerrainMaterial";
import EnvLightData from "../../../light/base/EnvLightData";
import {MaterialPipeline} from "../../../vox/material/pipeline/MaterialPipeline";

class Terrain {

    constructor() { }

    private m_engine: EngineBase = null;
    
    private getImageTexByUrl(url: string): TextureProxy {
        return this.m_engine.texLoader.getTexByUrl(url);
    }
    initialize(engine: EngineBase): void {

        console.log("Terrain::initialize()......");
        if (this.m_engine == null) {

            this.m_engine = engine;
            
            /*
            let plane: Plane3DEntity = new Plane3DEntity();
            plane.showDoubleFace();
            plane.uScale = 5.0;
            plane.vScale = 5.0;
            plane.initializeXOZSquare(2600.0, [this.getImageTexByUrl("static/assets/wood_02.jpg")]);
            plane.setXYZ(0.0, -200.0, 0.0);
            this.m_engine.rscene.addEntity(plane);
            //**/
            this.initTerrain();
        }
    }
    private initTerrain(): void {

        let envData: EnvLightData = new EnvLightData();
        envData.initialize();
        envData.setFogDensity(0.0008);
        envData.setFogColorRGB3f(1.0, 1.0, 1.0);

        let materialPipeline: MaterialPipeline = new MaterialPipeline();
        materialPipeline.addPipe( envData );

        let material: TerrainMaterial = new TerrainMaterial();
        material.fogEnabled = false;

        material.setMaterialPipeline( materialPipeline );

        material.setTextureList( [
            this.getImageTexByUrl("static/assets/moss_04.jpg"),
            this.getImageTexByUrl("static/assets/color_02.jpg"),
            this.getImageTexByUrl("static/assets/heightMap05.jpg"),
            this.getImageTexByUrl("static/assets/heightMap05.jpg")
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
        entity.setScaleXYZ(4.0, 12.0, 4.0);
        entity.setXYZ(0.0, -400.0, 0.0);
        this.m_engine.rscene.addEntity(entity);
    }
    update(): void {
    }
    run(): void {
    }
}

export { Terrain };