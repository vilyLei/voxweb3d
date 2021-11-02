
import { FileIO } from "./FileIO";
import Vector3D from "../../../vox/math/Vector3D";
import RoadSurfaceGeometry from "../geometry/RoadSurfaceGeometry";
import { PathSegmentObject } from "../road/PathSegmentObject";
import { PathSegmentEntity } from "../road/PathSegmentEntity";
import MeshBase from "../../../vox/mesh/MeshBase";

class RoadSegmentMesh {

    ivs: Uint16Array | Uint32Array = null;
    vs: Float32Array = null;
    uvs: Float32Array = null;
    nvs: Float32Array = null;

    constructor() {
    }

    parseDataTo(srcBytes: Uint8Array, dataObj: any): void {

        let tempObj: any = dataObj["ivs"];
        console.log("ivs: ",tempObj.bytesIndex, tempObj.bytesIndex + tempObj.bytesTotal);
        let u8Arr: Uint8Array = srcBytes.slice(tempObj.bytesIndex, tempObj.bytesIndex + tempObj.bytesTotal);
        if(tempObj.type == 16) {
            this.ivs = new Uint16Array( u8Arr.buffer );
        }
        else {
            this.ivs = new Uint32Array( u8Arr.buffer );
        }

        tempObj = dataObj["vs"];
        u8Arr = srcBytes.slice(tempObj.bytesIndex, tempObj.bytesIndex + tempObj.bytesTotal);
        this.vs = new Float32Array( u8Arr.buffer );
        
        tempObj = dataObj["uvs"];
        u8Arr = srcBytes.slice(tempObj.bytesIndex, tempObj.bytesIndex + tempObj.bytesTotal);
        this.uvs = new Float32Array( u8Arr.buffer );

        if(dataObj["nvs"] !== undefined && dataObj["nvs"] !== null) {
            tempObj = dataObj["nvs"];
            u8Arr = srcBytes.slice(tempObj.bytesIndex, tempObj.bytesIndex + tempObj.bytesTotal);
            this.nvs = new Float32Array( u8Arr.buffer );
        }
    }

}
class RoadSegment {

    posTotal: number = 0;
    meshes: RoadSegmentMesh[] = [];
    constructor() {
    }
    parseDataTo(srcBytes: Uint8Array, dataObj: any): void {
        let mesh: RoadSegmentMesh = null;
        this.meshes = [];
        let meshes: any[] = dataObj.meshes;
        for (let i: number = 0; i < meshes.length; ++i) {
            mesh = new RoadSegmentMesh();
            mesh.parseDataTo(srcBytes, meshes[i]);            
            this.meshes.push(mesh);
        }
    }
}

class RoadScene {

    segmentList: RoadSegment[] = [];
    constructor() {
    }
    parseDataTo(srcBytes: Uint8Array, dataObj: any): void {
        let seg: RoadSegment = null;
        this.segmentList = [];
        let roadSegments: any[] = dataObj.roadSegments;
        for (let i: number = 0; i < roadSegments.length; ++i) {
            seg = new RoadSegment();
            seg.posTotal = roadSegments[i].posTotal;
            seg.parseDataTo(srcBytes, roadSegments[i]);            
            this.segmentList.push(seg);
        }
    }
}
class SceneHead {

    headBytesTotal: number = 0;
    version: number = 0;
    curvePosListBytesIndex: number = 0;
    curvePosListBytesTotal: number = 0;
    geomBytesIndex: number = 0;
    geomBytesTotal: number = 0;
    jsonStrBytesIndex: number = 0;
    jsonStrBytesTotal: number = 0;

    sceneJsonObj: any = null;
    curvePosList: Vector3D[] = null;
    constructor() {
    }
    parse(fileBuf: Uint8Array): void {

        console.log("### parse begin ....");
        const iconStr: string = "vrdScene";
        let fileIcon: string = "";
        for (let i: number = 0; i < 8; ++i) {
            //fileBuf[i] = fileIcon.charCodeAt(i);
            fileIcon += String.fromCharCode(fileBuf[i]);
        }
        console.log("fileIcon: ",fileIcon);
        if(fileIcon === iconStr) {

            let uint32: Uint32Array = new Uint32Array(fileBuf.buffer);

            this.headBytesTotal = uint32[3];
            this.version = uint32[4];
    
            this.geomBytesIndex = uint32[5];
            this.geomBytesTotal = uint32[6];
    
            this.curvePosListBytesIndex = uint32[7];
            this.curvePosListBytesTotal = uint32[8];
            
            this.jsonStrBytesIndex = uint32[9];
            this.jsonStrBytesTotal = uint32[10];
            
            let posU8Arr: Uint8Array = fileBuf.slice(this.curvePosListBytesIndex, this.curvePosListBytesIndex + this.curvePosListBytesTotal);
            let posF32Arr: Float32Array = new Float32Array( posU8Arr.buffer );
            this.curvePosList = new Array(posF32Arr.length / 3);
            let k: number = 0;
            for(let i: number = 0; i < posF32Arr.length;) {
                this.curvePosList[k++] = new Vector3D(
                    posF32Arr[i++],
                    posF32Arr[i++],
                    posF32Arr[i++]
                    );
            }
            let jsonBytes: Uint8Array = fileBuf.slice(this.jsonStrBytesIndex, this.jsonStrBytesIndex + this.jsonStrBytesTotal);
            let jsonStr: string = new TextDecoder("utf-8").decode(jsonBytes);
            this.sceneJsonObj = JSON.parse(jsonStr);
            //console.log("jsonObj: ", jsonObj);
            console.log("head: ", this);
        }
    }
}
class RoadSceneFileParser {

    private m_head: SceneHead = new SceneHead();
    private m_scene: RoadScene = new RoadScene();
    constructor() { }

    parse(fileBuf: Uint8Array): void {
        this.m_head.parse(fileBuf);
        this.m_scene.parseDataTo(fileBuf, this.m_head.sceneJsonObj);
        console.log("parse this.m_scene: ",this.m_scene);
    }
}

export { RoadSceneFileParser };