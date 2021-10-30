import Vector3D from "../../../vox/math/Vector3D";
import EngineBase from "../../../vox/engine/EngineBase";
;
import { PathTool } from "./PathTool";
import { RoadMesh } from "../geometry/RoadMesh";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import { RoadGeometryBuilder } from "../geometry/RoadGeometryBuilder";
import { PathCurveEditor } from "./PathCurveEditor";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import TextureProxy from "../../../vox/texture/TextureProxy";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";
import { Pos3DPool } from "../base/Pos3DPool";
import { Pos3D } from "../base/Pos3D";

class RoadEntityBuilder {

    constructor() { }

    private m_initFlag: boolean = true;
    private m_engine: EngineBase = null;
    private m_pathEditor: PathCurveEditor;
    private m_pathDataVresion: number = -1;
    private m_pathTool: PathTool = new PathTool();
    private m_surfaceEntities: DisplayEntity[] = [null, null, null, null];
    private m_wireframeEnabled: boolean = false;
    private m_roadWidth: number = 120.0;

    readonly geometryBuilder: RoadGeometryBuilder = new RoadGeometryBuilder();
    initialize(engine: EngineBase, pathEditor: PathCurveEditor): void {

        console.log("RoadEntityBuilder::initialize()......");
        if (this.m_initFlag) {

            this.m_initFlag = false;
            this.m_engine = engine;
            this.m_pathEditor = pathEditor;

            // let posTable: Vector3D[][] = [
            //     [new Vector3D(0.0,0.0,100.0), new Vector3D(400.0,0.0,100.0)],
            //     [new Vector3D(), new Vector3D(400.0, 0.0, 0.0)]
            // ];
            // let tex = this.m_engine.texLoader.getTexByUrl("static/assets/roadSurface04.jpg");
            // this.buildRoadSurface(null,posTable,tex);

        }
    }
    clear(): void {

        if (this.m_surfaceEntities != null) {
            for (let i: number = 0; i < this.m_surfaceEntities.length; ++i) {
                if (this.m_surfaceEntities[i] != null) {
                    this.m_engine.rscene.removeEntity(this.m_surfaceEntities[i]);
                    this.m_surfaceEntities[i] = null;
                }
            }
        }
    }
    setWireframeEnabled(wireframeEnabled: boolean): void {

        //if(this.m_surfaceEntities[0] != null && this.m_wireframeEnabled !== wireframeEnabled) {
        if(this.m_wireframeEnabled !== wireframeEnabled) {
            this.m_wireframeEnabled = wireframeEnabled;
            for (let i: number = 0; i < this.m_surfaceEntities.length; ++i) {
                if (this.m_surfaceEntities[i] != null) {                    
                    this.reInitialize(this.m_surfaceEntities[i], true);
                }
            }
        }
    }
    private buildRoadSurface(surfaceEntity: DisplayEntity, posTable: Vector3D[][], tex: TextureProxy, uScale: number = 1.0, vScale: number = 1.0, uvType: number = 0): DisplayEntity {

        let mesh: RoadMesh = (surfaceEntity != null ? surfaceEntity.getMesh() : null) as RoadMesh;

        mesh = this.geometryBuilder.buildRoadSurface(mesh, posTable, uScale, vScale, uvType);
        if (surfaceEntity == null) {
            //console.log("create new road entity");

            let material = new Default3DMaterial();
            material.setTextureList([tex]);
            material.initializeByCodeBuf(true);
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.wireframe = this.m_wireframeEnabled;
            mesh.initialize();

            surfaceEntity = new DisplayEntity();
            surfaceEntity.setMesh(mesh);
            surfaceEntity.setMaterial(material);
            this.m_engine.rscene.addEntity(surfaceEntity);
        } else {
            this.reInitialize(surfaceEntity);
        }
        return surfaceEntity;
    }
    private reInitialize(surfaceEntity: DisplayEntity, force: boolean = false): void {
        let mesh: RoadMesh = surfaceEntity.getMesh() as RoadMesh;
        if (mesh != null && (mesh.changed || force)) {
            mesh.wireframe = this.m_wireframeEnabled;
            mesh.changed = false;
            mesh.initialize();
            surfaceEntity.setIvsParam(0, mesh.vtCount);
            surfaceEntity.updateMeshToGpu();
            surfaceEntity.updateBounds();
        }
    }
    build(): void {

        if (this.m_pathEditor.getPathPosTotal() > 1 && this.m_pathDataVresion != this.m_pathEditor.getPathVersion()) {

            let halfWidth: number = this.m_roadWidth * 0.5;
            let dis: number = halfWidth;
            this.m_pathDataVresion = this.m_pathEditor.getPathVersion();

            let curvePosList: Pos3D[] = this.m_pathEditor.getPathCurvePosList();
            //curvePosList = [new Pos3D(), new Pos3D(200,0.0,0),new Pos3D(600,0.0,0)];
            
            let offsetXYZ: Vector3D = new Vector3D(0, 0, 0);
            
            //let tvList: Pos3D[] = this.m_pathTool.calcTVList(posListL, posListR);
            let tvList: Pos3D[] = this.m_pathTool.calcExpandXOZTVList(curvePosList, null, this.m_pathEditor.isPathClosed());
            //console.log("tvList: ", tvList);

            let posListL: Pos3D[] = this.m_pathTool.calcOnePosListByTVList(tvList, curvePosList, offsetXYZ, -dis);
            //console.log("posListL: ", posListL);
            let posListL1: Pos3D[] = this.m_pathTool.calcOnePosListByTVList(tvList, curvePosList, offsetXYZ, 0);
            let posListR: Pos3D[] = this.m_pathTool.calcOnePosListByTVList(tvList, curvePosList, offsetXYZ, dis);

            let lbList: Pos3D[];
            let rbList: Pos3D[];

            offsetXYZ.setXYZ(0, -25, 0);
            let table: Pos3D[][] = this.m_pathTool.calcTwoPosListByTVList(tvList, posListL, posListR, offsetXYZ, -30);
            lbList = table[0];
            rbList = table[1];

            let tableTop: Pos3D[][] = [posListL, posListL1, posListR];
            //let table: Vector3D[][] = [lbList,posListL,posListR, rbList];
            let tableBottom: Pos3D[][] = [posListR, rbList, lbList, posListL];
            let texTop = this.m_engine.texLoader.getTexByUrl("static/assets/roadSurface04.jpg");
            let texBottom = this.m_engine.texLoader.getTexByUrl("static/assets/brick_d.jpg");

            //this.geometryBuilder.offsetXYZ.setXYZ(0, -5, 0);
            offsetXYZ.setXYZ(0, -5, 0);
            let entities: DisplayEntity[] = this.m_surfaceEntities;
            entities[0] = this.buildRoadSurface(entities[0], tableTop, texTop, 1.0, 0.0, 1);
            entities[1] = this.buildRoadSurface(entities[1], tableBottom, texBottom, 1.0, 0.05, 0);
            for(let i: number = 0; i < entities.length; ++i) {
                if(entities[i] != null) {
                    entities[i].setPosition(offsetXYZ);
                    entities[i].update();
                }
            }
            Pos3DPool.RestoreTable(tableTop);
            Pos3DPool.RestoreTable(tableBottom);
            Pos3DPool.RestoreList(tvList);
            /*
            let pls = new Line3DEntity();
            pls.dynColorEnabled = true;
            pls.initializeByPosList(posListR);
            (pls.getMaterial() as any).setRGB3f(1.0, 0.8, 0.8);
            this.m_engine.rscene.addEntity(pls);
            this.m_dispList.push(pls);


            pls = new Line3DEntity();
            pls.dynColorEnabled = true;
            pls.initializeByPosList(posListL);
            (pls.getMaterial() as any).setRGB3f(0.3, 0.8, 1.0);
            this.m_engine.rscene.addEntity(pls);
            this.m_dispList.push(pls);
            //*/
        }
    }
    run(): void {
        //if(this.m_pathEditor.isPathClosed()) {
            this.build();
        //}
    }
}

export { RoadEntityBuilder };