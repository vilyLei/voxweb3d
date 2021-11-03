import EngineBase from "../../../vox/engine/EngineBase";

import { RoadGeometryBuilder } from "../geometry/RoadGeometryBuilder";
import { PathCurveEditor } from "./PathCurveEditor";
import { Pos3D } from "../base/Pos3D";
import DataMesh from "../../../vox/mesh/DataMesh";
import {GeometryMerger} from "../../../vox/mesh/GeometryMerger";
import {PathSegmentObject} from "./PathSegmentObject";
import { PathTool } from "./PathTool";
import { PathSegmentTool } from "./segment/PathSegmentTool";
import { Pos3DPool } from "../base/Pos3DPool";
import { SegmentData } from "./segment/SegmentData";

class RoadEntityBuilder {

    constructor() { }

    private m_initFlag: boolean = true;
    private m_engine: EngineBase = null;
    private m_pathEditor: PathCurveEditor = null;
    private m_pathDataVresion: number = -1;
    private m_roadWidth: number = 120.0;
    
    private m_pathTool: PathTool = new PathTool();
    private m_pathTableTool: PathSegmentTool = new PathSegmentTool();
    private m_segList: PathSegmentObject[] = [];

    readonly geometryBuilder: RoadGeometryBuilder = new RoadGeometryBuilder();

    initialize(engine: EngineBase, pathEditor: PathCurveEditor): void {

        console.log("RoadEntityBuilder::initialize()......");

        if (this.m_initFlag) {

            this.m_initFlag = false;
            this.m_engine = engine;
            this.m_pathEditor = pathEditor;
            this.m_pathTableTool.initialize( this.m_pathEditor );


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

        // this.m_pathSeg.clear();
        for(let i: number = 0; i < this.m_segList.length; ++i) {
            if(this.m_segList[i] != null) {
                this.m_segList[i].clear();
            }
        }
    }
    setWireframeEnabled(wireframeEnabled: boolean): void {
        //this.m_pathSeg.setWireframeEnabled( wireframeEnabled );
        for(let i: number = 0; i < this.m_segList.length; ++i) {
            if(this.m_segList[i] != null) {
                this.m_segList[i].setWireframeEnabled( wireframeEnabled );
            }
        }
    }
    private fitSegList(srcLen: number, dstLen: number): void {
        
        let pathSeg: PathSegmentObject;
        let i: number;
        if(srcLen < dstLen) {
            // append
            for(i = srcLen; i < dstLen; ++i) {
                pathSeg = new PathSegmentObject();
                pathSeg.initialize(this.m_engine);
                this.m_segList.push(pathSeg);
            }
        }
        else {
            // remove
            for(i = dstLen; i < srcLen; ++i) {
                pathSeg = this.m_segList.pop();
                pathSeg.destroy();
            }
        }
    }
    private buildRoadSegmentAll(): void {

        let srcPosList: Pos3D[] = this.m_pathEditor.getPathPosList();
        let srcPosTable: Pos3D[][] = this.m_pathEditor.getPathPosTable();
        //this.m_pathSeg.buildByPathPosList(curvePosList, this.m_roadWidth, this.m_pathEditor.isPathClosed());

        let i: number = 0;
        let subLen: number = 0;
        let pathSeg: PathSegmentObject;

        this.fitSegList(this.m_segList.length, srcPosTable.length);

        let posList: Pos3D[];
        let tvList: Pos3D[];
        let index: number = 0;
        let listTotal: number = srcPosTable.length;
        let srcPosLen: number = srcPosList.length;
        let endIndex: number;
        let usePosTable: boolean = true;
        if(usePosTable) {
            this.m_pathTableTool.build(this.m_roadWidth);
            let segments: SegmentData[];
            //console.log("### A, listTotal: ",listTotal);

            let tempTot: number = 0;
            for(i = 0; i < listTotal; ++i) {

                subLen = srcPosTable[i].length;
                tempTot += subLen;
                endIndex = ((i + 1) < listTotal) ? (index + subLen + 1) : srcPosLen;
                //console.log(i,", subLen: ",subLen, ", srcPosLen: ",srcPosLen, ", index, endIndex: ",index, endIndex);                
                segments = this.m_pathTableTool.slice(index, endIndex);
                index += subLen;
                pathSeg = this.m_segList[i];
                pathSeg.posTotal = subLen;
                pathSeg.buildByPathSegments(segments);
                for(let j: number = 0; j < segments.length; ++j) {
                    segments[j].reset();
                }
            }
            this.m_pathTableTool.reset();
            //console.log("### B, tempTot: ",tempTot);
        }
        else {
            let srcTVList: Pos3D[] = this.m_pathTool.calcExpandXOZTVList(srcPosList, null, this.m_pathEditor.isPathClosed());
            for(i = 0; i < listTotal; ++i) {

                subLen = srcPosTable[i].length;
                endIndex = ((i + 1) < listTotal) ? (index + subLen + 1) : srcPosLen;
                posList = srcPosList.slice(index, endIndex);
                tvList = srcTVList.slice(index, endIndex);
                index += subLen;
                pathSeg = this.m_segList[i];
                pathSeg.buildByPathPosAndTVList(posList, tvList, this.m_roadWidth);
            }
            // let posList: Pos3D[] = srcPosList.slice(0, srcPosTable[0].length);
            // let tvList: Pos3D[] = srcTVList.slice(0, srcPosTable[0].length);
            // this.m_pathSeg.buildByPathPosAndTVList(posList, tvList);
    
            // this.m_pathSeg.buildByPathPosAndTVList(srcPosList, srcTVList);
            Pos3DPool.RestoreList(srcTVList);
        }
    }
    getSegList(): PathSegmentObject[] {
        return this.m_segList;
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