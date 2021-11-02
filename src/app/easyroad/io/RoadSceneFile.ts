
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

    bytesTotal: number = 0;
    constructor() {
    }

    copyDataTo(srcBytes: Uint8Array, bytesIndex: number): void {

        let ivsU8Arr:Uint8Array = new Uint8Array(this.ivs.buffer);
        let vsU8Arr:Uint8Array = new Uint8Array(this.vs.buffer);
        let uvsU8Arr:Uint8Array = new Uint8Array(this.uvs.buffer);
        srcBytes.set(ivsU8Arr, bytesIndex);
        bytesIndex += ivsU8Arr.length;
        srcBytes.set(vsU8Arr, bytesIndex);
        bytesIndex += vsU8Arr.length;
        srcBytes.set(uvsU8Arr, bytesIndex);
        bytesIndex += uvsU8Arr.length;
        if (this.nvs != null) {
            let nvsU8Arr:Uint8Array = new Uint8Array(this.nvs.buffer);
            srcBytes.set(nvsU8Arr, bytesIndex);
            bytesIndex += nvsU8Arr.length;
        }
    }
    setPathSegmentEntity(segEntity: PathSegmentEntity): void {

        let mesh: MeshBase = segEntity.getMesh();
        this.ivs = mesh.getIVS();
        this.vs = mesh.getVS();
        this.uvs = mesh.getUVS();
        this.nvs = mesh.getNVS();

        this.bytesTotal = this.ivs.buffer.byteLength;
        this.bytesTotal += this.vs.buffer.byteLength;
        this.bytesTotal += this.uvs.buffer.byteLength;
        if (this.nvs != null) {
            this.bytesTotal += this.nvs.buffer.byteLength;
        }
    }

    createJsonObject(bytesIndex: number): any {

        let obj: any = {};
        obj.bytesBegin = bytesIndex;

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

class RoadScene {

    segmentList: RoadSegment[] = [];
    geomBytesTotal: number = 0;
    constructor() {
    }
    reset(): void {

        this.geomBytesTotal = 0;
    }
    copyDataTo(srcBytes: Uint8Array, bytesIndex: number): void {
        let seg: RoadSegment = null;
        for (let i: number = 0; i < this.segmentList.length; ++i) {
            seg = this.segmentList[i];
            seg.copyDataTo(srcBytes, bytesIndex);            
            bytesIndex += seg.bytesTotal;
        }
    }
    setPathSegmentObject(pathSegObjs: PathSegmentObject[]): void {

        this.segmentList = [];
        this.geomBytesTotal = 0;
        let seg: RoadSegment = null;
        for (let i: number = 0; i < pathSegObjs.length; ++i) {
            seg = new RoadSegment();
            seg.setPathSegmentObject(pathSegObjs[i]);
            this.segmentList.push(seg);
            this.geomBytesTotal += seg.bytesTotal;
        }
    }
    createJsonObject(bytesIndex: number): any {
        let obj: any = {};
        obj.bytesBegin = bytesIndex;
        obj.roadSegments = [];
        let seg: RoadSegment = null;
        let tempObj: any;
        for (let i: number = 0; i < this.segmentList.length; ++i) {
            seg = this.segmentList[i];
            tempObj = seg.createJsonObject(bytesIndex);
            obj.roadSegments.push(tempObj);
            bytesIndex += seg.bytesTotal;
        }
        obj.bytesEnd = bytesIndex;
        return obj;
    }
}
class RoadSceneFile {

    private m_fileIO: FileIO = new FileIO();
    private m_scene: RoadScene = new RoadScene();
    constructor() { }

    save(curvePosList: Vector3D[], pathSegList: PathSegmentObject[]): Uint8Array {

        this.m_scene.setPathSegmentObject(pathSegList);

        console.log("save this.m_scene: ",this.m_scene);
        console.log("this.m_scene.geomBytesTotal: ", this.m_scene.geomBytesTotal);

        let sceneJsonOj: any = this.m_scene.createJsonObject(128);

        let jsonStr = JSON.stringify(sceneJsonOj);
        console.log("jsonStr: ", jsonStr);
        let jsonObj: any = JSON.parse(jsonStr);
        console.log("jsonObj: ", jsonObj);

        let jsonStrUint8: Uint8Array = new TextEncoder().encode(jsonStr);
        // let decoded = new TextDecoder("utf-8").decode(encoded);
        // console.log("encoded: ",encoded);
        // console.log("decoded: ",decoded);
        let headBytesTotal: number = 128;
        let curvePosListBytesTotal: number = curvePosList.length * 3 * 4;
        let fileBytesTotal: number = headBytesTotal + this.m_scene.geomBytesTotal + curvePosListBytesTotal + jsonStrUint8.byteLength;

        let geomBytesIndex: number = headBytesTotal;
        let curvePosListBytesIndex: number = headBytesTotal + this.m_scene.geomBytesTotal;
        let jsonStrBytesIndex: number = headBytesTotal + this.m_scene.geomBytesTotal + curvePosListBytesTotal;
        console.log("A fileBytesTotal: ",fileBytesTotal);
        fileBytesTotal = Math.ceil(fileBytesTotal/4) * 4;
        console.log("B fileBytesTotal: ",fileBytesTotal);
        let fileBuf: Uint8Array = new Uint8Array(fileBytesTotal);
        let uint32: Uint32Array = new Uint32Array(fileBuf.buffer);

        let fileIcon: string = "vrdScene";
        for (let i: number = 0; i < fileIcon.length; ++i) {
            fileBuf[i] = fileIcon.charCodeAt(i);
        }
        
        uint32[3] = headBytesTotal;
        // version
        uint32[4] = 1001;

        // mesh geom data bytes position index
        uint32[5] = geomBytesIndex;
        // mesh geom data bytes total
        uint32[6] = this.m_scene.geomBytesTotal;

        // curve pos list data bytes position index
        uint32[7] = curvePosListBytesIndex;
        // curve pos list data bytes total
        uint32[8] = curvePosListBytesTotal;

        // json str data bytes position index
        uint32[9] = jsonStrBytesIndex;
        // json str data bytes total
        uint32[10] = jsonStrUint8.byteLength;
        // console.log("save uint32: ",uint32);
        this.m_scene.copyDataTo(fileBuf, geomBytesIndex);
        //console.log("curvePosListBytesIndex: ", curvePosListBytesIndex);
        //console.log("curvePosListBytesTotal: ", curvePosListBytesTotal);
        //console.log("src curvePosList: ", curvePosList);
        let posFS: Float32Array = new Float32Array(curvePosList.length * 3);
        let pv: Vector3D;
        let k: number = 0;
        for (let i: number = 0; i < curvePosList.length; ++i) {
            pv = curvePosList[i];
            posFS[k++] = pv.x;
            posFS[k++] = pv.y;
            posFS[k++] = pv.z;
        }
        let posUint8: Uint8Array = new Uint8Array(posFS.buffer);
        fileBuf.set(posUint8, curvePosListBytesIndex);

        fileBuf.set(jsonStrUint8, jsonStrBytesIndex);
        
        // for test
        // let posU8Arr: Uint8Array = fileBuf.slice(curvePosListBytesIndex, curvePosListBytesIndex + curvePosListBytesTotal);
        // let posF32Arr: Float32Array = new Float32Array( posU8Arr.buffer );
        // curvePosList = new Array(posF32Arr.length / 3);
        // k = 0;
        // for(let i: number = 0; i < posF32Arr.length;) {
        //     curvePosList[k] = new Vector3D(
        //         posF32Arr[i],
        //         posF32Arr[i+1],
        //         posF32Arr[i+2]
        //         );
        //     i += 3;
        //     k ++;
        // }        
        // console.log("read curvePosList: ", curvePosList);

        return fileBuf;
    }
}

export { RoadSceneFile };