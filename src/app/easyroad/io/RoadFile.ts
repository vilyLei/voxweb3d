
import {FileIO} from "./FileIO";
import Vector3D from "../../../vox/math/Vector3D";
import RoadSurfaceGeometry from "../geometry/RoadSurfaceGeometry";

class RoadPathData{
    pathPosList: Vector3D[] = null;
    vs: Float32Array = null;
    uvs: Float32Array = null;
    ivs: Uint16Array | Uint32Array = null;
}
class RoadFile {

    private m_fileIO: FileIO = new FileIO();
    constructor() { }

    savePathData(pathPosList: Vector3D[], geom: RoadSurfaceGeometry = null): Uint8Array {
        let fileBuf: Uint8Array;// = this.buildPath(pathPosList);
        fileBuf = this.buildPathAndGeometry(pathPosList, geom);
        this.m_fileIO.downloadBinFile(fileBuf, "pathData");

        return fileBuf;
    }
    parsePathDataFromFileBuffer(fileBuf: Uint8Array): RoadPathData {
        
        let infoBuf: Uint32Array = new Uint32Array(fileBuf.buffer);
        // begin from fileBuf[16]
        //let dataPos: number = 128;
        let type = infoBuf[4];
        let total = infoBuf[5];
        let uint32Pos = infoBuf[6];
        let dataLength: number = infoBuf[7];

        let geomChunk: number = infoBuf[8];

        let dataBuf: Float32Array = new Float32Array(fileBuf.buffer);
        dataBuf = dataBuf.subarray(uint32Pos);
        
        let len: number = dataLength / 3;

        let pathPosList: Vector3D[] = new Array( len );
        
        let j: number = 0;
        for(let i: number = 0; i < len; ++i) {

            pathPosList[i] = new Vector3D(
                dataBuf[j    ],
                dataBuf[j + 1],
                dataBuf[j + 2]
            );
            j += 3;
        }

        let data: RoadPathData = new RoadPathData();
        data.pathPosList = pathPosList;
        //console.log("parse data: ",pathPosList);
        if(geomChunk == 7) {
            let index: number = 10;
            let vsBuf: Uint8Array = fileBuf.slice(infoBuf[index], infoBuf[index] + infoBuf[index + 1]);
            index = 12;
            let uvsBuf: Uint8Array = fileBuf.slice(infoBuf[index], infoBuf[index] + infoBuf[index + 1]);
            index = 14;
            let ivsBuf: Uint8Array = fileBuf.slice(infoBuf[index], infoBuf[index] + infoBuf[index + 1]);

            data.vs = new Float32Array(vsBuf.buffer);
            data.uvs = new Float32Array(uvsBuf.buffer);
            index = 16;
            if(infoBuf[index] > 65535) {
                data.ivs = new Uint32Array(ivsBuf.buffer);
            }
            else {
                data.ivs = new Uint16Array(ivsBuf.buffer);
            }
        }
        console.log("parse data: ",data);
        return data;
    }
    /*
    buildPath(pathPosList: Vector3D[]): Uint8Array {

        //console.log("src data: ",pathPosList);

        let len: number = pathPosList.length;
        let dataLength: number = len * 3;
        let dataBytesLength: number = dataLength * 4;
        // head 128 bytes
        let bytesLength: number = 128;
        bytesLength += dataBytesLength;
        // 
        let fileIcon: string = "vrd";
        let fileBuf: Uint8Array = new Uint8Array(bytesLength);
        
        for(let i: number = 0; i < fileIcon.length; ++i) {
            fileBuf[i] = fileIcon.charCodeAt(i);
        }

        let infoBuf: Uint32Array = new Uint32Array(fileBuf.buffer);
        // begin from fileBuf[16]
        let dataPos: number = 128;
        let uint32Pos: number = dataPos >> 2;
        infoBuf[4] = 1;// type
        infoBuf[5] = 2;// total number
        infoBuf[6] = uint32Pos;
        infoBuf[7] = dataLength;
        
        let dataBuf: Float32Array = new Float32Array(fileBuf.buffer);
        // from 128 bytes pos
        dataBuf = dataBuf.subarray(uint32Pos);

        let pv: Vector3D;
        let j: number = 0;
        for(let i: number = 0; i < len; ++i) {

            pv = pathPosList[i];
            dataBuf[j    ] = pv.x;
            dataBuf[j + 1] = pv.y;
            dataBuf[j + 2] = pv.z;
            j += 3;
        }
        return fileBuf;
    }
    //*/
    buildPathAndGeometry(pathPosList: Vector3D[], geom: RoadSurfaceGeometry = null): Uint8Array {

        //console.log("src data: ",pathPosList);

        let len: number = pathPosList.length;
        let dataLength: number = len * 3;
        let dataBytesLength: number = dataLength * 4;

        let geomFlag: boolean = geom != null;
        // head 128 bytes
        let bytesLength: number = 128;
        bytesLength += dataBytesLength;


        let vs: Float32Array;
        let uvs: Float32Array;
        let ivs: Uint16Array | Uint32Array;
        
        let vsPos: number;
        let uvsPos: number;
        let ivsPos: number;

        if(geomFlag) {

            vs = geom.getVS();
            uvs = geom.getUVS();
            ivs = geom.getIVS();
    
            vsPos = bytesLength;
            bytesLength += vs.buffer.byteLength;
            
            uvsPos = bytesLength;
            bytesLength += uvs.buffer.byteLength;
    
            ivsPos = bytesLength;
            bytesLength += ivs.buffer.byteLength;
        }

        // 
        let fileIcon: string = "vrdgeom";
        let fileBuf: Uint8Array = new Uint8Array(bytesLength);

        for(let i: number = 0; i < fileIcon.length; ++i) {
            fileBuf[i] = fileIcon.charCodeAt(i);
        }
        
        let infoBuf: Uint32Array = new Uint32Array(fileBuf.buffer);
        // begin from fileBuf[16]
        let dataPos: number = 128;
        let uint32Pos: number = dataPos >> 2;
        infoBuf[4] = 1;// type
        infoBuf[5] = 2;// total number
        infoBuf[6] = uint32Pos;
        infoBuf[7] = dataLength;

        if(geomFlag) {
            // geom data info
            infoBuf[8] = 7;// type
            infoBuf[9] = 7;// total number
            infoBuf[10] = vsPos;// pos in file buffer
            infoBuf[11] = vs.buffer.byteLength;// byteLength
            infoBuf[12] = uvsPos;// pos in file buffer
            infoBuf[13] = uvs.buffer.byteLength;// byteLength
            infoBuf[14] = ivsPos;// pos in file buffer
            infoBuf[15] = ivs.buffer.byteLength;// byteLength
            infoBuf[16] = ivs.length;// ivs length
        }

        
        let dataBuf: Float32Array = new Float32Array(fileBuf.buffer);
        // from 128 bytes pos
        dataBuf = dataBuf.subarray(uint32Pos);

        let pv: Vector3D;
        let j: number = 0;
        for(let i: number = 0; i < len; ++i) {

            pv = pathPosList[i];
            dataBuf[j    ] = pv.x;
            dataBuf[j + 1] = pv.y;
            dataBuf[j + 2] = pv.z;
            j += 3;
        }

        if(geomFlag) {

            let u8data: Uint8Array = new Uint8Array(vs.buffer);
            fileBuf.set(u8data,vsPos);
            
            u8data = new Uint8Array(uvs.buffer);
            fileBuf.set(u8data,uvsPos);

            u8data = new Uint8Array(ivs.buffer);
            fileBuf.set(u8data,ivsPos);
        }

        return fileBuf;
    }
}

export {RoadPathData, RoadFile};