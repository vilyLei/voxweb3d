
import { FileIO } from "./FileIO";
import Vector3D from "../../../vox/math/Vector3D";
import { PathSegmentObject } from "../road/PathSegmentObject";
import { PathSegmentEntity } from "../entity/PathSegmentEntity";
import MeshBase from "../../../vox/mesh/MeshBase";

class RoadSegmentMesh {
    
    ivs: Uint16Array | Uint32Array = null;
    vs: Float32Array = null;
    uvs: Float32Array = null;
    nvs: Float32Array = null;

    bounds: any  = {min: new Vector3D(), max: new Vector3D()};
    bytesTotal: number = 0;
    constructor() {
    }

    copyDataTo(srcBytes: Uint8Array, bytesIndex: number): void {

        let ivsU8Arr:Uint8Array = new Uint8Array(this.ivs.buffer);
        let vsU8Arr:Uint8Array = new Uint8Array(this.vs.buffer);
        let uvsU8Arr:Uint8Array = new Uint8Array(this.uvs.buffer);
        // console.log("save copyDataTo RoadSegmentMesh bytesIndex, bytesIndex + bytesTotal: ",bytesIndex, bytesIndex + this.ivs.buffer.byteLength);
        srcBytes.set(ivsU8Arr, bytesIndex);
        bytesIndex += ivsU8Arr.length;
        srcBytes.set(vsU8Arr, bytesIndex);
        bytesIndex += vsU8Arr.length;
        srcBytes.set(uvsU8Arr, bytesIndex);
        // console.log("save copyDataTo uv bytesIndex, bytesIndex + bytesTotal: ",bytesIndex, bytesIndex + uvsU8Arr.length);
        bytesIndex += uvsU8Arr.length;
        
        if (this.nvs != null) {
            let nvsU8Arr:Uint8Array = new Uint8Array(this.nvs.buffer);
            srcBytes.set(nvsU8Arr, bytesIndex);
            bytesIndex += nvsU8Arr.length;
        }
    }
    setPathSegmentEntity(segEntity: PathSegmentEntity): void {

        let mesh: MeshBase = segEntity.getMesh();
        this.bounds.min.copyFrom(mesh.bounds.min);
        this.bounds.max.copyFrom(mesh.bounds.max);

        this.ivs = mesh.getIVS();
        this.vs = mesh.getVS();
        this.uvs = mesh.getUVS();
        this.nvs = mesh.getNVS();

        this.bytesTotal = 0;
        this.bytesTotal += this.ivs.buffer.byteLength;
        this.bytesTotal += this.vs.buffer.byteLength;
        this.bytesTotal += this.uvs.buffer.byteLength;
        if (this.nvs != null) {
            this.bytesTotal += this.nvs.buffer.byteLength;
        }
    }

    createJsonObject(bytesIndex: number): any {

        let obj: any = {};
        let min: Vector3D = this.bounds.min;
        let max: Vector3D = this.bounds.max;
        obj.bounds = {
            min: {x: min.x, y: min.y, z: min.z},
            max: {x: max.x, y: max.y, z: max.z},
        };
        obj.bytesBegin = bytesIndex;
        // console.log("crateJson RoadSegmentMesh bytesIndex, bytesIndex + bytesTotal: ",bytesIndex, bytesIndex + this.ivs.buffer.byteLength);
        let type: number = this.ivs instanceof Uint16Array ? 16 : 32;
        obj.ivs = { type: type, bytesIndex: bytesIndex, bytesTotal: this.ivs.buffer.byteLength };
        bytesIndex += this.ivs.buffer.byteLength;

        obj.vs = { bytesIndex: bytesIndex, bytesTotal: this.vs.buffer.byteLength };
        bytesIndex += this.vs.buffer.byteLength;

        obj.uvs = { bytesIndex: bytesIndex, bytesTotal: this.uvs.buffer.byteLength };
        bytesIndex += this.uvs.buffer.byteLength;

        if (this.nvs != null) {
            obj.nvs = { bytesIndex: bytesIndex, bytesTotal: this.nvs.buffer.byteLength };
            bytesIndex += this.nvs.buffer.byteLength;
        }

        obj.bytesEnd = bytesIndex;

        return obj;
    }
}
class RoadSegment {

    distance: number = 0;
    posTotal: number = 0;
    meshes: RoadSegmentMesh[] = [];
    bytesTotal: number = 0;
    constructor() {
    }
    copyDataTo(srcBytes: Uint8Array, bytesIndex: number): void {
       
        let segMesh: RoadSegmentMesh = null;
        for (let i: number = 0; i < this.meshes.length; ++i) {
            segMesh = this.meshes[i];
            segMesh.copyDataTo(srcBytes, bytesIndex);
            bytesIndex += segMesh.bytesTotal;
        }
    }
    setPathSegmentObject(pathSegObj: PathSegmentObject): void {

        this.distance = pathSegObj.distance;
        this.posTotal = pathSegObj.posTotal;
        let entities: PathSegmentEntity[] = pathSegObj.getPathSegmentEntities();
        let segMesh: RoadSegmentMesh = null;
        this.bytesTotal = 0;
        for (let i: number = 0; i < entities.length; ++i) {
            segMesh = new RoadSegmentMesh();
            segMesh.setPathSegmentEntity(entities[i]);
            this.bytesTotal += segMesh.bytesTotal;
            this.meshes.push(segMesh);
        }
    }
    createJsonObject(bytesIndex: number): any {
        let obj: any = {};
        obj.distance = this.distance;
        obj.posTotal = this.posTotal;
        obj.bytesBegin = bytesIndex;
        obj.meshes = [];
        let tempObj: any;
        let mesh: RoadSegmentMesh;
        for (let i: number = 0; i < this.meshes.length; ++i) {
            mesh = this.meshes[i];
            tempObj = mesh.createJsonObject(bytesIndex);
            obj.meshes.push(tempObj);
            bytesIndex += mesh.bytesTotal;
        }
        obj.bytesEnd = bytesIndex;
        return obj;
    }
}
/**
 * 每一个 road 相关的数据块
 * 数据布局方式: curve pos list -> geom data
 */
class RoadModel {

    segmentList: RoadSegment[] = [];
    bytesTotal: number = 0;
    /**
     * 路径上的关键点
     */
    pathPosList: Vector3D[] = null;
    /**
     * 路径曲线上的所有点
     */
    curvePosList: Vector3D[] = null;
    curvePosListBytesTotal: number = 0;
    curvePosTotal: number = 0;
    pathPosListBytesTotal: number = 0;
    pathPosTotal: number = 0;
    /**
     * 路径模块的分类: 道路、隧道管道、河流沟渠、长城，大坝、轨迹线、其他等等
     */
    modeClass: number = 0;
    /**
     * 功能类型, 如果是道路，则可能的值为: 一般路径，交叉路口， 两段路径中的链接部分，桥，其他等等
     */
    roadFunctionType: number = 0;
    constructor() {
    }
    private copyPosDataTo(posList: Vector3D[], srcBytes: Uint8Array, bytesIndex: number): void {
        
        let posFS: Float32Array = new Float32Array(posList.length * 3);
        let pv: Vector3D;
        let k: number = 0;
        for (let i: number = 0; i < posList.length; ++i) {
            pv = posList[i];
            posFS[k++] = pv.x;
            posFS[k++] = pv.y;
            posFS[k++] = pv.z;
        }
        let posUint8: Uint8Array = new Uint8Array(posFS.buffer);
        srcBytes.set(posUint8, bytesIndex);
    }
    copyDataTo(srcBytes: Uint8Array, bytesIndex: number): void {

        this.copyPosDataTo(this.pathPosList, srcBytes, bytesIndex);
        bytesIndex += this.pathPosListBytesTotal;

        this.copyPosDataTo(this.curvePosList, srcBytes, bytesIndex);
        bytesIndex += this.curvePosListBytesTotal;

        if(this.segmentList != null && this.segmentList.length > 0) {
            let seg: RoadSegment = null;
            for (let i: number = 0; i < this.segmentList.length; ++i) {
                seg = this.segmentList[i];
                seg.copyDataTo(srcBytes, bytesIndex);            
                bytesIndex += seg.bytesTotal;
            }
        }
    }
    setPathSegmentObject(pathSegObjs: PathSegmentObject[]): void {

        this.bytesTotal = 0;
        this.pathPosTotal = this.pathPosList.length;
        this.pathPosListBytesTotal = this.pathPosList.length * 3 * 4;
        this.bytesTotal += this.pathPosListBytesTotal;

        this.curvePosTotal = this.curvePosList.length;
        this.curvePosListBytesTotal = this.curvePosList.length * 3 * 4;
        this.bytesTotal += this.curvePosListBytesTotal;
        
        if(pathSegObjs != null) {
            this.segmentList = [];
            let seg: RoadSegment = null;
            for (let i: number = 0; i < pathSegObjs.length; ++i) {
    
                seg = new RoadSegment();
                seg.setPathSegmentObject(pathSegObjs[i]);
                this.segmentList.push(seg);
                this.bytesTotal += seg.bytesTotal;
            }
        }
    }
    createJsonObject(bytesIndex: number): any {

        let dataObj: any = {};
        dataObj.bytesBegin = bytesIndex;
        dataObj.roadSegments = [];
        dataObj.modeClass = this.modeClass;
        dataObj.roadFunctionType = this.roadFunctionType;

        dataObj.pathPosTotal = this.pathPosTotal;
        dataObj.curvePosTotal = this.curvePosTotal;

        dataObj.bytesTotal = this.bytesTotal;
        dataObj.pathPosListBytesIndex = bytesIndex;
        dataObj.pathPosListBytesTotal = this.pathPosListBytesTotal;
        bytesIndex += this.pathPosListBytesTotal;

        dataObj.curvePosListBytesIndex = bytesIndex;
        dataObj.curvePosListBytesTotal = this.curvePosListBytesTotal;
        bytesIndex += this.curvePosListBytesTotal;
        if(this.segmentList != null && this.segmentList.length > 0) {
            let seg: RoadSegment = null;
            let tempObj: any;
            for (let i: number = 0; i < this.segmentList.length; ++i) {
                seg = this.segmentList[i];
                tempObj = seg.createJsonObject(bytesIndex);
                dataObj.roadSegments.push(tempObj);
                bytesIndex += seg.bytesTotal;
            }
        }
        dataObj.bytesEnd = bytesIndex;
        return dataObj;
    }
}
/**
 * 当前编辑器场景的导出数据
 * 布局方式: 文件头(默认128字节) -> 几何等场景数据 -> 场景数据json描述数据
 */
class RoadSceneExportData {
    private m_roadNodes: ExportRoadNode[] = null;
    // 记录road的相关信息
    roadList:RoadModel[] = [];
    // 记录其他模块的相关信息

    // 总字节数
    bytesTotal: number = 0;
    constructor(){}

    addRoadModule(roadNode: ExportRoadNode): void {

        let road: RoadModel = new RoadModel();

        road.pathPosList = roadNode.pathPosList;
        road.curvePosList = roadNode.curvePosList;
        road.setPathSegmentObject(roadNode.pathSegList);

        this.bytesTotal += road.bytesTotal;
        this.roadList.push(road);
    }
    copyDataTo(srcBytes: Uint8Array, bytesIndex: number): void {

        let road: RoadModel = null;
        for (let i: number = 0; i < this.roadList.length; ++i) {
            road = this.roadList[i];
            road.copyDataTo(srcBytes, bytesIndex);
            bytesIndex += road.bytesTotal;
        }
    }
    createJsonObject(bytesIndex: number): any {

        let dataObj: any = {};
        dataObj.bytesTotal = this.bytesTotal;
        dataObj.bytesBegin = bytesIndex;
        dataObj.roadList = [];
        let road: RoadModel = null;
        let tempObj: any;
        for (let i: number = 0; i < this.roadList.length; ++i) {
            road = this.roadList[i];
            tempObj = road.createJsonObject(bytesIndex);
            dataObj.roadList.push(tempObj);
            bytesIndex += road.bytesTotal;
        }
        dataObj.bytesEnd = bytesIndex;
        return dataObj;
    }
}
class ExportRoadNode {
    /**
     * 路径上的关键点
     */
    pathPosList: Vector3D[] = null;
    /**
     * 曲线上的所有点
     */
    curvePosList: Vector3D[] = null;
    /**
     * road 所有分段的几何数据
     */
    pathSegList: PathSegmentObject[] = null;
    constructor() {
    }
}
class RoadSceneFile {

    private m_fileIO: FileIO = new FileIO();
    private m_sceneExportData: RoadSceneExportData = null;
    constructor() { }
    saveFile(fileBuf: Uint8Array): void {
        this.m_fileIO.downloadBinFile(fileBuf, "vrdScene");
    }
    buildRoadFile(roadNode: ExportRoadNode): Uint8Array {

        this.m_sceneExportData = new RoadSceneExportData();
        let headBytesTotal: number = 128;
        //let curvePosList: Vector3D[] = roadNode.curvePosList;
        //let pathSegList: PathSegmentObject[] = roadNode.pathSegList;
        this.m_sceneExportData.addRoadModule(roadNode);

        console.log("save this.m_sceneExportData: ",this.m_sceneExportData);
        console.log("this.m_scene.bytesTotal: ", this.m_sceneExportData.bytesTotal);

        let sceneJsonOj: any = this.m_sceneExportData.createJsonObject(headBytesTotal);
        console.log("sceneJsonOj: ",sceneJsonOj);
        let jsonStr = JSON.stringify(sceneJsonOj);
        // console.log("jsonStr: ", jsonStr);
        // let jsonObj: any = JSON.parse(jsonStr);
        // console.log("jsonObj: ", jsonObj);
        
        let jsonStrUint8: Uint8Array = new TextEncoder().encode(jsonStr);
        let sceneDataBytesIndex: number = headBytesTotal;
        // json str data bytes position index
        let jsonStrBytesIndex: number = headBytesTotal + this.m_sceneExportData.bytesTotal;
        // json str data bytes total
        let jsonStrBytesTotal: number = jsonStrUint8.byteLength;

        let fileBytesTotal: number = headBytesTotal + this.m_sceneExportData.bytesTotal + jsonStrBytesTotal;
        console.log("headBytesTotal,ceneExportData.bytesTotal,jsonStrBytesTotal: ",headBytesTotal,this.m_sceneExportData.bytesTotal,jsonStrBytesTotal);

        console.log("A fileBytesTotal: ",fileBytesTotal);
        fileBytesTotal = Math.ceil(fileBytesTotal/4) * 4;
        console.log("B fileBytesTotal: ",fileBytesTotal);
        console.log("jsonStrBytesIndex: ",jsonStrBytesIndex);
        let fileBuf: Uint8Array = new Uint8Array(fileBytesTotal);
        let uint32: Uint32Array = new Uint32Array(fileBuf.buffer);

        let fileIcon: string = "vrdScene";
        for (let i: number = 0; i < fileIcon.length; ++i) {
            fileBuf[i] = fileIcon.charCodeAt(i);
        }
        
        uint32[3] = headBytesTotal;
        // version
        uint32[4] = 1001;
        // json str data bytes position index
        uint32[6] = jsonStrBytesIndex;
        // json str data bytes total
        uint32[7] = jsonStrBytesTotal;
        // write scene data
        this.m_sceneExportData.copyDataTo(fileBuf, sceneDataBytesIndex);
        // write scene json data
        fileBuf.set(jsonStrUint8, jsonStrBytesIndex);
        return fileBuf;
    }
}

export { ExportRoadNode, RoadSceneFile };