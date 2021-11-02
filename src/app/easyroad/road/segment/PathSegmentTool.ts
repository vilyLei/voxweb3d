import Vector3D from "../../../../vox/math/Vector3D";
import { PathTool } from "../PathTool";
import { Pos3D } from "../../base/Pos3D";
import EngineBase from "../../../../vox/engine/EngineBase";
import { PathCurveEditor } from "../PathCurveEditor";
import { Pos3DPool } from "../../base/Pos3DPool";
import { IPathSegmentTool } from "./IPathSegmentTool";
import { SegmentData } from "../segment/SegmentData";
import TextureProxy from "../../../../vox/texture/TextureProxy";

class PathSegmentTool implements IPathSegmentTool {

    constructor() { }
    
    private m_initFlag: boolean = true;
    private m_offsetXYZ: Vector3D = new Vector3D(0, 0, 0);
    private m_pathTool: PathTool = new PathTool();
    private m_pathEditor: PathCurveEditor = null;
    private m_tvList: Pos3D[] = null;
    private m_srcTables: Pos3D[][][] = null;
    private m_texPathList: string[] = null;

    initialize(pathEditor: PathCurveEditor): void {

        console.log("PathSegmentTool::initialize()......");
        if (this.m_initFlag) {

            this.m_initFlag = false;
            this.m_pathEditor = pathEditor;
            this.m_pathTool = new PathTool();

            this.m_texPathList = [
                "static/assets/roadSurface04.jpg",
                "static/assets/brick_d.jpg"
            ];
        }
    }

    reset(): void {
        if(this.m_tvList != null) {
            for(let i: number = 0; i < this.m_srcTables.length; ++i) {
                Pos3DPool.RestoreTable(this.m_srcTables[i]);
            }
            Pos3DPool.RestoreList(this.m_tvList);
            this.m_srcTables = null;
            this.m_tvList = null;
        }
    }
    private sliceSubTable(srcTabel: Pos3D[][], begin: number, end: number): Pos3D[][] {
        let subTabel: Pos3D[][] = [];
        for(let i: number = 0; i < srcTabel.length; ++i) {
            subTabel.push(srcTabel[i].slice(begin, end));
        }
        return subTabel;
    }
    slice(begin: number, end: number): SegmentData[] {
        let segments: SegmentData[] = [];
        let data: SegmentData;
        for(let i: number = 0; i < this.m_srcTables.length; ++i) {
            data = new SegmentData();
            data.texturePath = this.m_texPathList[i];
            data.posTable = this.sliceSubTable(this.m_srcTables[i], begin, end);
            segments.push( data );
        }
        data = segments[0];
        data.uScale = 1.0;
        data.vScale = 0.0;
        data.uvType = 1;
        data = segments[1];
        data.uScale = 1.0;
        data.vScale = 0.05;
        data.uvType = 0;

        return segments;
    }
    build(roadWidth: number = 120.0): void {

        let posTotal: number = this.m_pathEditor.getPathPosTotal();
        if (posTotal > 1) {

            let srcPosList: Pos3D[] = this.m_pathEditor.getPathPosList();
            let srcTVList: Pos3D[] = this.m_pathTool.calcExpandXOZTVList(srcPosList, null, this.m_pathEditor.isPathClosed());

            let curvePosList: Pos3D[] = srcPosList;
            let tvList: Pos3D[] = srcTVList;
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

            this.m_tvList = tvList;
            this.m_srcTables = [];
            this.m_srcTables.push(tableTop);
            this.m_srcTables.push(tableBottom);
        }
    }
    
    destroy(): void {
        if(!this.m_initFlag) {
            this.reset();
            this.m_pathEditor = null;
            this.m_pathTool = null;
            this.m_initFlag = true;
        }
    }
}

export { PathSegmentTool };