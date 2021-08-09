
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Axis3DEntity from "../vox/entity/Axis3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import CameraTrack from "../vox/view/CameraTrack";
import MouseEvent from "../vox/event/MouseEvent";
import DemoInstance from "./DemoInstance";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import ThreadSystem from "../thread/ThreadSystem";
import DracoTask from "../voxmesh/draco/DracoTask";
import {DracoTaskListener} from "../voxmesh/draco/DracoTask";
import DracoMesh from "../voxmesh/draco/DracoMesh";
import DracoMeshMaterial from "../voxmesh/draco/DracoMeshMaterial";
import MeshBufferLoader from "../voxmesh/draco/MeshBufferLoader";
import DracoWasmLoader from "../voxmesh/draco/DracoWasmLoader";
import DisplayEntity from "../vox/entity/DisplayEntity";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

export class DemoDraco extends DemoInstance implements DracoTaskListener {
    constructor() {
        super();
    }
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_wasmLoader: DracoWasmLoader = new DracoWasmLoader();

    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_moduleScale: number = 100.0;

    protected initializeSceneParam(param: RendererParam): void {
        this.m_processTotal = 4;
        param.maxWebGLVersion = 1;
        param.setCamPosition(500.0, 500.0, 500.0);
        
    }
    protected initializeSceneObj(): void {
        console.log("DemoDraco::initialize()......");
        this.m_camTrack = new CameraTrack();
        this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

        RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
        RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
        //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
        this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
        this.m_profileInstance.initialize(this.m_rscene.getRenderer());
        this.m_statusDisp.initialize("rstatus", this.m_rscene.getStage3D().viewWidth - 180);

        this.m_rscene.enableMouseEvent(true);
        this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
        this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
        this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

        let tex0: TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
        let tex1: TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");

        // add common 3d display entity
        //  var plane: Plane3DEntity = new Plane3DEntity();
        //  plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
        //  this.m_rscene.addEntity(plane, 2);

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity(axis);

        //  let box: Box3DEntity = new Box3DEntity();
        //  box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
        //  this.m_rscene.addEntity(box);

        console.log("------------------------------------------------------------------");
        console.log("------------------------------------------------------------------");

        this.m_wasmLoader.load(this.onWasmLoaded, this);
        //  this.m_moduleScale = 1.0;
        //  this.loadMeshFile( "static/assets/modules/loveass.rawmd" );

        //  this.m_moduleScale = 100.0;
        //  this.loadMeshFile( "static/assets/modules/car.rawmd" );

        this.m_moduleScale = 10.0;
        this.loadMeshFile( "static/assets/modules/longxiaPincer.rawmd" );
    }
    private m_meshBuffer: ArrayBuffer = null;
    private m_segs: number[] = [];

    parse(module: any, index: number, total: number): void {
        console.log("parse progress: "+index+"/"+total);
    }
    parseFinish(modules: any, total: number): void {
        let module: any = modules[0];
        //console.log("XXXXXXXXXXXXXXXXXXXX parseFinish module: ",module);
        let mesh: DracoMesh = new DracoMesh();
        mesh.initialize(modules);
        let material: DracoMeshMaterial = new DracoMeshMaterial();
        let entity: DisplayEntity = new DisplayEntity();
        entity.setMesh(mesh);
        entity.setMaterial( material );
        entity.setScaleXYZ(this.m_moduleScale, this.m_moduleScale, this.m_moduleScale);
        this.m_rscene.addEntity(entity);
    }
    private loadMeshFile(furl: string): void {

        let loader: MeshBufferLoader = new MeshBufferLoader();
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
    private m_dracoTask: DracoTask = null;
    private onWasmLoaded(data: any): void {

        console.log("onWasmLoaded exec....");
        let taskTotal: number = 3;
        this.m_dracoTask = new DracoTask( taskTotal );
        ThreadSystem.InitTaskByCodeStr(this.m_dracoParserStr + this.m_dracoThreadStr, 0, "ThreadDraco");
        ThreadSystem.Initsialize(taskTotal, data.wapper);
        this.m_dracoTask.setListener( this );
        this.m_dracoTask.initTask(this.m_wasmLoader.wasmBin);

    }
    
    //  private m_segIndex: number = 0;
    private testDracoTask(): void {
        
        //this.m_dracoTask.parseNextSeg();

        //if(this.m_segIndex < this.m_segs.length) {
        //    console.log("parse data task..");
        //    this.m_dracoTask.parseData(this.m_meshBuffer, this.m_segs[this.m_segIndex], this.m_segs[this.m_segIndex + 1]);
        //    this.m_segIndex += 2;
        //}
    }
    
    private mouseDown(evt: any): void {
        console.log("mouse down evt: ", evt);
        this.testDracoTask();
    }
    runBegin(): void {
        this.m_statusDisp.update();
        this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
        //this.m_rscene.setClearUint24Color(0x003300,1.0);
        super.runBegin();
    }
    run(): void {
        this.m_rscene.run();
        //  if (this.m_profileInstance != null) {
        //      this.m_profileInstance.run();
        //  }
        ThreadSystem.Run();
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);
    }
    runEnd(): void {
        super.runEnd();
        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
    private m_dracoParserStr: string =
        `
        ///////////////////////////////////
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
                
                let pdata = data.data;
                selfT.drawMode = 0;
                selfT.vsScale = 1.0;

                selfT.attMap = {};
                selfT.attOpts = { position: {} };
                let errorFlag = 0;
                let dataObj = null;
                if (pdata != null) {
                    if (data.endI > data.beginI) {
                        let u8arr = new Uint8Array(pdata);
                        try {
                            dataObj = selfT.parseData(u8arr, data.beginI, data.endI, data.status);
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
            console.log("ThreadDraco instance init run ... from code str");
        
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
                    data: [101, 0],
                    data: data.data
                };
                postMessage(sendData, transfers);
            }
            function initDecoder(data) {
                selfT.decoder["wasmBinary"] = data.data;
                selfT.decoder["onModuleLoaded"] = function (module) {
                    selfT.parser = module;
                    dracoParser.parser = module;
                    console.log("draco init finish...");
                    postDataMessage(data, [data.data]);
                };
                DracoDecoderModule(selfT.decoder);
            }
            this.receiveData = function (data) {
                m_srcuid = data.srcuid;
                m_dataIndex = data.dataIndex;
                //console.log("ThreadDraco::receiveData(), data: ", data);
        
                //console.log("data.taskCmd: ", data.taskCmd);
                switch (data.taskCmd) {
                    case "DRACO_PARSE":
                        let parseData = dracoParser.receiveCall(data);
                        //console.log("XXXXXXXXXXXXXXXX parseData: ", parseData);
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
export default DemoDraco;