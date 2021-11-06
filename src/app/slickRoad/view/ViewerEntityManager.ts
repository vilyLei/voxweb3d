import EngineBase from "../../../vox/engine/EngineBase";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import AABB from "../../../vox/geom/AABB";
import MaterialBase from "../../../vox/material/MaterialBase";
import DataMesh from "../../../vox/mesh/DataMesh";
import TextureProxy from "../../../vox/texture/TextureProxy";
import { RoadSegmentMesh } from "../io/RoadSceneFileParser";

class ViewerEntityManager {

    constructor() { }

    private m_engine: EngineBase = null;

    initialize(engine: EngineBase): void {

        console.log("ViewerEntityManager::initialize()......");

        if (this.m_engine == null) {
            this.m_engine = engine;
        }
    }
    createRoadSegEntityFromMeshData(segMesh: RoadSegmentMesh, material: MaterialBase): DisplayEntity {

        let mesh: DataMesh = new DataMesh();
        // mesh.bounds = new AABB();
        // mesh.bounds.min.copyFrom(segMesh.bounds[0]);
        // mesh.bounds.max.copyFrom(segMesh.bounds[1]);
        // mesh.bounds.updateFast();
        
        mesh.setIVS(segMesh.ivs);
        mesh.setVS(segMesh.vs);
        mesh.setUVS(segMesh.uvs);
        if (segMesh.nvs !== undefined && segMesh.nvs !== null) {
            mesh.setNVS(segMesh.nvs);
        }

        mesh.setBufSortFormat(material.getBufSortFormat());
        //mesh.wireframe = this.m_wireframeEnabled;
        mesh.initialize();

        let entity = new DisplayEntity();
        entity.setMesh(mesh);
        entity.setMaterial(material);
        //entity.setXYZ(360,0.0,560.0);
        //this.m_engine.rscene.addEntity(entity);
        return entity;
    }
    createRoadSegEntitiesFromMeshesData(meshs: RoadSegmentMesh[], materials: MaterialBase[]): DisplayEntity[] {
        //let meshs: any[] = segMesh.meshes;
        let entities: DisplayEntity[] = [];
        for (let i: number = 0; i < meshs.length; ++i) {
            entities.push(this.createRoadSegEntityFromMeshData(meshs[i], materials[i]));
        }
        return entities;
    }
}

export { ViewerEntityManager };