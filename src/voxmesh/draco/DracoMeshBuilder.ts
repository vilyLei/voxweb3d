
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import ThreadSystem from "../../thread/ThreadSystem";
import DracoTask from "../../voxmesh/draco/DracoTask";
import {DracoTaskListener} from "../../voxmesh/draco/DracoTask";
import MeshBufferLoader from "../../voxmesh/draco/MeshBufferLoader";
import DracoWasmLoader from "../../voxmesh/draco/DracoWasmLoader";
import RendererDevice from "../../vox/render/RendererDevice";

export class DracoMeshBuilder {
    constructor() {
    }
    
    private m_listener: DracoTaskListener = null;
    private m_wasmLoader: DracoWasmLoader = null;
    private m_dracoTask: DracoTask = null;
    private m_threadsTotal: number = 1;

    multiBuffers: boolean = true;
    zipParseEnabled: boolean = false;
    setListener(l: DracoTaskListener): void {
        this.m_listener = l;
        if(this.m_dracoTask != null) {
            this.m_dracoTask.setListener(l);
        }
    }
    initialize(threadTotal: number = 1): void {

        if(this.m_wasmLoader == null) {

            this.m_threadsTotal = threadTotal > 0 ? threadTotal : 1;
            if(RendererDevice.IsWebGL1()) {
                //this.m_threadsTotal = 1;
            }
            this.m_wasmLoader = new DracoWasmLoader();
            this.m_wasmLoader.load(this.onWasmLoaded, this);
        }
    }

    load(module_url: string): void {
        if(this.m_dracoTask != null) {
            this.m_dracoTask.reset();
        }
        this.loadMeshFile( module_url );
    }
    private m_meshBuffer: ArrayBuffer = null;
    private m_segs: number[] = [];
    private loadMeshFile(furl: string): void {
        let loader: MeshBufferLoader = new MeshBufferLoader();
        loader.multiBuffers = this.multiBuffers;
        loader.zipParseEnabled = this.zipParseEnabled;
        loader.load(
            furl,
            (buffer: ArrayBuffer, param: string) => {

                this.m_meshBuffer = buffer;

                //  console.log("loaded a file, buffer: ",buffer);
                //  console.log("loaded a file, param: ",param);

                let s: string[] = param.split(',');
                let len: number = Math.floor(s.length / 2);
                this.m_segs = [];
                for (let i: number = 0; i < len; ++i) {
                    this.m_segs.push(parseInt(s[i * 2]), parseInt(s[i * 2 + 1]));
                }
                this.m_dracoTask.parseSrcData(this.m_meshBuffer, this.m_segs);
            }
        );
    }
    private onWasmLoaded(data: any): void {

        console.log("onWasmLoaded exec....");
        
        this.m_dracoTask = new DracoTask( this.m_threadsTotal );
        ThreadSystem.Initialize(this.m_threadsTotal, data.wapper);
        ThreadSystem.InitTaskByCodeStr(this.m_dracoParserStr + this.m_dracoThreadStr, 0, "ThreadDraco");
        //  ThreadSystem.Initialize(taskTotal);
        //  ThreadSystem.InitTaskByCodeStr(data.wapper + this.m_dracoParserStr + this.m_dracoThreadStr, 0, "ThreadDraco");
        this.m_dracoTask.setListener( this.m_listener );
        this.m_dracoTask.initTask(this.m_wasmLoader.wasmBin);

    }
    
    run(): void {
        ThreadSystem.Run();
    }
    private m_dracoParserStr: string =
`
function DracoParser() {

    this.parser = null;

    this.verbosity = 1;
    this.drawMode = 0;
    this.vsScale = 1.0;
    
    this.attNSMap = {
        position: "POSITION",
        normal: "NORMAL",
        color: "COLOR",
        uv: "TEX_COORD",
        generic: "GENERIC"
    };
    this.attMap = null;
    this.attOpts = null;
    
    let selfT = this;
    this.getAttributeOptions = function (ns) {
        if (typeof selfT.attOpts[ns] === "undefined") selfT.attOpts[ns] = {};
        return selfT.attOpts[ns];
    }
    const PARSER_TriangleStripDrawMode = 1;
    const PARSER_TriangleFanDrawMode = 21;
    this.addAttributeToGeometry = function (dracoDecoder, decoder, dracoGeometry, ns, attribute, geometryBuffer) {
        if (attribute.ptr === 0) {
            let errorMsg = "DracoParser: No attribute " + ns;
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
        let numComponents = attribute.num_components();
        let attributeData = new dracoDecoder.DracoFloat32Array();
        decoder.GetAttributeFloatForAllPoints(dracoGeometry, attribute, attributeData);
        let numPoints = dracoGeometry.num_points();
        let numValues = numPoints * numComponents;
        let fs32 = new Float32Array(numValues + 1);
        fs32[0] = numComponents;
        
        for (let i = 0; i < numValues; i++) {
            fs32[i + 1] = attributeData.GetValue(i);
        }
        geometryBuffer[ns] = fs32;
        dracoDecoder.destroy(attributeData);
    }
    this.decodeGeomData = function (dracoDecoder, decoder, geometryType, buffer) {
        if (selfT.getAttributeOptions("position").skipDequantization === true) {
            decoder.SkipAttributeTransform(dracoDecoder.POSITION);
        }
        let dracoGeometry;
        let decodingStatus;

        if (geometryType === dracoDecoder.TRIANGULAR_MESH) {
            dracoGeometry = new dracoDecoder.Mesh();
            decodingStatus = decoder.DecodeBufferToMesh(buffer, dracoGeometry);
        }
        else {
            dracoGeometry = new dracoDecoder.PointCloud();
            decodingStatus = decoder.DecodeBufferToPointCloud(buffer, dracoGeometry);
        }
        if (!decodingStatus.ok() || dracoGeometry.ptr == 0) {
            let errorMsg = "DracoParser: Decoding failed: ";
            errorMsg += decodingStatus.error_msg();
            console.error(errorMsg);
            dracoDecoder.destroy(decoder);
            dracoDecoder.destroy(dracoGeometry);
            throw new Error(errorMsg);
        }
        dracoDecoder.destroy(buffer);
        let numFaces;
        if (geometryType == dracoDecoder.TRIANGULAR_MESH) {
            numFaces = dracoGeometry.num_faces();
        }
        else {
            numFaces = 0;
        }
        let posAttId = decoder.GetAttributeId(dracoGeometry, dracoDecoder.POSITION);
        if (posAttId == -1) {
            let errorMsg = "DracoParser: No position attribute found.";
            console.error(errorMsg);
            dracoDecoder.destroy(decoder);
            dracoDecoder.destroy(dracoGeometry);
            throw new Error(errorMsg);
        }
        let geometryBuffer = {};
        for (let ns in selfT.attNSMap) {
            if (selfT.attMap[ns] === undefined) {
                let attId = decoder.GetAttributeId(dracoGeometry, dracoDecoder[selfT.attNSMap[ns]]);
                if (attId !== -1) {
                    if (selfT.verbosity > 0) {
                        // console.log('Loaded ' + ns + ' attribute.');
                    }
                    let attribute = decoder.GetAttribute(dracoGeometry, attId);
                    selfT.addAttributeToGeometry(dracoDecoder, decoder, dracoGeometry, ns, attribute, geometryBuffer);
                }
            }
        }
        for (let ns in selfT.attMap) {
            let attributeId = selfT.attMap[ns];
            let attribute = decoder.GetAttributeByUniqueId(dracoGeometry, attributeId);
            selfT.addAttributeToGeometry(dracoDecoder, decoder, dracoGeometry, ns, attribute, geometryBuffer);
        }
        if (geometryType == dracoDecoder.TRIANGULAR_MESH) {
            if (selfT.drawMode === PARSER_TriangleStripDrawMode) {
                let stripsArray = new dracoDecoder.DracoInt32Array();
                geometryBuffer.indices = new Uint32Array(stripsArray.size());
                for (let i = 0; i < stripsArray.size(); ++i) {
                    geometryBuffer.indices[i] = stripsArray.GetValue(i);
                }
                dracoDecoder.destroy(stripsArray);
            } else {
                let numIndices = numFaces * 3;
                geometryBuffer.indices = new Uint32Array(numIndices);
                let ia = new dracoDecoder.DracoInt32Array();
                for (let i = 0; i < numFaces; ++i) {
                    decoder.GetFaceFromMesh(dracoGeometry, i, ia);
                    let index = i * 3;
                    geometryBuffer.indices[index] = ia.GetValue(0);
                    geometryBuffer.indices[index + 1] = ia.GetValue(1);
                    geometryBuffer.indices[index + 2] = ia.GetValue(2);
                }
                dracoDecoder.destroy(ia);
            }
        }
        if (geometryType != dracoDecoder.TRIANGULAR_MESH) {
            geometryBuffer.indices = null;
        }
        dracoDecoder.destroy(decoder);
        dracoDecoder.destroy(dracoGeometry);
        return geometryBuffer;
    }
    this.parseData = function (bufData, beginI, endI, status) {
        let dracoDecoder = selfT.parser;
        let buffer = new dracoDecoder.DecoderBuffer();
        let bufLen = endI - beginI;
        if (status < 1) {
            buffer.Init(new Int8Array(bufData.buffer).subarray(0, bufLen), bufLen);
        }
        else {
            buffer.Init(new Int8Array(bufData.buffer).subarray(beginI, endI), bufLen);
        }
        let decoder = new dracoDecoder.Decoder();
        /*
            * Determine what type is this file: mesh or point cloud.
            */
        let geometryType = decoder.GetEncodedGeometryType(buffer);
        if (geometryType == dracoDecoder.TRIANGULAR_MESH) {
            if (selfT.verbosity > 0) {
                // console.log("Loaded a mesh segment.");
            }
        } else if (geometryType == dracoDecoder.POINT_CLOUD) {
            if (selfT.verbosity > 0) {
                // console.log("Loaded a point cloud.");
            }
        } else {
            let errorMsg = "DracoParser: Unknown geometry type.";
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        //console.log("worker parseData, geometryType: "+geometryType);
        return this.decodeGeomData(dracoDecoder, decoder, geometryType, buffer);
    }

    this.transformVS = function (vsScale, matfs, f32vs, vinLength) {
        let i = 0;
        let x = y = z = 0.0;
        let matX = vsScale * matfs[12];
        let matY = vsScale * matfs[13];
        let matZ = vsScale * matfs[14];
        while ((i + 3) <= vinLength) {
            x = f32vs[i];
            y = f32vs[i + 1];
            z = f32vs[i + 2];
            f32vs[i] = x * matfs[0] + y * matfs[4] + z * matfs[8] + matX;
            f32vs[i + 1] = x * matfs[1] + y * matfs[5] + z * matfs[9] + matY;
            f32vs[i + 2] = x * matfs[2] + y * matfs[6] + z * matfs[10] + matZ;
            i += 3;
        }
    }
    this.getParseData = function (bufData, errorFlag) {
        let tarr = null;
        if (bufData != null) {
            tarr = [];
            let fvs32 = null;
            for (let key in bufData) {
                if (bufData[key] != null) {
                    tarr.push(bufData[key].buffer);
                }
            }
            if (fvs32 != null) {
                let atrribSize = fvs32[0];
                let min_x = fvs32[1];
                let min_y = fvs32[2];
                let min_z = fvs32[3];
                let max_x = min_x;
                let max_y = min_y;
                let max_z = min_z;
                let px;
                let py;
                let pz;
                for (let i = 1, len = fvs32.length; i < len; i += atrribSize) {
                    px = fvs32[i];
                    py = fvs32[i + 1];
                    pz = fvs32[i + 2];
                    if (px < min_x) min_x = px;
                    else if (px > max_x) max_x = px;
                    if (py < min_y) min_y = py;
                    else if (py > max_y) max_y = py;
                    if (pz < min_z) min_z = pz;
                    else if (pz > max_z) max_z = pz;
                }
                bufData.min = { x: min_x, y: min_y, z: min_z };
                bufData.max = { x: max_x, y: max_y, z: max_z };
            }
        }
        return { data: bufData, transfers: tarr, errorFlag: errorFlag };
    }
    this.receiveCall = function (data) {
        
        let streams = data.streams;
        selfT.drawMode = 0;
        selfT.vsScale = 1.0;
        console.log("XXX data: ",data);
        selfT.attMap = {};
        selfT.attOpts = { position: {} };
        let errorFlag = 0;
        let dataObj = null;
        if (streams != null) {
            let descriptor = data.descriptor;
            console.log("descriptor: ", descriptor);
            if (descriptor.endI > descriptor.beginI) {
                let u8arr = streams[0];
                try {
                    dataObj = selfT.parseData(u8arr, descriptor.beginI, descriptor.endI, descriptor.status);
                } catch (err) {
                    errorFlag = -1;
                    dataObj = null;
                    console.error(err);
                }
            }
        }
        else {
            errorFlag = -2;
            console.error("pdata is null.");
        }
        return selfT.getParseData(dataObj, errorFlag);
    }
}
`;
    private m_dracoThreadStr: string =
`
function ThreadDraco() {

    let m_dataIndex = 0;
    let m_srcuid = 0;
    this.threadIndex = 0;
    let selfT = this;

    this.parser = null;
    this.decoder = { wasmBinary: null };
    let dracoParser = new DracoParser();
    function postDataMessage(data, transfers) {
        let sendData =
        {
            cmd: data.cmd,
            taskCmd: data.taskCmd,
            threadIndex: selfT.threadIndex,
            taskclass: selfT.getTaskClass(),
            srcuid: m_srcuid,
            dataIndex: m_dataIndex,
            streams: data.streams,
            data: data.data
        };
        postMessage(sendData, transfers);
    }
    function initDecoder(data) {
        let bin = data.streams[0].buffer;
        selfT.decoder["wasmBinary"] = bin;
        selfT.decoder["onModuleLoaded"] = function (module) {
            selfT.parser = module;
            dracoParser.parser = module;
            postDataMessage(data, [bin]);
        };
        DracoDecoderModule(selfT.decoder);
    }
    this.receiveData = function (data) {
        m_srcuid = data.srcuid;
        m_dataIndex = data.dataIndex;
        console.log("ThreadDraco::receiveData(), data: ", data);

        //console.log("data.taskCmd: ", data.taskCmd);
        switch (data.taskCmd) {
            case "DRACO_PARSE":
                let parseData = dracoParser.receiveCall(data);
                //return { data: bufData, transfers: tarr, errorFlag: errorFlag };
                data.data = {module: parseData.data, errorFlag: parseData.errorFlag};
                postDataMessage(data, parseData.transfers);
                break;
            case "DRACO_INIT":
                initDecoder(data);
                break;
            default:
                //postDataMessage(data);
                break;
        }
    }
    this.getTaskClass = function () {
        return 0;
    }
}
`;
}
export default DracoMeshBuilder;