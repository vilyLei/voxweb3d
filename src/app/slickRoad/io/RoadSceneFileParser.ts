import Vector3D from "../../../vox/math/Vector3D";

class RoadSegmentMesh {

    ivs: Uint16Array | Uint32Array = null;
    vs: Float32Array = null;
    uvs: Float32Array = null;
    nvs: Float32Array = null;
    bounds: Vector3D[] = [new Vector3D(), new Vector3D()];
    constructor() {
    }

    parseDataTo(srcBytes: Uint8Array, dataObj: any): void {
        let min: any = dataObj.bounds.min;
        let max: any = dataObj.bounds.max;
        this.bounds[0].setTo(min.x, min.y, min.z);
        this.bounds[1].setTo(max.x, max.y, max.z);
        let tempObj: any = dataObj["ivs"];
        // console.log("parse RoadSegmentMesh bytesIndex, bytesIndex + bytesTotal: ",tempObj.bytesIndex, tempObj.bytesIndex + tempObj.bytesTotal);
        let u8Arr: Uint8Array = srcBytes.slice(tempObj.bytesIndex, tempObj.bytesIndex + tempObj.bytesTotal);
        if (tempObj.type == 16) {
            this.ivs = new Uint16Array(u8Arr.buffer);
        }
        else {
            this.ivs = new Uint32Array(u8Arr.buffer);
        }

        tempObj = dataObj["vs"];
        u8Arr = srcBytes.slice(tempObj.bytesIndex, tempObj.bytesIndex + tempObj.bytesTotal);
        this.vs = new Float32Array(u8Arr.buffer);

        tempObj = dataObj["uvs"];
        // console.log("parse RoadSegmentMesh uv bytesIndex, bytesIndex + bytesTotal: ",tempObj.bytesIndex, tempObj.bytesIndex + tempObj.bytesTotal);
        u8Arr = srcBytes.slice(tempObj.bytesIndex, tempObj.bytesIndex + tempObj.bytesTotal);
        this.uvs = new Float32Array(u8Arr.buffer);        
        
        if (dataObj["nvs"] !== undefined && dataObj["nvs"] !== null) {
            tempObj = dataObj["nvs"];
            u8Arr = srcBytes.slice(tempObj.bytesIndex, tempObj.bytesIndex + tempObj.bytesTotal);
            this.nvs = new Float32Array(u8Arr.buffer);
        }
    }

}
class RoadSegment {

    distance: number = 0;
    posTotal: number = 0;
    meshes: RoadSegmentMesh[] = null;
    constructor() {
    }
    parseDataTo(srcBytes: Uint8Array, dataObj: any): void {

        this.distance = dataObj.distance;
        this.posTotal = dataObj.posTotal;
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

class RoadModel {
    /**
     * 道路分段数据数组
     */
    segmentList: RoadSegment[] = null;
    /**
     * 路径上的关键点位置数组
     */
    pathPosList: Vector3D[] = null;
    pathPosTotal: number = 0;
    /**
     * 路径曲线上的关键点位置数组
     */
    curvePosList: Vector3D[] = null;
    curvePosTotal: number = 0;
    /**
     * 路径模块的分类: 道路、隧道、河流沟渠、轨迹线、其他等等
     */
    modeClass: number = 0;
    /**
     * 功能类型, 如果是道路，则可能的值为: 一般路径，交叉路口， 两段路径中的链接部分，桥，其他等等
     */
    roadFunctionType: number = 0;
    constructor() {
    }
    
    private parsePoseDataTo(posF32Arr: Float32Array, posList: Vector3D[]): void {
        let k: number = 0;
        for (let i: number = 0; i < posF32Arr.length;) {
            posList[k++] = new Vector3D(
                posF32Arr[i++],
                posF32Arr[i++],
                posF32Arr[i++]
            );
        }
    }
    parseDataTo(srcBytes: Uint8Array, dataObj: any): void {

        this.modeClass = dataObj.modeClass;
        this.roadFunctionType = dataObj.roadFunctionType;
        this.pathPosTotal = dataObj.pathPosTotal;
        this.curvePosTotal = dataObj.curvePosTotal;

        let posU8Arr: Uint8Array = srcBytes.slice(dataObj.pathPosListBytesIndex, dataObj.pathPosListBytesIndex + dataObj.pathPosListBytesTotal);
        let posF32Arr: Float32Array = new Float32Array(posU8Arr.buffer);
        this.pathPosList = new Array(this.pathPosTotal);
        this.parsePoseDataTo(posF32Arr, this.pathPosList);

        posU8Arr = srcBytes.slice(dataObj.curvePosListBytesIndex, dataObj.curvePosListBytesIndex + dataObj.curvePosListBytesTotal);
        posF32Arr = new Float32Array(posU8Arr.buffer);
        this.curvePosList = new Array(this.curvePosTotal);
        this.parsePoseDataTo(posF32Arr, this.curvePosList);

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

/**
 * 当前编辑器场景的导出数据
 * 布局方式: 文件头(默认128字节) -> 几何等场景数据 -> 场景数据json描述数据
 */
class RoadSceneData {
    // 记录road的相关信息
    roadList: RoadModel[] = null;
    // 记录其他模块的相关信息
    // 总字节数
    bytesTotal: number = 0;
    constructor() { }

    parseDataTo(srcBytes: Uint8Array, dataObj: any): void {

        this.roadList = [];
        let road: RoadModel = null;
        let roadList: any[] = dataObj.roadList;
        for (let i: number = 0; i < roadList.length; ++i) {
            road = new RoadModel();
            road.parseDataTo(srcBytes, roadList[i]);
            this.roadList.push(road);
        }
    }
}

class RoadSceneDataHead {

    headBytesTotal: number = 0;
    version: number = 0;
    jsonStrBytesIndex: number = 0;
    jsonStrBytesTotal: number = 0;

    sceneJsonObj: any = null;
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
        console.log("fileIcon: ", fileIcon);
        if (fileIcon === iconStr) {

            let uint32: Uint32Array = new Uint32Array(fileBuf.buffer);

            this.headBytesTotal = uint32[3];
            this.version = uint32[4];

            this.jsonStrBytesIndex = uint32[6];
            this.jsonStrBytesTotal = uint32[7];

            let jsonBytes: Uint8Array = fileBuf.slice(this.jsonStrBytesIndex, this.jsonStrBytesIndex + this.jsonStrBytesTotal);
            let jsonStr: string = new TextDecoder("utf-8").decode(jsonBytes);
            this.sceneJsonObj = JSON.parse(jsonStr);
            console.log("head: ", this);
        }
        else {
            throw Error("illegal data format.");
        }
    }
}
class RoadSceneFileParser {

    private m_head: RoadSceneDataHead = new RoadSceneDataHead();
    private m_scene: RoadSceneData = new RoadSceneData();
    constructor() { }

    getSceneDataHead(): RoadSceneDataHead {
        return this.m_head;
    }
    getSceneData(): RoadSceneData {
        return this.m_scene;
    }
    parse(fileBuf: Uint8Array): void {
        this.m_head.parse(fileBuf);
        this.m_scene.parseDataTo(fileBuf, this.m_head.sceneJsonObj);
        console.log("parse this.m_scene: ", this.m_scene);
    }
}

export { RoadSegmentMesh, RoadSegment, RoadModel, RoadSceneDataHead, RoadSceneData, RoadSceneFileParser };