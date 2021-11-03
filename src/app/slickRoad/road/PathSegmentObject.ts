import Vector3D from "../../../vox/math/Vector3D";
import EngineBase from "../../../vox/engine/EngineBase";

import { PathTool } from "./PathTool";
import { RoadMesh } from "../geometry/RoadMesh";
import { RoadGeometryBuilder } from "../geometry/RoadGeometryBuilder";
import { PathSegmentEntity } from "./PathSegmentEntity";
import TextureProxy from "../../../vox/texture/TextureProxy";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";
import { Pos3DPool } from "../base/Pos3DPool";
import { Pos3D } from "../base/Pos3D";
import { SegmentData } from "./segment/SegmentData";

class PathSegmentObject {

    constructor() { }

    private m_initFlag: boolean = true;
    private m_engine: EngineBase = null;
    private m_offsetXYZ: Vector3D = new Vector3D(0, 0, 0);
    private m_pathTool: PathTool = new PathTool();
    private m_geomBuilder: RoadGeometryBuilder = new RoadGeometryBuilder();
    private m_dispEntities: PathSegmentEntity[] = [null, null, null, null, null, null];
    private m_wireframeEnabled: boolean = false;
    posTotal: number = 0;
    initialize(engine: EngineBase): void {

        console.log("PathSegmentObject::initialize()......");
        if (this.m_initFlag) {

            this.m_initFlag = false;
            this.m_engine = engine;
            this.m_pathTool = new PathTool();
            this.m_geomBuilder = new RoadGeometryBuilder();
        }
    }

    clear(): void {
        
        for (let i: number = 0; i < this.m_dispEntities.length; ++i) {
            if (this.m_dispEntities[i] != null) {
                this.m_engine.rscene.removeEntity(this.m_dispEntities[i]);
                this.m_dispEntities[i] = null;
            }
        }
    }
    setVisible(visible: boolean): void {

        for (let i: number = 0; i < this.m_dispEntities.length; ++i) {
            if (this.m_dispEntities[i] != null) {
                this.m_dispEntities[i].setVisible(visible);
            }
        }
    }

    setWireframeEnabled(wireframeEnabled: boolean): void {

        if(this.m_wireframeEnabled !== wireframeEnabled) {
            this.m_wireframeEnabled = wireframeEnabled;
            for (let i: number = 0; i < this.m_dispEntities.length; ++i) {
                if (this.m_dispEntities[i] != null) {                    
                    this.reInitialize(this.m_dispEntities[i], true);
                }
            }
        }
    }
    distance: number = 0;
    private buildPathEntity(dispEntity: PathSegmentEntity, posTable: Vector3D[][], tex: TextureProxy, uScale: number = 1.0, vScale: number = 1.0, uvType: number = 0): PathSegmentEntity {

        let mesh: RoadMesh = (dispEntity != null ? dispEntity.getMesh() : null) as RoadMesh;

        mesh = this.m_geomBuilder.buildRoadSurface(mesh, posTable, uScale, vScale, uvType);
        this.distance = mesh.distance;
        if (dispEntity == null) {
            //console.log("create new road entity");

            let material = new Default3DMaterial();
            material.setTextureList([tex]);
            material.initializeByCodeBuf(true);
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.wireframe = this.m_wireframeEnabled;
            mesh.initialize();
            dispEntity = new PathSegmentEntity();
            dispEntity.setMesh(mesh);
            dispEntity.setMaterial(material);
            this.m_engine.rscene.addEntity(dispEntity);
        } else {
            this.reInitialize(dispEntity);
        }
        return dispEntity;
    }
    private reInitialize(dispEntity: PathSegmentEntity, force: boolean = false): void {
        let mesh: RoadMesh = dispEntity.getMesh() as RoadMesh;
        if (mesh != null && (mesh.changed || force)) {
            mesh.wireframe = this.m_wireframeEnabled;
            mesh.changed = false;
            mesh.initialize();
            dispEntity.setIvsParam(0, mesh.vtCount);
            dispEntity.updateMeshToGpu();
            dispEntity.updateBounds();
        }
    }

    buildByPathPosList(curvePosList: Pos3D[], roadWidth: number = 120.0, pathClosed: boolean = false): void {

        if (curvePosList != null && curvePosList.length > 1) {

            // console.log("##### Build R disp Begin...");
            let halfWidth: number = roadWidth * 0.5;
            let dis: number = halfWidth;
            
            let offsetXYZ: Vector3D = this.m_offsetXYZ;
            
            let tvList: Pos3D[] = this.m_pathTool.calcExpandXOZTVList(curvePosList, null, pathClosed);
            //console.log("tvList: ", tvList);

            let posListL: Pos3D[] = this.m_pathTool.calcOnePosListByTVList(tvList, curvePosList, offsetXYZ, -dis);
            //console.log("posListL: ", posListL);
            let posListL1: Pos3D[] = this.m_pathTool.calcOnePosListByTVList(tvList, curvePosList, offsetXYZ, 0);
            let posListR: Pos3D[] = this.m_pathTool.calcOnePosListByTVList(tvList, curvePosList, offsetXYZ, dis);

            let lbList: Pos3D[];
            let rbList: Pos3D[];

            offsetXYZ.setXYZ(0, -30, 0);
            let table: Pos3D[][] = this.m_pathTool.calcTwoPosListByTVList(tvList, posListL, posListR, offsetXYZ, 0);
            lbList = table[0];
            rbList = table[1];

            let tableTop: Pos3D[][] = [posListL, posListL1, posListR];
            let tableBottom: Pos3D[][] = [posListR, rbList, lbList, posListL];
            let texTop = this.m_engine.texLoader.getTexByUrl("static/assets/roadSurface04.jpg");
            let texBottom = this.m_engine.texLoader.getTexByUrl("static/assets/brick_d.jpg");

            offsetXYZ.setXYZ(0, -5, 0);
            let entities: PathSegmentEntity[] = this.m_dispEntities;
            entities[0] = this.buildPathEntity(entities[0], tableTop, texTop, 1.0, 0.0, 1);
            entities[1] = this.buildPathEntity(entities[1], tableBottom, texBottom, 1.0, 0.05, 0);

            for(let i: number = 0; i < entities.length; ++i) {
                if(entities[i] != null) {
                    //entities[i].setPosition(offsetXYZ);
                    entities[i].update();
                }
            }
            Pos3DPool.RestoreTable(tableTop);
            Pos3DPool.RestoreTable(tableBottom);
            Pos3DPool.RestoreList(tvList);
        }
    }
    buildByPathPosAndTVList(curvePosList: Pos3D[], tvList: Pos3D[], roadWidth: number = 120.0): void {

        if (curvePosList != null && curvePosList.length > 1) {

            // console.log("##### Build R disp Begin...");
            let halfWidth: number = roadWidth * 0.5;
            let dis: number = halfWidth;
            
            let offsetXYZ: Vector3D = this.m_offsetXYZ;
            offsetXYZ.setXYZ(0.0, 0.0, 0.0);
            
            let posListL: Pos3D[] = this.m_pathTool.calcOnePosListByTVList(tvList, curvePosList, offsetXYZ, -dis);
            let posListL1: Pos3D[] = this.m_pathTool.calcOnePosListByTVList(tvList, curvePosList, offsetXYZ, 0);
            let posListR: Pos3D[] = this.m_pathTool.calcOnePosListByTVList(tvList, curvePosList, offsetXYZ, dis);

            let lbList: Pos3D[];
            let rbList: Pos3D[];

            offsetXYZ.setXYZ(0, -30, 0);
            let table: Pos3D[][] = this.m_pathTool.calcTwoPosListByTVList(tvList, posListL, posListR, offsetXYZ, 0);
            lbList = table[0];
            rbList = table[1];
            
            let tableTop: Pos3D[][] = [posListL, posListL1, posListR];
            let tableBottom: Pos3D[][] = [posListR, rbList, lbList, posListL];
            let texTop = this.m_engine.texLoader.getTexByUrl("static/assets/roadSurface04.jpg");
            let texBottom = this.m_engine.texLoader.getTexByUrl("static/assets/brick_d.jpg");
            
            let entities: PathSegmentEntity[] = this.m_dispEntities;
            entities[0] = this.buildPathEntity(entities[0], tableTop, texTop, 1.0, 0.0, 1);
            entities[1] = this.buildPathEntity(entities[1], tableBottom, texBottom, 1.0, 0.05, 0);

            for(let i: number = 0; i < entities.length; ++i) {
                if(entities[i] != null) {
                    entities[i].update();
                }
            }
            Pos3DPool.RestoreTable(tableTop);
            Pos3DPool.RestoreTable(tableBottom);
        }
    }
    
    getPathSegmentEntities(): PathSegmentEntity[] {

        let entities: PathSegmentEntity[] = this.m_dispEntities;
        let new_entities: PathSegmentEntity[] = [];
        for(let i: number = 0; i < entities.length; ++i) {
            if(entities[i] != null) {
                new_entities.push( entities[i] );
            }
        }
        return new_entities;
    }
    buildByPathSegments(segments: SegmentData[]): void {

        if (segments != null) {

            let entities: PathSegmentEntity[] = this.m_dispEntities;
            let data: SegmentData;
            for(let i: number = 0; i < segments.length; ++i) {
                data = segments[i];
                let tex: TextureProxy = this.m_engine.texLoader.getTexByUrl(data.texturePath);
                entities[i] = this.buildPathEntity(entities[i], data.posTable, tex, data.uScale, data.vScale, data.uvType);
            }
        }
    }
    destroy(): void {
        if(!this.m_initFlag) {
            this.clear();
            this.m_engine = null;
            this.m_pathTool = null;
            this.m_geomBuilder = null;
            this.m_initFlag = true;
        }
    }
}

export { PathSegmentObject };