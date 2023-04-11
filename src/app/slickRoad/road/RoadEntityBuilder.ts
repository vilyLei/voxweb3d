import EngineBase from "../../../app/engine/EngineBase";

import { RoadGeometryBuilder } from "../geometry/RoadGeometryBuilder";
import { PathCurveEditor } from "./PathCurveEditor";
import { Pos3D } from "../base/Pos3D";
import DataMesh from "../../../vox/mesh/DataMesh";
import { GeometryMerger } from "../../../vox/mesh/GeometryMerger";
import { PathSegmentObject } from "./PathSegmentObject";
import { PathTool } from "./PathTool";
import { IPathShapeCalcModel } from "./segment/IPathShapeCalcModel";

import { PathShapeCalcModel } from "./segment/PathShapeCalcModel";
import { HighwayShapeCalcModel } from "./segment/HighwayShapeCalcModel";

import { Pos3DPool } from "../base/Pos3DPool";
import { SegmentData } from "./segment/SegmentData";
import { RoadSegObjectManager } from "./RoadSegObjectManager";
import MathConst from "../../../vox/math/MathConst";

class RoadEntityBuilder {

    private m_initFlag: boolean = true;
    private m_editEnabled: boolean = true;
    private m_engine: EngineBase = null;
    private m_pathEditor: PathCurveEditor = null;
    private m_pathDataVresion: number = -1;
    //private m_roadWidth: number = 120.0;

    private m_pathTool: PathTool = new PathTool();
    private m_shapeCalcModel: IPathShapeCalcModel = null;

    readonly segObjManager: RoadSegObjectManager = new RoadSegObjectManager();
    readonly geometryBuilder: RoadGeometryBuilder = new RoadGeometryBuilder();
    constructor() { }

    setShapeCalcModel(model: IPathShapeCalcModel): void {
        this.m_shapeCalcModel = model;
    }
    getRoadWidth(): number {
        return this.m_pathEditor.getPathWholeWidthScale();
    }
    initialize(engine: EngineBase, pathEditor: PathCurveEditor): void {

        console.log("RoadEntityBuilder::initialize()......");

        if (this.m_initFlag) {

            this.m_initFlag = false;
            this.m_engine = engine;
            this.m_pathEditor = pathEditor;
            this.segObjManager.initialize(this.m_engine);
            
            if(this.m_shapeCalcModel == null) {
                //this.m_shapeCalcModel = new PathShapeCalcModel();
                this.m_shapeCalcModel = new HighwayShapeCalcModel();
            }
            this.m_shapeCalcModel.initialize(this.m_pathEditor);


            // let posTable: Vector3D[][] = [
            //     [new Vector3D(0.0,0.0,100.0), new Vector3D(400.0,0.0,100.0)],
            //     [new Vector3D(), new Vector3D(400.0, 0.0, 0.0)]
            // ];
            // let tex = this.m_engine.texLoader.getTexByUrl("static/assets/roadSurface04.jpg");
            // this.buildRoadSurface(null,posTable,tex);
            /*
            let tex = this.m_engine.texLoader.getTexByUrl("static/assets/default.jpg");
            let plane: Plane3DEntity = new  Plane3DEntity();
            plane.initializeXOZSquare(300.0, [tex]);
            plane.update();
            let plane1: Plane3DEntity = new  Plane3DEntity();
            plane1.initializeXOZSquare(300.0, [tex]);
            plane1.setXYZ(310, 0, 160);
            plane1.update();
            // this.m_engine.rscene.addEntity( plane );
            // this.m_engine.rscene.addEntity( plane1 );

            let geomWelder: GeometryMerger = new GeometryMerger();
            geomWelder.addEntity(plane);
            geomWelder.addEntity(plane1);
            geomWelder.weld();
            // console.log("GGGG ivs: ", geomWelder.getIVS());
            // console.log("GGGG vs: ", geomWelder.getVS());
            ///*
            let mesh: DataMesh = new DataMesh();
            mesh.initializeFromGeometry( geomWelder );
            // mesh.setIVS(plane.getMesh().getIVS());
            // mesh.vs = (plane.getMesh().getVS());
            // mesh.uvs = (plane.getMesh().getUVS());
            // //mesh.nvs = (plane.getMesh().getNVS());

            let material = new Default3DMaterial();
            material.setTextureList([tex]);
            material.initializeByCodeBuf(true);
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.wireframe = this.m_wireframeEnabled;
            mesh.initialize();

            let entity = new DisplayEntity();
            entity.setMesh(mesh);
            entity.setMaterial(material);
            entity.setXYZ(360,0.0,560.0);
            this.m_engine.rscene.addEntity(entity);
            //*/
        }
    }
    
    clear(): void {
        this.segObjManager.clear();
    }

    setEditEnabled(enabled: boolean): void {
        this.m_editEnabled = enabled;
        this.segObjManager.setMouseEnabled(enabled);
        if (!enabled) {
            this.segObjManager.deselectAll();
        }
    }
    getEditEnabled(): boolean {
        return this.m_editEnabled;
    }
    private buildRoadSegmentAll(): void {

        let srcPosList: Pos3D[] = this.m_pathEditor.getPathCurvePosList();
        let srcPosTable: Pos3D[][] = this.m_pathEditor.getPathCurvePosTable();
        let i: number = 0;
        let subLen: number = 0;
        let pathSeg: PathSegmentObject;

        this.segObjManager.fitSegList(srcPosTable.length, this.m_shapeCalcModel.getSegMeshesTotal());

        let index: number = 0;
        let listTotal: number = srcPosTable.length;
        let srcPosLen: number = srcPosList.length;
        let endIndex: number;

        this.m_shapeCalcModel.build(this.m_pathEditor.getPathWholeWidthScale());

        let segments: SegmentData[];

        let tempTot: number = 0;
        for (i = 0; i < listTotal; ++i) {

            subLen = srcPosTable[i].length;
            tempTot += subLen;
            endIndex = ((i + 1) < listTotal) ? (index + subLen + 1) : srcPosLen;
            //console.log(i,", subLen: ",subLen, ", srcPosLen: ",srcPosLen, ", index, endIndex: ",index, endIndex);                
            segments = this.m_shapeCalcModel.slice(index, endIndex);
            index += subLen;
            pathSeg = this.segObjManager.getSegEntityObjectAt(i);
            pathSeg.posTotal = subLen;
            pathSeg.buildByPathSegments(segments);
            for (let j: number = 0; j < segments.length; ++j) {
                segments[j].reset();
            }
        }
        this.m_shapeCalcModel.reset();
            
    }
    getSegList(): PathSegmentObject[] {
        return this.segObjManager.getSegList();
    }
    build(): void {
        let posTotal: number = this.m_pathEditor.getPathKeyPosTotal();
        if (posTotal > 1 && this.m_pathDataVresion != this.m_pathEditor.getPathVersion()) {
            this.m_pathDataVresion = this.m_pathEditor.getPathVersion();

            this.buildRoadSegmentAll();
        }
    }
    run(): void {
        this.build();
    }
}

export { RoadEntityBuilder };